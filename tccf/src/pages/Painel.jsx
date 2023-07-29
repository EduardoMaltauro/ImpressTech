import React from "react";
import { useState } from "react";

import NavBar from "../components/NavBar.jsx";
import styles from "../styles/Painel.module.css"
import FecebookPost from "../components/FacebookPost.jsx";
 
export default function Painel(){
    const [page, setPage] = useState(0);

    if(page === 0){
        return<>
            <NavBar/>
            <div className={styles.index}>
                <ul className={styles.menu}>
                    <li id={styles.ativo} onClick={() => {setPage(0)}}>FACEBOOK POST</li>
                    <li onClick={() => {setPage(1)}}>SITE CHECK</li>
                </ul>
            </div>
            <FecebookPost/>
        </>
    }

    if(page === 1){
        return<>
            <NavBar/>
            <div className={styles.index}>
                <ul className={styles.menu}>
                    <li onClick={() => {setPage(0)}}>FACEBOOK POST</li>
                    <li id={styles.ativo} onClick={() => {setPage(1)}}>SITE CHECK</li>
                </ul>
            </div>
        </>
    }
}