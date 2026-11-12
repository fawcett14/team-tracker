## Purpose

Provides an authenticated admin area where the coach can manage fixtures and results, attach game videos, and record goal scorers — data that is never exposed on the public site.

## ADDED Requirements

### Requirement: Admin login gates the admin area
The admin area SHALL require authentication before any admin functionality is accessible, and unauthenticated requests SHALL be denied.

#### Scenario: Unauthenticated admin access
- **WHEN** a visitor who is not logged in attempts to access an admin page
- **THEN** they are shown a login form or redirected to login and cannot reach admin functionality

#### Scenario: Successful login
- **WHEN** an authorized user submits valid credentials
- **THEN** they gain access to the admin area

#### Scenario: Failed login
- **WHEN** a user submits invalid credentials
- **THEN** login is rejected and no admin functionality is exposed

### Requirement: Admin can manage games
An authenticated admin SHALL be able to create, edit, and remove games (fixtures/results), including the opponent team name, match date, home/away designation, and score.

#### Scenario: Admin records a result
- **WHEN** an admin submits a game with opponent, date, home/away designation, and score
- **THEN** the game is saved and appears on the public site accordingly

#### Scenario: Admin updates an existing game
- **WHEN** an admin edits a previously saved game
- **THEN** the public site reflects the updated details

### Requirement: Admin can attach video to a game
An authenticated admin SHALL be able to associate a video or highlights reel with a game so it appears on that game's public match page.

#### Scenario: Admin attaches a video
- **WHEN** an admin provides a video reference for a game and saves it
- **THEN** the video is embedded on that game's public match page

#### Scenario: Admin removes a video
- **WHEN** an admin removes the video reference from a game
- **THEN** the public match page no longer shows a video for that game

### Requirement: Admin can record goal scorers
An authenticated admin SHALL be able to record goal scorers for a game, including scorer name and the team they scored for.

#### Scenario: Admin adds a goal scorer
- **WHEN** an admin adds a goal scorer to a game and saves
- **THEN** the scorer is stored and visible within the admin area for that game

### Requirement: Goal scorers are never shown publicly
Goal scorer data SHALL NOT be displayed on any public-facing page.

#### Scenario: Visitor views match with scorers recorded
- **WHEN** a visitor opens the public match page for a game that has goal scorers recorded
- **THEN** no goal scorer information is visible anywhere on the page

#### Scenario: Visitor views homepage
- **WHEN** a visitor views the homepage
- **THEN** no goal scorer information is displayed
