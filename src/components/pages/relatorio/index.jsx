import '../../../estilo.css'; // Corrigido para garantir que o CSS seja importado corretamente
import { Link } from 'react-router-dom';

const Relatorio = () => {

    const readGooglesheet = () =>{
        // Sort results by id in descending order, take two
        // and return the age as an integer.

        fetch('https://sheetdb.io/api/v1/59aqd8up5nr9z')
        .then((response) => response.json())
        .then((data) => console.log(data));

    }

    return (
        <>
            <header>
                <div className="container-header">
                    <div className="img">
                        <a href="home.html"><img src="Logo2.png" alt="ID/EA" /></a>
                        <h1>ID/EA</h1>
                    </div>
                    <div className="menu">
                        <button onClick={() => alert("Navegar para Dashboard ABS")}>Dashboard ABS</button>
                        <button onClick={() => alert("Navegar para Dashboard Feedback")}>Dashboard Feedback</button>
                        <button onClick={() => alert("Navegar para Site ID/EA")}>Site ID/EA</button>
                        <button onClick={()=> alert("Ler Relatório")}>ler</button>
                    </div>
                </div>
            </header>

            <div className="side-bar">
                <div className="container-side">
                    <ul>
                        <li><Link to="/home">Home</Link></li>
                        <li><Link to="/">Relatório</Link></li>
                    </ul>
                </div>
            </div>

            <main>
                <div className="container-main">
                    <div className="campo-de-pesquisa">
                        <label htmlFor="NomeTL">Nome:</label>
                        <input type="text"  id="NomeTL" name="NomeTL"/>
                        <label htmlFor="RETL">RE:</label>
                        <input type="text" id="RETL" name="RETL"/>
                        <label htmlFor="data">Data do relatório:</label>
                        <input type="date" id="data" name="data"/>
                        <button onClick={()=>readGooglesheet()}>Gerar Relatório</button>
                        <button>Salvar</button>
                    </div>

                    <div className="container-tabela">
                        <h2>Olá, ! Aqui está o relatório <span>ABS</span> da sua equipe</h2>

                        <table>
                            <thead>
                                <tr>
                                    <th>IDGroot</th>
                                    <th>Nome</th>
                                    <th>Team Leader</th>
                                    <th>Processo Mãe</th>
                                    <th>RE</th>
                                    <th>Turno</th>
                                    <th>Empresa</th>
                                    <th>Escala</th>
                                    <th>Cargo</th>
                                    <th>Área</th>
                                    <th>Status</th>
                                    <th>Turma</th>
                                    <th>Data</th>
                                    <th>Status</th>
                                    <th>Status Real</th>
                                </tr>
                            </thead>
                           
                        </table>
                    </div>
                </div>
            </main>

            <footer>
                <div className="foto">
                    <img src="" alt="" />
                </div>
            </footer>
        </>
    );
};

export default Relatorio;
