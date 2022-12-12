import React from 'react'
import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "../axios";

function ToHome() {

    async function go() {
        const userGet = axios.get('/user',
        {
            headers: { 'Content-Type': 'application/json'},
            withCredentials: true
        }
        );

        const user = JSON.stringify(userGet.username);
        console.log(user);
    }

    useEffect(() => {
        go();
    }, [])
  
  return (
    <div>ToHome</div>
  )
}

export default ToHome