import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/home";
import Relatorio from "./components/pages/relatorio";
import Sobre from "./components/pages/sobre"
import Write from "./components/pages/Write"; 
import Read from "./components/pages/Read";
import UpdateRead from "./components/pages/UpdateRead";
import UpdateWrite from "./components/pages/UpdateWrite";
import DashABS from "./components/pages/DashABS";
import Error404 from './components/pages/Error404'
import Error404Alternate from './components/pages/Error404Alternate' // Importe a segunda página 404
const RoutesApp = () => {
    const random404 = Math.random() < 0.5 ? <Error404 /> : <Error404Alternate />

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>}/>
                <Route path="/relatorio" element={<Relatorio/>}/>
                <Route path="/sobre" element={<Sobre/>}/>
                <Route path="/write" element={<Write/>}/>
                <Route path="/read" element={<Read/>}/>
                <Route path="/updatewrite/:firebaseid" element={<UpdateWrite/>}/>
                <Route path="/updateread" element={<UpdateRead/>}/>
                <Route path="/dashABS" element={<DashABS/>}/>
            </Routes>
        </BrowserRouter>
    )

}

export default RoutesApp;