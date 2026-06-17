import React, { useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance.js';
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
                const result = await axiosInstance.get('/api/user/me');
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