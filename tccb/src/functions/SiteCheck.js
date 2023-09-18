import axios from "axios";
import * as cheerio from "cheerio";
import { compareAsc, format } from "date-fns";
import sslCertificate from "get-ssl-certificate"
import dados from "../data/SiteCheck.js"

function RemoveHttp(site) {
    if(site.startsWith("https://")){
        site = site.substr(8)
    }


    if (site.startsWith("http://")) {
       site = site.substr(7)
    }
    
    if (site.endsWith("/")) {
       site = site.slice(0, -1)
    }

    return site
}

export async function getInfoSite(site, id) {

    let user = dados.findIndex(user => user.id === id)
    let userSite = dados[user].sites.findIndex(userSite => userSite === site)

    const siteSemHttp = await RemoveHttp(site)

    const resposta = await axios.get(site)

        if (resposta.status === 200) {
            const html = resposta.data
            const $ = cheerio.load(html)
            $.html()
    
            const title = $('title').text()
            let faviconLink = $('link[rel="icon"]').attr('href')
            if (faviconLink && !faviconLink.startsWith("https://")) {
                faviconLink = site + faviconLink
            }

    
            let fimValidade
            await sslCertificate.get(siteSemHttp).then(function (certificate) {
                fimValidade = certificate.valid_to
            })
    
            let SSL = new Date(fimValidade)
            const hj = new Date()


            if(compareAsc(SSL, hj) > 0){
                SSL = "SSL OK"
            }else if(compareAsc(SSL, hj) < 0){
                SSL = "SSL VENCIDO"
            }else{
                SSL = "SSL VENCE HOJE"
            }

            const data = {
                "titulo": title,
                "favIcon": faviconLink,
                "ssl": SSL,
                "status": "ONLINE",
                "linkSite": site,
                "dominio": siteSemHttp
            }

            dados[user].sites[userSite] = data

        }else{
            const data = {
                "titulo": "???",
                "favIcon": undefined,
                "ssl": "",
                "status": "OFFLINE",
                "linkSite": site
            }

            dados[user].sites[userSite] = data
        }
}


export async function addSite() {

}