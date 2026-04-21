import axios from 'axios';
import React from 'react'
import { useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { serverUrl } from '../App';


function Editor() {
    const { id } = useParams();
    useEffect(() => {
        const handleGetWebsite = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/getById/${id}`, { withCredentials: true });
                if(!result) 
                    return result.json({ message: "Website not found" }); 
                else
                    console.log(result); 
            }
            catch (error) {
                console.log("Error getting website:", error.response?.data);
            }
        }
        handleGetWebsite();
        }, [id])
    

    return (
        <div>
            Editor
        </div>
    )
}

export default Editor