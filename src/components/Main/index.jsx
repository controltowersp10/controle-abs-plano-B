import "./estilo.css"

const Mainpage = () => {
    return(
        <>
            <div className="main">
                <div className="container-main"> 
                    <h1>Seja bem vindo ao controle de ABS <span>!</span></h1>

                    <p>
                        Essa ferramenta foi desenvolvida especificamente para otimizar o controle de absenteísmo dentro das nossas equipes. Tradicionalmente, esse controle era realizado de maneira manual, o que demandava tempo e resultava em processos repetitivos, especialmente para os gestores que precisam lidar com grandes equipes. Com a automação, buscamos simplificar esse fluxo, tornando-o mais eficiente e menos suscetível a erros. <br /><br />

                        A ferramenta funciona de maneira simples: ao inserir o RE do Team Leader <span>(TL)</span>, uma lista de presença é gerada automaticamente com todos os reps da equipe. Isso permite que o <span>TL</span> possa registrar rapidamente a presença ou ausência de cada colaborador, sem a necessidade de preencher planilhas repetidamente. Além disso, em caso de faltas, o sistema solicita uma justificativa, permitindo o registro das informações diretamente na plataforma.<br /><br />

                        Com essa abordagem, esperamos não só aumentar a produtividade dos gestores, mas também garantir que o controle de absenteísmo seja mais preciso e acessível. A centralização das informações facilita a análise dos dados e a tomada de decisões, além de oferecer uma experiência mais fluida para os usuários que lidam com a gestão de pessoas diariamente.
                    </p>
                </div>
            </div>
            
        </>
    )
}

export default Mainpage;