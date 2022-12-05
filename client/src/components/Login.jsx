import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthProvider";
import axios from "../axios";

import React from 'react'

import './Register.css';

const emailRules = /^(?=.*[a-z])(?=.*[@])(?!.*")(?=\S)(?!.*\")(?!.*\')(?!.*\;).{3,30}/;
const passRules = /^(?!.*")(?=\S)(?!.*\")(?!.*\')(?!.*\;).{2,30}$/;

function Login() {

    const { setAuth } = useContext(AuthContext);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [pass, setPass] = useState('');
    const [validPass, setValidPass] = useState(false);

    useEffect(() => {
        const valid = emailRules.test(email)
        if (valid) { setValidEmail(true); }
        else { setValidEmail(false); }

    }, [email])

    useEffect(() => {
        const valid = passRules.test(pass)
        if (valid) { setValidPass(true); }
        else{ setValidPass(false); }

    }, [pass])

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email, pass);

        try{
            const response = await axios.post('/auth/login',
                JSON.stringify({email, password: pass}),
                {
                    headers: {  'Content-Type': 'application/json' },//, 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': '*'},
                    withCredentials: true,
                }
            );
            console.log(JSON.stringify(response));
        } catch(err){
            console.log(err);
        }
        setEmail('');
        setPass('');
    }

  return (
    <section className="register">

    <form onSubmit={handleSubmit}>
        <h1>
            Login
        </h1>
        <div className="inputBox">
            <input type="email" id="email"
            autoComplete="false"
            onChange={(e) => setEmail(e.target.value)}
            required></input>
            <label className="username">Email:</label>
            <span></span>
        </div>   
        <div className="inputBox">
            <input type="password" id="password" 
            onChange={(e) => setPass(e.target.value)}
            required></input>
            <label className="pass">Password:</label>
            <span></span>
        </div>
        <div className="options">
            <a href="#">Zarejestruj się</a>
            <button disabled={!validPass || !validEmail ? true : false}>Sign up</button>
        </div>    
        
    </form>
</section>
  )
}

export default Login