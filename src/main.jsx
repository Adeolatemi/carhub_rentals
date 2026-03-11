// import React from "react";
// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
// import { HashRouter } from "react-router-dom";

// import "./index.css";
// import App from "./App.jsx";

// const rootElement = document.getElementById("root");

// createRoot(rootElement).render(
//   <StrictMode>
//     <HashRouter>
//       <App />
//     </HashRouter>
//   </StrictMode>
// );


import React from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom";  // ✅ Correct import
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <App />
  </HashRouter>
);
