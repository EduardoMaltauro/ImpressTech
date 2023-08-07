import React, { Component } from "react";
import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";
import axios from "axios";

class LoginFacebook extends Component {
  FaceRespota = async (response) => {
    console.log(response);
  
    try {
        const app_token = response.data.accounts.data[0].access_token
    
        const pageId = response.data.accounts.data[0].id;
    
        const pageName = response.data.accounts.data[0].name;
  
        let data = localStorage.getItem("ImpressTech");
        data = JSON.parse(data);
        const id = data.ID;
        const resposta = await axios.post(`http://localhost:4000/add-pages`, {
          app_token,
          pageId,
          pageName,
          id,
        });
        if (resposta.status === 202) {
          this.props.getPages();
        }
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    return (
      <div>
        <LoginSocialFacebook
          appId="2459647954195593"
          fieldsProfile="accounts"
          // scope="accounts"
          onResolve={this.FaceRespota}
          onReject={(err) => {
            console.log(err);
          }}
        >
          <FacebookLoginButton />
        </LoginSocialFacebook>
      </div>
    );
  }
}

export default LoginFacebook;
