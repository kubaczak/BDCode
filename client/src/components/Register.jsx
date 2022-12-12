import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';

import './Register.css';

import React from 'react';
import { Link } from 'react-router-dom';

const userRules = /^[a-zA-Z][a-zA-Z0-9_]{3,30}$/;
const emailRules =
  /^(?=.*[a-z])(?=.*[@])(?!.*")(?=\S)(?!.*\")(?!.*\')(?!.*\;).{3,30}/;
const passRules = /^(?=.*[a-z])(?!.*")(?=\S)(?!.*\")(?!.*\')(?!.*\;).{3,30}$/;

function Register() {
  const [user, setUser] = useState('');
  const [validUser, setValidUser] = useState(false);
  const [email, setEmail] = useState('');
  const [validEmail, setValidEmail] = useState(false);
  const [pass, setPass] = useState('');
  const [validPass, setValidPass] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    //console.log(user);
    const valid = userRules.test(user);
    if (valid) {
      setValidUser(true);
    } else {
      setValidUser(false);
    }
    //console.log(validUser);
  }, [user]);

  useEffect(() => {
    //console.log(user);
    const valid = emailRules.test(email);
    if (valid) {
      setValidEmail(true);
    } else {
      setValidEmail(false);
    }
    //console.log(validUser);
  }, [email]);

  useEffect(() => {
    //console.log(pass);
    const valid = passRules.test(pass);
    if (valid) {
      setValidPass(true);
    } else {
      setValidPass(false);
    }
    //console.log(validPass);
  }, [pass]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user, email, pass);

    try {
      const response = await axios.post(
        '/auth/register',
        JSON.stringify({ nick: user, email, password: pass }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      //console.log(JSON.stringify(response));
      setSuccess(true); //nie wiem co tu redirect jakis? do login?
      const userGet = await axios.get('/user', {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const user = JSON.stringify(userGet?.data?.username).substring(
        1,
        JSON.stringify(userGet?.data?.username).length - 1
      );
      console.log(user);
      navigate('/user/' + user);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <section className="register">
      <form onSubmit={handleSubmit}>
        <h1>Rejestracja</h1>
        <div className="inputBox">
          <input
            type="text"
            id="name"
            autoComplete="false"
            onChange={(e) => setUser(e.target.value)}
            required
          ></input>
          <label className="username">Username:</label>
          <span></span>
        </div>
        <div className="inputBox">
          <input
            type="email"
            id="email"
            autoComplete="false"
            onChange={(e) => setEmail(e.target.value)}
            required
          ></input>
          <label className="username">Email:</label>
          <span></span>
        </div>
        <div className="inputBox">
          <input
            type="password"
            id="password"
            onChange={(e) => setPass(e.target.value)}
            required
          ></input>
          <label className="pass">Password:</label>
          <span></span>
        </div>
        <div className="options">
          <Link to={'/login'}>Zaloguj się</Link>
          <button
            disabled={!validPass || !validEmail || !validUser ? true : false}
          >
            Sign up
          </button>
        </div>
      </form>
    </section>
  );
}

export default Register;
