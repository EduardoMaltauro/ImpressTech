import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "../styles/FacebookPost.module.css";
import LoginFacebook from "../components/LoginFacebook.jsx";
import { format } from 'date-fns';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function FacebookPost() {
  const [type, setType] = useState("load");
  const [pageName, setPageName] = useState([]);
  const [selectPage, setSelectPage] = useState("");
  const [listPost, setListPost] = useState([])

  async function delPost(idPost) {
    if (localStorage.getItem("ImpressTech")) {
      let data = JSON.parse(localStorage.getItem("ImpressTech"));
      let id = data.ID;

      try {
        const resposta = await axios.post("http://localhost:4000/del-post", { idPost, selectPage, id })
        setType("load")
        if (resposta.status === 200) {
          setType("comPages")
        }
      } catch (erro) {
        console.log(erro)
      }
    }
  }

  async function getPost() {
    if (selectPage !== "" && localStorage.getItem("ImpressTech")) {
      let data = JSON.parse(localStorage.getItem("ImpressTech"));
      let id = data.ID;

      try {
        const resposta = await axios.post(`http://localhost:4000/get-post`, { id, selectPage });
        if (resposta.data.data) {
          setType("load")
          const posts = resposta.data.data.map((post) => {
            const idPost = post.id;
            const mensagem = post.message || "Sem Texto";
            const created_time = post.created_time;
            const data = format(new Date(created_time), "dd/MM/yy - HH:mm:ss");
            const imagem = post.full_picture || "/assets/sem-imagem.png"
            const permDel = post.can_delete

            return {
              idPost: idPost,
              mensagem: mensagem,
              data: data,
              imagem: imagem,
              permDel: permDel
            };
          });

          setListPost(posts);
          setType("comPages")
        }
      } catch (erro) {
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
  }, [])

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
        <select className={styles.selectPage} onChange={(event) => { setSelectPage(event.target.value); getPost() }}>
          <option value="">Escolha uma página</option>
          {pageName.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button className={styles.bntRelPost} onClick={() => {getPost()}}><FontAwesomeIcon icon={faRotateRight} spin></FontAwesomeIcon></button>

        <div className={styles.posts}>
          <div>
            {listPost.map((item) => (
              <div key={item.idPost} id={item.idPost} className="card mb-3 text-bg-dark border-light" style={{ maxWidth: 540 }}>
                <button onClick={() => { const id = item.idPost; delPost(id) }} className="btn btn-danger" style={{position:"absolute", left:"36vw", top:"5px"}}><FontAwesomeIcon icon={faTrash} bounce /></button>
                <div className="row g-0">
                  <div className="col-md-4">
                    <img src={item.imagem} className="img-fluid rounded-start" alt="..." />
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <h5 className="card-title">PUBLICAÇÃO</h5>
                      <p className="card-text">{item.mensagem}</p>
                      <div className="card-footer">
                        <small className="text-body-dark">{item.data}</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
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
