import React ,{ useState, useEffect} from "react";
import { Routes, Route, Navigate } from 'react-router-dom'
import {GoogleOAuthProvider} from '@react-oauth/google';

import Login from './components/Login'
import Home from './container/Home'

import { userQuery } from "./utils/data";
import { client } from "./client";

import { fetchUser } from "./utils/fetchUser";



const App = () => {
  const[isLoggedIn,setIsLoggedIn]= useState(false);
  const [user, setUser] = useState(null);
  const userInfo = fetchUser(); 


  useEffect(() => {
    const query = userQuery(userInfo?.sub);  
      client.fetch(query).then((data) => {
        setUser(data[0]);
        setIsLoggedIn(true);
      });    

  }, []);

  return (
    <GoogleOAuthProvider clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}>
      <Routes>         
      <Route path="/login" element={<Login />}/>
      <Route path="/*" element={isLoggedIn? <Home /> : <Navigate to='/login'/>}/>      
    </Routes>
    </GoogleOAuthProvider>    
  )
}

export default App;
