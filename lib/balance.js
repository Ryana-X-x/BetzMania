import axios from "axios";

export const deposit = async (userId, amount) => {
    const response = await axios.post('/api/balance/deposit', {userId, amount})
    return response.data.balance
}

export const withdraw = async (userId, amount) => {
    const response = await axios.post('/api/balance/withdraw', {userId, amount})
    return response.data.balance
}

export const getBalance = async (userId, amount) => {
    const response = await axios.post(`/api/balance?userId=${userId}`, {userId, amount})
    return response.data.balance
}