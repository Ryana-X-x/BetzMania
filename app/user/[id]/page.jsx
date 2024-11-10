'use client'
import { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../../../styles/Profile.module.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [amount, setAmount] = useState(0); // State to hold the amount

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem('token');
                const user = JSON.parse(localStorage.getItem('user'));

                if (!user || !user.id) {
                    setError('User ID is required');
                    return;
                }

                const response = await axios.get(`/api/user/${user.id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUser(response.data);
            } catch (err) {
                setError(err.response ? err.response.data.message : 'Failed to load user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleDeposit = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        const userId = user ? user.id : null;
    
        if (!userId) {
            console.error("User ID is undefined");
            alert("User ID is missing");
            return;
        }
    
        try {
            const response = await axios.post('/api/balance/deposit', { userId, amount }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            setUser(prevUser => ({ ...prevUser, balance: response.data.balance }));
            alert("Deposit successful!");
        } catch (error) {
            console.error("Deposit error:", error);
            alert("Failed to deposit");
        }
    };
   
    
    
    const handleWithdraw = async () => {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('token');
        const userId = user ? user.id : null;
        if (!user || !user.id) {
            alert("User ID is missing");
            return;
        }
        try {
            const response = await axios.post('/api/balance/withdraw', { userId: user.id, amount }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            setUser(prevUser => ({ ...prevUser, balance: response.data.balance }));
            alert("Withdrawal successful!");
        } catch (error) {
            alert(error.response ? error.response.data.message : "Failed to withdraw");
        }
    };
   
    

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className={styles.profileContainer}>
            <h1>User Profile</h1>
            <div className={styles.profileDetails}>
                <img src={user.profilePicture || "/default-avatar.png"} alt="Profile" />
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Balance:</strong> ${user.balance.toFixed(2)}</p>

                <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(parseFloat(e.target.value))}
                    placeholder="Enter amount"
                    className={styles.amountInput}
                />

                <div className={styles.buttonContainer}>
                    <button className={styles.depositButton} onClick={handleDeposit}>Deposit</button>
                    <button className={styles.withdrawButton} onClick={handleWithdraw}>Withdraw</button>
                </div>

                <p><strong>Account Created:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </div>
        </div>
    );
};

export default Profile;
