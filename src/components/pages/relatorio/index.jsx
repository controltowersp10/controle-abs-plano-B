import React, { useState, useEffect } from "react";
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
    const [showDateField, setShowDateField] = useState(false); // Novo estado para controlar a visibilidade do campo de data
    const [reportGenerated, setReportGenerated] = useState(false);
    const [viewOnly, setViewOnly] = useState(false);
    const [pendingChanges, setPendingChanges] = useState({});
    const [buttonLabel, setButtonLabel] = useState("GERAR RELATÓRIO");
    const [showGenerateButton, setShowGenerateButton] = useState(true); // Estado para controlar a visibilidade do botão "GERAR RELATÓRIO"

        // Função para obter a data atual formatada como 'YYYY-MM-DD'
        const getCurrentDate = () => {
            const today = new Date();
            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0'); // Adiciona o zero à esquerda
            const day = String(today.getDate()).padStart(2, '0'); // Adiciona o zero à esquerda
            return `${year}-${month}-${day}`;
        };
        useEffect(() => {
            // Definir a data atual quando o componente for montado
            const currentDate = getCurrentDate();
            setSearchData(currentDate); // Define a data atual como o valor inicial
        }, []);

    const fetchData = async () => {
        try {
            const db = getDatabase(app);// Obtém a instância do banco de dados Firebase
            const dbRef = ref(db, "Chamada/Representante");// Cria uma referência para a coleção "Chamada/Representante" no banco de dados
            const snapshot = await get(dbRef); // Faz uma solicitação para obter os dados dessa referência
        
            // Verifica se os dados existem na referência
            if (snapshot.exists()) {
                const myData = snapshot.val();// Obtém os dados como um objeto
                // Converte o objeto em um array, adicionando o ID do representante como uma nova propriedade
                const temporaryArray = Object.keys(myData).map(myFireid => ({
                    ...myData[myFireid],
                    RepresentanteId: myFireid // Adiciona o ID do representante ao objeto
                }));
                // Verifica se uma data de busca foi fornecida
                if (searchData) {
                    
                    const historicoRef = ref(db, `Historico/Chamada/${searchData}`);// Cria uma referência para os dados históricos da data especificada
                    const historicoSnapshot = await get(historicoRef); // Obtém os dados históricos
                    let historicoData = [];

                    if (historicoSnapshot.exists()) {// Verifica se os dados históricos existem
                        
                        historicoData = historicoSnapshot.val();// Obtém os dados históricos como um objeto
                        // Converte o objeto de dados históricos em um array, adicionando o ID do histórico e a data
                        historicoData = Object.keys(historicoData).map(historicoId => ({
                            ...historicoData[historicoId],
                            RepresentanteId: historicoId, // Adiciona o ID do histórico ao objeto
                            DATA: searchData // Adiciona a data ao objeto
                        }));
                    }
        
                    // Combina os dados dos representantes com os dados históricos
                    const combinedData = temporaryArray.map(item => {
                        // Encontra o item de histórico correspondente ao representante
                        const historicoItem = historicoData.find(h => h.RepresentanteId === item.RepresentanteId) || {};
                        return {
                            ...item,
                            // Adiciona os dados de presença e justificativa, se existirem, caso contrário, define como vazio
                            Presenca: historicoItem.Presenca || "",
                            Justificativa: historicoItem.Justificativa || ""
                        };
                    });
                    setRepresentanteArray(combinedData);// Atualiza o estado do componente com os dados combinados
                    applyFilters(combinedData);// Aplica os filtros aos dados combinados
                } else {
                    setRepresentanteArray(temporaryArray); // Se não houver data de busca, simplesmente atualiza o estado com os dados temporários
                    applyFilters(temporaryArray);// Aplica os filtros aos dados temporários
                }
            } else {
                alert("Nenhum dado disponível");// Se não houver dados disponíveis, exibe um alerta
            }
        } catch (error) {
            // Captura e exibe erros, caso ocorra uma falha na busca dos dados
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
        setShowGenerateButton(false); // Oculta o botão "GERAR RELATÓRIO" após a geração
    };

    const handleGenerateReport = async () => {
        await fetchData();
        setViewOnly(false); // Garante que estamos no modo de edição após gerar o relatório
        setPendingChanges({}); // Reseta as mudanças pendentes ao gerar o relatório
        setButtonLabel("GERAR RELATÓRIO"); // Volta o nome do botão ao original
        setShowGenerateButton(false); // Esconde o botão "GERAR RELATÓRIO"
    };


    const handleStatusChange = (representanteId, newStatus) => {
        setPendingChanges(prev => ({
            ...prev,
            [representanteId]: {
                ...prev[representanteId],
                Presenca: newStatus
            }
        }));
    };

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
            alert("Nenhuma justificativa inserida!");
        }
    };

    const handleSave = async () => {
        const db = getDatabase(app);

        for (const representanteId in pendingChanges) {
            const representanteData = pendingChanges[representanteId];
            const representanteOriginal = representanteArray.find(item => item.RepresentanteId === representanteId);

            const fullRepresentanteData = {
                ID_Groot: representanteOriginal.ID_Groot || "",
                Nome: representanteOriginal.Nome || "",
                Matricula: representanteOriginal.Matricula || "",
                Turno: representanteOriginal.Turno || "",
                Escala_Padrao: representanteOriginal.Escala_Padrao || "",
                Cargo_Padrao: representanteOriginal.Cargo_Padrao || "",
                Area_Padrao: representanteOriginal.Area_Padrao || "",
                Empresa: representanteOriginal.Empresa || "",
                Status: representanteOriginal.Status || "",
                Turma: representanteOriginal.Turma || "",
                DATA: representanteOriginal.DATA || "",
                Presenca: representanteData.Presenca || representanteOriginal.Presenca || "",
                Justificativa: representanteData.Justificativa || representanteOriginal.Justificativa || ""
            };

            const dbRef = ref(db, `Historico/Chamada/${fullRepresentanteData.DATA}/${representanteId}`);
            const snapshot = await get(dbRef);

            if (snapshot.exists()) {
                const updatedData = {
                    ...snapshot.val(),
                    ...fullRepresentanteData
                };
                await set(dbRef, updatedData);
            } else {
                await set(dbRef, fullRepresentanteData);
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
            <SideBar />
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
                            <h2>Olá <span>{capitalizeName(searchNome)}</span>,&nbsp; Aqui está o relatório <span>ABS</span> da data <span>{formatDate(searchData)}</span> !</h2>
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
                                            {!viewOnly && <th>Validação</th>} {/* Exibe somente se não estiver em modo de visualização */}
                                            <th>Justificativa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredData.map((representante, index) => (
                                            <tr key={index}>
                                                <td>{representante.ID_Groot}</td>
                                                <td>{capitalizeName(representante.Nome)}</td>
                                                <td>{representante.Matricula}</td>
                                                <td>{representante.Turno}</td>
                                                <td>{representante.Escala_Padrao}</td>
                                                <td>{representante.Cargo_Padrao}</td>
                                                <td>{representante.Area_Padrao}</td>
                                                <td>{representante.Empresa}</td>
                                                <td>{representante.Status}</td>
                                                <td>{representante.Turma}</td>
                                                <td>{formatDate(representante.DATA)}</td>
                                                <td>{representante.Presenca}</td>
                                                <td>
                                                    {viewOnly ? (
                                                        representante.Justificativa || " "
                                                    ) : (
                                                        <select value={pendingChanges[representante.RepresentanteId]?.Presenca || representante.Presenca} onChange={(e) => handleStatusChange(representante.RepresentanteId, e.target.value)}>
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
                                                        <button onClick={() => addJustificativa(representante.RepresentanteId)}>Adicionar Justificativa</button>
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
