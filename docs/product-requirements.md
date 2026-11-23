# Giovanni OS product requirements

| Visitor   | Primary need                                                                         |
| --------- | ------------------------------------------------------------------------------------ |
| Recruiter | Find the résumé, review project evidence and contact the owner                       |
| Engineer  | Inspect a sanitized infrastructure case study and read a competition case study      |
| Friend    | Explore the portfolio and discover the OS presentations when available               |
| Owner     | Update approved content once and publish consistent information across presentations |

## MVP

The owner approved Windows XP as the default OS and a functional desktop with a taskbar, Start menu, desktop icons, draggable windows, My Computer, My Network Places and five portfolio servers. The servers represent the five portfolio areas and use simulated or static content. Kali Linux and Mac OS X are deferred to later phases. Visitors can reach five portfolio areas, a simulated topology with a list view, a competition case study, the résumé and contact from desktop or mobile. Canonical reading routes remain available throughout. The System control identifies XP as active and shows Kali and Tiger as coming later. When implemented in later phases, it switches OS without losing access to résumé or contact.

Draft baseline for owner review is 320 CSS pixels, launcher and full-width panels on narrow screens, and a mobile System control. Use original artwork or independently reviewed licensed assets. Defer exact visual era approval for Kali and Tiger, which are represented here as contemporary XFCE and Tiger 10.4 proposals.

## Draft screens

```text
XP DESKTOP
+----------------------------------------------------------------+
| My Computer   +-- Welcome / About ------------------- [_][□][×]|
| My Documents  | Portfolio areas, Résumé and Contact            ||
| Network       | Open reading page                              ||
| Résumé        +------------------------------------------------+|
|                                                                |
| +-- Start menu when open --+                                   |
| | About | Projects | Network|                                  |
| | Résumé | Contact | System  |                                  |
| +---------------------------+                                  |
| [Start] [Welcome / About]                      [System] [Clock]|
+----------------------------------------------------------------+

KALI PROPOSAL
+----------------------------------------------------------------+
| Applications | Workspaces                        System | Clock|
|    +-- File manager -----------------------------------------+ |
|    | Projects | Network | Résumé | Contact                    | |
|    +----------------------------------------------------------+ |
|                       Terminal demo launcher                   |
+----------------------------------------------------------------+

TIGER PROPOSAL
+----------------------------------------------------------------+
| System | Finder | File | View                             Clock |
|    +-- Finder ------------------------------------------------+ |
|    | Sidebar       | Projects, Network, Résumé, Contact       | |
|    +----------------------------------------------------------+ |
|                     [Finder] [Projects] [Résumé] [Contact]      |
+----------------------------------------------------------------+
```

The XP draft opens Welcome by default on desktop. The mobile home presents launcher buttons and reading links. Approval of this specific wireframe, including its default open window, is pending.

## Interaction matrix

| Input                               | Expected behavior                                                                                                                               |
| ----------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| Icon single click                   | Focus and select desktop shortcut                                                                                                               |
| Icon double click                   | Open or focus the shortcut's app                                                                                                                |
| Touch tap                           | Open app once in its responsive presentation                                                                                                    |
| Keyboard Enter or Space on shortcut | Open or focus app with native button behavior. Enter follows reading links                                                                      |
| Escape                              | Close the active menu and restore opener focus. With a window active, preserve it                                                               |
| Start menu                          | Button toggles disclosure, exposes expanded state and reveals keyboard-reachable options. Activation closes it and focuses the destination      |
| Window buttons                      | Minimize returns focus to its taskbar control. Maximize toggles viewport fit and restore. Close restores focus to the opener or a surviving app |
| Taskbar button                      | Restore or focus app, or minimize the focused app                                                                                               |
| System control                      | Shows current mode and available choices with keyboard access                                                                                   |

Render reading navigation in the initial HTML. A desktop enhancement can initialize after the page loads. Keep links usable during initialization and on failure. Use static content with scripting disabled and remove nonessential motion for reduced-motion preferences. Avoid blocking startup sequences.

## Acceptance

Exercise top actions with mouse, touch and keyboard at desktop and 320 CSS pixels and check at 200% zoom. Every navigation item has a destination or a clearly labeled unavailable state. Verify every published external link and each canonical route. Open résumé, contact, case studies and topology list without drag or terminal. Verify disabled JavaScript and reduced motion preserve reading actions. Use only approved publication material and check the provenance inventory before release.

Deferred for MVP are alternate OS shells, terminal, games, audio, login, uploads, contact forms, tracking, third-party widgets, live network status and transitions between OS modes. Owner approval remains pending for final apps, résumé authority, contact, public identity and content.
