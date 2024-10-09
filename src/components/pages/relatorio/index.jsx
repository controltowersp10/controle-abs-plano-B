import React, { useState } from "react";
import { Helmet } from "react-helmet";
import app from "../../../firebaseConfig.jsx";
import { getDatabase, ref, get, set } from "firebase/database";
import '../../../estilo.css';
import Navbar from '../../Navbar';
import SideBar from '../../SideBar';
import Footer from '../../Footer';


const RelatorioEUpdate = () => {
    const [representanteArray, setRepresentanteArray] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchNome, setSearchNome] = useState("");
    const [searchRE, setSearchRE] = useState("");
    const [searchData, setSearchData] = useState("");
    const [reportGenerated, setReportGenerated] = useState(false);
    const [pendingChanges, setPendingChanges] = useState({}); // Armazenar alterações locais


    {/* Função para buscar os dados do Firebase */}
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
    {/* Aplicar filtros ao carregar os dados */}
    const applyFilters = (data) => {
        if (!searchNome.trim()) {
            alert("Por favor, preencha o nome do Team Leader.");
            return;
        }

        if (!searchData.trim()) {
            alert("Por favor, selecione uma data.");
            return;
        }
        {/* Filtra os dados com base no nome do Team Leader e na data */}
        const filtered = data.filter(item => {
            const isNomeMatch = item.Team_Leader && item.Team_Leader.toLowerCase().includes(searchNome.toLowerCase());
            const isDataMatch = item.DATA === searchData;
            return isNomeMatch && isDataMatch;
        });

        setFilteredData(filtered);
        setReportGenerated(true);
    };
    {/* Função para gerar o relatório */}
    const handleGenerateReport = () => {
        fetchData();
    };
    {/* Função para atualizar o status */}
    const handleStatusChange = (representanteId, newStatus) => {
        setPendingChanges(prev => ({
            ...prev,
            [representanteId]: {
                ...prev[representanteId],
                Status: newStatus
            }
        }));
    };
    {/* Função para adicionar justificativa */}
    const addJustificativa = (representanteId) => {
        const justificativa = prompt("Por favor, insira a justificativa:");
        if (justificativa) {
            setPendingChanges(prev => ({
                ...prev,
                [representanteId]: {
                    ...prev[representanteId],
                    Justificativa: justificativa
                }
            }));
        } else {
            alert("Nenhuma justificativa inserida.");
        }
    };
    {/* Função para salvar as alterações locais */}
    const handleSave = async () => {
        const db = getDatabase(app);

        for (const representanteId in pendingChanges) {
            const dbRef = ref(db, `Chamada/Representante/${representanteId}`);
            const snapshot = await get(dbRef);

            if (snapshot.exists()) {
                const updatedData = {
                    ...snapshot.val(),
                    ...pendingChanges[representanteId] // Aplica as alterações locais
                };
                await set(dbRef, updatedData);
            }
        }

        alert("Alterações salvas com sucesso!");
        setPendingChanges({}); // Limpa as alterações pendentes após salvar
        fetchData(); // Atualiza os dados
    };

        {/* Função para capitalizar o nome */}
    const capitalizeName = (name) => {
        return name
            .toLowerCase() // Converte a string inteira para minúsculas
            .split(' ') // Divide a string em palavras
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitaliza a primeira letra de cada palavra
            .join(' '); // Junta as palavras de volta em uma string
    }
        {/* Função para formatar a data */}
    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-'); // Divide a string de data no formato 'ano-mês-dia'
        return `${day}/${month}/${year}`; // Retorna no formato 'dia/mês/ano'
    };

    return (
        <>
            <Helmet>
                <title>Controle ABS</title>
            </Helmet>
            <Navbar />
            <SideBar />
            <main>
                <div className="container-main">
                    <div className="campo-de-pesquisa">

                        <label htmlFor="NomeTL">Nome:</label>
                        <input type="text" id="NomeTL" name="NomeTL" value={searchNome} onChange={(e) => setSearchNome(e.target.value)} placeholder="Digite seu nome" />

                        <label htmlFor="RETL">RE:</label>
                        <input type="text" id="RETL" name="RETL" value={searchRE} onChange={(e) => setSearchRE(e.target.value)} placeholder="Digite seu RE"/>

                        <label htmlFor="data">Data do relatório:</label>
                        <input type="date" id="data" name="data" value={searchData} onChange={(e) => setSearchData(e.target.value)}/>

                        <button onClick={handleGenerateReport}>GERAR RELATÓRIO</button>

                        {/* Exibe o botão de salvar apenas quando o relatório for gerado */}
                        {reportGenerated && (
                            <button onClick={handleSave}>SALVAR</button>
                        )}
                    </div>

                    {reportGenerated && (
                        <>
                            <h2>Olá {capitalizeName(searchNome)},&nbsp; Aqui está o relatório <span>ABS</span> da sua equipe!</h2>
                        </>
                    )}

                    <div className="container-tabela">
                        <table>
                            <thead>
                                <tr>
                                    <th>IDGroot</th>
                                    <th>Nome</th>
                                    <th>RE</th>
                                    <th>Turno</th>
                                    <th>Escala</th>
                                    <th>Cargo</th>
                                    <th>Área</th>
                                    <th>Empresa</th>
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
                                            <td>{capitalizeName(item.Nome)}</td>
                                            <td>{item.Matricula}</td>
                                            <td>{item.Turno}</td>
                                            <td>{item.Escala_Padrao}</td>
                                            <td>{item.Cargo_Padrao}</td>
                                            <td>{item.Area_Padrao}</td>
                                            <td>{item.Empresa}</td>
                                            <td>{item.Status}</td>
                                            <td>{item.Turma}</td>
                                            <td>{formatDate(item.DATA)}</td>
                                            <td>{item.presenca}</td>
                                            <td>
                                                <select defaultValue={item.presenca} onChange={(e) => handleStatusChange(item.RepresentanteId, e.target.value)}>
                                                    <option value="">Selecione</option>
                                                    <option value="Presente">Presente</option>
                                                    <option value="Afastamento">Afastamento</option>
                                                    <option value="Afastamento-Acd-Trab">Afastamento Acd Trabalho</option>
                                                    <option value="Atestado">Atestado</option>
                                                    <option value="Atestado-Acd-Trab">Atestado Acd Trabalho</option>
                                                    <option value="Atestado-Horas">Atestado Horas</option>
                                                    <option value="Banco-de-Horas">Banco de Horas</option>
                                                    <option value="Decl-Medica">Declaração Médica</option>
                                                    <option value="Falta">Falta</option>
                                                    <option value="Ferias">Férias</option>
                                                    <option value="Folga-Escala">Folga Escala</option>
                                                    <option value="Fretado">Fretado</option>
                                                    <option value="Licenca">Licença</option>
                                                    <option value="Presenca-HE">Presença (HE)</option>
                                                    <option value="Sinergia-CX">Sinergia CX</option>
                                                    <option value="Sinergia-IN">Sinergia IN</option>
                                                    <option value="Sinergia-INV">Sinergia INV</option>
                                                    <option value="Sinergia-Loss">Sinergia Loss</option>
                                                    <option value="Sinergia-MWH">Sinergia MWH</option>
                                                    <option value="Sinergia-OUT">Sinergia OUT</option>
                                                    <option value="Sinergia-Qua">Sinergia Qua</option>
                                                    <option value="Sinergia-RC01">Sinergia RC01</option>
                                                    <option value="Sinergia-RC-SP10">Sinergia RC-SP10</option>
                                                    <option value="Sinergia-RET">Sinergia RET</option>
                                                    <option value="Sinergia-SP01">Sinergia SP01</option>
                                                    <option value="Sinergia-SP02">Sinergia SP02</option>
                                                    <option value="Sinergia-SP03">Sinergia SP03</option>
                                                    <option value="Sinergia-SP04">Sinergia SP04</option>
                                                    <option value="Sinergia-SP05">Sinergia SP05</option>
                                                    <option value="Sinergia-SP06">Sinergia SP06</option>
                                                    <option value="Sinergia-Sortation">Sinergia Sortation</option>
                                                    <option value="Sinergia-Suspensao">Sinergia Suspensão</option>
                                                    <option value="Sinergia-SVC">Sinergia SVC</option>
                                                    <option value="Transferido">Transferido</option>
                                                    <option value="Treinamento-Ext">Treinamento Ext</option>
                                                    <option value="Treinamento-Int">Treinamento Int</option>
                                                    <option value="Treinamento-REP-III">Treinamento REP III</option>
                                                    <option value="Sinergia-Insumo">Sinergia Insumo</option>
                                                </select>
                                            </td>
                                            <td>
                                                <button onClick={() => addJustificativa(item.RepresentanteId)}>
                                                    Adicionar Justificativa
                                                </button>
                                            </td>
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
            <Footer />
        </>
    );
};

export default RelatorioEUpdate;
