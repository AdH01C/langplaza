// START CHAT
import axios from 'axios';

// axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
// axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
// axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';


export const startChat = async (username: any, language: any) => {
  try {
    const response = await axios.post('http://127.0.0.1:3003/room/start', {
        "user": username,
        "language": language
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data; // Adjust this based on your backend's response
    } else {
      throw new Error(response.statusText);
    }

  } catch (error) {
    console.error('Start chat room error:', error);
    throw error;
  }
};
