# 0002 Desktop interaction and theme dependencies

Start with React context and a reducer for shared app and window state. Keep input and view logic in components. Revisit Zustand if profiling or selector requirements justify it.

Prefer native buttons, keyboard alternatives and responsive panels. Custom pointer handling gives control over pointer capture, drag handles, focus, bounds and z-order with no library. It also needs careful touch and text selection validation. react-rnd is MIT and exposes drag and resize bounds and controlled position. Its upstream API delegates stacking to caller styles. Adopting it would still require a keyboard interaction model. Before choosing an implementation for Phase 1, prototype both approaches as appropriate and verify touch drag, resize and scroll, viewport bounds, overlapping window focus, and keyboard move/resize alternatives. No runtime touch or z-order test has been executed.

Use CSS Modules for component scope and theme root variables for palette, spacing and typography. Tailwind would provide utility composition and theme tokens, but theme markup would be more coupled to its utility system and its global Preflight needs review. XP.css (MIT) offers familiar XP controls, including beveled buttons and window chrome. Its global element selectors and class names such as `.window` would affect unrelated screens if imported into the App Router root. Use original, component-scoped styles when Phase 1 begins. No upstream stylesheet or assets adopted.

React Flow offers keyboard-focusable nodes and edges, screen-reader instructions and live updates. The initial small graph can be a static SVG illustration with a semantic list of destinations. Use the list as a full equivalent and revisit React Flow if rich graph interactions become a requirement.

Sources [react-rnd](https://github.com/bokuweb/react-rnd), [XP.css](https://github.com/botoxparty/XP.css), [React Flow accessibility](https://reactflow.dev/learn/advanced-use/accessibility) and [Tailwind utilities](https://tailwindcss.com/docs/styling-with-utility-classes).
