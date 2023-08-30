import express from "express";
import axios from "axios";
import "dotenv/config.js";
import multer from "multer";
import multerConfig from "./config/multer.js";
import fs from "fs";
import * as cheerio from "cheerio";
import sslCertificate from "get-ssl-certificate";

import users from "./data/users.js";
import facebookData from "./data/FacebookPost.js";
import siteData from "./data/SiteCheck.js";

import { verifyToken } from "./functions/SDKFacebook.js";
import { newId } from "./functions/SystemLogin.js";
import "./functions/SystemTimeAccess.js";

import { v2 as cloudinary } from 'cloudinary';
import SiteCheck from "../../tccf/src/components/SiteCheck.jsx";

cloudinary.config({
  cloud_name: 'dlgvouxpu',
  api_key: '839692774586942',
  api_secret: '6EVMbE20HyotPS1rzeOkT2pnCXQ'
});

const uploadOptions = {
  public_id: 'unique_id_for_image', // Defina um identificador único para o recurso
  context: 'expires_after=24h',     // Define o contexto de expiração
};


const rotas = express.Router();
rotas.use(express.json());

//OK
rotas.post("/enviar-registro", async function (req, res) {
  const { email, senha, name } = req.body

  try {
    const user = users.find(user => user.email === email)
    if (!user) {
      const id = await newId();
      if (id === 0) {
        res.status(507).json({ erro: "Servidor possui número maximo de usuários cadastrados permitido" })
      }
      const data = {
        "id": id,
        "name": name,
        "email": email,
        "senha": senha,
        "time_access": 0
      }
      users.push(data)
      const dataR = { id: data.id, name: data.name, email: data.email }
      res.json(dataR)

      const dataFace = {
        "id": data.id,
        "pages": []
      }
      facebookData.push(dataFace)

    } else {
      res.sendStatus(409).json({ aviso: "Esses dados já estão cadastrados no sitema" })
    }
  } catch (erro) {
    console.log(erro)
    res.status(500).json({ erro: "Erro interno do servidor" })
  }
})

//OK
rotas.post('/enviar-login', async function (req, res) {
  const { email, senha } = req.body
  try {
    const user = users.find(user => user.senha === senha && user.email === email)
    if (user) {
      if (user.access === false) {
        user.access = true
        user.time_access = process.env.TIME_ACCESS;
      } else {
        user.time_access = process.env.TIME_ACCESS
      }
      const data = { id: user.id, access: user.access }
      res.json(data)
    } else {
      res.sendStatus(404)
    }
  } catch (erro) {
    console.log(erro)
    res.status(500).json({ erro: "Erro interno do servidor" })
  }
})

//OK
rotas.get('/get-access', function (req, res) {
  const { id } = req.query

  if (!id) {
    return res.status(400).json({ erro: "Dados de entrada inválidos" });
  }
  try {
    const user = users.find(user => user.id === id)
    if (user) {
      const data = {
        "access": user.access
      }
      return res.json(data)
    } else {
      return res.status(404).json({ erro: "Usuário não encontrado" })
    }
  } catch (erro) {
    console.log(erro)
    res.status(500).json({ erro: "Erro interno do servidor" })
  }
})

//OK
rotas.get('/get-facebook', async function (req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const user = facebookData.find(user => user.id === id)
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ erro: "Usuário não encontrado" })
    }
  } catch (erro) {
    console.log(erro)
    res.status(500).json({ erro: "Erro interno do servidor" })
  }
})


//OK
rotas.post('/create-post', multer(multerConfig).single("file"), async function (req, res) {
  let imgPost
  if (req.file) {
    imgPost = req.file.path
    setTimeout(() => {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Erro ao excluir o arquivo local:', err);
        } else {
          console.log('Arquivo excluído.');
        }
      });
    }, 60000);

    await cloudinary.uploader.upload(imgPost, uploadOptions, (erro, result) => {
      if (erro) {
        console.error('Erro ao fazer upload da imagem:', error)
        res.status(500).json({ erro: "Erro ao enviar a imagem para o sistema" })
      } else {
        console.log('Upload bem-sucedido! URL da imagem:', result.secure_url)
        imgPost = result.secure_url
      }
    })
  }
  const { id, selectPage, mensagemPost } = req.body
  if (!id || !selectPage || !mensagemPost) {
    return res.status(400).json({ erro: "Dados de entrada inválidos" })
  }
  const user = facebookData.find(user => user.id === id)
  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" })
  }

  let token, pageId
  for (const page of user.pages) {
    if (page.pageName === selectPage) {
      token = await verifyToken(page.app_token)
      pageId = page.pageId
      break
    }
  }

  if (!imgPost) {
    try {
      const response = await axios.post(`https://graph.facebook.com/v17.0/${pageId}/feed`, {
        message: mensagemPost,
        access_token: token
      })
      res.status(201).json({ sucesso: "Post criado com sucesso!" })
    } catch (erro) {
      console.log(erro)
      res.status(500).json({ erro: "Erro interno do servidor" })
    }
  }
  else if (imgPost) {
    try {
      const response = await axios.post(`https://graph.facebook.com/v17.0/${pageId}/photos`, {
        message: mensagemPost,
        access_token: token,
        url: imgPost
      })
      if (response.data) {
        res.status(201).json({ sucesso: "Post criado com sucesso!" })
      } else {
        res.status(500).json({ erro: "Erro ao criar post" })
      }

    } catch (erro) {
      console.log(erro)
      res.status(500).json({ erro: "Erro interno do servidor" })
    }
  }
})

//OK
rotas.post('/del-post', async function (req, res) {
  const { idPost, selectPage, id } = req.body;

  if (!idPost || !selectPage || !id) {
    return res.status(400).json({ error: "Dados de entrada inválidos" })
  }

  const user = facebookData.find(user => user.id === id)
  if (!user) {
    return res.status(404).json({ error: "Usuário não encontrado" })
  }

  let token
  for (const page of user.pages) {
    if (page.pageName === selectPage) {
      token = await verifyToken(page.app_token)
      break
    }
  }

  if (!token) {
    return res.status(404).json({ error: "Página não encontrada para o usuário" })
  }

  try {
    const response = await axios.delete(`https://graph.facebook.com/v17.0/${idPost}?access_token=${token}`)
    if (response.status === 200) {
      res.status(200).json("Post excluído com sucesso.")
    } else {
      console.log(response)
      res.status(404).json("Ocorreu um erro ao tentar excluir o post.")
    }
  } catch (erro) {
    console.log(erro);
    res.status(500).json({ erro: "Erro interno do servidor" })
  }
});

//OK
rotas.get('/get-post', async function (req, res) {
  const { id, selectPage } = req.query


  if (!id || !selectPage) {
    return res.status(400).json({ error: "Dados de entrada inválidos" });
  }

  try {
    const user = facebookData.find(user => user.id === id)

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" })
    }

    let token, PageId
    for (const page of user.pages) {
      if (page.pageName === selectPage) {
        PageId = page.pageId
        token = await verifyToken(page.app_token)
        break
      }
    }

    if (!token || !PageId) {
      return res.status(404).json({ erro: "Página não encontrada para o usuário" })
    }

    const response = await axios.get('https://graph.facebook.com/v17.0/me/feed', {
      params: {
        fields: 'id,message,created_time,full_picture',
        limit: 100,
        access_token: token
      }
    })

    res.status(200).json(response.data)

  } catch (erro) {
    console.log(erro)
    res.status(500).json({ erro: "Erro interno do servidor" })
  }
})

//OK
rotas.post('/add-pages', async function (req, res) {
  const { pageId, pageName, id } = req.body
  let { app_token } = req.body

  if (!app_token || !pageId || !pageName || !id) {
    return res.status(400).json({ erro: "Dados de entrada inválidos" })
  } else {
    app_token = await verifyToken(app_token)
  }

  try {
    const user = facebookData.find(user => user.id === id)
    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado" })
    }

    if (user.pages.some(page => page.pageName === pageName)) {
      return res.status(409).json({ aviso: "Dados já adicionados" })
    }

    const data = {
      "app_token": app_token,
      "pageId": pageId,
      "pageName": pageName
    };
    user.pages.push(data)
    return res.status(202).json({ mensagem: "Dados adicionados com sucesso" })
  } catch (erro) {
    console.log(erro)
    return res.status(500).json({ erro: "Erro interno do servidor" })
  }
});

rotas.delete('del-sites', async function (req, res) {
  const id = req.params.id
  const site = req.params.site
  if(!id || !site){
    return res.status(400).json({ erro: "Dados de entrada inválidos" })
  }

  const user = siteData.find(user => user.id === id)
  if(!user){
    return res.status(404).json({ erro: "Usuário não encontrado" })
  }else{
    for(const siteUser of user.sites){
      if(siteUser === site){
        user.sites.delete()
      }
    }
  }
})

//...
rotas.post('/add-sites', async function (req, res) {
  const id = req.body.id
  const site = req.body.site
  if (!id || !site) {
    return res.status(400).json({ erro: "Dados de entrada inválidos" })
  }
  const user = siteData.find(user => user.id === id)
  if (!user) {
    return res.status(404).json({ erro: "Usuário não encontrado" })
  } else {
    for(const siteUser of user.sites){
      if(siteUser === site){
        return res.status(409).json({ aviso: "Dados já adicionados" });
      }
    }
      user.sites.push(site)
      return res.status(202).json({ mensagem: "Dados adicionados com sucesso" })
  }
})

//...
rotas.get('/get-sites', async function (req, res) {
  const id = req.query.id
  if (!id) {
    return res.status(400).json({ erro: "Dados de entrada inválidos" })
  }
  const user = siteData.find(user => user.id === id)
  if (!user) {
    return res.status(404).json({ erro: "Usuário não encontrado" })
  } else {
    const data = []
    for (let site of user.sites) {
      let siteData = {}
      const siteHTTP = site
      
      try {
        const resposta = await axios.get(site)

        if (resposta.status === 200) {
          const html = resposta.data
          const $ = cheerio.load(html)
          await $.html()

          const title = $('title').text()
          let faviconLink = $('link[rel="icon"]').attr('href')

          if(!faviconLink.startsWith("https://")){
            faviconLink = siteHTTP + faviconLink
          }

          if(site.startsWith("http://")){
            site = site.substr(7)
          }
          else if (site.startsWith("https://")) {
            site = site.substr(8)
          } else {
            site = site.substr(7);
          }

          if (site.endsWith("/")) {
            site = site.slice(0, -1)
          }

          let iniValidade, fimValidade
          await sslCertificate.get(site).then(function (certificate) {
            iniValidade = certificate.valid_from
            fimValidade = certificate.valid_to
          })

          siteData = {
            "titulo": title,
            "favIcon": faviconLink,
            "iniValidade": iniValidade,
            "fimValidade": fimValidade,
            "linkSite": siteHTTP
          }
          data.push(siteData)
        } else {
          siteData = {
            "titulo": "OFF",
            "favIcon": null,
            "iniValidade": 0,
            "fimValidade": 0,
            "linkSite": siteHTTP
          }
          data.push(siteData)
        }
      } catch (erro) {
        console.log(erro)
        res.sendStatus(404)
      }

    }
    res.status(200).json(data)
  }
})

//OK
rotas.get('/', async function (req, res) {
  try {
    res.sendStatus(200)
  } catch (erro) {
    console.log(erro)
    res.status(500).json({ erro: "Erro interno do servidor" })
  }
})

//OK
rotas.get('*', function (req, res) {
  res.status(404).json({ erro: "Não foi encontrado" })
})

export default rotas