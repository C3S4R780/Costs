import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import styles from "./Project.module.css"

import Loading from "../layout/Loading"
import Container from "../layout/Container"
import Message from "../layout/Message"
import ProjectForm from "../project/ProjectForm"
import ServiceForm from "../service/ServiceForm"
import ServiceCard from "../service/ServiceCard"

function Project() {
    const id = useParams().id
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()

    useEffect(() => {
        fetch(`http://localhost:5000/projects/${id}`, {
            method: "GET",
            headers: {
                "Content-Type" : "application/json"
            }
        })
        .then(resp => resp.json())
        .then(data => {
            setProject(data)
            setServices(data.services)
        })
        .catch(err => console.log(err))
    }, [id])

    function editPost(project) {
        if (project.budget < project.cost) {
            setMessage("O orçamento não pode ser menor que o custo do projeto!")
            setType("error")
            setTimeout(() => setMessage(""), 3000);
            return false
        }
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(project)
        })
        .then(resp => resp.json())
        .then(data => {
            setProject(data)
            setShowProjectForm(false)
            setMessage("Projeto atualizado!")
            setType("success")
        })
        .catch(err => console.log(err))

        setTimeout(() => setMessage(""), 3000);
    }

    function createService(project) {
        setMessage("")

        const lastService = project.services[project.services.length - 1]
        lastService.id = uuidv4()

        const lastServiceCost = lastService.cost
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)

        if (newCost > parseFloat(project.budget)) {
            setMessage("Orçamento ultrapassado, verifique o valor do serviço")
            setType("error")
            project.services.pop()
            return false
        }

        project.cost = newCost

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(project)
        })
        .then(resp => resp.json())
        .then(data => {
            setProject(data)
            setServices(data.services)
            setShowServiceForm(false)
            setMessage("Serviço adicionado com sucesso!")
            setType("success")
        })
        .catch(err => console.log(err))
    }

    function removeService(id, cost) {
        setMessage("")

        const servicesUpdate = project.services.filter(
            service => service.id !== id
        )

        const projectUpdated = project
        projectUpdated.services = servicesUpdate
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)

        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(projectUpdated)
        })
        .then(resp => resp.json())
        .then(data => {
            setProject(projectUpdated)
            setServices(servicesUpdate)
            setMessage("Serviço removido com sucesso!")
            setType("success")
        })
        .catch(err => console.log(err))
    }

    const toggleProjectForm = () => setShowProjectForm(!showProjectForm)
    const toggleServiceForm = () => setShowServiceForm(!showServiceForm)

    return (
        <>
            {project.id ? (
                <div className={styles.project_details}>
                    <Container customClass="column">
                        {message && <Message type={type} msg={message}/>}
                        <div className={styles.details_container}>
                            <h1>{project.name}</h1>
                            <button onClick={toggleProjectForm} className={styles.btn}>
                                {!showProjectForm ? "Editar projeto" : "Fechar"}
                            </button>
                            {!showProjectForm ? (
                                <div className={styles.project_info}>
                                    <p>
                                        <span>Categoria:</span> {project.category.name}
                                    </p>
                                    <p>
                                        <span>Total de Orçamento:</span> R${project.budget}
                                    </p>
                                    <p>
                                        <span>Total Utilizado:</span> R${project.cost}
                                    </p>
                                    {project.cost > 0 && (
                                        <p>
                                            <span>Orçamento restante:</span> R${project.budget - project.cost}
                                        </p>
                                    )}
                                </div>
                                ) : (
                                <div className={styles.project_info}>
                                    <ProjectForm
                                        handleSubmit={editPost}
                                        btnText="Concluir edição"
                                        projectData={project}
                                    />
                                </div>
                            )}
                        </div>
                        <div className={styles.service_form_container}>
                            <h2>{showServiceForm ? "Novo serviço" : "Serviços"}</h2>
                            <button onClick={toggleServiceForm} className={styles.btn}>
                                {!showServiceForm ? "Adicionar serviço" : "Fechar"}
                            </button>
                            <div className={styles.project_info}>
                                {showServiceForm && <ServiceForm
                                    handleSubmit={createService}
                                    btnText="Adicionar serviço"
                                    projectData={project}
                                />}
                            </div>
                        </div>
                        {!showServiceForm && (
                            <div className={styles.service_list}>
                                {services.length > 0 ? (
                                    services.map(service => (
                                        <ServiceCard
                                            key={service.id}
                                            id={service.id}
                                            name={service.name}
                                            cost={service.cost}
                                            description={service.description}
                                            handleRemove={removeService}
                                        />
                                    ))
                                ) : (
                                    <p>Nenhum serviço cadastrado.</p>
                                )}
                            </div>
                        )}
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    )
}

export default Project