import React, {useState } from "react";
import NavBar from "../components/NavBar.jsx";
import Dev from "../components/Dev.jsx";
import Painel from "./Painel.jsx";
import SystemLogin from "../components/SystemLogin.jsx";
import InicioComp from "../components/InicioComp.jsx";

export default function Inicio() {
    const [page, setPage] = useState(0);

    function mudarPage(newPage) {
        setPage(newPage);
    }

    return (
        <>
            <NavBar Login={() => mudarPage(1)} Home={() => mudarPage(0)} />
            {page === 1 && <SystemLogin Painel={() => mudarPage(2)} Page={page} />}
            {page === 2 && <Painel Painel={() => mudarPage(2)} Page={page} />}
            {page === 0 && <InicioComp/>}
        </>
    );
}
