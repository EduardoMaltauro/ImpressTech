import React, { useEffect, useState } from "react";
import styles from "../styles/SiteCheck.module.css";
import axios from "axios";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGlobe, faPlus, faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function SiteCheck() {
    const [type, setType] = useState("load")
    const [sites, setSites] = useState([])
    const [site, setSite] = useState("")
    const [AlterOn, setAlertOn] = useState({display: "none"})
    const [AlertText, setAlertText] = useState("")

    function Alerta(text){
        setAlertText(text)
        setAlertOn({display: "flex"})
        setTimeout(() => {
            setAlertOn({display: "none"})
            setAlertText("")
        },10000)  
    }


    function verifType(){
        setType("load")
        if (sites.length > 0) {
            setType("comSites")
        } else {
            setType("semSites")
        }   
    }

    setTimeout(() => {
        verifType()
        
    }, 1000);

    useEffect(() => {
        getSites()
    }, [])

    async function delSites(site){
        if(localStorage.getItem("ImpressTech")){
            setType("load")
            const data = JSON.parse(localStorage.getItem("ImpressTech"))
            const id = data.ID

            try{
                const resposta = await axios.post("http://localhost:4000/del-sites", {id,site})

                if(resposta.status === 200){
                    await getSites()
                    verifType()
                }
            }catch(erro){
                verifType()
                Alerta(erro.response.data.erro)
                console.log(erro)
            }
        }
    }
    async function getSites(){
        if (localStorage.getItem("ImpressTech")) {
            let data = JSON.parse(localStorage.getItem("ImpressTech"));
            let id = data.ID;
            try{
                setType("load")
                const resposta = await axios.get("http://localhost:4000/get-sites", {
                    params:{
                        id: id
                    }
                })
                if(resposta.status === 200){
                    const dataSites = resposta.data.map((site) => {
                        const titulo = site.titulo
                        const favIcon = site.favIcon || "/assets/sem-imagem.png"
                        const status = site.status
                        let ssl = site.ssl
                        const linkSite = site.linkSite                      
                       
                        return {
                            titulo: titulo,
                            favIcon: favIcon,
                            ssl: ssl,
                            status: status,
                            link: linkSite
                        }
                    })
                    setSites(dataSites)            
                }
            }catch(erro){
                verifType()
                alert(erro.response.data.erro)
                Alerta(erro.response.data.erro)
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
                    verifType()
                }
            }catch(erro){
                verifType()
                Alerta(erro.response.data.erro)
                console.log(erro)
            }
        }
    }

    function divSite() {
        verifType()
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
                         <input  onChange={(event) => {setSite(event.target.value)}}  id={styles.inputSite} type="url" placeholder="https://impresscione.com.br/" required/>
                        <br />
                        <input type="submit"/>
                    </form>
                </div>

                <div className={styles.alerta} style={AlterOn} id="divAlert">
                        <p id="textAlert">{AlertText}</p>
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
                        <input  onChange={(event) => {setSite(event.target.value)}}  id={styles.inputSite} type="url" placeholder="https://impresscione.com.br/" required/>
                        <br />
                        <input type="submit" />
                    </form>
                </div>

                <div class="row row-cols-1 row-cols-md-3 g-4" style={{marginTop:50, marginLeft:50, textAlign:"center"}}>
                {sites.map((site) => (
                    <div class="col"  style={{width:250, maxHeight:350}}>
                    <div class="card">
                      <img src={site.favIcon} class="card-img-top rounded mx-auto d-block" alt="FavIcon Site" style={{maxWidth:100, maxHeight:100}}/>
                      <div class="card-body">
                        <h5 class="card-title" style={{whiteSpace:"nowrap", overflow:"hidden", textOverflow: "ellipsis"}}>{site.titulo}</h5>
                        <p class="card-text">{site.status}</p>
                        <p class="card-text">{site.ssl}</p>
                        <a href={site.link} target="_blank" >Acessar</a>
                        <br/>
                        <br/>
                        <button className="btn btn-danger" onClick={() => { delSites(site.link)}}><FontAwesomeIcon icon={faTrash} bounce /></button>
                      </div>
                    </div>
                  </div>
                ))}
                </div>
                <div className={styles.alerta} style={AlterOn} id="divAlert">
                        <p id="textAlert">{AlertText}</p>
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