import React, { useEffect } from 'react'
import axios from 'axios';
import serverUrl from '../config/config.js';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

function useGetCurrentUser() {
    const dispatch = useDispatch();
    useEffect(() => {
        const getCurrentUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/me`, {
                    withCredentials: true,
                    headers: getAuthHeaders(),
                });
                const payload = result.data?.user ? result.data.user : result.data;
                dispatch(setUserData(payload));
            } catch (error) {
                console.error("Error fetching current user:", error);
            }
        };
        getCurrentUser();
    }, [dispatch]);
}

export default useGetCurrentUser