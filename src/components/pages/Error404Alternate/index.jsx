import Styles from './Error404A.module.css' 
import { Helmet } from "react-helmet"
const Error404Alternate = () => {
    return(
        <>
            <Helmet>
                <title> 404 || Page Not Found !</title>
            </Helmet>
            <NavBar/>
            <section className={Styles.information_404}>
                 <img src={img} alt="imagem ilustrativa 404 not found" className={Styles.imagem} />
            </section>
            <Footer />
        </>
    )
}

export default Error404Alternate