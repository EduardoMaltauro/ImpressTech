import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "./pages/Inicio.jsx";
import "./functions/SystemTimeAccess.js"



export default function Rotas(){
    return <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
            <Route path="/" element={<Inicio/>}/>
        </Routes>
    </BrowserRouter>
}