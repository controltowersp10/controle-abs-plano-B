import '../../estilo.css'; // Corrigido para garantir que o CSS seja importado corretamente

const Navbar = () => {
    return (
        <>
            <header>
                <div className="container-header">
                    <div className="img">
                        <a href="home.html">
                            <h1>ID/EA</h1> {/* O título deve estar dentro do link */}
                        </a>
                    </div>
                    <div className="menu">
                        <link to="" className="button">Dashboard ABS</link>
                        <link to="" className="button">Dashboard Feedback</link>
                        <link to="" className="button">Site ID/EA</link>
                        <link to="" className="button">Sobre</link>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;
