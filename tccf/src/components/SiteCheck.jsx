import React, { useState } from "react";
import styles from "../styles/SiteCheck.module.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faPlus } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";

export default function SiteCheck() {
    const [type, setType] = useState("semSites")
    const [sites, setSites] = useState([])
    const [site, SetSite] = useState("")

    async function getSites(){
        if (localStorage.getItem("ImpressTech")) {
            let data = JSON.parse(localStorage.getItem("ImpressTech"));
            let id = data.ID;
            try{
                const resposta = await axios.get("http://localhost:4000/get-sites", {
                    params:{
                        id: id
                    }
                })

                if(resposta.status === 200){
                    //....
                }
            }catch(erro){
                console.log(erro)
            }
        }
    }

    async function addSites(){

        if (localStorage.getItem("ImpressTech")) {
            let data = JSON.parse(localStorage.getItem("ImpressTech"));
            let id = data.ID;

            try{
                const resposta = await axios.post("http://localhost:4000/add-sites", {id, site})
    
                if(resposta.status === 202){
                    setType("comSites")
                }
            }catch(erro){
                console.log(erro)
            }
        }
    }

    function divSite() {
        const divCreatePost = document.getElementById("divAddSite")        
        if (divCreatePost.style.display === "flex") {
            divCreatePost.style.display = "none";
        } else {
            divCreatePost.style.display = "flex";
        }
    }

    if (type === "semSites") {
        return <>
            <div className={styles.index}>
                <div className={styles.semSites}>
                    <h2>ATENÇÃO</h2>
                    <p>Você não possui nenhum site adicionado em nosso sistema</p>
                    <button onClick={() => { divSite() }}><FontAwesomeIcon icon={faGlobe} /> Adicionar</button>
                </div>
                <div className={styles.divNewSite} id="divAddSite" style={{ display: "none" }}>
                    <form onSubmit={(event) => {event.preventDefault()}}>
                         <input  onChange={(event) => {SetSite(event.target.value)}}  id={styles.inputSite} type="url" placeholder="https://impresstech.com.br" required/>
                        <br />
                        <input type="submit"/>
                    </form>
                </div>
            </div>
        </>
    }

    if (type === "comSites") {
        return<>
            <div className={styles.index}>
                <button className={styles.btnAdd} onClick={() => { divSite() }}><FontAwesomeIcon icon={faPlus} beat></FontAwesomeIcon></button>
                <div className={styles.divNewSite} id="divAddSite" style={{ display: "none" }}>
                    <form onSubmit={(event) => { event.preventDefault() }}>
                        <input id={styles.inputSite} type="url" placeholder="https://impresstech.com.br" required />
                        <br />
                        <input type="submit" />
                    </form>
                </div>

                <div className={styles.divSites}>
                    <div className={styles.divSite}>
                        <div className={styles.divSiteInfo}>
                            <h4><b>Nome</b></h4>
                            <label>Online</label>
                            <label>SSL</label>
                        </div>
                        <img  className={styles.divSiteImg}src="/assets/sem-imagem.png" alt="Icon Site" style={{width:70}}/>
                    </div>
                </div>

                    
            </div>
        </>
    }

    if (type === "load") {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
                <div className="spinner-border" role="status" style={{ fontSize: "3rem", width: "6rem", height: "6rem" }}>
                    <span className="visually-hidden">Carregando...</span>
                </div>
            </div>
        );
    }
}