import React, { useEffect } from 'react'
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';


function useGetCurrentUser() {
    const dispatch = useDispatch();
    useEffect(() => {
        const getCurrentUser = async () => {
            try{
                const result = await axios.get(`${serverUrl}/api/user/me`, {withCredentials: true});
                const payload = result.data?.user ? result.data.user : result.data;
                dispatch(setUserData(payload))
            }
            catch(error){
                console.error("Error fetching current user:", error);
            }
        };
        getCurrentUser();
    }, []);
}

export default useGetCurrentUser