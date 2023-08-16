import axios from "axios";

async function SystemTimeAccess() {
  if (localStorage.getItem("ImpressTech")) {
    let data = JSON.parse(localStorage.getItem("ImpressTech"));
    let id = data.ID;

    try {
      const resposta = await axios.get(`http://localhost:4000/get-access`, {params: { id },});
      if (resposta.data) {
        if (resposta.data.access === false) {
          localStorage.removeItem("ImpressTech")
        }
      }
    } catch (erro) {
      console.log(erro);
    }
  }

}

function DelAccess(){
  localStorage.removeItem("ImpressTech")
}

setInterval(SystemTimeAccess, 10000);

export{
  SystemTimeAccess,
  DelAccess
}
