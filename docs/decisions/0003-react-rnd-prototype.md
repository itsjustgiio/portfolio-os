# 0003 React window interaction prototype

Evaluated `react-rnd@10.5.3` (MIT) with React 19.3.1 and Playwright 1.65.1. The fixture lives in [prototypes/react-rnd](../../prototypes/react-rnd/) with a separate lockfile. Its browser bundle is temporary and outside the site's static export.

| Scenario                         | Observed result in Chrome 158.0.8127.36                                                                                                                                                                             |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Mouse drag and resize            | Drag by title and resize by bottom-right handle changed the measured bounds. Parent bounds clamped drag at the top-left and resize at the bottom edge.                                                              |
| Activation and stacking          | Clicking an exposed window title put that window above its peer. Tabbing to an interior control raised its window and retained keyboard focus on the control. The fixture supplied activation handlers and z-index. |
| Emulated touch at 320 CSS pixels | Tapping a control raised the window. A single finger moved the title and resized the handle. Swiping inside the body scrolled its content without moving or resizing the window.                                    |
| Keyboard geometry                | Arrow Right on a focused interior button left the geometry unchanged. Dragging and resizing need equivalent controls.                                                                                               |

The resize grip is a pointer-only target. The fixture provides no keyboard move/resize, announcements of geometry, or focus restoration after closing a window. Raising a window does not reorder Tab navigation. Phase 1 should preserve semantic reading order and implement explicit focus restoration, native focus indicators, and accessible move/resize or fit controls. Screen readers, real mobile devices, iOS Safari, multitouch, and viewport changes mid-gesture were outside this test.

Use react-rnd as the provisional desktop pointer adapter in Phase 1. Keep bounds, stacking and focus policy owned by the shared reducer and UI. A custom pointer implementation would offer direct control over capture and keyboard integration, with more code and validation for drag, resize, bounds, and scroll interaction. The tests exercise react-rnd only. Keep the launcher and full-width panels as the proposed mobile design. Revisit the adapter if the full shell exposes focus, touch, or viewport issues. The portfolio app has no react-rnd dependency.

## Reproduce

Use the root Node and npm pins. With Google Chrome installed, run in PowerShell:

```powershell
npm.cmd --prefix prototypes/react-rnd ci --ignore-scripts
$env:PROTOTYPE_BROWSER = 'chrome'
npm.cmd --prefix prototypes/react-rnd test
npm.cmd --prefix prototypes/react-rnd audit
```

For Playwright's Chromium, run `npm exec --prefix prototypes/react-rnd -- playwright install chromium` and leave `PROTOTYPE_BROWSER` unset. The test loads a local file and uses synthetic touch input.

Sources [react-rnd upstream and MIT license](https://github.com/bokuweb/react-rnd) and [Playwright device emulation](https://playwright.dev/docs/emulation).
