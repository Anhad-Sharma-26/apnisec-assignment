import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  return (
    <div className={styles.container}>
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.logo}>🔐 ApniSec</div>
          <Link href="/login" className={styles.loginBtn}>Login</Link>
        </div>
      </nav>

      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>Your Trusted Cybersecurity Partner</h1>
        <p className={styles.heroSubtitle}>
          Protect your digital assets with comprehensive security solutions. Cloud Security, VAPT, and Reteam Assessments all in one platform.
        </p>
        <div className={styles.ctaButtons}>
          <Link href="/register" className={styles.btnPrimary}>Get Started</Link>
          <Link href="/login" className={styles.btnSecondary}>Sign In</Link>
        </div>
      </section>

      <section className={styles.services}>
        <h2 className={styles.servicesTitle}>Our Services</h2>
        <div className={styles.servicesGrid}>
          
          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>☁️</div>
            <h3 className={styles.serviceTitle}>Cloud Security</h3>
            <p className={styles.serviceDesc}>
              Comprehensive cloud infrastructure security assessments and monitoring to protect your cloud assets.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>🔍</div>
            <h3 className={styles.serviceTitle}>VAPT Services</h3>
            <p className={styles.serviceDesc}>
              Vulnerability Assessment and Penetration Testing to identify and fix security weaknesses.
            </p>
          </div>

          <div className={styles.serviceCard}>
            <div className={styles.serviceIcon}>📊</div>
            <h3 className={styles.serviceTitle}>Reteam Assessment</h3>
            <p className={styles.serviceDesc}>
              Red team exercises to test your organization's detection and response capabilities.
            </p>
          </div>

        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLogo}>🔐 ApniSec</div>
        <p className={styles.footerText}>© 2024 ApniSec. All rights reserved.</p>
        <p className={styles.footerSubtext}>Professional Cybersecurity Solutions</p>
      </footer>
    </div>
  );
}