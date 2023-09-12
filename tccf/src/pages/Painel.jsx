import React from "react";
import { useState } from "react";

import styles from "../styles/Painel.module.css"
import FecebookPost from "../components/FacebookPost.jsx";
import SiteCheck from "../components/SiteCheck";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScrewdriverWrench } from '@fortawesome/free-solid-svg-icons';
import { Modal, Button } from "react-bootstrap";

export default function Painel() {
    const [page, setPage] = useState(0);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    if (page === 0) {
        return <>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title>Ferramentas</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
        <Button variant="dark" onClick={() => {setPage(0); handleClose()}} style={{border:"solid 1px"}}>
            FACEBOOK POST
          </Button>
          <br/>
          <br/> 
          <Button variant="dark" onClick={() => {setPage(1); handleClose()}} style={{border:"solid 1px"}}>
            SITE CHECK
          </Button>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
            <div className={styles.index} id="index">
                <ul className={styles.menu}>
                    <li id={styles.ativo} onClick={() => { setPage(0) }}>FACEBOOK POST</li>
                    <li onClick={() => { setPage(1) }}>SITE CHECK</li>
                </ul>
            </div>
            <button  onClick={handleShow} className={styles.buttonPainel}><FontAwesomeIcon icon={faScrewdriverWrench}></FontAwesomeIcon></button>
            <FecebookPost />
        </>
    }

    if (page === 1) {
        return <>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="bg-dark">
          <Modal.Title>Ferramentas</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark">
        <Button variant="dark" onClick={() => {setPage(0); handleClose()}} style={{border:"solid 1px"}}>
            FACEBOOK POST
          </Button>
          <br/>
          <br/> 
          <Button variant="dark" onClick={() => {setPage(1); handleClose()}} style={{border:"solid 1px"}}>
            SITE CHECK
          </Button>
        </Modal.Body>
        <Modal.Footer className="bg-dark">
          <Button variant="secondary" onClick={handleClose}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>
            <div className={styles.index} id="index">
                <ul className={styles.menu}>
                    <li onClick={() => { setPage(0) }}>FACEBOOK POST</li>
                    <li id={styles.ativo} onClick={() => { setPage(1) }}>SITE CHECK</li>
                </ul>
            </div>
            <button  onClick={handleShow} className={styles.buttonPainel}><FontAwesomeIcon icon={faScrewdriverWrench}></FontAwesomeIcon></button>
            <SiteCheck />
        </>
    }
}