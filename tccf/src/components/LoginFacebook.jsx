import React, { Component } from "react";
import FacebookLogin from "react-facebook-login";
import axios from "axios";

export default class Facebook extends Component {
    state = {
        "isLoggedIn": false
    }

    responseFacebook = async (response) => {
        console.log(response);
    
        try {
            const app_token = response.accessToken; // Acesso ao accessToken diretamente
            console.log(app_token);
    
            const pageId = response.accounts.data[0].id; // O array data contém as contas do usuário, o primeiro elemento é selecionado
            console.log(pageId);
    
            const pageName = response.accounts.data[0].name; // O array data contém as contas do usuário, o primeiro elemento é selecionado
            console.log(pageName);

            const data = localStorage.getItem
            const id = 
            const resposta = await axios.post(`http://localhost:4000/add-pages`, {app_token, pageId, pageName}) 
        } catch (error) {
            console.log(error);
        }
    };
    
    componentClicked =  () => console.log("click")
    render() {
        let fbConnect;

        if(this.state.isLoggedIn){

        }else{
            fbConnect = (
                <FacebookLogin
                appId="2459647954195593"
                autoLoad={true}
                fields="accounts"
                onClick={this.componentClicked}
                callback={this.responseFacebook} />
            )
        }
        return (
            <div>
                {fbConnect}
            </div>
        )
    }
}