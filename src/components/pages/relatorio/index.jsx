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
    const [reportGenerated, setReportGenerated] = useState(false);
    const [pendingChanges, setPendingChanges] = useState({});

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
            // Obtenha todos os registros do histórico para a data selecionada
            if (searchData) {
                const historicoRef = ref(db, `Historico/Chamada/Representante/${searchData}`);
                const historicoSnapshot = await get(historicoRef);
                let historicoData = [];
                
                if (historicoSnapshot.exists()) {
                    historicoData = historicoSnapshot.val();
                    historicoData = Object.keys(historicoData).map(historicoId => ({
                        ...historicoData[historicoId],
                        RepresentanteId: historicoId,
                        DATA: searchData // Adicionando a data ao histórico
                    }));
                }
    
                // Combina os dados mais recentes com o histórico
                const combinedData = temporaryArray.map(item => {
                    const historicoItem = historicoData.find(h => h.RepresentanteId === item.RepresentanteId) || {};
                    return {
                        ...item,
                        ...historicoItem // Isso irá sobrepor dados do histórico se existirem
                    };
                });
    
                setRepresentanteArray(combinedData);
                applyFilters(combinedData);
            } else {
                setRepresentanteArray(temporaryArray);
                applyFilters(temporaryArray);
            }
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

    const handleStatusChange = (representanteId, newStatus) => {
        setPendingChanges(prev => ({
            ...prev,
            [representanteId]: {
                ...prev[representanteId],
                presenca: newStatus // Atualizando o campo correto
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
                    Justificativa: justificativa // Atualizando o campo correto
                }
            }));
        } else {
            alert("Nenhuma justificativa inserida.");
        }
    };

    const handleSave = async () => {
        const db = getDatabase(app);
    
        // Para cada representante que teve suas informações alteradas
        for (const representanteId in pendingChanges) {
            const representanteData = pendingChanges[representanteId];
            const representanteOriginal = representanteArray.find(item => item.RepresentanteId === representanteId); // Captura os dados originais do representante
            
            // Combina os dados originais com os dados alterados (caso haja)
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
                Presenca: representanteData.presenca || representanteOriginal.presenca || "", // Pega o valor alterado ou o original
                Justificativa: representanteData.Justificativa || representanteOriginal.Justificativa || "" // Pega o valor alterado ou o original
            };
    
            // Caminho para o histórico baseado na data e ID do representante
            const dbRef = ref(db, `Historico/Chamada/${fullRepresentanteData.DATA}/${representanteId}`);
            const snapshot = await get(dbRef);
    
            // Verifica se já existe registro para a data do representante
            if (snapshot.exists()) {
                // Se já existir, atualize todos os campos com os dados mais recentes
                const existingData = snapshot.val();
                const updatedData = {
                    ...existingData,
                    ...fullRepresentanteData, // Sobrescreve com os dados mais recentes
                };
                await set(dbRef, updatedData);
            } else {
                // Se não existir, crie um novo registro com todos os dados
                await set(dbRef, fullRepresentanteData);
            }
        }
    
        alert("Alterações salvas com sucesso!");
        setPendingChanges({});
        fetchData();
    };
    

    const capitalizeName = (name) => {
        return name
            .toLowerCase()
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    };

    const formatDate = (dateString) => {
        const [year, month, day] = dateString.split('-');
        return `${day}/${month}/${year}`;
    };

    const calculateColumnWidths = () => {
        const table = document.querySelector('.container-tabela table');
        if (table) {
            const columns = table.querySelectorAll('th');
            // Lógica para calcular e aplicar larguras
            columns.forEach(column => {
                column.style.width = `${Math.random() * 100}px`; // Exemplo de ajuste aleatório
            });
        }
    };

    useEffect(() => {
        if (reportGenerated) {
            calculateColumnWidths(); // Chama a função para calcular larguras
        }
    }, [reportGenerated]);

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
                        <input type="text" id="RETL" name="RETL" value={searchRE} onChange={(e) => setSearchRE(e.target.value)} placeholder="Digite seu RE" />

                        <label htmlFor="data">Data do relatório:</label>
                        <input type="date" id="data" name="data" value={searchData} onChange={(e) => setSearchData(e.target.value)} />

                        <button onClick={handleGenerateReport}>GERAR RELATÓRIO</button>

                        {reportGenerated && (
                            <button onClick={handleSave}>SALVAR</button>
                        )}
                    </div>

                    {reportGenerated && (
                        <>
                            <h2>Olá {capitalizeName(searchNome)},&nbsp; Aqui está o relatório <span>ABS</span> da sua equipe!</h2>

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
                                                    <td>{item.Matricula}</td> {/*RE*/}
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
                                                            <option value="Sinergia-Insumo">Sinergia Insumo</option>
                                                        </select>
                                                    </td>
                                                    <td>
                                                        <button onClick={() => addJustificativa(item.RepresentanteId)}>Adicionar Justificativa</button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="14">Nenhum registro encontrado.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
                <Footer />
            </main>
        </>
    );
};

export default RelatorioEUpdate;
