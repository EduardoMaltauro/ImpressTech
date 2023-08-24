import React, { useEffect, useState } from "react";
import styles from "../styles/SiteCheck.module.css";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faPlus, faRotateRight } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import { format } from 'date-fns';

export default function SiteCheck() {
    const [type, setType] = useState("semSites")
    const [sites, setSites] = useState([])
    const [site, SetSite] = useState("")

    useEffect(() => {
        getSites()
    }, [])

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
                    const dataSites = resposta.data.map((site) => {
                        const titulo = site.titulo
                        const favIcon = site.favIcon || "/assets/sem-imagem.png"

                        let SSL = format(new Date(site.fimValidade), "dd/MM/yy - HH:mm:ss")
                        const hj = format(new Date(), "dd/MM/yy - HH:mm:ss")
                        if(SSL > hj ){
                            SSL = "SSL OK"
                        }else if(SSL < hj){
                            SSL = "Vencido"
                        }else{
                            SSL = "Vence Hoje"
                        }

                        let Status
                        if(titulo === "OFF"){
                            Status = "OFF"
                        }else{
                            Status = "ONLINE"
                        }

                        return {
                            titulo: titulo,
                            favIcon: favIcon,
                            SSL: SSL,
                            Status: Status
                        }
                    })
                    setSites(dataSites)
                    setType("comSites")
                }
            }catch(erro){
                setType("semSites")
                console.log(erro)
            }
        }
    }

    async function addSites(){

        if (localStorage.getItem("ImpressTech")) {
            let data = JSON.parse(localStorage.getItem("ImpressTech"));
            let id = data.ID;

            try{
                setType("load")
                const resposta = await axios.post("http://localhost:4000/add-sites", {id, site})
    
                if(resposta.status === 202){
                    await getSites()
                    setType("comSites")
                }
            }catch(erro){
                setType("semSites")
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
                    <form onSubmit={(event) => {event.preventDefault(); divSite(); addSites();}}>
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
                <button className={styles.btnAdd} onClick={() => {divSite()}}><FontAwesomeIcon icon={faPlus} beat></FontAwesomeIcon></button>
                <button className={styles.bntRelSites} onClick={() => {getSites()}}><FontAwesomeIcon icon={faRotateRight} spin></FontAwesomeIcon></button>
                <div className={styles.divNewSite} id="divAddSite" style={{ display: "none" }}>
                    <form onSubmit={(event) => { event.preventDefault(); addSites()}}>
                        <input id={styles.inputSite} type="url" placeholder="https://impresstech.com.br" required />
                        <br />
                        <input type="submit" />
                    </form>
                </div>

                {sites.map((site) => (
                    <div className={styles.divSites}>
                    <div className={styles.divSite}>
                        <div className={styles.divSiteInfo}>
                            <h4><b>{site.titulo}</b></h4>
                            <label>{site.Status}</label>
                            <label>{site.SSL}</label>
                        </div>
                        <img  className={styles.divSiteImg} src={site.favIcon || "/assets/sem-imagem.png"} alt="Icon Site" style={{width:70}}/>
                    </div>
                </div>
                ))}

                    
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