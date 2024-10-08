import React, { useState } from "react";
import app from "../../../firebaseConfig.jsx";
import { getDatabase, ref, get, remove } from "firebase/database";
import { useNavigate } from "react-router-dom";

const UpdateReaed = () => {
    const navigate = useNavigate();
    let [representanteArray, setRepresentanteArray] = useState([]);

    const fetchData = async () => {
        const db = getDatabase(app);
        const dbRef = ref(db, "Chamada/Representante");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
            const myData = snapshot.val();
            const temporaryArray = Object.keys(myData).map(myFireid => {
                return {
                    ...myData[myFireid],
                    RepresentanteId: myFireid // Mudamos para um nome mais apropriado
                };
            });
            setRepresentanteArray(temporaryArray); 
        } else {
            alert("Nenhum dado disponível");
        }
    };

    const deleteRepresentante = async (RepresentanteIdParam) => {
        const db = getDatabase(app);
        const dbRef = ref(db, `Chamada/Representante/${RepresentanteIdParam}`);
        await remove(dbRef);
        alert("Representante deletado");
        window.location.reload();
    };

    const updateData = () => {
        // Implementar a lógica de atualização aqui, se necessário
    };

    return (
        <>     
            <button onClick={fetchData}>Ver o que está salvo</button>
            <ul>
                {representanteArray.map((item, index) => (
                    <li key={index}>
                        {item.Nome} : {item.Cargo_Padrao} : {item.RepresentanteId} 
                        <button onClick={() => navigate(`/updatewrite/${item.RepresentanteId}`)}>Editar</button>
                        <button onClick={() => deleteRepresentante(item.RepresentanteId)}>Deletar</button>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default UpdateReaed;
