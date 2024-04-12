import axios from 'axios';
    

async function getUserReceipts(userId) {
    try {
        const response = await axios.get(`http://127.0.0.1:8000/receipt/?user_id=${userId}`, {
            headers: {
                'Content-Type': 'application/json'
                // Add additional headers if needed
            }
        });

        if (!response.data) {
            throw new Error('User not found');
        }

        return response.data;
    } catch (error) {
        // Handle fetch errors
        console.error('Error fetching user:', error.message);
        // Optionally, rethrow the error to let the caller handle it
        throw error;
    }
}

async function createReceipts(user_id, amount, sub_category, main_category, time, imageFile) {
    try {
        const receiptData = {
            'user_id': user_id,
            'amount': amount,
            'sub_category': sub_category,
            'main_category': main_category,
            'time': time,
            'image': imageFile,
        }
        // receiptData.append('user_id', user_id);
        // receiptData.append('amount', amount);
        // receiptData.append('sub_category', sub_category);
        // receiptData.append('main_category', main_category);
        // receiptData.append('time', time);
        // receiptData.append('image', imageFile);


        const response = await axios.post('http://127.0.0.1:8000/receipt/confirm', receiptData, {
            headers: {
                'Content-Type': 'application/json'
                // Add additional headers if needed
            }
        });

        if (!response.data) {
            throw new Error('Failed to create receipt');
        }

        return response.data;
    } catch (error) {
        // Handle fetch errors
        console.error('Error creating receipt:', error.message);
        // Optionally, rethrow the error to let the caller handle it
        throw error;
    }
}


async function uploadReceipts(user_id, imageFile) {
    try {
        const formData = new FormData();
        formData.append('user_id', user_id);
        formData.append('image', imageFile);

        const response = await axios.post(`http://127.0.0.1:8000/receipt/upload/?user_id=${user_id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        if (!response.data) {
            throw new Error('Failed to upload receipt');
        }

        return response.data;
    } catch (error) {
        // Handle fetch errors
        console.error('Error uploading receipt:', error.message);
        // Optionally, rethrow the error to let the caller handle it
        throw error;
    }
}

export default {getUserReceipts, createReceipts, uploadReceipts};
