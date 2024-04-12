import axios from 'axios';
    
async function loginUser(email, password) {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/user/login/?email=${email}&password=${password}`);
        
        if (!response.data) {
            throw new Error('Failed to login');
        }
        
        return response.data;
    } catch (error) {
        // Handle fetch errors
        console.error('Error logging in:', error.message);
        // Optionally, rethrow the error to let the caller handle it
        throw error;
    }
}

async function createUser(userData) {
    try {
        const response = await axios.post('http://127.0.0.1:8000/register_user/', userData);
        
        if (!response.data) {
            throw new Error('Failed to create user');
        }
        
        return response.data;
    } catch (error) {
        // Handle fetch errors
        console.error('Error creating user:', error.message);
        // Optionally, rethrow the error to let the caller handle it
        throw error;
    }
}

export default {loginUser, createUser};