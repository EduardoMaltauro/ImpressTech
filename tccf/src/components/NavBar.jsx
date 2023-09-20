import React from "react";
import {DelAccess} from "../functions/SystemTimeAccess.js"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse,faUser,faRightFromBracket } from '@fortawesome/free-solid-svg-icons'

export default function NavBar(props){
    if(localStorage.getItem("ImpressTech")){
      return<>
        <nav className="navbar navbar-dark bg-dark fixed-top" style={{fontSize: 20}}>
          <div className="container-fluid">
          <img src="assets/FavIcon.png" alt="Icon" width="32px" onClick={props.Home} />
            <a className="navbar-brand" onClick={props.Home}>ImpressTech</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Menu</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" onClick={props.Home}><FontAwesomeIcon icon={faHouse} bounce/> <strong>Home</strong></a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link active" onClick={props.Login}><FontAwesomeIcon icon={faUser} flip/> <strong>Área do Cliente</strong></a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link active text-danger" onClick={() => {
                      DelAccess()
                      props.Home()
                    }}><FontAwesomeIcon icon={faRightFromBracket} beat/> <strong>Sair</strong></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </>
    }else{
      return<>
        <nav className="navbar navbar-dark bg-dark fixed-top" style={{fontSize: 20}}>
          <div className="container-fluid">
          <img src="assets/FavIcon.png" alt="Icon" width="32px" onClick={props.Home} />
            <a className="navbar-brand" onClick={props.Home}>ImpressTech</a>
            <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="offcanvas offcanvas-end text-bg-dark" tabIndex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
              <div className="offcanvas-header">
                <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">Menu</h5>
                <button type="button" className="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
              </div>
              <div className="offcanvas-body">
                <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                  <li className="nav-item">
                    <a className="nav-link active" aria-current="page" onClick={props.Home}><FontAwesomeIcon icon={faHouse} bounce/> <strong>Home</strong></a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link active" onClick={props.Login}><FontAwesomeIcon icon={faUser} flip/> <strong>Área do Cliente</strong></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>
      </>
    }
}