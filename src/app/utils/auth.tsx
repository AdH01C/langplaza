import axios from 'axios';
import { useEffect } from 'react';

let token;
const auth_url = 'http://127.0.0.1:30000';
const room_url = 'http://127.0.0.1:3003';

const setTokenOnClient = () => {
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }
  }
};

setTokenOnClient();

export const loginUser = async (email: FormDataEntryValue | null, password: FormDataEntryValue | null) => {
  try {
    // Send a POST request to your login endpoint with the user's credentials
    const response = await axios.post(auth_url + "/login", {
      email: email,
      password: password,
    });

    // Check if the status code is 2xx
    if (response.status == 200) {
      const token = response.data.api_token;
      localStorage.setItem('token', token);
      localStorage.setItem('user_id', response.data.id);

      if (localStorage.getItem('token') == "undefined")
        throw new Error("Token not received");

      return token;
    } else {
      // Handle non-2xx status codes
      throw new Error(response.data.message); // You can also create a custom error message based on the response
    }

  } catch (error) {
    // Handle login errors (like incorrect credentials)
    throw error;
  }
};
export const logoutUser = async () => {
    try {
        // Send a POST request to your logout endpoint
        const response = await axios.patch(auth_url + "/logout", {
            // Pass in the token in the request body
            Authorization: localStorage.getItem('token'),
        });

        // Check if the status code is 2xx
        if (response.status >= 200 && response.status < 300) {
            localStorage.removeItem('token');
            return true;

        } else {
            // Handle non-2xx status codes
            throw new Error(response.data.message);
        }

    } catch (error) {
        // Handle logout errors
        throw error;
    }

};
export const startChat = async (userId: any, language: any) => {
  try {
    const response = await axios.post(room_url + '/room/start', {
        "user": userId,
        "language": language
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data; // Adjust this based on your backend's response
    } else {
      throw new Error(response.data.message);
    }

  } catch (error) {
    console.error('Start chat room error:', error);
    throw error;
  }
};

export const signUpUser = async (email: any, name: any, password1: any, password2: any) => {
  try {
    const response = await axios.post(auth_url + '/sign-up', {
      email: email,
      name: name,
      password1: password1,
      password2: password2,
      verified: 0,
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }

  } catch (error) {
    console.error('Sign-up error:', error);
    throw error;
  }
};
