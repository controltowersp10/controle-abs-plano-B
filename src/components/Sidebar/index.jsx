import { Link } from "react-router-dom";
import '../../../estilo.css'; // Corrigido para garantir que o CSS seja importado corretamente
const Sidebar = () => {
    return (
        <div className="side-bar">
            <div className="container-side">
                <ul>
                    <li><Link to="/relatorio">Relatório ABS</Link></li>
                    <li><Link to="/sobre">Sobre</Link></li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
