## ADDED Requirements

### Requirement: Match page displays venue
The match page SHALL display the game's venue when one is recorded, and SHALL omit the venue when none is recorded.

#### Scenario: Match with a venue
- **WHEN** a visitor opens a match page for a game that has a venue
- **THEN** the venue is displayed on the page

#### Scenario: Match without a venue
- **WHEN** a visitor opens a match page for a game with no venue
- **THEN** no venue is displayed and the page renders normally

### Requirement: Game lists display venue
Game list entries on the public site SHALL display the venue when one is recorded, and SHALL omit it when none is recorded.

#### Scenario: Game list entry with a venue
- **WHEN** a visitor views a public game list containing a game with a venue
- **THEN** the venue is shown for that entry

#### Scenario: Game list entry without a venue
- **WHEN** a visitor views a public game list containing a game with no venue
- **THEN** no venue is shown for that entry and the list renders normally
