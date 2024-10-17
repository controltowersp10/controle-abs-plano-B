import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import app from "../../../firebaseConfig.jsx";
import { getDatabase, ref, get, set } from "firebase/database";
import '../../../estilo.css';
import Navbar from '../../Navbar';
import Footer from '../../Footer';

const RelatorioEUpdate = () => {
    const [RepresentantesArray, setRepresentantesArray] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchNome, setSearchNome] = useState("");
    const [searchRE, setSearchRE] = useState("");
    const [searchData, setSearchData] = useState("");
    const [showDateField, setShowDateField] = useState(false);
    const [reportGenerated, setReportGenerated] = useState(false);
    const [viewOnly, setViewOnly] = useState(false);
    const [pendingChanges, setPendingChanges] = useState({});
    const [buttonLabel, setButtonLabel] = useState("GERAR RELATÓRIO");
    const [showGenerateButton, setShowGenerateButton] = useState(true);

    const getCurrentDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        const currentDate = getCurrentDate();
        setSearchData(currentDate);
    }, []);

    const fetchData = async () => {
        try {
            const db = getDatabase(app);
            const dbRef = ref(db, "Chamada/Representante/Representantes");
            const snapshot = await get(dbRef);

            if (snapshot.exists()) {
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
                            Presenca: historicoItem.Presenca || "",
                            Justificativa: historicoItem.Justificativa || ""
                        };
                    });

                    setRepresentantesArray(combinedData);
                    applyFilters(combinedData);
                } else {
                    setRepresentantesArray(temporaryArray);
                    applyFilters(temporaryArray);
                }
            } else {
                alert("Nenhum dado disponível");
            }
        } catch (error) {
            console.error("Erro ao buscar dados:", error);
            alert("Erro ao buscar dados. Tente novamente mais tarde.");
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
                Presenca: newStatus
            }
        }));
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

    const handleSave = async () => {
        const db = getDatabase(app);

        for (const RepresentantesId in pendingChanges) {
            const RepresentantesData = pendingChanges[RepresentantesId];
            const RepresentantesOriginal = RepresentantesArray.find(item => item.RepresentantesId === RepresentantesId);

            const fullRepresentantesData = {
                ID_Groot: RepresentantesOriginal.ID_Groot || "",
                Nome: RepresentantesOriginal.Nome || "",
                Matricula: RepresentantesOriginal.Matricula || "",
                Turno: RepresentantesOriginal.Turno || "",
                Escala_Padrao: RepresentantesOriginal.Escala_Padrao || "",
                Cargo_Padrao: RepresentantesOriginal.Cargo_Padrao || "",
                Area_Padrao: RepresentantesOriginal.Area_Padrao || "",
                Empresa: RepresentantesOriginal.Empresa || "",
                Status: RepresentantesOriginal.Status || "",
                Turma: RepresentantesOriginal.Turma || "",
                DATA: RepresentantesOriginal.DATA || "",
                Presenca: RepresentantesData.Presenca || RepresentantesOriginal.Presenca || "",
                Justificativa: RepresentantesData.Justificativa || RepresentantesOriginal.Justificativa || ""
            };

            const dbRef = ref(db, `Historico/Chamada/${fullRepresentantesData.DATA}/${RepresentantesId}`);
            const snapshot = await get(dbRef);

            if (snapshot.exists()) {
                const updatedData = {
                    ...snapshot.val(),
                    ...fullRepresentantesData
                };
                await set(dbRef, updatedData);
            } else {
                await set(dbRef, fullRepresentantesData);
            }
        }

        alert("Alterações salvas com sucesso!");
        setPendingChanges({});
        fetchData();
    };

    const capitalizeName = (name) => { 
        return name.toUpperCase();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString + "T00:00:00");
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };
    const handleViewRecords = () => {
        fetchData();
        setViewOnly(true);
        setButtonLabel("ATUALIZAR DADOS");
        setShowGenerateButton(true);
        setShowDateField(true); // Mostrar o campo de data ao clicar em "VER REGISTROS"
    };
    // Atualiza a visibilidade do botão "GERAR RELATÓRIO" ao editar o nome do Team Leader
    useEffect(() => {
        if (searchNome.trim() && !viewOnly) {
            setShowGenerateButton(true);
            setButtonLabel("GERAR RELATÓRIO"); // Reconfigura o botão para "GERAR RELATÓRIO" quando estiver em modo de edição
        } else if (viewOnly) {
            setButtonLabel("ATUALIZAR DADOS"); // Altera o nome do botão ao visualizar registros
        }
    }, [searchNome, viewOnly]);


    return (
        <>
            <Helmet>
                <title>Controle ABS</title>
            </Helmet>
            <Navbar />
            <main>
                <div className="container-main">
                <div className="campo-de-pesquisa">
                    
                        <label htmlFor="NomeTL">Nome:</label>
                        <input type="text" id="NomeTL" value={searchNome} onChange={(e) => setSearchNome(e.target.value)} placeholder="Digite seu nome" />

                        <label htmlFor="RETL">RE:</label>
                        <input type="text" id="RETL" value={searchRE} onChange={(e) => setSearchRE(e.target.value)} placeholder="Digite seu RE" />

                        {showDateField && ( // Exibir o campo de data somente se showDateField for true
                            <>
                                <label htmlFor="data">Data do relatório:</label>
                                <input type="date" id="data" value={searchData} onChange={(e) => setSearchData(e.target.value)} />
                            </>
                        )}

                        {showGenerateButton && ( // Exibe o botão "GERAR RELATÓRIO" apenas se o relatório ainda não foi gerado
                            <button onClick={handleGenerateReport}>{buttonLabel}</button>
                        )}
                        {reportGenerated && !viewOnly && ( // Exibe o botão "SALVAR" somente quando não está no modo de visualização
                            <button onClick={handleSave}>SALVAR</button>
                        )}
                        {reportGenerated && !viewOnly && ( // Exibe o botão "VER REGISTROS" quando não está no modo de visualização
                            <button onClick={handleViewRecords}>VER REGISTROS</button>
                        )}
                        {viewOnly && ( // Exibe o botão "ATUALIZAR DADOS" quando está no modo de visualização
                            <button onClick={handleGenerateReport}>{buttonLabel}</button>
                         )}

                        
                    </div>
                    {reportGenerated && (
                        <>
                            <h2>
                                Olá <span>{capitalizeName(searchNome)}</span>, Aqui está o relatório <span>ABS</span> da data <span>{formatDate(searchData)}</span>!
                            </h2>
                            <div className="container-tabela">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID Groot</th>
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
                                            {!viewOnly && <th>Validação</th>}
                                            <th>Justificativa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((Representantes, index) => (
                                            <tr key={index}>
                                                <td>{Representantes.ID_Groot}</td>
                                                <td>{capitalizeName(Representantes.Nome)}</td>
                                                <td>{Representantes.Matricula}</td>
                                                <td>{Representantes.Turno}</td>
                                                <td>{Representantes.Escala_Padrao}</td>
                                                <td>{Representantes.Cargo_Padrao}</td>
                                                <td>{Representantes.Area_Padrao}</td>
                                                <td>{Representantes.Empresa}</td>
                                                <td>{Representantes.Status}</td>
                                                <td>{Representantes.Turma}</td>
                                                <td>{formatDate(Representantes.DATA)}</td>
                                                <td>{Representantes.Presenca}</td>
                                                <td>
                                                    {viewOnly ? (
                                                        Representantes.Justificativa || " "
                                                    ) : (
                                                        <select value={pendingChanges[Representantes.RepresentantesId]?.Presenca || Representantes.Presenca} onChange={(e) => handleStatusChange(Representantes.RepresentantesId, e.target.value)}>
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
                                                    )}
                                                </td>
                                                {!viewOnly && (
                                                    <td>
                                                        <button onClick={() => addJustificativa(Representantes.RepresentantesId)}>Adicionar Justificativa</button>
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
