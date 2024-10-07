import React, { useState } from "react"
import app from "../../firebaseConfig.jsx"
import { getDatabase, ref, get} from "firebase/database"
import { Link } from "react-router-dom"

const Read = () => {

    let [fruitArray, setFruitArray] = useState([])

    const fetchData = async () => {
        const db = getDatabase(app)
        const dbRef = ref(db, "nature/fruits")
        const snapshot = await get(dbRef)
        if(snapshot.exists()) {
            setFruitArray(Object.values(snapshot.val())) // Corrigido de velues para values
        } else {
            alert("no data available")
        }
    }
    

    return(
        <>     
            <Link to="/">relatorio</Link>
            <br/> <br/> 
            <button onClick={fetchData}>ver oque esta salvo</button>
            <ul>
                {fruitArray.map( (item, index) => (
                    <li key={index}>
                        {item.FruitName}: {item.FruitDefinition}
                    </li>
                ))}
            </ul>
        </>
    )
}

export default Read