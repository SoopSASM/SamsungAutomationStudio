import React from "react";
import ReactDOM from "react-dom/client";

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("failed to find the root element");

ReactDOM.createRoot(rootElement).render(<div>Hello React</div>);
