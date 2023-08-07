import React, { useState, useEffect} from "react";
import axios from "axios";
import styles from "../styles/FacebookPost.module.css";
import LoginFacebook from "../components/LoginFacebook.jsx";
import { format } from 'date-fns';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faPlus, faRotateRight, faTrash } from '@fortawesome/free-solid-svg-icons'

export default function FacebookPost() {
  const [type, setType] = useState("load")
  const [pageName, setPageName] = useState([])
  const [selectPage, setSelectPage] = useState("")
  const [listPost, setListPost] = useState([])
  const [selectValue, setSelectedValue] = useState("")
  const [mensagemPost, setMensagemPost] = useState("")
  const [imgPost, setImgPost] = useState(null)
  const [dataPost, setDataPost] = useState("")


  function setSelect(value) {
    setSelectedValue(value)
    const select = document.getElementById("select")
    if (selectValue === selectPage && select) {
      select.value = selectValue
    }

  }
  async function createPost() {
    if (localStorage.getItem("ImpressTech")) {
      let data = JSON.parse(localStorage.getItem("ImpressTech"));
      let id = data.ID;

      try {
        // let img = new FormData()
        // img.append("file", imgPost)
        // console.log(img, imgPost)
       const resposta = await axios.post("http://localhost:4000/create-post",{ file: imgPost, id, selectPage, mensagemPost, dataPost })

        if (resposta.status === 201) {
          divPost()
          getPages(selectPage)
        }
      } catch (erro) {
        console.log(erro)
      }

    }
  }
  async function delPost(idPost) {
    if (localStorage.getItem("ImpressTech")) {
      let data = JSON.parse(localStorage.getItem("ImpressTech"));
      let id = data.ID;
      try {
        setType("load")
        const resposta = await axios.post("http://localhost:4000/del-post", { idPost, selectPage, id })
        if (resposta.status === 200) {
          getPost(selectPage)
        }
      } catch (erro) {
        console.log(erro)
        setType("comPeges")
      }
    }
  }

  async function getPost(selectPage) {
    setSelectPage(selectPage)
    setType("load")

    if (selectPage === "") {
      setListPost([])
      setType("comPages")
    }
    if (localStorage.getItem("ImpressTech") && selectPage !== "") {
      let data = JSON.parse(localStorage.getItem("ImpressTech"));
      let id = data.ID;
      try {
        const resposta = await axios.get(`http://localhost:4000/get-post`, {
          params: {
            id, 
            selectPage
          }
        })
        if (resposta.data.data) {
          const posts = resposta.data.data.map((post) => {
            const idPost = post.id;
            const mensagem = post.message || "Sem Texto"
            const created_time = post.created_time;
            const data = format(new Date(created_time), "dd/MM/yy - HH:mm:ss")
            const imagem = post.full_picture || "/assets/sem-imagem.png"

            return {
              idPost: idPost,
              mensagem: mensagem,
              data: data,
              imagem: imagem,
            }
          })

          setListPost(posts)
          setType("comPages")
        }
      } catch (erro) {
        console.log(erro)
        setType("comPages")
      }
    }
  }

  async function getPages() {
    if (localStorage.getItem("ImpressTech")) {
      let data = JSON.parse(localStorage.getItem("ImpressTech"));
      let id = data.ID;

      try {
        const resposta = await axios.get(`http://localhost:4000/get-facebook`, {
          params: {
            id
          }
        })

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

  function divPost() {
    const divCreatePost = document.getElementById("divCreatePost")
    if (divCreatePost.style.display === "flex") {
        divCreatePost.style.display = "none";
        console.log("A")
      } else {
        divCreatePost.style.display = "flex";
        console.log("B")
      }
  }

  function inputData() {
    if (document.getElementById("data").style.display === "flex") {
      document.getElementById("data").style.display = "none"
    } else {
      document.getElementById("data").style.display = "flex"
    }
  }


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

        <button className={styles.btnAdd} onClick={() => { divPost() }}><FontAwesomeIcon icon={faPlus} beat></FontAwesomeIcon></button>

        <select value={selectValue} id="select" className={styles.selectPage} onChange={(event) => { getPost(event.target.value); setSelect(event.target.value) }}>
          <option value="">Escolha uma página</option>
          {pageName.map((name) => (
            <option key="" value={name}>{name}</option>
          ))}
        </select>

        <button className={styles.bntRelPost} onClick={() => { getPost(selectPage) }}><FontAwesomeIcon icon={faRotateRight} spin></FontAwesomeIcon></button>

        <div className={styles.divNewPost} id="divCreatePost" style={{display: "none"}}>
          <form onSubmit={(event) => { event.preventDefault(); createPost()}}>
            <input type="file" onChange={(event) => {
              const file = event.target.files[0]
              console.log(file)
              setImgPost(file)
  
            }}/>
            <textarea className={styles.descricao}  required onChange={(event) => {setMensagemPost(event.target.value)}}/>
            <br/>
            <input type="checkbox" id="agendar" name="agendar" onClick={() => { inputData() }} />
            <label htmlFor="agendar"> Agendar?</label>
            <br/>
            <input style={{ display: "none" }} id="data" type="datetime-local" onChange={(event) => {setDataPost(event.target.value)}}/>
            <br/>
            <button>Enviar</button>
          </form>
        </div>
        
        <div className={styles.posts}>
          <div>
            {listPost.map((item) => (
              <div key={item.idPost} id={item.idPost} className="card mb-3 text-bg-dark border-light" style={{ maxWidth: 540 }}>
                <button onClick={() => { const id = item.idPost; delPost(id) }} className="btn btn-danger" style={{ position: "absolute", left: "36vw", top: "5px" }}><FontAwesomeIcon icon={faTrash} bounce /></button>
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
