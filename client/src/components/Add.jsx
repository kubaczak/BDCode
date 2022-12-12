import React from 'react';
import { Link } from 'react-router-dom';
import './Add.css';

function Add() {
  return (
    <div className="linkContainer">
        <Link className='addLink' to={'/new'}>Dodaj nowego paste'a</Link>
    </div>
  );
}

export default Add;