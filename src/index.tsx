import React from "react";
import ReactDOM from "react-dom/client";

import Program from "./main";

import "./utility/style/index.style.css";

const root = ReactDOM.createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <Program />
    </React.StrictMode>
);
