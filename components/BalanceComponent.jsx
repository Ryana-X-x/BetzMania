"use client"
import { useState, useEffect } from "react"
import { deposit, withdraw, getBalance } from "@/lib/balance"

const BalanceComponent = ({ userId }) => {
    const [balance, setBalance] = useState(0);
  
    // Fetch initial balance when the component loads
    const fetchBalance = async () => {
      try {
        const initialBalance = await getBalance(userId);
        setBalance(initialBalance);
      } catch (error) {
        console.error("Failed to fetch balance:", error);
      }
    };
  
    // Handle deposit operation
    const handleDeposit = async () => {
      try {
        const updatedBalance = await deposit(userId, 100); // Example amount
        setBalance(updatedBalance); // Update balance state
      } catch (error) {
        console.error("Deposit failed:", error);
      }
    };
  
    // Handle withdraw operation
    const handleWithdraw = async () => {
      try {
        const updatedBalance = await withdraw(userId, 50); // Example amount
        setBalance(updatedBalance); // Update balance state
      } catch (error) {
        console.error("Withdraw failed:", error);
      }
    };
  
    // Initial fetch for balance when component mounts
    useEffect(() => {
      fetchBalance();
    }, []);
  
    return (
      <div>
        <h3>Balance: ${balance}</h3>
        <button onClick={handleDeposit}>Deposit $100</button>
        <button onClick={handleWithdraw}>Withdraw $50</button>
      </div>
    );
  };
  
  export default BalanceComponent;