import React from 'react'
import { useParams } from 'react-router-dom'

function LiveSite() {
    
  id = useParams()
  useEffect(() => {
    const handleGetWebsite = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/website/getById/${id}`, {
                withCredentials: true,
                headers: getAuthHeaders(),
            });
            setCode(result.data.latestCode);
            setMessages(result.data.conversation ? result.data.conversation : []);
            

            if (!result?.data) {
                setError(result?.data?.message || "No result found.");
            } else {
                setWebsite(result.data);
            }
        } catch (error) {
            console.log("Error getting website:", error.response?.data || error.message);
            setError(error.response?.data?.message || error.message || "An error occurred.");
        }
    }
    handleGetWebsite();
    }, [id]);

  
    return (
    <div>LiveSite</div>
  )
}

export default LiveSite