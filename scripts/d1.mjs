#!/usr/bin/env node
// D1 helper for local (miniflare state file) and remote (cf d1) databases.
//
// Usage:
//   node scripts/d1.mjs migrate --local
//   node scripts/d1.mjs migrate --remote <database-id>
//   node scripts/d1.mjs seed --local
//   node scripts/d1.mjs seed --remote <database-id>
//   node scripts/d1.mjs import-devdb --local
//   node scripts/d1.mjs import-devdb --remote <database-id>
//
// Remote commands require `cf auth login` (or CLOUDFLARE_API_TOKEN).

import { execFileSync } from 'node:child_process'
import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const D1_STATE_DIR = path.join(ROOT, '.cloudflare/state/v3/d1/miniflare-D1DatabaseObject')
const MIGRATIONS_DIR = path.join(ROOT, 'migrations')
const DEV_DB = path.join(ROOT, 'prisma/dev.db')

function loadEnv() {
  try {
    process.loadEnvFile(path.join(ROOT, '.env'))
  } catch {}
}

function parseArgs(argv) {
  const [command, ...rest] = argv
  const args = { command }
  for (let i = 0; i < rest.length; i++) {
    if (rest[i] === '--local') args.local = true
    else if (rest[i] === '--remote') args.remote = rest[++i]
  }
  return args
}

function localDbFile() {
  if (!existsSync(D1_STATE_DIR)) {
    throw new Error(`No local D1 state found at ${D1_STATE_DIR}. Run \`npm run dev:vinext\` once first.`)
  }
  const files = readdirSync(D1_STATE_DIR)
    .filter((f) => /^[0-9a-f]{64}\.sqlite$/.test(f))
    .map((f) => path.join(D1_STATE_DIR, f))
    .sort((a, b) => statSync(b).mtimeMs - statSync(a).mtimeMs)
  if (files.length === 0) throw new Error('No local D1 database file found.')
  // Multiple files can exist after binding config changes; the newest belongs
  // to the current binding.
  return files[0]
}

function sqlite(file, sql) {
  execFileSync('sqlite3', [file, sql], { stdio: 'inherit' })
}

function sqliteScript(file, script) {
  execFileSync('sqlite3', [file], { input: script, stdio: ['pipe', 'inherit', 'inherit'] })
}

function cfD1(args) {
  execFileSync('npx', ['cf', 'd1', ...args], { stdio: 'inherit', cwd: ROOT })
}

function appliedMigrationsLocal(dbFile) {
  try {
    const out = execFileSync('sqlite3', [dbFile, "SELECT name FROM d1_migrations"], {
      encoding: 'utf8',
    })
    return new Set(out.trim().split('\n').filter(Boolean))
  } catch {
    return new Set()
  }
}

function migrate({ local, remote }) {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort()
  if (files.length === 0) throw new Error(`No migration files in ${MIGRATIONS_DIR}`)

  if (local) {
    const dbFile = localDbFile()
    sqlite(dbFile, 'CREATE TABLE IF NOT EXISTS d1_migrations (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL);')
    const applied = appliedMigrationsLocal(dbFile)
    for (const file of files) {
      if (applied.has(file)) {
        console.log(`skip ${file} (already applied)`)
        continue
      }
      console.log(`applying ${file}`)
      sqliteScript(dbFile, readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8'))
      sqlite(dbFile, `INSERT INTO d1_migrations (name) VALUES ('${file}');`)
    }
    console.log('Local D1 migrations complete.')
    return
  }

  if (!remote) throw new Error('Pass --local or --remote <database-id>')
  cfD1(['migrations', 'apply', remote])
}

function seedStatements() {
  loadEnv()
  const name = (process.env.TEAM_NAME || 'Our Team').replaceAll("'", "''")
  const logo = process.env.TEAM_LOGO_URL
    ? `'${process.env.TEAM_LOGO_URL.replaceAll("'", "''")}'`
    : 'NULL'
  return `INSERT INTO "Team" (id, name, logoUrl) VALUES (1, '${name}', ${logo}) ON CONFLICT(id) DO UPDATE SET name=excluded.name, logoUrl=excluded.logoUrl;`
}

function seed({ local, remote }) {
  const sql = seedStatements()
  if (local) {
    sqlite(localDbFile(), sql)
    console.log('Local D1 seeded.')
    return
  }
  if (!remote) throw new Error('Pass --local or --remote <database-id>')
  cfD1(['query', remote, '--sql', sql])
  console.log('Remote D1 seeded.')
}

function importDevDb({ local, remote }) {
  if (!existsSync(DEV_DB)) throw new Error(`Dev database not found at ${DEV_DB}`)
  const dump = execFileSync(
    'sqlite3',
    [DEV_DB, '.dump Team', '.dump "Game"', '.dump "GoalScorer"'],
    { encoding: 'utf8' },
  )
  const dataInserts = []
  const sequenceInserts = []
  for (const line of dump.split('\n')) {
    if (
      line.startsWith('INSERT INTO Team ') ||
      line.startsWith('INSERT INTO Game ') ||
      line.startsWith('INSERT INTO GoalScorer ')
    ) {
      dataInserts.push(line)
    } else if (line.startsWith('INSERT INTO sqlite_sequence ')) {
      sequenceInserts.push(line.replace('INSERT INTO', 'INSERT OR REPLACE INTO'))
    }
  }
  if (dataInserts.length === 0) {
    throw new Error('No rows found in dev.db to import')
  }
  // Full replace of app data; sqlite_sequence updates go last so the table
  // exists (it is created by the first AUTOINCREMENT insert above).
  const script = [
    'DELETE FROM "GoalScorer";',
    'DELETE FROM "Game";',
    'DELETE FROM "Team";',
    ...dataInserts,
    ...sequenceInserts,
  ].join('\n')

  if (local) {
    sqliteScript(localDbFile(), script)
    console.log('Imported dev.db into local D1.')
    return
  }
  if (!remote) throw new Error('Pass --local or --remote <database-id>')
  cfD1(['query', remote, '--sql', script])
  console.log('Imported dev.db into remote D1.')
}

const args = parseArgs(process.argv.slice(2))
const commands = { migrate, seed, 'import-devdb': importDevDb }
const fn = commands[args.command]
if (!fn) {
  console.error(`Unknown command "${args.command}". Expected one of: ${Object.keys(commands).join(', ')}`)
  process.exit(1)
}
Promise.resolve()
  .then(() => fn(args))
  .catch((err) => {
    console.error(err.message || err)
    process.exit(1)
  })
