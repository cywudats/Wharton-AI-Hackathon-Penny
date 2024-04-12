import axios from 'axios';



async function uploadMessage(user_id, message) {
  try {
    const response = await axios.post(
      `http://127.0.0.1:8000/chatbot/?user_id=${user_id}`,
      { message },
      {
        headers: {
          'Content-Type': 'application/json'
          // Add additional headers if needed
        }
      }
    );

    if (!response.data) {
      throw new Error('No response from server');
    }

    return response.data.message;
  } catch (error) {
    console.error('Error uploading message:', error);
    throw error;
  }
}

export default { uploadMessage };