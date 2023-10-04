// utils/signUp.js
import axios from 'axios';

export const signUpUser = async (email: any, username: any, password1: any, password2: any) => {
  try {
    const response = await axios.post('http://127.0.0.1:5000/sign-up', {
      email: email,
      username: username,
      password1: password1,
      password2: password2,

    });

    if (response.status >= 200 && response.status < 300) {
      return response.data; // Adjust this based on your backend's response
    } else {
      throw new Error(response.statusText);
    }

  } catch (error) {
    console.error('Sign-up error:', error);
    throw error;
  }
};
