import React, { useEffect } from 'react'
import axios from 'axios';
const serverUrl = process.env.REACT_APP_SERVER_URL;


function useGetCurrentUser() {
    useEffect(() => {
        const getCurrentUser = async () => {
            try{
                const result = await axios.get(`${serverUrl}/api/user/me`, {withCredentials: true});
                console.log("Current user:", result.data.user);
            }
            catch(error){
                console.error("Error fetching current user:", error);
            }
        };
        getCurrentUser();
    }, []);
}

export default useGetCurrentUser