import React, { useState, useEffect } from "react"
import app from "../../../firebaseConfig.jsx"
import { getDatabase, ref, set, get } from "firebase/database"
import { Link } from "react-router-dom"
import { useNavigate, useParams } from "react-router-dom"

const UpdateWrite = () => {
    const navigate = useNavigate()
    const { firebaseid } = useParams() // Correção: usa chaves para desestruturar o parâmetro

    let [inputValue1, setInputValue1] = useState("")
    let [inputValue2, setInputValue2] = useState("")

    useEffect(() => {
      const fetchData = async () => {
        const db = getDatabase(app)
        const dbRef = ref(db, `nature/fruits/${firebaseid}`)
        const snapshot = await get(dbRef)
            if (snapshot.exists()) {
                const targetObject = snapshot.val()
                setInputValue1(targetObject.FruitName)
                setInputValue2(targetObject.FruitDefinition)
            } else {
                alert("no data available")
            }
        }
        fetchData()
    }, [firebaseid])

    const overwriteData = async () => {
        const db = getDatabase(app) // Certifique-se de que app está inicializado corretamente com a URL raiz
        const newDocRef = ref(db, `nature/fruits/${firebaseid}`)
        set(newDocRef, {
            FruitName: inputValue1,
            FruitDefinition: inputValue2
        }).then(() => {
            alert("seus dados foram salvos com sucesso !!!!!")
        }).catch((error) => {
            alert("Error: " + error.message)
        })
    }
    
    return (
        <>
            <h1>update</h1>
            <input type="text" value={inputValue1} onChange={(e) => setInputValue1(e.target.value)} />
            <input type="text" value={inputValue2} onChange={(e) => setInputValue2(e.target.value)} />
            <br />
            <button onClick={overwriteData}>update</button>
            <br /> <br />
            <Link to="/">relatorio</Link>
        </>
    )
}

export default UpdateWrite
