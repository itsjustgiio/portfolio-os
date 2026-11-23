import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import { Rnd } from "react-rnd";

const windows = [
  { title: "Alpha", x: 12, y: 12 },
  { title: "Beta", x: 105, y: 64 },
];

function Fixture() {
  const [active, setActive] = useState("Beta");

  return (
    <div className="stage" data-testid="stage">
      {windows.map(({ title, x, y }) => (
        <Rnd
          key={title}
          className="window"
          role="region"
          aria-label={title}
          bounds="parent"
          default={{ x, y, width: 184, height: 150 }}
          minWidth={140}
          minHeight={110}
          dragHandleClassName="title"
          enableResizing={{ bottomRight: true }}
          resizeHandleComponent={{
            bottomRight: <span data-resize-handle aria-hidden="true" />,
          }}
          resizeHandleStyles={{ bottomRight: { touchAction: "none" } }}
          onMouseDown={() => setActive(title)}
          onDragStart={() => setActive(title)}
          onResizeStart={() => setActive(title)}
          onFocus={() => setActive(title)}
          style={{ zIndex: title === active ? 2 : 1 }}
        >
          <div className="title">{title}</div>
          <div className="body">
            <button type="button">{title} content</button>
            <p className="long-content">Scrollable window content.</p>
          </div>
        </Rnd>
      ))}
    </div>
  );
}

createRoot(document.getElementById("fixture")).render(<Fixture />);
