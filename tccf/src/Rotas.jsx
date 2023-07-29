import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Inicio from "./pages/Inicio.jsx";
import AreaCliente from "./pages/AreaCliente.jsx";
import Painel from "./pages/Painel.jsx";



export default function Rotas(){
    return <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Routes>
            <Route path="/" element={<Inicio/>}/>
            <Route path="/areacliente" element={<AreaCliente/>}/>
            <Route path="/:id/painel" element={<Painel/>}/>
        </Routes>
    </BrowserRouter>
}