import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/home";
import Relatorio from "./components/pages/relatorio";
import Sobre from "./components/pages/sobre"
import Write from "./components/Write"; 

const RoutesApp = () => {

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home/>}/>
                <Route path="/" element={<Relatorio/>}/>
                <Route path="/sobre" element={<Sobre/>}/>
                <Route path="/write" element={<Write/>}/>
            </Routes>
        </BrowserRouter>
    )

}

export default RoutesApp;