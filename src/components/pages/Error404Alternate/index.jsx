import Styles from './Error404A.module.css' 
import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"
import img from "../../../assets/img/error1.svg"
import logo from "../../../assets/img/ControlABS.png"

const Error404Alternate = () => {
    alert("Esta página não existe!\n Volte a pagina inicial e tente novamente !");
    return(
        <>
            <Helmet>
                <title> 404 || Page Not Found !</title>
            </Helmet>
            <header className={Styles.header}>
                 <Link to="/"><img src={logo} alt="imagemLogo"className={Styles.imagemLogo}/></Link>
            </header>
            <section className={Styles.information_404}>
                 <img src={img} alt="imagem ilustrativa 404 not found" className={Styles.imagem} />
            </section>
        </>
    )
}

export default Error404Alternate