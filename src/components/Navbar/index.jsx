import { Link } from 'react-router-dom';
import Logo from "../../assets/img/ControlABS.png"
import '../../estilo.css'; // Corrigido para garantir que o CSS seja importado corretamente

const Navbar = () => {
    return (
        <>
            <header>
                <div className="container-header">
                    <div className="img">
                        <Link to="/">
                            <img src={Logo} alt="ID/EA"/>
                        </Link>
                    </div>
                    <div className="menu">
                        <button onClick={() => alert("Navegar para Dashboard ABS")}>Dashboard ABS</button>
                        <button onClick={() => alert("Navegar para Dashboard Feedback")}>Dashboard Feedback</button>
                        <button onClick={() => window.location.href = "https://sites.google.com/mercadolivre.com/idea-sp10?usp=sharing"}>Site ID/EA-SP10</button>
                        <button onClick={() => alert("Ler Relatório")}>Sobre</button>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Navbar;
