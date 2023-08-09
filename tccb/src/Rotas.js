import express from "express";
import axios from "axios";
import "dotenv/config.js";
import multer from "multer";
import multerConfig from "./config/multer.js";

import users from "./data/users.js";
import facebookData from "./data/FacebookPost.js";
import post from "./data/post.js";

import { verifyToken } from "./functions/SDKFacebook.js";
import { newId } from "./functions/SystemLogin.js";
import "./functions/SystemTimeAccess.js";


//TESTE
import {v2 as cloudinary} from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dlgvouxpu', 
  api_key: '839692774586942', 
  api_secret: '6EVMbE20HyotPS1rzeOkT2pnCXQ' 
});
///////////////////////////////////////////

const rotas = express.Router();
rotas.use(express.json());

//OK
rotas.post("/enviar-registro", async function (req, res) {
  const {email, senha, name} = req.body

  try {
    const user = users.find(user => user.email === email)
    if (!user) {
      const id = await newId();
      if(id === 0){
        res.status(507).json({erro: "Servidor possui número maximo de usuários cadastrados permitido"})
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
      res.sendStatus(409).json({aviso: "Esses dados já estão cadastrados no sitema"})
    }
  } catch (erro) {
    console.log(erro)
    res.status(500).json({ erro: "Erro interno do servidor" })
  }
})

//OK
rotas.post('/enviar-login', async function (req, res) {
  const {email, senha} = req.body
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

  if(!id){
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


//...
//multer(multerConfig).single("file"),
rotas.post('/create-post', async function (req, res){
  console.log(req.file)
  // if(req.file){
  //   imgPost = req.file.path
  // }
  // const { id, selectPage, mensagemPost, dataPost } = req.body

  // if(imgPost){
  //    await cloudinary.uploader.upload(imgPost, (erro, result) =>{
  //     if(erro){
  //       console.error('Erro ao fazer upload da imagem:', error)
  //     }else{
  //       console.log('Upload bem-sucedido! URL da imagem:', result.secure_url)
  //       imgPost = result.secure_url
  //     }
  //   })
  // }

  // if(!id || !selectPage || !mensagemPost){
  //   return res.status(400).json({ erro: "Dados de entrada inválidos"})
  // }

  // const user = facebookData.find(user => user.id === id)
  // if (!user) {
  //   return res.status(404).json({ error: "Usuário não encontrado" })
  // }
   
  // let token, pageId
  // for (const page of user.pages) {
  //   if (page.pageName === selectPage) {
  //     token = await verifyToken(page.app_token)
  //     pageId = page.pageId
  //     break
  //   }
  // }


  //   if(!dataPost && !imgPost){
  //     console.log("Criando sem IMG")
  //     try {
  //       const response = await axios.post(`https://graph.facebook.com/v17.0/${pageId}/feed`, {
  //         message: mensagemPost,
  //         access_token: token
  //       })
  //       res.status(201).json({sucesso: "Post criado com sucesso!"})
  //     }catch(erro){
  //       console.log(erro)
  //       res.status(500).json({ erro: "Erro interno do servidor" })
  //     }
  //   }
  //   else if(!dataPost && imgPost){
  //     console.log("Criando com IMG")
  //     try{
  //       const response = await axios.post(`https://graph.facebook.com/v17.0/${pageId}/photos`, {
  //       message: mensagemPost,
  //       access_token: token,
  //       url: imgPost
  //     })
  //     if(response.data){
  //       res.status(201).json({sucesso: "Post criado com sucesso!"})
  //     }else{
  //       res.status(500).json({erro: "Erro ao criar post"})
  //     }

  //     }catch(erro){
  //       console.log(erro)
  //       res.status(500).json({ erro: "Erro interno do servidor" })
  //     }
  //   }else{
  //     //.....
  //   }
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
    return resposta.status(400).json({ erro: "Dados de entrada inválidos" })
  }else{
    app_token = await verifyToken(app_token)
  }

  try {
    const user = facebookData.find(user => user.id === id)
    if (!user) {
      return resposta.status(404).json({ erro: "Usuário não encontrado" })
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
  res.status(404).json({erro: "Não foi encontrado"})
})

export default rotas