import { Link } from 'react-router-dom';
import '../../estilo.css'; // Corrigido para garantir que o CSS seja importado corretamente

const SideBar = () => {
    return (
        <>
            <div className="side-bar">
                <div className="container-side">
                    <ul>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/">Controle ABS</Link></li>
                        <li><Link to="/DashABS">Dashboard ABS</Link></li>
                    </ul>
                </div>
            </div>
        
        </>
    )
}

export default SideBar;