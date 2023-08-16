import React, { useState } from "react";
import NavBar from "../components/NavBar.jsx";
import Dev from "../components/Dev.jsx";
import Painel from "./Painel.jsx";
import SystemLogin from "../components/SystemLogin.jsx";


export default function Inicio(){
    const [page, setPage] = useState(0)

    if(page === 0){
        return<>
            <NavBar  Painel={() => { setPage(2)}} Login={() => {setPage(1)}} Home={() => {setPage(0)}} Page={page}/>
            <Dev/>
        </>
    }else if(page === 1){
        return<>
            <NavBar  Login={() => {setPage(1)}} Home={() => {setPage(0)}} Page={page}/>
            <SystemLogin Painel={() => {setPage(2)}} Page={page}/>
        </>
    }else if(page === 2){
        return<>
            <NavBar  Login={() => {setPage(1)}} Home={() => {setPage(0)}} Page={page}/>
            <Painel/>
        </>
    }
}