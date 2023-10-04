import axios from 'axios';

export const logoutUser = async () => {
    try {
        // Send a POST request to your logout endpoint
        const response = await axios.patch('http://127.0.0.1:5000/logout', {
            // Pass in the token in the request body
            Authorization: localStorage.getItem('token'),
        });

        // Check if the status code is 2xx
        if (response.status >= 200 && response.status < 300) {
            localStorage.removeItem('token');
            return true;

        } else {
            // Handle non-2xx status codes
            throw new Error(response.statusText); // You can also create a custom error message based on the response
        }

    } catch (error) {
        // Handle logout errors
        throw error;
    }

}

