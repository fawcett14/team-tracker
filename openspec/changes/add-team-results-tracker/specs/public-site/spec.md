## Purpose

Provides the public-facing website for the football team: a homepage summarizing the team's season record and fixtures, and individual match pages showing teams, scores, and game videos.

## ADDED Requirements

### Requirement: Homepage displays team identity and season record
The homepage SHALL display the team's logo and the team's overall record of games won, drawn, and lost.

#### Scenario: Visitor views homepage
- **WHEN** a visitor opens the homepage
- **THEN** the team logo and counts of won, drawn, and lost games are displayed

#### Scenario: No completed games yet
- **WHEN** a visitor opens the homepage before any games have been recorded as played
- **THEN** the won/drawn/lost counts show zero and the page still renders without error

### Requirement: Homepage shows recent and upcoming games
The homepage SHALL list recently played games and upcoming games, with each game entry linking to its match page.

#### Scenario: Visitor views recent results
- **WHEN** the team has completed games
- **THEN** the homepage shows the most recently played games, each linking to a match page

#### Scenario: Visitor views upcoming fixtures
- **WHEN** the team has scheduled but unplayed games
- **THEN** the homepage shows upcoming fixtures in chronological order, each linking to a match page

### Requirement: Match page shows teams in home/away order
Each match page SHALL display the home team's name first and the away team's name second, clearly identifiable as home and away.

#### Scenario: Visitor opens a match page
- **WHEN** a visitor opens the match page for a game
- **THEN** the home team is displayed first and the away team second

### Requirement: Match page shows score when available
The match page SHALL display the score in the format `HOME TEAM score - score AWAY TEAM` when a score has been recorded, and SHALL omit the score when none is available.

#### Scenario: Completed game with score
- **WHEN** a visitor opens a match page for a game with a recorded score of 2-1 for the home team
- **THEN** the page displays the home team name followed by `2 - 1` followed by the away team name

#### Scenario: Upcoming game without score
- **WHEN** a visitor opens a match page for a game with no recorded score
- **THEN** the page shows both team names with no score displayed

### Requirement: Match page embeds game video
The match page SHALL display an embedded video or highlights reel for the game when one has been associated with it, and SHALL omit the video section when none exists.

#### Scenario: Match with video
- **WHEN** a visitor opens a match page for a game that has an associated video
- **THEN** the embedded video or highlights reel is shown on the page

#### Scenario: Match without video
- **WHEN** a visitor opens a match page for a game with no associated video
- **THEN** no video section is displayed

### Requirement: Unknown match pages handle gracefully
The system SHALL return a not-found response for a match page that does not correspond to any recorded game.

#### Scenario: Visitor opens invalid match URL
- **WHEN** a visitor requests a match page for a game that does not exist
- **THEN** the system responds with a not-found page
