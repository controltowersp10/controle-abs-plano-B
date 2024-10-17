import Navbar from "../../Navbar"
import Main from "../../Main"
import { Helmet } from "react-helmet";
import Footer from "../../Footer";

const Home = () => {
    return (
        <>
        <Helmet>
            <title>Home</title>
        </Helmet>
            <Navbar />
            <Main />
            <Footer />
        </>
    );
};

export default Home;
