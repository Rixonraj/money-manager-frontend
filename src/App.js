import './App.css';
import axios from 'axios';
import React, { createContext, useEffect, useState } from 'react';
import {BrowserRouter,Routes,Route,useParams, Link, Navigate} from 'react-router-dom'
import Component1 from './Components/Component1';
import Login from './Components/Login';
import Register from './Components/Register';
import Home from './Components/Home';


function App() {
  let {userid} = useParams();
    // const [userObject,setuserObject] = useState("");
  //   useEffect(() => {
  //   axios.get(`${process.env.REACT_APP_BACKENDURL}/`,{withCredentials:true})
  //   .then((res)=>{
  //     setuserObject(res.data)
  //   })
  // }, [])

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}></Route>
      <Route path='/register' element={<Register/>}></Route> 
      <Route path='/home'>
      <Route path=':userid' element={<Home/>}></Route>
      </Route>
    </Routes>
    </BrowserRouter>
  );
}

export default App;
