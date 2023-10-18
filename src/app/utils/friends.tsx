import axios from 'axios';

let token;
const baseUrl = 'http://127.0.0.1:30000';  // Base URL of your Flask server

const setTokenOnClient = () => {
    if (typeof window !== 'undefined') {
        token = localStorage.getItem('token');
        if (token) {
        axios.defaults.headers.common['Authorization'] = token;
        }
}
};

setTokenOnClient();

export const getAllFriends = async (userId: any) => {
  try {
    const response = await axios.get(`${baseUrl}/user/${userId}/friends`);

    if (response.status === 200) {
      return response.data.data.friends;
    } else {
      throw new Error(response.data.message);
    }

  } catch (error) {
    console.error('Get all friends error:', error);
    throw error;
  }
};

export const addFriend = async (userId: any, friendId: any) => {
  try {
    const response = await axios.post(`${baseUrl}/user/${userId}/add_friend/${friendId}`);

    if (response.status === 200) {
      return response.data.message;
    } else {
      throw new Error(response.data.message);
    }

  } catch (error) {
    console.error('Add friend error:', error);
    throw error;
  }
};

export const removeFriend = async (userId: any, friendId: any) => {
  try {
    const response = await axios.delete(`${baseUrl}/user/${userId}/remove_friend/${friendId}`);

    if (response.status === 200) {
      return response.data.message;
    } else {
      throw new Error(response.data.message);
    }

  } catch (error) {
    console.error('Remove friend error:', error);
    throw error;
  }
};

export const getSentRequests = async (userId: any) => {
  try {
    const response = await axios.get(`${baseUrl}/user/${userId}/sent_requests`);

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }

  } catch (error) {
    console.error('Get sent requests error:', error);
    throw error;
  }
};

export const getReceivedRequests = async (userId: any) => {
  try {
    const response = await axios.get(`${baseUrl}/user/${userId}/received_requests`);

    if (response.status === 200) {
      return response.data.data;
    } else {
      throw new Error(response.data.message);
    }

  } catch (error) {
    console.error('Get received requests error:', error);
    throw error;
  }
};

export const addRequest = async (user_id :string |  null, target_user_id: number, friendRequestMessage: string) => {
  try {
    const data = {
      "request_status": "pending",
      "request_message": friendRequestMessage,
      "user_id": user_id,
      "target_user_id": target_user_id,
    };
    
    const response = await axios.post(`${baseUrl}/request`, data);
    

    if (response.status === 201) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }

  } catch (error) {
    console.error('Add request error:', error);
    throw error;
  }
};

export const updateRequestStatus = async (requestId: any, status: any) => {
  try {
    const response = await axios.patch(`${baseUrl}/request/${requestId}`, {
      request_status: status
    });

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(response.data.message);
    }

  } catch (error) {
    console.error('Update request status error:', error);
    throw error;
  }
};

export const isFriend = async (userId: any, friendId: any) => {
    try{
        const allFriends = await getAllFriends(userId);
        return allFriends.includes(friendId);
    } catch (error) {
        console.error('Check if friend error:', error);
        throw error;
    }
}

export const hasSentRequest = async (userId: any, friendId: any) => {
    try{
        const sentRequests = await getSentRequests(userId);
        return sentRequests.includes(friendId);
    } catch (error) {
        console.error('Check if sent request error:', error);
        throw error;
    }
}

export const getUser = async (userId: any) => {
    try {
        const response = await axios.get(`${baseUrl}/user/${userId}`);
        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error(response.data.message);
        }
    } catch (error) {
        console.error('Get user error:', error);
        throw error;
    }
}
