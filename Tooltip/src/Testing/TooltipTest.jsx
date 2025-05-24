import React from "react";
import { useTooltip } from "../Hooks/useTooltip";
const TooltipButton = ({ label, tooltip }) => {
  const { tooltipProps, renderTooltip } = useTooltip({ content: tooltip });
  return (
    <>
      <button
        {...tooltipProps}
        style={{
          margin: "0.5rem",
          padding: "0.5rem 1rem",
          border: "1px solid #ccc",
          background: "#fff",
          cursor: "pointer",
        }}
      >
        {label}
      </button>
      {renderTooltip()}
    </>
  );
};

const DeeplyNestedComponent = () => (
  <div style={{ padding: "1rem", border: "1px dashed gray" }}>
    <div style={{ margin: "1rem" }}>
      <div style={{ margin: "1rem" }}>
        <div style={{ margin: "1rem" }}>
          <TooltipButton
            label="Deep Nest"
            tooltip="Tooltip in deeply nested structure"
          />
        </div>
      </div>
    </div>
  </div>
);

const ScrollContainer = () => (
  <div
    style={{
      maxHeight: "120px",
      overflowY: "auto",
      border: "1px solid gray",
      padding: "1rem",
      marginBottom: "2rem",
    }}
  >
    <p>Scrollable content line 1</p>
    <p>Scrollable content line 2</p>
    <TooltipButton
      label="Scroll Tooltip"
      tooltip="Tooltip inside scrollable container"
    />
    <p>Scrollable content line 3</p>
    <p>Scrollable content line 4</p>
  </div>
);

const TooltipTest = () => {
  const listItems = Array.from({ length: 10 }, (_, i) => (
    <TooltipButton
      key={i}
      label={`Item ${i + 1}`}
      tooltip={`Tooltip ${i + 1}`}
    />
  ));

  return (
    <div
      style={{
        padding: "3rem",
        fontFamily: "sans-serif",
        position: "relative",
      }}
    >
      <h1>Advanced Tooltip Portal Test</h1>

      {/* Basic Buttons */}
      <section>
        <h2>Basic Buttons</h2>
        {listItems}
      </section>

      {/* Flexbox Test */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Flexbox Layout</h2>
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <TooltipButton label="Flex 1" tooltip="Tooltip inside flex item" />
          <TooltipButton label="Flex 2" tooltip="Another tooltip in flex" />
          <TooltipButton label="Flex 3" tooltip="Yet another one" />
        </div>
      </section>

      {/* Grid Test */}
      <section style={{ marginTop: "2rem" }}>
        <h2>CSS Grid Layout</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "1rem",
          }}
        >
          <TooltipButton label="Grid 1" tooltip="Tooltip in grid 1" />
          <TooltipButton label="Grid 2" tooltip="Tooltip in grid 2" />
          <TooltipButton label="Grid 3" tooltip="Tooltip in grid 3" />
        </div>
      </section>

      {/* Input Field Interaction */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Tooltip Near Inputs</h2>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <input type="text" placeholder="Type here..." />
          <TooltipButton label="?" tooltip="Helpful input hint" />
        </div>
      </section>

      {/* Absolute and Fixed Positioning */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Absolute & Fixed Position</h2>
        <div
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
          }}
        >
          <TooltipButton label="Abs TL" tooltip="Top left absolute" />
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            right: "10px",
          }}
        >
          <TooltipButton label="Abs BR" tooltip="Bottom right absolute" />
        </div>
        <div
          style={{
            position: "fixed",
            top: "10px",
            right: "10px",
          }}
        >
          <TooltipButton label="Fixed TR" tooltip="Top right fixed" />
        </div>
      </section>

      {/* Inside Text Paragraph */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Inline Text with Tooltip</h2>
        <p>
          This sentence includes a{" "}
          <TooltipButton
            label="hoverable word"
            tooltip="Tooltip inline with text"
          />{" "}
          that has a tooltip when hovered.
        </p>
      </section>

      {/* Scroll Test */}
      <section>
        <h2>Scrollable Container</h2>
        <ScrollContainer />
      </section>

      {/* Deep Nesting */}
      <section>
        <h2>Deeply Nested Tooltip</h2>
        <DeeplyNestedComponent />
      </section>

      {/* Overlapping Elements */}
      <section style={{ marginTop: "2rem" }}>
        <h2>Tooltip Between Layers</h2>
        <div style={{ position: "relative", zIndex: 1 }}>
          <TooltipButton
            label="Under Overlay"
            tooltip="Tooltip should still appear above"
          />
        </div>
        <div
          style={{
            position: "absolute",
            top: "200px",
            left: "100px",
            width: "200px",
            height: "100px",
            background: "rgba(0, 0, 0, 0.1)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
          Overlay layer
        </div>
      </section>
    </div>
  );
};

export default TooltipTest;
