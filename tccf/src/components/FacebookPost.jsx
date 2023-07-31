import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/FacebookPost.module.css";
import LoginFacebook from "../components/LoginFacebook.jsx";
import { format } from 'date-fns';

export default function FecebookPost() {
  const [type, setType] = useState("load");
  const [pageName, setPageName] = useState([]);
  const [selectPage, setSelectPage] = useState("");
  const [listPost, setListPost] = useState([])

  async function getPost() {
    console.log(listPost)
    if(localStorage.getItem("ImpressTech")){
      let data = JSON.parse(localStorage.getItem("ImpressTech"));
      let id = data.ID;

      try{
        const resposta = await axios.post(`http://localhost:4000/get-post`, {id, selectPage})
        if(!resposta.data){
          for(let i = 0; i < resposta.data.length; i++){
            const id = resposta.data[i].id
            let mensagem
            if(!resposta.data[i].message){
              mensagem = "Sem Texto"
            }else{
              mensagem = resposta.data[i].message
            }
            let created_time = resposta.data[i].created_time
            let data = new Date(created_time)
            data = format(data, "dd/MM/yy - HH:mm:ss")

            const dados = {
              "id": id,
              "mensagem": mensagem,
              "data": data
            }
            console.log(dados)
            setListPost(dados)
          }
        }
      }catch(erro){
        console.log(erro)
      }
    }
  }
  async function getPages() {
    if (localStorage.getItem("ImpressTech")) {
      let data = JSON.parse(localStorage.getItem("ImpressTech"));
      let id = data.ID;

      try {
        const resposta = await axios.post(`http://localhost:4000/get-facebook`, { id })

        if (resposta.data.pages.length > 0) {
          setPageName(resposta.data.pages.map((page) => page.pageName));
          setType("comPages");
        } else {
          setType("semPages");
        }
      } catch (erro) {
        console.log(erro);
        setType("semPages");
      }
    }
  }

  useEffect(() => {
    getPages()
  });

  if (type === "semPages") {
    return (
      <div className={styles.index}>
        <div className={styles.semPages}>
          <h2>ATENÇÃO</h2>
          <p>Você não possui nenhuma página em nosso sistema</p>
          <LoginFacebook getPages={() => getPages()} />
        </div>
      </div>
    );
  }

  if (type === "comPages") {
    return (
      <div className={styles.index}>
        <select className={styles.selectPage} onClick={(event) => { setSelectPage(event.target.value); getPost()}}>
          {pageName.map((option) => (
            <option value={option}>
              {option}
            </option>
          ))}
        </select>
        
        <div className={styles.posts}>
          <div>
            {listPost.map((item) => (
              <span id={item.id}>{item.mensagem} {item.data}</span>
            ))}
          </div>
        </div>
          
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
