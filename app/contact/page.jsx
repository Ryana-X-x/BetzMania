// app/contact/page.js
"use client";

import styles from '../../styles/about.module.css'; // Reusing the same CSS file

const ContactUs = () => {
    return (
        <div className={styles.aboutContainer}>
            <h1>Contact Us</h1>
            <p>
                Have questions, feedback, or need assistance? We’d love to hear from you!
            </p>
            <form className={styles.contactForm}>
                <label htmlFor="name">Name:</label>
                <input type="text" id="name" name="name" required />

                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="message">Message:</label>
                <textarea id="message" name="message" rows="4" required></textarea>

                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default ContactUs;
