import React from "react";

import styles from "../styles/Dev.module.css"

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWrench, faHammer } from "@fortawesome/free-solid-svg-icons";
 
export default function Dev(){
    return<>
        <div className={styles.index}>
            <h1><FontAwesomeIcon icon={faWrench} shake /> SITE EM DESENVOLVIMENTO <FontAwesomeIcon icon={faHammer} shake /></h1>
        </div>
    </>
}