// importando o express e CORS
import express from "express" 
import cors from "cors"

// importando as rotas
import Rotas from "./Rotas.js"

// declarando o servidor
const servidor = express()

// configurando o servidor
servidor.use(cors()) 
servidor.use(express.json()) 

// incluindo as rotas
servidor.use(Rotas)

// ligando o servidor
servidor.listen(4000, function() { 
    console.log("SERVIDOR EM FUNCIONAMENTO!") 
    console.log("http://localhost:4000/") 
})


