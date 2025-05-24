import React from "react";
import Button from "./Components/Button/Button";
import "./App.css";
import TooltipTest from "./Testing/TooltipTest";
import { ToggleTip } from "./Components/ToggleTip/ToggleTip";
const App = () => {
  return (
    // <>
    //   <div
    //     className="app-container"
    //     style={{ padding: "2rem", height: "300vh" }}
    //   >
    //     {/* Section 1: Basic Tooltip Tests */}
    //     <section
    //       style={{
    //         marginBottom: "3rem",
    //         borderBottom: "1px solid #eee",
    //         paddingBottom: "2rem",
    //       }}
    //     >
    //       <h2>Basic Tooltip Positioning</h2>
    //       <div
    //         style={{
    //           display: "flex",
    //           gap: "1rem",
    //           flexWrap: "wrap",
    //           marginBottom: "1rem",
    //         }}
    //       >
    //         <Button label="Top Left" tooltip="Top left tooltip" />
    //         <Button label="Top Center" tooltip="Top center tooltip" />
    //         <Button label="Top Right" tooltip="Top right tooltip" />
    //       </div>
    //       <div
    //         style={{
    //           display: "flex",
    //           gap: "1rem",
    //           justifyContent: "center",
    //           marginBottom: "1rem",
    //         }}
    //       >
    //         <Button
    //           label="Left Center"
    //           tooltip="Left center tooltip"
    //           tooltipPosition="MIDDLE_RIGHT"
    //           toggletip="Left center toggletip"
    //         />
    //         <div style={{ width: "200px" }}></div>
    //         <Button label="Right Center" />
    //       </div>
    //       <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
    //         <Button label="Bottom Left" tooltip="Bottom left tooltip" />
    //         <Button label="Bottom Center" tooltip="Bottom center tooltip" />
    //         <Button label="Bottom Right" tooltip="Bottom right tooltip" />
    //       </div>
    //     </section>

    //     {/* Section 2: Edge Cases */}
    //     <section
    //       style={{
    //         marginBottom: "3rem",
    //         borderBottom: "1px solid #eee",
    //         paddingBottom: "2rem",
    //       }}
    //     >
    //       <h2>Edge Cases</h2>

    //       {/* Viewport Edge Testing */}
    //       <div
    //         style={{
    //           display: "flex",
    //           justifyContent: "space-between",
    //           marginBottom: "2rem",
    //         }}
    //       >
    //         <Button label="Top-Left Corner" tooltip="Should adjust position" />
    //         <Button label="Top-Right Corner" tooltip="Should adjust position" />
    //       </div>

    //       <div
    //         style={{
    //           display: "flex",
    //           justifyContent: "space-between",
    //           marginBottom: "2rem",
    //         }}
    //       >
    //         <Button
    //           label="Bottom-Left Corner"
    //           tooltip="Should adjust position"
    //         />
    //         <Button
    //           label="Bottom-Right Corner"
    //           tooltip="Should adjust position"
    //         />
    //       </div>

    //       {/* Long Content */}
    //       <div style={{ marginBottom: "2rem" }}>
    //         <Button
    //           label="Long Tooltip"
    //           tooltip="This is an extremely lengthy tooltip text that should wrap or adjust its position accordingly. It needs to handle cases where the content is much longer than usual. This is an extremely lengthy tooltip text that should wrap or adjust its position accordingly. It needs to handle cases where the content is much longer than usual. This is an extremely lengthy tooltip text that should wrap or adjust its position accordingly. It needs to handle cases where the content is much longer than usual. This is an extremely lengthy tooltip text that should wrap or adjust its position accordingly. It needs to handle cases where the content is much longer than usual. This is an extremely lengthy tooltip text that should wrap or adjust its position accordingly. It needs to handle cases where the content is much longer than usual."
    //         />
    //       </div>

    //       {/* Small Viewport Simulation */}
    //       <div
    //         style={{
    //           border: "1px solid #ccc",
    //           padding: "1rem",
    //           width: "200px",
    //           height: "150px",
    //           overflow: "auto",
    //           marginBottom: "2rem",
    //         }}
    //       >
    //         <div style={{ height: "300px", position: "relative" }}>
    //           <Button
    //             label="In Scroll Container"
    //             tooltip="Should position correctly within scroll container"
    //             style={{ position: "absolute", bottom: "50px", right: "20px" }}
    //           />
    //         </div>
    //       </div>
    //     </section>

    //     {/* Section 3: Real-world Scenarios */}
    //     <section
    //       style={{
    //         marginBottom: "3rem",
    //         borderBottom: "1px solid #eee",
    //         paddingBottom: "2rem",
    //       }}
    //     >
    //       <h2>Real-world Scenarios</h2>

    //       {/* Form Elements */}
    //       <div style={{ marginBottom: "2rem" }}>
    //         <h3>Form Fields</h3>
    //         <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
    //           <div style={{ flex: "1 1 300px" }}>
    //             <label htmlFor="username">Username</label>
    //             <input
    //               id="username"
    //               placeholder="Enter username"
    //               style={{ width: "100%", padding: "0.5rem" }}
    //             />
    //           </div>
    //           <div style={{ flex: "1 1 300px" }}>
    //             <label htmlFor="password">Password</label>
    //             <div style={{ display: "flex", alignItems: "center" }}>
    //               <input
    //                 id="password"
    //                 type="password"
    //                 placeholder="Enter password"
    //                 style={{ width: "100%", padding: "0.5rem" }}
    //               />
    //               <Button
    //                 variant="ghost"
    //                 label="?"
    //                 tooltip="Password requirements: 8+ chars, 1 number, 1 special char"
    //                 style={{ marginLeft: "0.5rem" }}
    //               />
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Data Table */}
    //       <div style={{ marginBottom: "2rem" }}>
    //         <h3>Data Table with Actions</h3>
    //         <table style={{ width: "100%", borderCollapse: "collapse" }}>
    //           <thead>
    //             <tr>
    //               <th
    //                 style={{
    //                   textAlign: "left",
    //                   padding: "0.5rem",
    //                   borderBottom: "1px solid #ddd",
    //                 }}
    //               >
    //                 ID
    //               </th>
    //               <th
    //                 style={{
    //                   textAlign: "left",
    //                   padding: "0.5rem",
    //                   borderBottom: "1px solid #ddd",
    //                 }}
    //               >
    //                 Name
    //               </th>
    //               <th
    //                 style={{
    //                   textAlign: "left",
    //                   padding: "0.5rem",
    //                   borderBottom: "1px solid #ddd",
    //                 }}
    //               >
    //                 Status
    //               </th>
    //               <th
    //                 style={{
    //                   textAlign: "left",
    //                   padding: "0.5rem",
    //                   borderBottom: "1px solid #ddd",
    //                 }}
    //               >
    //                 Actions
    //               </th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {[1, 2, 3].map((item) => (
    //               <tr key={item}>
    //                 <td
    //                   style={{
    //                     padding: "0.5rem",
    //                     borderBottom: "1px solid #eee",
    //                   }}
    //                 >
    //                   {item}
    //                 </td>
    //                 <td
    //                   style={{
    //                     padding: "0.5rem",
    //                     borderBottom: "1px solid #eee",
    //                   }}
    //                 >
    //                   Item {item}
    //                 </td>
    //                 <td
    //                   style={{
    //                     padding: "0.5rem",
    //                     borderBottom: "1px solid #eee",
    //                   }}
    //                 >
    //                   <Button
    //                     variant="ghost"
    //                     label={item % 2 === 0 ? "Active" : "Inactive"}
    //                     tooltip={
    //                       item % 2 === 0
    //                         ? "This item is currently active"
    //                         : "This item is inactive"
    //                     }
    //                   />
    //                 </td>
    //                 <td
    //                   style={{
    //                     padding: "0.5rem",
    //                     borderBottom: "1px solid #eee",
    //                   }}
    //                 >
    //                   <Button
    //                     variant="ghost"
    //                     label="Edit"
    //                     tooltip="Edit this item"
    //                   />
    //                   <Button
    //                     variant="ghost"
    //                     label="Delete"
    //                     tooltip="Delete this item permanently"
    //                     style={{ marginLeft: "0.5rem" }}
    //                   />
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>
    //       </div>
    //     </section>

    //     {/* Section 4: Fixed Position Elements */}
    //     <section>
    //       <h2>Fixed Position Elements</h2>

    //       {/* Fixed Footer */}
    //       <div
    //         style={{
    //           position: "fixed",
    //           bottom: 16,
    //           left: 16,
    //           display: "flex",
    //           gap: "1rem",
    //         }}
    //       >
    //         <Button
    //           variant="secondary"
    //           label="Help"
    //           tooltip="Open help center"
    //         />
    //         <Button
    //           variant="outline"
    //           label="Feedback"
    //           tooltip="Send feedback about your experience"
    //         />
    //       </div>

    //       {/* Fixed Sidebar */}
    //       <div
    //         style={{
    //           position: "fixed",
    //           top: "50%",
    //           right: 16,
    //           transform: "translateY(-50%)",
    //           display: "flex",
    //           flexDirection: "column",
    //           gap: "0.5rem",
    //         }}
    //       >
    //         <Button
    //           variant="ghost"
    //           label="▲"
    //           tooltip="Scroll to top Scroll to top Scroll to top Scroll to top Scroll to top"
    //         />
    //         <Button variant="ghost" label="⚙" tooltip="Settings" />
    //         <Button variant="ghost" label="✉" tooltip="Contact support" />
    //       </div>
    //     </section>

    //     {/* Section 5: Edge-Aligned Vertical/Horizontal Button Groups with Various Tooltip Lengths */}
    //     <section>
    //       <h2>Screen Edge Button Groups (Tooltip Lengths)</h2>
    //       {/* Left Side Vertical Buttons */}
    //       <div
    //         style={{
    //           position: "fixed",
    //           top: "20%",
    //           left: 0,
    //           display: "flex",
    //           flexDirection: "column",
    //           gap: "1rem",
    //           alignItems: "flex-start",
    //           zIndex: 1000,
    //           paddingLeft: "0.5rem",
    //         }}
    //       >
    //         <Button
    //           label="L1"
    //           tooltip="Short"
    //           tooltipPosition="MIDDLE_LEFT"
    //           toggletip="this a toggle tip with a long text"
    //         />
    //         <Button
    //           label="L2"
    //           tooltip="A bit longer tooltip text"
    //           toggletip=" this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text"
    //           tooltipPosition="MIDDLE_CENTER"
    //         />
    //         <Button
    //           label="L3"
    //           tooltip="This is a much longer tooltip. It should wrap and demonstrate how the tooltip handles more verbose content on the left edge of the screen. This is a much longer tooltip. It should wrap and demonstrate how the tooltip handles more verbose content on the left edge of the screen."
    //           tooltipPosition="MIDDLE_RIGHT"
    //           toggletip=" this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text"
    //         />
    //         <Button
    //           label="L4"
    //           tooltip="This is a much longer tooltip. It should wrap and demonstrate how the tooltip handles more verbose content on the left edge of the screen."
    //           tooltipPosition="MIDDLE_RIGHT"
    //           toggletip=" this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text"
    //         />
    //         <Button
    //           label="L5"
    //           tooltip="This is a much longer tooltip. It should wrap and demonstrate how the tooltip handles more verbose content on the left edge of the screen. This is a much longer tooltip. It should wrap and demonstrate how the tooltip handles more verbose content on the left edge of the screen."
    //           // tooltipPosition="BOTTOM_LEFT"
    //           avoidOverlapping={true}
    //           toggletip=" this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text"
    //         />
    //       </div>
    //       {/* Right Side Vertical Buttons */}
    //       {/* <div
    //         style={{
    //           position: "fixed",
    //           top: "20%",
    //           right: 0,
    //           display: "flex",
    //           flexDirection: "column",
    //           gap: "1rem",
    //           alignItems: "flex-end",
    //           zIndex: 1000,
    //           paddingRight: "0.5rem",
    //         }}
    //       > */}
    //       <Button
    //         label="R1"
    //         tooltip="Short"
    //         toggletip=" this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text"
    //         style={{
    //           position: "fixed",
    //           top: "20%",
    //           right: 0,
    //           zIndex: 1000,
    //           margin: "0.5rem",
    //         }}
    //       />
    //       <Button
    //         label="R2"
    //         tooltip="A bit longer tooltip text"
    //         tooltipPosition="MIDDLE_LEFT"
    //         toggletip=" this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text"
    //         style={{
    //           position: "fixed",
    //           top: "25%",
    //           right: 0,
    //           zIndex: 1000,
    //           margin: "0.5rem",
    //         }}
    //       />
    //       <Button
    //         label="R3"
    //         tooltip="This is a medium-length tooltip for the right side button."
    //         toggletip=" this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text"
    //         withTip={false}
    //         style={{
    //           position: "fixed",
    //           top: "30%",
    //           right: 0,
    //           zIndex: 1000,
    //           margin: "0.5rem",
    //         }}
    //       />
    //       <Button
    //         label="R4"
    //         tooltip="This is a much longer tooltip. It should wrap and demonstrate how the tooltip handles more verbose content on the right edge of the screen."
    //         toggletip=" this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text"
    //         style={{
    //           position: "fixed",
    //           top: "35%",
    //           right: 0,
    //           zIndex: 1000,
    //           margin: "0.5rem",
    //         }}
    //       />
    //       <Button
    //         label="R5"
    //         tooltip="This is an extremely lengthy tooltip text for the right side button. It is intentionally verbose to test how the tooltip component manages very long content, wrapping, and edge positioning. The tooltip should remain readable and not overflow the viewport."
    //         toggletip=" this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text this a toggle tip with a long text"
    //         // tooltipPosition="MIDDLE_LEFT"
    //         style={{
    //           position: "fixed",
    //           top: "40%",
    //           right: 0,
    //           zIndex: 1000,
    //           margin: "0.5rem",
    //         }}
    //       />
    //       {/* </div> */}
    //       {/* Top Side Horizontal Buttons */}
    //       <div
    //         style={{
    //           position: "fixed",
    //           top: 0,
    //           left: "50%",
    //           transform: "translateX(-50%)",
    //           display: "flex",
    //           flexDirection: "row",
    //           gap: "1rem",
    //           zIndex: 1000,
    //           paddingTop: "0.5rem",
    //         }}
    //       >

    //         <ToggleTip toggletip="Click to view password rules and other information, some more text here to make it longer">
    //           {(toggleProps) => (
    //             <Button
    //               {...toggleProps} // <- click handling from ToggleTip
    //               tooltip="this is just a tooltip" // <- hover tooltip handled by Button
    //               label="T1"
    //               variant="primary"
    //               style={{ marginLeft: "0.5rem" }}
    //             />
    //           )}
    //         </ToggleTip>
    //         <ToggleTip toggletip="Click to view password rules and other information, some more text here to make it longer">
    //           {(toggleProps) => (
    //             <Button
    //               {...toggleProps} // <- click handling from ToggleTip
    //               tooltip="this is just a tooltip" // <- hover tooltip handled by Button
    //               label="T2"
    //               variant="primary"
    //               style={{ marginLeft: "0.5rem" }}
    //             />
    //           )}
    //         </ToggleTip>
    //         <ToggleTip toggletip="Click to view password rules and other information, some more text here to make it longer">
    //           {(toggleProps) => (
    //             <Button
    //               {...toggleProps} // <- click handling from ToggleTip
    //               tooltip="this is just a tooltip" // <- hover tooltip handled by Button
    //               label="T3"
    //               variant="primary"
    //               style={{ marginLeft: "0.5rem" }}
    //             />
    //           )}
    //         </ToggleTip>
    //         <ToggleTip toggletip="Click to view password rules and other information, some more text here to make it longer">
    //           {(toggleProps) => (
    //             <Button
    //               {...toggleProps} // <- click handling from ToggleTip
    //               tooltip="this is just a tooltip" // <- hover tooltip handled by Button
    //               label="T4"
    //               variant="primary"
    //               style={{ marginLeft: "0.5rem" }}
    //             />
    //           )}
    //         </ToggleTip>
    //         <ToggleTip toggletip="Click to view password rules and other information, some more text here to make it longer">
    //           {(toggleProps) => (
    //             <Button
    //               {...toggleProps} // <- click handling from ToggleTip
    //               tooltip="this is just a tooltip" // <- hover tooltip handled by Button
    //               label="T5"
    //               variant="primary"
    //               style={{ marginLeft: "0.5rem" }}
    //             />
    //           )}
    //         </ToggleTip>

    //         <Button
    //           tooltip="this is just a tooltip" // <- hover tooltip handled by Button
    //           toggletip="Click to view password rules and other information, some more text here to make it longer"
    //           label="T6"
    //           variant="primary"
    //           style={{ marginLeft: "0.5rem" }}
    //         />

    //         <Button
    //           tooltip="this is just a tooltip" // <- hover tooltip handled by Button
    //           toggletip="Click to view password rules and other information, some more text here to make it longer"
    //           label="T7"
    //           variant="primary"
    //           style={{ marginLeft: "0.5rem" }}
    //         />
    //       </div>
    //       {/* Bottom Side Horizontal Buttons */}
    //       <div
    //         style={{
    //           position: "fixed",
    //           bottom: 0,
    //           left: "50%",
    //           transform: "translateX(-50%)",
    //           display: "flex",
    //           flexDirection: "row",
    //           gap: "1rem",
    //           zIndex: 1000,
    //           paddingBottom: "0.5rem",
    //         }}
    //       >
    //         <ToggleTip toggletip="large: This is an extremely lengthy tooltip text for the top button. It is intentionally verbose to test how the tooltip component manages very long content, wrapping, and edge positioning. The tooltip should remain readable and not overflow the viewport ">
    //           {({ ...toggleProps }) => (
    //             <Button
    //               {...toggleProps}
    //               label="B1"
    //               tooltip="short"
    //               tooltipPosition="MIDDLE_LEFT"
    //             />
    //           )}
    //         </ToggleTip>
    //         <Button label="B2" tooltip="A bit longer tooltip text" />
    //         <Button
    //           label="B3"
    //           tooltip="This is a medium-length tooltip for the bottom button."
    //         />
    //         <Button
    //           label="B4"
    //           tooltip="This is a much longer tooltip. It should wrap and demonstrate how the tooltip handles more verbose content on the bottom edge of the screen."
    //         />
    //         <Button
    //           label="B5"
    //           tooltip="This is an extremely lengthy tooltip text for the bottom button. It is intentionally verbose to test how the tooltip component manages very long content, wrapping, and edge positioning. The tooltip should remain readable and not overflow the viewport."
    //         />
    //       </div>
    //     </section>
    //   </div>
    //   {/* <TooltipTest /> */}
    // </>
    <>
      <div className="tooltip-test">
        <ToggleTip
          tooltip="?: Help" // <- hover tooltip handled by Button
          toggletip="Click to view password rules and other information, some more text here to make it longer"
          label="?"
          tooltipPosition="center-left"
        ></ToggleTip>

        <ToggleTip
          label="??"
          tooltip="??: Help"
          toggletip="Click to view password rules and other information, some more text here to make it longer Click to view password rules and other information, some more text here to make it longer"
          tooltipPosition="top-center"
        ></ToggleTip>

        {/* <ToggleTip toggletip="Click to view password rules and other information, some more text here to make it longer">
          {(toggleProps) => (
            <Button
              {...toggleProps} // <- click handling from ToggleTip
              tooltip="i: More information" // <- hover tooltip handled by Button
              label="i"
              variant="primary"
              style={{ marginLeft: "0.5rem" }}
            />
          )}
        </ToggleTip> */}

        {/* <ToggleTip toggletip="Click to view password rules and other information, some more text here to make it longer">
          {(toggleProps) => (
            <Button
              {...toggleProps} // <- click handling from ToggleTip
              tooltip="$: Check Price" // <- hover tooltip handled by Button
              label="$"
              variant="primary"
              style={{ marginLeft: "0.5rem" }}
            />
          )}
        </ToggleTip> */}

        <Button tooltip="Goods" label="???" variant="primary"></Button>

        <ToggleTip
          tooltip="This is a hover tooltip"
          toggletip={
            "Click to view password rules and other information, some more text here to make it longer"
          }
          tooltipPosition="bottom-center"
          withTip={true}
          variant="primary"
        >
          Click Me
        </ToggleTip>

        {/* <Button
          role="tab"
          type="button"
          tooltip={isTruncated ? label : undefined}
        >
          <div className="truncate tab-header" ref={labelRef}>
            <span className="label">{"Tab 111"}</span>
          </div>
        </Button> */}
      </div>
    </>
  );
};

export default App;

{
  /* <ToggleTip toggletip="Click to view password rules and other information, some more text here to make it longer">
        {(toggleProps) => (
          <Button
            {...toggleProps} // <- click handling from ToggleTip
            tooltip="this is just a tooltip" // <- hover tooltip handled by Button
            label="?"
            variant="primary"
            style={{ marginLeft: "0.5rem" }}
          />
        )}
      </ToggleTip> */
}

// <Button
//   tooltip="More information"
//   toggletip="Click to view password rules and other information, "
//   label="?"
//   variant="primary"
//   style={{ marginLeft: "0.5rem" }}
// />

// <Button
//   tooltip="More information"
//   toggletip="Click to view password rules and other information, "
//   label="??"
//   variant="primary"
//   style={{ marginLeft: "0.5rem" }}
// />
