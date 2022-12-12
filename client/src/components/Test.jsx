import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../axios";


function Test() {
  const navigate = useNavigate();

  async function test() {
    const res = await axios.get('/post/user/kubaczak',
    {
        headers: {  'Content-Type': 'application/json' },
        withCredentials: true,
    }
    );
    //console.log(JSON.stringify(res))
    const userGet = await axios.get('/user',
    {
        headers: { 'Content-Type': 'application/json'},
        withCredentials: true
    }
    );
    const user = JSON.stringify(userGet?.data?.username).substring(1,JSON.stringify(userGet?.data?.username).length-1);
    console.log(user);
    navigate('/user/'+user);
  }

  test()


  return (
    <div>Test</div>
  )
};

export default Test