import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Heading from '@theme/Heading';
import styles from './projects.module.css';

export default function Projects() {
  const { siteConfig } = useDocusaurusContext();
  
  return (
    <Layout
      title="Projects"
      description="Projects page is currently under construction"
    >
      <main>
        <div className={styles.constructionContainer}>
          <div className={styles.constructionContent}>
            <div className={styles.constructionIcon}>
              🚧
            </div>
            <Heading as="h1" className={styles.constructionTitle}>
              Under Construction
            </Heading>
            <p className={styles.constructionSubtitle}>
              Check back soon!
            </p>
            <div className={styles.constructionActions}>
              <a 
                href="/docs/intro" 
                className={styles.constructionButton}
              >
                Explore Docs
              </a>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
