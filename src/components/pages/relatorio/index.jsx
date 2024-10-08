import '../../../estilo.css'; // Corrigido para garantir que o CSS seja importado corretamente
import { Link } from 'react-router-dom';
import { useState } from 'react';
import Navbar from '../../Navbar';
import SideBar from '../../SideBar';



const Relatorio = () => {
    const [relatorioData, setRelatorioData] = useState([]); // Estado para armazenar os dados do relatório

    const readGooglesheet = () => {
        // Pega os dados da Google Sheet e atualiza o estado
        fetch('https://sheetdb.io/api/v1/ryh23udhp03fa')
            .then((response) => response.json())
            .then((data) => {
                setRelatorioData(data); // Armazena os dados retornados no estado
            })
            .catch((error) => console.error('Erro ao ler os dados:', error));
    };

    const updateGooglesheet = () => {
        fetch('https://sheetdb.io/api/v1/ryh23udhp03fa/STL/4', {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    "STL": 'faltou'
                }
            })
        })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error('Erro ao atualizar:', error));
    };

    return (
        <>
           <Navbar />
           <SideBar/>

            <main>
                <div className="container-main">
                    <div className="campo-de-pesquisa">
                        <label htmlFor="NomeTL">Nome:</label>
                        <input type="text" id="NomeTL" name="NomeTL"/>
                        <label htmlFor="RETL">RE:</label>
                        <input type="text" id="RETL" name="RETL"/>
                        <label htmlFor="data">Data do relatório:</label>
                        <input type="date" id="data" name="data"/>
                        <button onClick={readGooglesheet}>Gerar Relatório</button>
                        <button onClick={updateGooglesheet}>Salvar</button>
                    </div>

                    <div className="container-tabela">
                        <h2>Olá! Aqui está o relatório <span>ABS</span> da sua equipe</h2>

                        <table>
                            <thead>
                                <tr>
                                    <th>IDGroot</th>
                                    <th>Nome</th>
                                    <th>Team Leader</th>
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
                                    <th>Status auto</th>
                                    <th>Status TL</th>
                                    <th>Justificativa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {relatorioData.length > 0 ? (
                                    relatorioData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.IDrep}</td>
                                            <td>{item.Nome}</td>
                                            <td>{item.Leader}</td>
                                            <td>{item.RE}</td>
                                            <td>{item.Turno}</td>
                                            <td>{item.Empresa}</td>
                                            <td>{item.Escala}</td>
                                            <td>{item.Cargo}</td>
                                            <td>{item.Area}</td> 
                                            <td>{item.Status}</td> 
                                            <td>{item.Turma}</td>
                                            <td>{item.data}</td>
                                            <td>{item.Status}</td>
                                            <td>{item.StatusR}</td>
                                            <td>{item.StatusT}</td>
                                            <td>{item.Justificativa}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="17">Nenhum dado disponível</td>
                                    </tr>
                                )}
                            </tbody>
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
