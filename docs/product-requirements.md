# Giovanni OS product requirements

| Visitor   | Primary need                                                                         |
| --------- | ------------------------------------------------------------------------------------ |
| Recruiter | Find the résumé, review project evidence and contact the owner                       |
| Engineer  | Inspect a sanitized infrastructure case study and read a competition case study      |
| Friend    | Explore the portfolio and discover the OS presentations when available               |
| Owner     | Update approved content once and publish consistent information across presentations |

## MVP

The owner approved Windows XP Luna as the default desktop on November 23, 2026. Use a clean, nostalgic Luna aesthetic and open directly to the desktop. Show Welcome on the first visit. The desktop includes a taskbar, Start menu, draggable windows and shortcuts for My Computer, My Network Places, My Documents, Resume and Recycle Bin. Keep the OS selector accessible from the taskbar. The servers represent the five portfolio areas and use simulated or static content. Kali Linux and Mac OS X are deferred to later phases. Visitors can reach five portfolio areas, a simulated topology with a list view, a competition case study, the résumé and contact from desktop or mobile. Canonical reading routes remain available throughout. The System control identifies XP as active and shows Kali and Tiger as coming later. When implemented in later phases, it switches OS without losing access to résumé or contact.

Use a simplified mobile-friendly layout. The proposed implementation uses a launcher and full-width panels at narrow widths, with a 320 CSS pixel test baseline and taskbar access to the OS selector. Use original or appropriately licensed assets and record provenance before adding them. Defer exact visual era approval for Kali and Tiger, which are represented here as contemporary XFCE and Tiger 10.4 proposals.

## Wireframes

```text
XP LUNA DESKTOP · FIRST VISIT
+----------------------------------------------------------------+
| My Computer   +-- Welcome --------------------------- [_][□][×]|
| My Network    | Portfolio areas, Resume and Contact            ||
| Places        | Open reading page                              ||
| My Documents  +------------------------------------------------+|
| Resume · Recycle Bin                                           |
| +-- Start menu when open --+                                   |
| | About | Projects | Network|                                  |
| | Résumé | Contact | System  |                                  |
| +---------------------------+                                  |
| [Start] [Welcome]                      [OS selector] [Clock]|
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

The XP wireframe reflects the approved first-visit Welcome window and taskbar OS selector. Exact spacing, colors and asset selections are implementation details. On narrow screens the proposed launcher keeps reading links reachable alongside the simplified panels.

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

Deferred for MVP are alternate OS shells, terminal, games, audio, login, uploads, contact forms, tracking, third-party widgets, live network status and transitions between OS modes. Owner approval remains pending for the authoritative résumé, contact, public identity and content.
