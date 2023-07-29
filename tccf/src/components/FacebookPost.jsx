import React from "react";
import { useState, useEffect } from "react";
import axios from "axios"
import styles from "../styles/FacebookPost.module.css";

import FacebookLogin from 'react-facebook-login';


export default function FecebookPost() {
  const [type, setType] = useState("load")

  const responseFacebook = (response) => {
    // Aqui você pode tratar a resposta do login do Facebook
    console.log(response);
  };
  
  useEffect(() => {
    async function getPages() {
      if (localStorage.getItem("ImpressTech")) {
        let data = JSON.parse(localStorage.getItem("ImpressTech"));
        let id = data.ID;

        try {
          const resposta = await axios.get(`http://localhost:4000/get-facebook`, {
            params: { id },
          });

          if (resposta.data.length <= 0) {
            setType("semPeges");
          } else {
            setType("comPeges");
          }
        } catch (erro) {
          console.log(erro);
        }
      }
    }

    getPages();
  }, []);

  if (type === "semPeges") {
    return <>
      <div className={styles.index}>
        <div className={styles.semPages}>
          <h2>ATENÇÃO</h2>
          <p>Você não possui nenhuma página em nosso sitema</p>
          {/* <button onClick={login}>ADICIONAR</button> */}
          <FacebookLogin
              appId="2459647954195593" // Substitua pelo ID do seu aplicativo no Facebook
              autoLoad={false}
              fields="accounts"
              callback={responseFacebook}
              version="v17.0"
            />
          <div>
          </div>
        </div>
      </div>
    </>
  }

  if (type === "comPeges") {
    return <>
      <div className={styles.index}>

      </div>
    </>
  }

  if (type === "load") {
    return <>
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <div className="spinner-border" role="status" style={{ fontSize: "3rem", width: "6rem", height: "6rem" }}>
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    </>
  }
}