## ADDED Requirements

### Requirement: Admin can set a home venue in team settings
The admin team settings SHALL include a home venue field that is saved with the team's other settings and may be left empty.

#### Scenario: Admin saves a home venue
- **WHEN** the admin enters a home venue in team settings and saves
- **THEN** the venue is stored as the team's default home venue and shown in the settings form on subsequent visits

#### Scenario: Admin clears the home venue
- **WHEN** the admin empties the home venue field and saves team settings
- **THEN** no default home venue is stored

### Requirement: Admin can record a venue on a game
The admin game create and edit forms SHALL include a venue field that accepts free text and may be left empty.

#### Scenario: Admin sets a venue when creating a game
- **WHEN** the admin enters a venue on the new game form and submits
- **THEN** the game is saved with that venue and it is shown when editing the game later

#### Scenario: Admin leaves venue empty
- **WHEN** the admin submits the game form with an empty venue field
- **THEN** the game is saved with no venue

### Requirement: Home games default to the team home venue
When a game is marked as a home game, the venue SHALL be automatically populated from the team's home venue setting, while remaining editable by the admin. Away games SHALL NOT auto-populate the venue.

#### Scenario: Creating a home game with a configured home venue
- **WHEN** the admin creates a game, leaves "Our team is home" checked, and the team has a home venue configured
- **THEN** the venue field is pre-filled with the team's home venue

#### Scenario: Creating an away game
- **WHEN** the admin creates a game with "Our team is home" unchecked
- **THEN** the venue field is not populated from the team home venue

#### Scenario: Home game saved without a team home venue
- **WHEN** the admin saves a home game and no home venue is configured and no venue was entered
- **THEN** the game is saved with no venue and no error is shown

#### Scenario: Admin overrides the default venue
- **WHEN** the admin changes the pre-filled venue on a home game before saving
- **THEN** the game is saved with the admin-entered venue, not the team default
