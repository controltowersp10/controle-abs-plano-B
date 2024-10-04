import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/pages/home";
import Relatorio from "./components/pages/relatorio";
import Sobre from "./components/pages/sobre"

const RoutesApp = () => {

    return(
        <BrowserRouter>
            <Routes>
                <Route path="/home" element={<Home/>}/>
                <Route path="/" element={<Relatorio/>}/>
                <Route path="/sobre" element={<Sobre/>}/>
            </Routes>
        </BrowserRouter>
    )

}

export default RoutesApp;