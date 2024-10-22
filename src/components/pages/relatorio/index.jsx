import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import app from "../../../firebaseConfig.jsx";
import { getDatabase, ref, get, set } from "firebase/database";
import '../../../estilo.css';
import Navbar from '../../Navbar';
import Footer from '../../Footer';

const formatDate = (dateString) => {
    const date = new Date(dateString + "T00:00:00");
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
};

const RelatorioEUpdate = () => {
    const [representantesArray, setRepresentantesArray] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchRE, setSearchRE] = useState("");
    const [searchData, setSearchData] = useState("");
    const [showDateField, setShowDateField] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(false);
    const [viewOnly, setViewOnly] = useState(false);
    const [pendingChanges, setPendingChanges] = useState({});
    const [buttonLabel, setButtonLabel] = useState("GERAR RELATÓRIO");
    const [showGenerateButton, setShowGenerateButton] = useState(true);
    const [error, setError] = useState(null);

    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    };

    const getTeamLeaderByRE = (re) => {
        const representante = representantesArray.find(item => item.RE_TL === re);
        return representante ? representante.Team_Leader : "";
    };

    useEffect(() => {
        setSearchData(getCurrentDate());
    }, []);

    const fetchData = async () => {
        try {
            const db = getDatabase(app);
            const dbRef = ref(db, "Chamada/Representante/Representantes");
            const snapshot = await get(dbRef);

            if (!snapshot.exists()) {
                setError("Nenhum dado disponível.");
                return;
            }

            const myData = snapshot.val();
            const temporaryArray = Object.keys(myData).map(myFireid => ({
                ...myData[myFireid],
                RepresentantesId: myFireid
            }));

            if (searchData) {
                const historicoRef = ref(db, `Historico/Chamada/${searchData}`);
                const historicoSnapshot = await get(historicoRef);
                let historicoData = [];

                if (historicoSnapshot.exists()) {
                    historicoData = historicoSnapshot.val();
                    historicoData = Object.keys(historicoData).map(historicoId => ({
                        ...historicoData[historicoId],
                        RepresentantesId: historicoId,
                        DATA: searchData
                    }));
                }

                const combinedData = temporaryArray.map(item => {
                    const historicoItem = historicoData.find(h => h.RepresentantesId === item.RepresentantesId) || {};
                    return {
                        ...item,
                        Presenca_sistemica: historicoItem.Presenca_sistemica || "",
                        Justificativa: historicoItem.Justificativa || ""
                    };
                });

                setRepresentantesArray(combinedData);
                applyFilters(combinedData);
            } else {
                setRepresentantesArray(temporaryArray);
                applyFilters(temporaryArray);
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            setError("Erro ao buscar dados. Tente novamente mais tarde.");
        }
    };

    const applyFilters = (data) => {
        if (!searchRE.trim()) {
            alert("Por favor, preencha o RE.");
            return;
        }

        const representante = data.find(item => item.RE_TL === searchRE);
        if (!representante) {
            alert("RE não encontrado.");
            return;
        }

        const teamLeader = representante.Team_Leader;
        const filtered = data.filter(item => item.Team_Leader === teamLeader && item.DATA === searchData);

        setFilteredData(filtered);
        setReportGenerated(true);
        setShowGenerateButton(false);
    };

    const handleGenerateReport = async () => {
        await fetchData();
        setViewOnly(false);
        setPendingChanges({});
        setButtonLabel("GERAR RELATÓRIO");
        setShowGenerateButton(false);
    };

    const handleStatusChange = (RepresentantesId, newStatus) => {
        setPendingChanges(prev => ({
            ...prev,
            [RepresentantesId]: {
                ...prev[RepresentantesId],
                Presenca_sistemica: newStatus
            }
        }));
    };

    const handleSave = async () => {
        const db = getDatabase(app);
        
        for (const RepresentantesId in pendingChanges) {
            const RepresentantesData = pendingChanges[RepresentantesId];
            const RepresentantesOriginal = representantesArray.find(item => item.RepresentantesId === RepresentantesId);

            const fullRepresentantesData = {
                ...RepresentantesOriginal,
                Presenca_sistemica: RepresentantesData.Presenca_sistemica || RepresentantesOriginal.Presenca_sistemica || "",
                Justificativa: RepresentantesData.Justificativa || RepresentantesOriginal.Justificativa || ""
            };

            const dbRef = ref(db, `Historico/Chamada/${fullRepresentantesData.DATA}/${RepresentantesId}`);
            await set(dbRef, fullRepresentantesData);
        }
        
        alert("Alterações salvas com sucesso!");
        setPendingChanges({});
        await fetchData();
    };

    const addJustificativa = (RepresentantesId) => {
        const justificativa = prompt("Por favor, insira a justificativa:");
        if (justificativa) {
            setPendingChanges(prev => ({
                ...prev,
                [RepresentantesId]: {
                    ...prev[RepresentantesId],
                    Justificativa: justificativa
                }
            }));
        } else {
            alert("Nenhuma justificativa inserida!");
        }
    };

    const handleViewRecords = () => {
        fetchData();  // Recarregar dados
        setViewOnly(true);  // Definir para visualização apenas
        setButtonLabel("ATUALIZAR DADOS");  // Atualizar o botão para permitir edição
        setShowGenerateButton(true);  // Mostrar botão de atualização
        setShowDateField(true);  // Mostrar o campo de data
    };
    

    useEffect(() => {
        if (searchRE.trim() && !viewOnly) {
            setShowGenerateButton(true);
            setButtonLabel("GERAR RELATÓRIO");
        } else if (viewOnly) {
            setButtonLabel("ATUALIZAR DADOS");
        }
    }, [searchRE, viewOnly]);
    
    const capitalizeName = (name) => name.toUpperCase();

    return (
        <>
            <Helmet>
                <title>Controle ABS</title>
            </Helmet>
            <Navbar />
            <main>
                <div className="container-main">
                    {error && <div className="error-message">{error}</div>}
                    <div className="campo-de-pesquisa">
                        <label htmlFor="RETL">RE:</label>
                        <input type="text" id="RETL" value={searchRE} onChange={(e) => setSearchRE(e.target.value)} placeholder="Digite seu RE"/>

                        {showDateField && (
                            <>
                                <label htmlFor="data">DATA:</label>
                                <input type="date" id="data" value={searchData} onChange={(e) => setSearchData(e.target.value)}/>
                            </>
                        )}

                        {showGenerateButton && (
                            <button onClick={handleGenerateReport}>{buttonLabel}</button>
                        )}
                        {reportGenerated && !viewOnly && (
                            <>
                                <button onClick={handleSave}>SALVAR</button>
                                <button onClick={handleViewRecords}>VER REGISTROS</button>
                            </>
                        )}
                        {viewOnly && (
                            <button onClick={handleGenerateReport}>{buttonLabel}</button>
                        )}
                    </div>
                    {reportGenerated && (
                        <>
                            <h2>
                                Olá, <span>{capitalizeName(getTeamLeaderByRE(searchRE))}</span>, aqui está o relatório <span>ABS</span> da data <span>{formatDate(searchData)}</span>&nbsp;!
                            </h2>
                            <div className="container-tabela">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID Groot</th>
                                            <th>Nome</th>
                                            <th>RE</th>
                                            <th>Turno</th>
                                            <th>Escala Padrão</th>
                                            <th>Cargo Padrão</th>
                                            <th>Área Padrão</th>
                                            <th>Empresa</th>
                                            <th>Turma</th>
                                            <th>Status</th>
                                            <th>Data</th>
                                            <th className="presensa-sistemica">Presença Sistêmica</th>
                                            <th>Validação</th>
                                            <th>Justificativa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.ID_Groot}</td>
                                                <td>{capitalizeName(item.Nome)}</td>
                                                <td>{item.Matricula}</td>
                                                <td>{item.Turno}</td>
                                                <td>{item.Escala_Padrao}</td>
                                                <td>{item.Cargo_Padrao}</td>
                                                <td>{item.Area_Padrao}</td>
                                                <td>{item.Empresa}</td>
                                                <td>{item.Turma}</td>
                                                <td>{item.Status}</td>
                                                <td>{formatDate(item.DATA)}</td>
                                                <td className="presensa-sistemica">
                                                    {pendingChanges[item.RepresentantesId]?.Presenca_sistemica !== undefined
                                                        ? pendingChanges[item.RepresentantesId]?.Presenca_sistemica
                                                        : item.Presenca_sistemica}
                                                </td>
                                                <td>
                                                    <select value={pendingChanges[item.RepresentantesId]?.Presenca_sistemica || ""}
                                                        onChange={(e) => handleStatusChange(item.RepresentantesId, e.target.value)}>
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
                                                {!viewOnly && (
                                                    <td>
                                                        <button onClick={() => addJustificativa(item.RepresentantesId)}>Adicionar Justificativa</button>
                                                    </td>
                                                )}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
};

export default RelatorioEUpdate;
