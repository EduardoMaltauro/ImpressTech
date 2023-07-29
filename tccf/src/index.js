import React from "react";
import {createRoot} from "react-dom/client";

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import Rotas from "./Rotas.jsx"

const root = createRoot(document.getElementById('root'))
root.render(<Rotas/>)