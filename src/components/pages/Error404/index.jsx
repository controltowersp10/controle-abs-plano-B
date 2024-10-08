import Styles from './Page404.module.css'; // Certifique-se de que o caminho está correto
import { Helmet } from "react-helmet"
const Error404 = () => {
    return(
        <>
            <Helmet>
                <title>404 || Page Not Found !</title>
            </Helmet>
            <NavBar/>
            <section className={Styles.information_404}>
                 <div className={Styles.information_container_404}>
                    <h1>404</h1>
                    <p>Page not found!</p>
                </div>
            </section>
            <Footer />
        </>
    );
};

export default Error404;