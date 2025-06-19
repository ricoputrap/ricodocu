import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import styles from './projects.module.css';

interface Project {
  title: string;
  description: string;
  technologies: string[];
  status: 'Completed' | 'In Progress' | 'Planning';
  githubUrl?: string;
  liveUrl?: string;
  image?: string;
}

const projects: Project[] = [
  {
    title: 'Todolist App',
    description: 'A simple client-side rendered todo list application built with vanilla HTML, CSS, and JavaScript. Features task categorization, local storage persistence, and mobile-responsive design.',
    technologies: ['HTML5', 'Tailwind CSS', 'JavaScript', 'Local Storage'],
    status: 'Completed',
    githubUrl: 'https://github.com/ricoputrap/todolist',
    liveUrl: 'https://todolist.ricoputra.dev/',
    image: 'https://ricoputra.dev/projects/todolist.png'
  },
  {
    title: 'Rico Documentation Hub',
    description: 'A comprehensive documentation site built with Docusaurus for sharing knowledge across programming, finance, and technology domains.',
    technologies: ['Docusaurus', 'React', 'TypeScript', 'Markdown'],
    status: 'In Progress',
    githubUrl: 'https://github.com/yourusername/ricodocu',
    image: '/img/docusaurus.png'
  },
  // Add more projects here as they become available
];

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className={styles.projectCard}>
      {project.image && (
        <div className={styles.projectImage}>
          <img src={project.image} alt={project.title} />
        </div>
      )}
      <div className={styles.projectContent}>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        
        <div className={styles.technologies}>
          {project.technologies.map((tech) => (
            <span key={tech} className={styles.techTag}>
              {tech}
            </span>
          ))}
        </div>
        
        <div className={styles.projectMeta}>
          <span className={`${styles.status} ${styles[project.status.toLowerCase().replace(' ', '')]}`}>
            {project.status}
          </span>
        </div>
        
        <div className={styles.projectLinks}>
          {project.githubUrl && (
            <a 
              href={project.githubUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a 
              href={project.liveUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.projectLink}
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { siteConfig } = useDocusaurusContext();
  
  return (
    <Layout
      title="Projects"
      description="Explore my projects and work across various technologies and domains"
    >
      <main>
        <div className={styles.projectsContainer}>
          <div className={styles.projectsHero}>
            <Heading as="h1">My Projects</Heading>
            <p>
              Here's a collection of projects I've worked on, ranging from web applications 
              to documentation sites and experimental tools. Each project represents a learning 
              journey and exploration of different technologies and concepts.
            </p>
          </div>
          
          <div className={styles.projectsContent}>
            <div className={styles.projectsGrid}>
              {projects.length > 0 ? (
                projects.map((project, index) => (
                  <ProjectCard key={`project-${index}`} project={project} />
                ))
              ) : (
                <div className={styles.emptyState}>
                  <h3>Projects Coming Soon!</h3>
                  <p>I'm currently working on several exciting projects. Check back soon to see my latest work!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
