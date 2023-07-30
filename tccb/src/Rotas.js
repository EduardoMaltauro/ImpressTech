import express from "express";
import users from "./data/users.js";
import newId from "./functions/GerarIds.js";
import facebookData from "./data/FacebookPost.js";
import "dotenv/config.js";
import "./functions/SystemTimeAccess.js";

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

rotas.post('/add-pages', async function(requisicao, resposta) {
  const app_tokenR = requisicao.body.app_token;
  const pageIdR = requisicao.body.pageId;
  const pageNameR = requisicao.body.pageName;
  const idR = requisicao.body.id;

  // Verificação de dados de entrada
  if (!app_tokenR || !pageIdR || !pageNameR || !idR) {
    return resposta.status(400).json({ error: "Dados de entrada inválidos" });
  }

  try {
    const user = facebookData.find(user => user.id === idR);
    if (!user) {
      return resposta.status(404).json({ error: "Usuário não encontrado" });
    }

    if (user.pages.some(page => page.pageName === pageNameR)) {
      return resposta.status(409).json({ message: "Dados já adicionados" });
    }

    const data = {
      "app_token": app_tokenR,
      "pageId": pageIdR,
      "pageName": pageNameR
    };
    user.pages.push(data);
    return resposta.status(202).json({ message: "Dados adicionados com sucesso" });
  } catch (erro) {
    console.log(erro);
    return resposta.status(500).json({ error: "Erro interno do servidor" });
  }
});


rotas.post('/get-facebook', async function(requisicao, resposta) {
  const idR = requisicao.body.id;

  if (!idR || typeof idR !== 'string') {
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


rotas.get('/get-access', async function(requisicao, resposta){
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
  } catch(erro) {
    console.log(erro);
    resposta.status(500).json({ error: "Erro interno do servidor" });
  }
});


rotas.get('/get-users', async function(requisicao, resposta){
  resposta.json(users)
})

rotas.post('/enviar-login', async function (requisicao, resposta) {
  const emailR = requisicao.body.email;
  const senhaR = requisicao.body.senha;
  try {
    const user = users.find(user => user.senha === senhaR && user.email === emailR)
    if(user){
      if(user.access === false){
        user.access = true
        user.time_access = process.env.TIME_ACCESS;
      }else{
        user.time_access = process.env.TIME_ACCESS
      }
      const data = {id: user.id, access: user.access}
      resposta.json(data)
    }else{
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
    if(!user){
      const Newid = newId();
      const data = {
        "id": Newid,
        "name": nameR,
        "email": emailR,
        "senha": senhaR,
        "time_access": 0
      }
      users.push(data)
      const dataR = { id: data.id, name: data.name, email: data.email}
      resposta.json(dataR)

      const dataFace = {
        "id": data.id,
        "pages": []
      }
      facebookData.push(dataFace)

    }else{
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

export default rotas;
