"use client"
import Link from 'next/link';
import styles from '../styles/footer.module.css'

const Footer = () => {
    return (
        <div className={styles.footerContainer}>
            <div className={styles.footerContent}>
                <div className={styles.left}>
                    <h3>BetzMania</h3>
                    <p>&copy; 2024 BetzMania. All rights reserved.</p>
                </div>
                <div className={styles.right}>
                    <Link href="/aboutUs" className={styles.footerLink}>About Us</Link>
                    <Link href="/contact" className={styles.footerLink}>Contact</Link>
                    <Link href="/privacy" className={styles.footerLink}>Privacy Policy</Link>
                    <Link href="/terms" className={styles.footerLink}>Terms of Service</Link>
                </div>
            </div>
        </div>
    );
};

export default Footer;
