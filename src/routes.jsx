import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/home";
import Relatorio from "./components/pages/relatorio";
import Sobre from "./components/pages/sobre"
import Write from "./components/pages/Write"; 
import Read from "./components/pages/Read";
import UpdateRead from "./components/pages/UpdateRead";
import UpdateWrite from "./components/pages/UpdateWrite";

const RoutesApp = () => {

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
            </Routes>
        </BrowserRouter>
    )

}

export default RoutesApp;