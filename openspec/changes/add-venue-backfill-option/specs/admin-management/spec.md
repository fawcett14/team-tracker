## ADDED Requirements

### Requirement: Home venue change offers fixture scope choice
When the admin saves team settings with a home venue that differs from the currently saved value, the system SHALL present a choice between applying the venue to all previous home fixtures or only to new fixtures going forward. Saving without changing the home venue SHALL NOT present the choice.

#### Scenario: Admin changes home venue and saves
- **WHEN** the admin edits the home venue field to a different non-empty value and submits team settings
- **THEN** a dialog is shown offering "apply to all previous fixtures" or "only apply to new fixtures"

#### Scenario: Admin saves without changing home venue
- **WHEN** the admin submits team settings with the home venue unchanged (or never set)
- **THEN** no dialog is shown and settings save normally

#### Scenario: Admin clears the home venue
- **WHEN** the admin empties the home venue field and submits
- **THEN** no fixture-scope dialog is shown and existing game venues are left unchanged

#### Scenario: Admin cancels the dialog
- **WHEN** the admin dismisses the dialog without choosing an option
- **THEN** team settings are not saved

### Requirement: Apply-to-all updates every home game venue
When the admin chooses to apply the new home venue to all previous fixtures, the system SHALL set the venue on every game marked as a home game, including games that already have scores and games that had a custom venue. Games not marked as home SHALL be unaffected.

#### Scenario: Bulk apply chosen
- **WHEN** the admin saves a changed home venue and chooses "apply to all previous fixtures"
- **THEN** every home game's venue is updated to the new home venue and away games keep their existing venue values

#### Scenario: New fixtures only chosen
- **WHEN** the admin saves a changed home venue and chooses "only apply to new fixtures"
- **THEN** existing games keep their current venue values and only the team setting is updated
