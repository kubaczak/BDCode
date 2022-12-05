import React from 'react';
import axios from "../axios";



function Test() {

  async function test() {
    const res = await axios.get('/user',
    {
        headers: {  'Content-Type': 'application/json' },
        withCredentials: true,
    }
    );
    console.log(JSON.stringify(res))
  }

  test()


  return (
    <div>Test</div>
  )
};

export default Test