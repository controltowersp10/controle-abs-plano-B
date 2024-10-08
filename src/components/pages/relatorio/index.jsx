import React, { useState } from "react";
import app from "../../../firebaseConfig.jsx";
import { getDatabase, ref, get, set } from "firebase/database";
import { useNavigate } from "react-router-dom";
import '../../../estilo.css';
import Navbar from '../../Navbar';
import SideBar from '../../SideBar';

const RelatorioEUpdate = () => {
    const [representanteArray, setRepresentanteArray] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchNome, setSearchNome] = useState("");
    const [searchRE, setSearchRE] = useState("");
    const [searchData, setSearchData] = useState("");
    const [reportGenerated, setReportGenerated] = useState(false);

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "Chamada/Representante");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const myData = snapshot.val();
            const temporaryArray = Object.keys(myData).map(myFireid => {
                return {
                    ...myData[myFireid],
                    RepresentanteId: myFireid 
                };
            });
            setRepresentanteArray(temporaryArray);
            applyFilters(temporaryArray);
        } else {
            alert("Nenhum dado disponível");
        }
    };

    const applyFilters = (data) => {
        if (!searchNome.trim()) {
            alert("Por favor, preencha o nome do Team Leader.");
            return;
        }
    
        if (!searchData.trim()) {
            alert("Por favor, selecione uma data.");
            return;
        }
    
        const filtered = data.filter(item => {
            const isNomeMatch = item.Team_Leader && item.Team_Leader.toLowerCase().includes(searchNome.toLowerCase());
            const isDataMatch = item.DATA === searchData;
            return isNomeMatch && isDataMatch;
        });
    
        setFilteredData(filtered);
        setReportGenerated(true);
    };
    

    const handleGenerateReport = () => {
        fetchData();
    };

    const updateStatus = async (representanteId, newStatus) => {
        const db = getDatabase(app);
        const dbRef = ref(db, `Chamada/Representante/${representanteId}`);
        const snapshot = await get(dbRef);
        
        if (snapshot.exists()) {
            const updatedData = { ...snapshot.val(), Status: newStatus };
            await set(dbRef, updatedData);
            alert("Status atualizado com sucesso!");
            fetchData();  // Atualiza os dados após salvar
        } else {
            alert("Erro ao atualizar status.");
        }
    };

    const addJustificativa = async (representanteId) => {
        const justificativa = prompt("Por favor, insira a justificativa:");
        if (justificativa) {
            const db = getDatabase(app);
            const dbRef = ref(db, `Chamada/Representante/${representanteId}`);
            const snapshot = await get(dbRef);
            
            if (snapshot.exists()) {
                const updatedData = { ...snapshot.val(), Justificativa: justificativa };
                await set(dbRef, updatedData);
                alert("Justificativa salva com sucesso!");
                fetchData();  // Atualiza os dados após salvar
            } else {
                alert("Erro ao salvar justificativa.");
            }
        } else {
            alert("Nenhuma justificativa inserida.");
        }
    };

    return (
        <>
            <Navbar />
            <SideBar />
            <main>
                <div className="container-main">
                    <div className="campo-de-pesquisa">

                        <label htmlFor="NomeTL">Nome:</label>
                        <input type="text" id="NomeTL" name="NomeTL" value={searchNome} onChange={(e) => setSearchNome(e.target.value)}/>

                        <label htmlFor="RETL">RE:</label>
                        <input type="text" id="RETL" name="RETL" value={searchRE} onChange={(e) => setSearchRE(e.target.value)}/>

                        <label htmlFor="data">Data do relatório:</label>
                        <input type="date" id="data" name="data"  value={searchData} onChange={(e) => setSearchData(e.target.value)} />

                        <button onClick={handleGenerateReport}>Gerar Relatório</button>
                    </div>

                    {reportGenerated && (
                        <h2>Olá {searchNome},&nbsp; Aqui está o relatório <span>ABS</span> da sua equipe <span>!</span></h2>
                    )}

                    <div className="container-tabela">
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
                                    <th>Presença</th>
                                    <th>Validação</th>
                                    <th>Justificativa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredData.length > 0 ? (
                                    filteredData.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.ID_Groot}</td>
                                            <td>{item.Nome}</td>
                                            <td>{item.Team_Leader}</td>
                                            <td>{item.Matricula}</td>
                                            <td>{item.Turno}</td>
                                            <td>{item.Empresa}</td>
                                            <td>{item.Escala_Padrao}</td>
                                            <td>{item.Cargo_Padrao}</td>
                                            <td>{item.Area_Padrao}</td>
                                            <td>{item.Status}</td>
                                            <td>{item.Turma}</td>
                                            <td>{item.DATA}</td>
                                            <td>{item.presenca}</td>
                                            <td>
                                                <select
                                                    defaultValue={item.presenca}
                                                    onChange={(e) => updateStatus(item.RepresentanteId, e.target.value)} >
                                                    <option>Selecione</option>
                                                    <option value="Presente">Presente</option>
                                                    <option value="Faltou">Faltou</option>
                                                    <option value="Férias">Férias</option>
                                                    <option value="Atestado">Atestado</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button onClick={() => addJustificativa(item.RepresentanteId)}>Adicionar Justificativa</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="15">Nenhum dado disponível</td>
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

export default RelatorioEUpdate;
