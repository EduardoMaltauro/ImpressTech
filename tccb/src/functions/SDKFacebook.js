// import Facebook from "facebook-node-sdk";

// const FB = new Facebook({
//     appId: '2459647954195593',
//     appSecret: '00962346a5d40bb01a7f40bbdd92beda',
//   });

import "dotenv/config.js"
import axios from "axios"

export async function getNewToken(token) {
  try {
    const resposta = await axios.get(`https://graph.facebook.com/oauth/access_token`, {
      params: {
        client_id: process.env.APPID,
        client_secret: process.env.APPSECRET,
        fb_exchange_token: token,
      },
    });

    if(resposta.data && verifyToken(resposta.data.access_token)){
      return resposta.data.access_token
    }else{
      getNewToken(token)
    }
  } catch (error) {
    console.error('Erro ao obter o token de longo prazo:', error.message);
    return null;
  }
}


export async function verifyToken(token){
  try {
    const resposta = await axios.get(`https://graph.facebook.com/debug_token`, {
      params: {
        input_token: token,
        access_token: `${process.env.APPID}|${process.env.APPSECRET}`,
      },
    });
    const data = resposta.data.data;
    if(data.is_valid && token){
      return await token
    }else{
      return await getNewToken(token)
    }
  } catch (error) {
    console.error('Erro ao verificar o token:', error.message);
    console.log(error)
  }
}

