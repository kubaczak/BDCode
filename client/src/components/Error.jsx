import React from 'react'
import { useRouteError } from "react-router-dom";
import './Error.css';

function Error() {

    const error = useRouteError();

  return (
    <div className='err'>
        <h2>Wystąpił błąd</h2>
        <h1>{error.statusText || error.message}</h1>
    </div>
  )
}

export default Error