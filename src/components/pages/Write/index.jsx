import React, { useState } from "react";
import app from "../../../firebaseConfig.jsx";
import { getDatabase, ref, set, push } from "firebase/database";
import { Link } from "react-router-dom";

const Write = () => {
    // Definindo estados para todos os campos que precisam ser salvos
    const [areaPadrao, setAreaPadrao] = useState("");
    const [clockOutMax, setClockOutMax] = useState("");
    const [cargoPadrao, setCargoPadrao] = useState("");
    const [data, setData] = useState("");
    const [empresa, setEmpresa] = useState("");
    const [escalaPadrao, setEscalaPadrao] = useState("");
    const [idGroot, setIdGroot] = useState("");
    const [matricula, setMatricula] = useState("");
    const [nome, setNome] = useState("");
    const [status, setStatus] = useState("");
    const [teamLeader, setTeamLeader] = useState("");
    const [turma, setTurma] = useState("");
    const [turno, setTurno] = useState("");

    const savedata = async () => {
        const db = getDatabase(app);
        const newDocRef = push(ref(db, "Chamada/Representante")); // Certifique-se de que a referência está correta
        set(newDocRef, {
            Area_Padrao: areaPadrao,
            CLOCK_OUT_MAX: clockOutMax,
            Cargo_Padrao: cargoPadrao,
            DATA: data,
            Empresa: empresa,
            Escala_Padrao: escalaPadrao,
            ID_Groot: idGroot,
            Matricula: matricula,
            Nome: nome,
            Status: status,
            Team_Leader: teamLeader,
            Turma: turma,
            Turno: turno
        })
        .then(() => {
            alert("Seus dados foram salvos com sucesso!");
        })
        .catch((error) => {
            alert("Error: " + error.message);
        });
    };

    return (
        <>
            <input type="text" value={areaPadrao} placeholder="Área Padrão" onChange={(e) => setAreaPadrao(e.target.value)} />
            <input type="text" value={clockOutMax} placeholder="Clock Out Max" onChange={(e) => setClockOutMax(e.target.value)} />
            <input type="text" value={cargoPadrao} placeholder="Cargo Padrão" onChange={(e) => setCargoPadrao(e.target.value)} />
            <input type="date" value={data} placeholder="Data" onChange={(e) => setData(e.target.value)} />
            <input type="text" value={empresa} placeholder="Empresa" onChange={(e) => setEmpresa(e.target.value)} />
            <input type="text" value={escalaPadrao} placeholder="Escala Padrão" onChange={(e) => setEscalaPadrao(e.target.value)} />
            <input type="text" value={idGroot} placeholder="ID Groot" onChange={(e) => setIdGroot(e.target.value)} />
            <input type="text" value={matricula} placeholder="Matrícula" onChange={(e) => setMatricula(e.target.value)} />
            <input type="text" value={nome} placeholder="Nome" onChange={(e) => setNome(e.target.value)} />
            <input type="text" value={status} placeholder="Status" onChange={(e) => setStatus(e.target.value)} />
            <input type="text" value={teamLeader} placeholder="Team Leader" onChange={(e) => setTeamLeader(e.target.value)} />
            <input type="text" value={turma} placeholder="Turma" onChange={(e) => setTurma(e.target.value)} />
            <input type="text" value={turno} placeholder="Turno" onChange={(e) => setTurno(e.target.value)} />
            <br />
            <button onClick={savedata}>Salvar Dados</button>
            <br /> <br />
            <Link to="/">Relatório</Link>
        </>
    );
};

export default Write;
