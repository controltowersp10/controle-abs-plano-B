import React, { useState } from "react"
import app from "../../../firebaseConfig.jsx"
import { getDatabase, ref, get, remove} from "firebase/database"
import { useNavigate } from "react-router-dom"

const UpdateReaed = () => {
    const navigate = useNavigate()
    let [fruitArray, setFruitArray] = useState([])

    const fetchData = async () => {
        const db = getDatabase(app)
        const dbRef = ref(db, "nature/fruits")
        const snapshot = await get(dbRef)
        if (snapshot.exists()) {
            const myData = snapshot.val()
            const temporaryArray = Object.keys(myData).map(myFireid => {
                return {
                    ...myData[myFireid],
                    Fruitid: myFireid
                }
            })
            setFruitArray(temporaryArray) 
        } else {
            alert("no data available")
        }
    }

    const deleteFruit = async (FruitidParam) => {
        const db = getDatabase(app)
        const dbRef = ref(db, `nature/fruits/${FruitidParam}`)
        await remove(dbRef)
        alert("fruit deleted")
        window.location.reload()
    }

    const updateData = () => {

    }
    return (
        <>     
            <button onClick={fetchData}>ver oque esta salvo</button>
            <ul>
                {fruitArray.map((item, index) => (
                    <li key={index}>
                        {item.FruitName} : {item.FruitDefinition} : {item.Fruitid}
                        <button onClick={() => navigate(`/updatewrite/${item.Fruitid}`)}>editar</button>
                        <button onClick={() => deleteFruit(item.Fruitid)}>deletar</button>
                    </li>
                ))}
            </ul>
        </>
    )
}

export default UpdateReaed
