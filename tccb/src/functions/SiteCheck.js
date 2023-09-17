import axios from "axios";
import * as cheerio from "cheerio";
import { format } from "date-fns";
import sslCertificate from "get-ssl-certificate"
import dados from "../data/SiteCheck.js"
function RemoveHttp(site){
    if(site.startsWith("http://")){
        site.substr(7)
    }
    else {
        site.substr(8)
    }

    if(site.endsWith("/")){
        site.slice(0, -1)
    }

    return site
}

async function getInfoSite(site, id){
    const resposta = await axios.get(site)

    if(resposta.status === 200){
        const html = resposta.data
        const $ = cheerio.load(html)
        $.html()

        const title = $('title').text()
        let faviconLink = $('link[rel="icon"]').attr('href')
        if (faviconLink && !faviconLink.startsWith("https://")) {
            faviconLink = site + faviconLink
          }

        const siteSemHttp = await RemoveHttp(site)

        let fimValidade
        await sslCertificate.get(siteSemHttp).then(function (certificate){
            fimValidade = certificate.valid_to
        })

        let SSL = format(new Date(fimValidade), "dd/MM/yy")
        const hj = new Date()

        if(SSL < hj){
            return SSL = "SSL VENCIDO"
        }else if(SSL > hj){
            return SSL = "SSL OK"
        }else{
            return SSL = "SSL VENCE HOJE"
        }

        const user = dados.find(user => user.id === id)
        for(const userSite of user.sites){
            if(userSite === site){
                userSite.length = 0
                const data = {
                    "titulo": title,
                    "favIcon": faviconLink,
                    "ssl": SSL,
                    "status": "ON",
                    "linkSite": site,
                    "dominio": siteSemHttp
                }
            }
        }
    }
}


export async function addSite(){

}