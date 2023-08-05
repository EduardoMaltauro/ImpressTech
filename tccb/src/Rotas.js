import express from "express";
import axios from "axios";
import users from "./data/users.js";
import { newId } from "./functions/SystemLogin.js";
import facebookData from "./data/FacebookPost.js";
import { verifyToken } from "./functions/SDKFacebook.js";
import "./functions/SystemTimeAccess.js";
import "dotenv/config.js";

const rotas = express.Router();
rotas.use(express.json());

//Rotas Revisadas
//OK
rotas.get('/', async function (req, res) {
  try {
    res.sendStatus(200)
  } catch (erro) {
    res.status(500).json({ erro: "Erro interno do servidor" })
    console.log(erro)
  }
})

//OK
rotas.get('*', function (req, res) {
  res.sendStatus(404)
})

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
});

//OK
rotas.post('/enviar-login', async function (req, res) {
  const {email, senha} = req.body;
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
rotas.get('/get-access', async function (req, res) {
  const id = req.query
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
    resposta.status(500).json({ erro: "Erro interno do servidor" })
  }
})

//OK
rotas.get('/get-facebook', async function (req, res) {
  const id = req.query;

  if (!id) {
    return res.status(400).json({ error: "ID inválido" });
  }

  try {
    const user = facebookData.find(user => user.id === id);
    if (user) {
      return res.json(user);
    } else {
      return res.status(404).json({ erro: "Usuário não encontrado" })
    }
  } catch (erro) {
    console.log(erro)
    resposta.status(500).json({ erro: "Erro interno do servidor" })
  }
})






rotas.post('/create-post', async function (requisicao, resposta){
  const idR = requisicao.body.id

  if(!id){
    return resposta.status(400).json({ error: "Dados de entrada inválidos" });
  }
  const user = facebookData.find(user => user.id === idR)
  let token;
  for (const page of user.pages) {
    if (page.pageName === selectPage) {
      token = await verifyToken(page.app_token);
      const pageId = page.pageId;
      break;
    }
  }
  if(user && token){
    try{
      const response = await axios.post(`https://graph.facebook.com/V17.0/${pageId}/feed?access_token=${token}`)
      if(response.status === 200){
        return resposta.status(200).json("Criado com suceso!")
      }else{
        return resposta.status(404).json("Erro ao criar!")
      }
    }catch(erro){
      console.log(erro)
      resposta.status(500).json({ error: "Erro interno do servidor" })
    }
  }
})

rotas.post('/del-post', async function (requisicao, resposta) {
  const { idPost, selectPage, id } = requisicao.body;

  if (!idPost || !selectPage || !id) {
    return resposta.status(400).json({ error: "Dados de entrada inválidos" });
  }

  const user = facebookData.find(user => user.id === id);
  if (!user) {
    return resposta.status(404).json({ error: "Usuário não encontrado" });
  }

  let token;
  for (const page of user.pages) {
    if (page.pageName === selectPage) {
      token = await verifyToken(page.app_token)
      break;
    }
  }

  if (!token) {
    return resposta.status(404).json({ error: "Página não encontrada para o usuário" });
  }

  try {
    const response = await axios.delete(`https://graph.facebook.com/v17.0/${idPost}?access_token=${token}`);
    if (response.status === 200) {
      resposta.status(200).json("Post excluído com sucesso.");
    } else {
      resposta.status(404).json("Ocorreu um erro ao tentar excluir o post.");
      console.log(response)
    }
  } catch (error) {
    console.log(error);
    resposta.status(500).json({ error: "Erro interno do servidor" });
  }
});

rotas.post('/get-post', async function (requisicao, resposta) {
  const { id, selectPage } = requisicao.body;


  if (!id || !selectPage) {
    return resposta.status(400).json({ error: "Dados de entrada inválidos" });
  }

  try {
    const user = facebookData.find(user => user.id === id);

    if (!user) {
      return resposta.status(404).json({ error: "Usuário não encontrado" });
    }

    let token, PageId;
    for (const page of user.pages) {
      if (page.pageName === selectPage) {
        PageId = page.pageId;
        token = await verifyToken(page.app_token);
        break;
      }
    }

    if (!token || !PageId) {
      return resposta.status(404).json({ error: "Página não encontrada para o usuário" });
    }

    const response = await axios.get('https://graph.facebook.com/v17.0/me/feed', {
      params: {
        fields: 'id,message,created_time,full_picture',
        limit: 100,
        access_token: token
      }
    });

    resposta.status(200).json(response.data);

  } catch (error) {
    console.log(error);
    resposta.status(500).json({ error: "Erro interno do servidor" });
  }
});

rotas.post('/add-pages', async function (requisicao, resposta) {
  const { app_token, pageId, pageName, id } = requisicao.body;

  if (!app_token || !pageId || !pageName || !id) {
    return resposta.status(400).json({ error: "Dados de entrada inválidos" });
  }

  await verifyToken(app_token);

  try {
    const user = facebookData.find(user => user.id === id);
    if (!user) {
      return resposta.status(404).json({ error: "Usuário não encontrado" });
    }

    if (user.pages.some(page => page.pageName === pageName)) {
      return resposta.status(409).json({ message: "Dados já adicionados" });
    }

    const data = {
      "app_token": app_token,
      "pageId": pageId,
      "pageName": pageName
    };
    user.pages.push(data);
    return resposta.status(202).json({ message: "Dados adicionados com sucesso" });
  } catch (erro) {
    console.log(erro);
    return resposta.status(500).json({ error: "Erro interno do servidor" });
  }
});

export default rotas