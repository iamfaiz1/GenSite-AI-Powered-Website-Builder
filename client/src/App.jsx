import React, { use } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Generate from './pages/Generate'
import Editor from './pages/Editor'
import useGetCurrentUser from './hooks/useGetCurrentUser' 
import { useSelector } from 'react-redux'

export const serverUrl = 'http://localhost:8000'

function App() {
  useGetCurrentUser();
  const {userData} = useSelector((state) => state.user);
  return (
    <BrowserRouter>
    <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/dashboard' element={userData ? <Dashboard/> :  <Home/>}/>
        <Route path='/generate' element={userData ? <Generate/> :  <Home/>} />
        <Route path='/editor/:id' element={userData ? <Editor/> :  <Home/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App