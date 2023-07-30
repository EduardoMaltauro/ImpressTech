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
                const app_token = response.accessToken;
                console.log(app_token);
        
                const pageId = response.accounts.data[0].id;
                console.log(pageId);
        
                const pageName = response.accounts.data[0].name;
                console.log(pageName);

                let data = localStorage.getItem("ImpressTech")
                data = JSON.parse(data)
                const id = data.ID
                const resposta = await axios.post(`http://localhost:4000/add-pages`, {app_token, pageId, pageName, id}) 
                if(resposta.status === 202){
                    this.props.getPages()
                }
        } catch (error) {
            console.log(error);
        }
    };
    
    render() {
        let fbConnect;

        if(this.state.isLoggedIn){

        }else{
            fbConnect = (
                <FacebookLogin
                appId="2459647954195593"
                autoLoad={true}
                fields="accounts"
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