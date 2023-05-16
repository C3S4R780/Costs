import styles from './Home.module.css'
import savings from '../../img/savings.svg'
import LinkButton from '../layout/LinkButton'
import { useEffect, useState } from 'react'

function Home() {
  const [projects, setProjects] = useState({})
  useEffect(() => {
    fetch("http://localhost:5000/projects", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(resp => resp.json())
    .then(data => setProjects(data))
    .catch(err => console.log(err))
  }, [])
  return (
    <section className={styles.home_container}>
      <h1>Bem-vindo ao <span>Costs</span></h1>
      <p>Comece a gerenciar seus projetos agora mesmo!</p>
      <div className={styles.home_buttons}>
        <LinkButton to="/newproject" text="Criar projeto" />
        {projects.length > 0 && (
          <LinkButton to="/projects" text="Gerenciar projetos"/>
        )}
      </div>
      <img src={savings} alt="Costs" />
    </section>
  )
}

export default Home