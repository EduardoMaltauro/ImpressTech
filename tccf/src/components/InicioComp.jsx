import React, { useEffect, useState } from "react";
import styles from "../styles/InicioComp.module.css"
import axios from "axios";

export default function InicioComp() {

    const [limit, setLimit] = useState(0);

    useEffect(() => {
        setInterval(() => {
            getLimit()
        }, 300000);
    }, [])

    async function getLimit() {
        try {
            const respota = await axios.get("http://localhost:4000/status-facebook")
            if (respota.data.info) {
                setLimit(respota.data.info)
            }
        } catch (erro) {
            console.log(erro)
        }
    }

    function status() {
        getLimit()
        if (limit > 100) {
            return <>
                <div class="spinner-grow text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-success" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </>
        } else if (limit < 100 && limit > 50) {
            return <>
                <div class="spinner-grow text-warning" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-warning" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-warning" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </>
        } else {
            return <>
                <div class="spinner-grow text-danger" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-danger" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="spinner-grow text-danger" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </>
        }
    }
    return <>
        <div className={styles.index}>
            <div className={styles.sobre}>
                <img style={{ maxHeight: 100, maxWidth: 100 }} src="/assets/FavIcon.png" />
                <h2>ImpressTech</h2>
                <p>Você já se imaginou com uma caixa de ferramentas que se adapta perfeitamente às suas
                    necessidades profissionais? Com a plataforma ImpressTech, essa visão torna-se realidade.
                    Imagine uma ferramenta digital que entende sua profissão, suas habilidades e suas metas,
                    e então oferece as melhores ferramentas e recursos para impulsionar sua carreira. Essa é
                    a proposta revolucionária da ImpressTech.
                </p>
                <p>
                    A ImpressTech é uma plataforma inovadora , permitindo  que os usuários aprimorem sua 
                    produtividade e desempenho profissional. Seja você um engenheiro, designer, médico, 
                    advogado, professor ou qualquer outra profissão, a ImpressTech adapta-se às suas 
                    necessidades específicas.
                </p>
            </div>
            <div className={styles.status}>
                <h2>STATUS</h2>
                <p>Bem-vindo à aba de Status, seu guia confiável para acompanhar
                    o desempenho e a estabilidade da nossa plataforma. Aqui, fornecemos atualizações
                    em 5 minutos para que você esteja sempre ciente do estado das nossas ferramentas.
                </p>

                <div div className={styles.statusDiv}>
                    <h5>FACEBOOK POST</h5>
                    {status()}
                    <div style={{ margin: 10 }} className="progress" role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                        <div className="progress-bar" style={{ width: `${limit}%`, border: "none" }}>{`${limit}%`}</div>
                    </div>
                </div>
                <br />
                <div className={styles.statusDiv}>
                    <h5>SITE CHECK</h5>
                    <div class="spinner-grow text-success" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="spinner-grow text-success" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div class="spinner-grow text-success" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <div style={{ margin: 10 }} className="progress" role="progressbar" aria-label="Example with label" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">
                        <div className="progress-bar" style={{ width: "100%", border: "none" }}>100%</div>
                    </div>
                </div>
            </div>
        </div>
    </>
}