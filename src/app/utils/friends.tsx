"use client";

import axios, { AxiosHeaders } from 'axios';

let token: string | number | boolean | AxiosHeaders | string[] | null | undefined;

const authUrl = process.env.NEXT_PUBLIC_AUTH_URL;
const roomsUrl = process.env.NEXT_PUBLIC_ROOMS_URL;
const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL as string;


const setTokenOnClient = () => {
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = token;
    }
  }
};

setTokenOnClient();

// export const getAllFriends = async (userId: any) => {
//   try {
//     const response = await axios.get(`${authUrl}/user/${userId}/friends`);
//     console.log(response.data);
//     if (response.status === 200) {
//       return response.data.data.friends;
//     } else {
//       throw new Error(response.data.message);
//     }

//   } catch (error) {
//     console.error('Get all friends error:', error);
//     throw error;
//   }
// };

export const getAllFriendsGQL = async (userId: any) => {
  try {
    const GET_FRIENDLIST_MUTATION = `{
        getFriendList(token: "${token}", id: ${userId}) {
          name
          email
          id
          subscribed
          verified
        }
      }
    `;

    const graphqlQuery = {
      query: GET_FRIENDLIST_MUTATION,
    };

    const response = await axios.post(graphqlUrl, {
      query: graphqlQuery.query
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(response.data.data.getFriendList);
      return response.data.data.getFriendList;
    } else {
      throw new Error(`Received status code ${response.status}`);
    }
  } catch (error) {
    console.error('Get all friends error:', error);
    throw error;
  }
}

// export const addFriend = async (userId: any, friendId: any) => {
//   try {
//     const response = await axios.post(`${authUrl}/user/${userId}/add_friend/${friendId}`);

//     if (response.status === 200) {
//       return response.data.message;
//     } else {
//       throw new Error(response.data.message);
//     }

//   } catch (error) {
//     console.error('Add friend error:', error);
//     throw error;
//   }
// };

export const addFriendGQL = async (userId: any, friendId: any) => {
  try {
    const ADD_FRIEND_MUTATION = `{
        addFriend(token: "${token}", id: ${userId}, friendId: ${friendId}) {
          status
          message
        }
      }
    `;

    const graphqlQuery = {
      query: ADD_FRIEND_MUTATION,
    };

    const response = await axios.post(graphqlUrl, {
      query: graphqlQuery.query
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(response.data.data.addFriend);
      return response.data.data.addFriend;
    } else {
      throw new Error(`Received status code ${response.status}`);
    }
  } catch (error) {
    console.error('Add friend error:', error);
    throw error;
  }
}

// export const removeFriend = async (userId: any, friendId: any) => {
//   try {
//     const response = await axios.delete(`${authUrl}/user/${userId}/remove_friend/${friendId}`);

//     if (response.status === 200) {
//       return response.data.message;
//     } else {
//       throw new Error(response.data.message);
//     }

//   } catch (error) {
//     console.error('Remove friend error:', error);
//     throw error;
//   }
// };

// export const getSentRequests = async (userId: any) => {
//   try {
//     const response = await axios.get(`${authUrl}/user/${userId}/sent_requests`);

//     if (response.status === 200) {
//       return response.data.data;
//     } else {
//       throw new Error(response.data.message);
//     }

//   } catch (error) {
//     console.error('Get sent requests error:', error);
//     throw error;
//   }
// };

export const getSentRequestsGQL = async (userId: any) => {
  try {
    const GET_SENT_REQUESTS_MUTATION = `{
        sendRequest(token: "${token}", id: ${userId}) {
          id
        }
      }
    `;

    const graphqlQuery = {
      query: GET_SENT_REQUESTS_MUTATION,
    };

    const response = await axios.post(graphqlUrl, {
      query: graphqlQuery.query
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(response.data.data.sendRequest);
      return response.data.data.sendRequest;
    } else {
      throw new Error(`Received status code ${response.status}`);
    }
  } catch (error) {
    console.error('Get sent requests error:', error);
    throw error;
  }
}

// export const getReceivedRequests = async (userId: any) => {
//   try {
//     const response = await axios.get(`${authUrl}/user/${userId}/received_requests`);

//     if (response.status === 200) {
//       return response.data.data;
//     } else {
//       throw new Error(response.data.message);
//     }

//   } catch (error) {
//     console.error('Get received requests error:', error);
//     throw error;
//   }
// };

export const getReceivedRequestsGQL = async (userId: any) => {
  try {
    const GET_RECEIVED_REQUESTS_MUTATION = `{
        receivedRequest(token: "${token}", id: ${userId}) {
          id
          request_status
          request_message
          user_id
          user_name
          target_user_id
          target_user_name
        }
      }
    `;

    const graphqlQuery = {
      query: GET_RECEIVED_REQUESTS_MUTATION,
    };

    const response = await axios.post(graphqlUrl, {
      query: graphqlQuery.query
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(response.data.data.receivedRequest);
      return response.data.data.receivedRequest;
    } else {
      throw new Error(`Received status code ${response.status}`);
    }
  } catch (error) {
    console.error('Get received requests error:', error);
    throw error;
  }
}

// export const addRequest = async (user_id :string |  null, target_user_id: number, friendRequestMessage: string) => {
//   try {
//     const data = {
//       "request_status": "pending",
//       "request_message": friendRequestMessage,
//       "user_id": user_id,
//       "target_user_id": target_user_id,
//     };
    
//     const response = await axios.post(`${authUrl}/request`, data);
    

//     if (response.status === 201) {
//       return response.data;
//     } else {
//       throw new Error(response.data.message);
//     }

//   } catch (error) {
//     console.error('Add request error:', error);
//     throw error;
//   }
// };

export const addRequestGQL = async (user_id :string |  null, target_user_id: number, friendRequestMessage: string, request_status: string) => {
  try {
    const ADD_REQUEST_MUTATION = `{
        addRequest(token: "${token}", target_user_id: ${target_user_id}, id: ${user_id}, request_message: "${friendRequestMessage}", request_status: "${request_status}")
      }
    `;

    const graphqlQuery = {
      query: ADD_REQUEST_MUTATION,
    };

    const response = await axios.post(graphqlUrl, {
      query: graphqlQuery.query
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(response.data.data.addRequest);
      return response.data.data.addRequest;
    } else {
      throw new Error(`Received status code ${response.status}`);
    }
  } catch (error) {
    console.error('Add request error:', error);
    throw error;
  }
}

// export const updateRequestStatus = async (requestId: any, status: any) => {
//   try {
//     const response = await axios.patch(`${authUrl}/request/${requestId}`, {
//       request_status: status
//     });

//     if (response.status === 200) {
//       return response.data;
//     } else {
//       throw new Error(response.data.message);
//     }

//   } catch (error) {
//     console.error('Update request status error:', error);
//     throw error;
//   }
// };

export const updateRequestStatusGQL = async (requestId: any, status: any) => {
  try {
    const UPDATE_REQUEST_STATUS_MUTATION = `{
      updateRequest(token: "${token}", requestId: ${requestId}, request_status: "${status}")
      }
    `;

    const graphqlQuery = {
      query: UPDATE_REQUEST_STATUS_MUTATION,
    };

    const response = await axios.post(graphqlUrl, {
      query: graphqlQuery.query
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(response.data.data.updateRequest);
      return response.data.data.updateRequest;
    } else {
      throw new Error(`Received status code ${response.status}`);
    }
  } catch (error) {
    console.error('Update request status error:', error);
    throw error;
  }
}

export const isFriend = async (userId: any, friendId: any) => {
    try{
        const allFriends = await getAllFriendsGQL(userId);
        if (allFriends === null) {
          return false;
        }
        return allFriends.includes(friendId);
    } catch (error) {
        console.error('Check if friend error:', error);
        throw error;
    }
}

export const hasSentRequest = async (userId: any, friendId: any) => {
    try{
        const sentRequests = await getSentRequestsGQL(userId);
        return sentRequests.includes(friendId);
    } catch (error) {
        console.error('Check if sent request error:', error);
        throw error;
    }
}

// export const getUser = async (userId: any) => {
//     try {
//         const response = await axios.get(`${authUrl}/user/${userId}`);
//         if (response.status === 200) {
//             return response.data.data;
//         } else {
//             throw new Error(response.data.message);
//         }
//     } catch (error) {
//         console.error('Get user error:', error);
//         throw error;
//     }
// }

// export const createPrivateRoom = async (friendId: any) => {
//     try {
//         const response = await axios.post(`${roomsUrl}/room/private`, {
//             "user1": localStorage.getItem('user_id'),
//             "user2": friendId
//         });
//         if (response.status === 200) {
//             return response.data;
//         } else {
//             throw new Error(response.data.message);
//         }
//     } catch (error) {
//         console.error('Create private room error:', error);
//         throw error;
//     }
// }

export const createPrivateRoomGQL = async (friendId: any) => {
  try {
    const CREATE_PRIVATE_ROOM_MUTATION = `{
        privateRoom(user1: "${localStorage.getItem('user_id')}", user2: "${friendId}") {
          id
        }
      }
    `;

    const graphqlQuery = {
      query: CREATE_PRIVATE_ROOM_MUTATION,
    };

    const response = await axios.post(graphqlUrl, {
      query: graphqlQuery.query
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(response.data.data.privateRoom);
      return response.data.data.privateRoom;
    } else {
      throw new Error(`Received status code ${response.status}`);
    }
  } catch (error) {
    console.error('Create private room error:', error);
    throw error;
  }
}

export const addMessageGQL = async (sender: any, receiver: any, content: any) => {
  try {
    const ADD_MESSAGE_MUTATION = `{
        addMessage(sender: "${sender}", receiver: ${receiver}, content: ${content}) {
          sender
          receiver
          content
          date_time
        }
      }
    `;

    const graphqlQuery = {
      query: ADD_MESSAGE_MUTATION,
    };

    const response = await axios.post(graphqlUrl, {
      query: graphqlQuery.query
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(response.data.data.addMessage);
      return response.data.data.addMessage;
    } else {
      throw new Error(`Received status code ${response.status}`);
    }
  } catch (error) {
    console.error('Add message error:', error);
    throw error;
  }
}

export const getMessagesByUsersGQL = async (user1: any, user2: any) => {
  try {
    const GET_MESSAGES_MUTATION = `{
      getMessagesByUsers(user1: "${user1}", user2: ${user2}) {
          sender
          receiver
          content
          date_time
        }
      }
    `;

    const graphqlQuery = {
      query: GET_MESSAGES_MUTATION,
    };

    const response = await axios.post(graphqlUrl, {
      query: graphqlQuery.query
    }, {
      headers: { 'Content-Type': 'application/json' },
    });

    if (response.status >= 200 && response.status < 300) {
      console.log(response.data.data.getMessagesByUsers);
      return response.data.data.getMessagesByUsers;
    } else {
      throw new Error(`Received status code ${response.status}`);
    }
  } catch (error) {
    console.error('Add message error:', error);
    throw error;
  }
}