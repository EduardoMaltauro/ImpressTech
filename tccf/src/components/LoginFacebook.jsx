import React, { Component } from "react";
import FacebookLogin from "react-facebook-login"

export default class Facebook extends Component {
    state = {
        "isLoggedIn": false
    }

    responseFacebook = response => {
        console.log(response)
    }
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