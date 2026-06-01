import React from 'react'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import axiosInstance from '../utils/axiosInstance';



function LiveSite() {
    const [error, setError] = useState("");
    const [html, setHtml] = useState("")

    const { id } = useParams();
    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axiosInstance.get(`/api/website/getBySlug/${id}`);
                setHtml(result.data.latestCode);

            } catch (error) {
                console.log("Error getting website:", error.response?.data || error.message);
                setError(error.response?.data?.message || error.message || "Site not found.");
            }
        }
        handleGetWebsite();
    }, [id]);

    if(error){
        return (
            <div className='h-screen items-center flex justify-center bg-black text-white'>
                {error}
            </div>
        )
    }
    return (
        <iframe title='Live Site' 
        srcDoc={html}
        className='border-none h-screen w-screen bg-black'
        
        />
    )
}

export default LiveSite