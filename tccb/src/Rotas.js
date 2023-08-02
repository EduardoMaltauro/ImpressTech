import express from "express";
import axios from "axios";
import users from "./data/users.js";
import newId from "./functions/GerarIds.js";
import facebookData from "./data/FacebookPost.js";
import "./functions/SystemTimeAccess.js";
import "dotenv/config.js";
import { verifyToken } from "./functions/SDKFacebook.js";

const rotas = express.Router();

rotas.use(express.json());

rotas.get('/', async function (requisicao, resposta) {
  try {
    resposta.sendStatus(200);
  } catch (erro) {
    resposta.sendStatus(500);
    console.log(erro);
  }
});

rotas.post('/teste', async function(req,res){
  let token = req.body.token
  token = await verifyToken(token)
  res.json({token:token})
})

rotas.post('/del-post', async function (requisicao, resposta) {
  const { idPost, selectPage, id } = requisicao.body;
  console.log(selectPage)

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
      token = page.app_token
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
    setType("load")
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



rotas.post('/get-facebook', async function (requisicao, resposta) {
  const idR = requisicao.body.id;

  if (!idR) {
    resposta.status(400).json({ error: "ID inválido" });
    return;
  }

  try {
    const user = facebookData.find(user => user.id === idR);
    if (user) {
      resposta.json(user);
    } else {
      resposta.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (erro) {
    console.log(erro);
    resposta.status(500).json({ error: "Erro interno do servidor" });
  }
});



rotas.get('/get-access', async function (requisicao, resposta) {
  const idR = requisicao.query.id;
  try {
    const user = users.find(user => user.id === idR)
    if (user) {
      const data = {
        "access": user.access
      };
      resposta.json(data);
    } else {
      resposta.status(404).json({ error: "Usuário não encontrado" });
    }
  } catch (erro) {
    console.log(erro);
    resposta.status(500).json({ error: "Erro interno do servidor" });
  }
});


rotas.get('/get-users', async function (requisicao, resposta) {
  resposta.json(users)
})

rotas.post('/enviar-login', async function (requisicao, resposta) {
  const emailR = requisicao.body.email;
  const senhaR = requisicao.body.senha;
  try {
    const user = users.find(user => user.senha === senhaR && user.email === emailR)
    if (user) {
      if (user.access === false) {
        user.access = true
        user.time_access = process.env.TIME_ACCESS;
      } else {
        user.time_access = process.env.TIME_ACCESS
      }
      const data = { id: user.id, access: user.access }
      resposta.json(data)
    } else {
      resposta.sendStatus(404)
    }
  } catch (erro) {
    resposta.sendStatus(500)
    console.log(erro)
  }
});

rotas.post("/enviar-registro", async function (requisicao, resposta) {
  const emailR = requisicao.body.email;
  const senhaR = requisicao.body.senha;
  const nameR = requisicao.body.name;

  try {
    const user = users.find(user => user.email === emailR)
    if (!user) {
      const Newid = newId();
      const data = {
        "id": Newid,
        "name": nameR,
        "email": emailR,
        "senha": senhaR,
        "time_access": 0
      }
      users.push(data)
      const dataR = { id: data.id, name: data.name, email: data.email }
      resposta.json(dataR)

      const dataFace = {
        "id": data.id,
        "pages": []
      }
      facebookData.push(dataFace)

    } else {
      resposta.sendStatus(409)
    }
  } catch (erro) {
    resposta.sendStatus(500);
    console.log(erro);
  }
});

rotas.get('*', function (requisicao, resposta) {
  resposta.sendStatus(404)
});

export default rotas
