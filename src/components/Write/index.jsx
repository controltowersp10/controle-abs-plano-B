import React, { useState } from "react"
import app from "../../firebaseConfig.jsx"
import { getDatabase, ref, set, push } from "firebase/database"

const Write = () => {

    let [inputValue1, setInputValue1] = useState("")
    let [inputValue2, setInputValue2] = useState("")

    const savedata = async () => {
        const db = getDatabase(app) // Certifique-se de que app está inicializado corretamente com a URL raiz
        const newDocRef = push(ref(db, "nature/fruits")) // "nature/fruits" está correto
        set(newDocRef, {
            FruitName: inputValue1,
            FruitDefinition: inputValue2
        }).then(() => {
            alert("Data saved")
        }).catch((error) => {
            alert("Error: " + error.message)
        })
    }
    
    return(
        <>
            <input type="text" value={inputValue1} onChange={(e) => setInputValue1(e.target.value)}/>
            <input type="text" value={inputValue2} onChange={(e) => setInputValue2(e.target.value)}/>
            <br/>
            <button onClick={savedata}>Save Data</button>
        </>
    )
}

export default Write