import axios from 'axios';

export const loginUser = async (email: FormDataEntryValue | null, password: FormDataEntryValue | null) => {
  try {
    // Send a POST request to your login endpoint with the user's credentials
    const response = await axios.post('http://127.0.0.1:5000/login', {
      email: email,
      password: password,
    });

    // Check if the status code is 2xx
    if (response.status == 200) {
      const token = response.data.api_token;
      localStorage.setItem('token', token);

      if (localStorage.getItem('token') == "undefined")
        throw new Error("Token not received");

      return token;
    } else {
      // Handle non-2xx status codes
      throw new Error(response.statusText); // You can also create a custom error message based on the response
    }

  } catch (error) {
    // Handle login errors (like incorrect credentials)
    
    throw error;
  }
};
