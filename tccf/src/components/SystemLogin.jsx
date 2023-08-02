import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import styles from"../styles/SystemLogin.module.css";
import "../functions/SystemTimeAccess.js"
export default function SystemLogin(){
    useEffect(() => {
        if(window.location.pathname === "/areacliente" && localStorage.getItem("ImpressTech")){
            let data = JSON.parse(localStorage.getItem("ImpressTech"))
            window.location.href = `https://localhost:3000/${data.ID}/painel`
        }
    }, [])

    const [type, setType] = useState("login");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [name, setName] = useState("");

    function Alerta(text){
        document.getElementById("textAlert").textContent = text
        document.getElementById("divAlert").style.display = "flex"
        setTimeout(() => {
            document.getElementById("textAlert").textContent = ""
            document.getElementById("divAlert").style.display = "none"
        },10000)  
    }

    async function System(event, mode){
        if(mode === "login"){
            try{
                setType("load")
                const resposta = await axios.post("http://localhost:4000/enviar-login", {email, senha})
                if(resposta.data.id && resposta.data.access){
                    let data = {
                        "ID": resposta.data.id,
                        "ACCESS": resposta.data.access,
                        "ONLINE": true
                    }
                    data = JSON.stringify(data)
                    localStorage.setItem("ImpressTech", data)
                    window.location.href = `https://localhost:3000/${resposta.data.id}/painel`
                }
            }catch(erro){
                console.log(erro)

                if(erro.response && erro.response.status === 404){
                    setType("login")
                    setTimeout(() => {
                        Alerta("Esse login não foi encontrado em nosso sistema!")
                    }, 100);
                }
            }
        }
        if(mode === "resgister"){
            try{
                setType("load")
                const resposta = await axios.post("http://localhost:4000/enviar-registro", { email, senha, name });
                if(resposta.data.id){
                    window.location.href = `https://localhost:3000/${resposta.data.id}/painel`
                }
            }catch(erro){
                if (erro.response && erro.response.status === 409) {
                    setType("register")
                    setTimeout(() => {
                        Alerta("Esse email já está em nosso sistema!");
                    }, 100);
                }
                console.log(erro)
            }
        }
    }
    if(type === "login"){
        return<>

            <form onSubmit={(event) => System(event, "login")}>
                <div className={styles.inputs}>
                <input className={styles.impuser} type="email" placeholder="Email" required value={email} onChange={(event) => setEmail(event.target.value)}/>
                    <input className={styles.imppass} type="password" placeholder="Senha" required value={senha} onChange={(event) => setSenha(event.target.value)}/>
                    <div>
                        <button className={styles.btnenter}>Entrar</button>
                    </div>
                    <div className={styles.text}>
                        <p>Não tem uma conta? <button onClick={() => setType("register")}>Registre-se</button></p>
                    </div>
                    <div className={styles.alerta} id="divAlert">
                        <p id="textAlert">ALERTA</p>
                    </div>
                </div>
            </form>
        </>
    }
    if(type === "register"){
        return<>
            <form onSubmit={(event) => System(event, "resgister")}>
                <div className={styles.inputs}>
                    <input className={styles.impuser} type="text" placeholder="Nome" required onChange={(event) => setName(event.target.value)}/>
                    <input className={styles.impuser} type="email" placeholder="Email" required onChange={(event) => setEmail(event.target.value)}/>
                    <input className={styles.imppass} type="password" placeholder="Senha" required onChange={(event) => setSenha(event.target.value)}/>
                    <div>
                        <button className={styles.btnenter} type="submite">Registrar</button>
                    </div>
                    <div className={styles.text}>
                        <p >Tem uma conta? <button onClick={() => setType("login")}>Faça login agora</button></p>
                    </div>
                    <div className={styles.alerta} id="divAlert">
                        <p id="textAlert">ALERTA</p>
                    </div>
                </div>
            </form>
        </>
    }
    if(type === "load"){
       return (
      <>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
          <div className="spinner-border" role="status" style={{ fontSize: "3rem", width: "6rem", height: "6rem" }}>
            <span className="visually-hidden">Carregando...</span>
          </div>
        </div>
      </>
    );
    }
}