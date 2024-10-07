import React from "react"
import app from "../firebase.jsx"
import { getDatabase, ref, set, push } from "firebase/database"


const Write = () => {


    let [inputValue1, setInputValue1]= useState("")
    let [inputValue2, setInputValue2]= useState("")
    const savedata = () => {
        const db =getDatabase(app)
        const newDocRef = push(ref(db, "nature/fruits"))
        set(newDocRef, {
            FruitName: inputValue1,
            FruitDefinition: inputValue2
        }).then( ()=> {
            alert("Data saved")
        }).catch((error) => {
            alert("Error", error)
        })
    }
    return(
        <>
            <input type="text" value={inputValue1} onChange={() => setInputValue1(e.target.value)}/>
            <input type="text" value={inputValue2} onChange={() => setInputValue2(e.target.value)}/>
            <br/>
            <button onclick={savedata}>Save Data</button>
        </>
    )
}

export default Write