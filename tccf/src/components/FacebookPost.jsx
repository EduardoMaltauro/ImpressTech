import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/FacebookPost.module.css";
import LoginFacebook from "../components/LoginFacebook.jsx";

export default function FecebookPost() {
  const [type, setType] = useState("load");



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
    return (
      <div className={styles.index}>
        <div className={styles.semPages}>
          <h2>ATENÇÃO</h2>
          <p>Você não possui nenhuma página em nosso sistema</p>
          {/* <button>ADICIONAR</button> */}
          <LoginFacebook/>
          
          <div></div>
        </div>
      </div>
    );
  }

  if (type === "comPeges") {
    return (
      <div className={styles.index}>
        {/* Renderizar o conteúdo quando houver páginas */}
      </div>
    );
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
