import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import axios from "../axios";
import './User.css';

const Box = ({ value1, value2, value3 }) => (

  <div className='userBox'>
    <p className='boxLang'>{value2 === "\"j\"" || value2 === "j" ? "Javascript" : value2 === "\"p\"" || value2 === "p" ? "Python" : "Tekst" }</p>
    <p className='boxPaste'>{value1}</p>
    <Link className='link' to={'/edit/'+ value3}>Zobacz</Link>
  </div>
);

const User = () => {

  let values = new Array;
  const [properties, setProperties] = useState(values);
  const { id } = useParams();
  const navigate = useNavigate();
  const url = '/post/user/'+id;

  async function download(){
    try{
        const res = await axios.get(url,
        {
            headers: {  'Content-Type': 'application/json' },
            withCredentials: true,
        }
        ).then(response => {
            const selected = response.data.posts.map(post => ({
                paste: post.paste,
                lang: post.lang,
                id : post.id,
              }));
            const temp = Object.values(selected);
            values = [];
            for (let i = 0; i < temp.length; i++) {
                values.push(Object.values(temp[i]));
                //console.log(Object.values(temp[i]));
            }
            setProperties(values);
        });
    }
    catch(err){
      try{
        navigate(-1);
      }
      catch{
        navigate('/');
      }
    }
  }
  useEffect(() => {
    download();
    setProperties((prev) => [values]);
    //console.log(properties);
  }, []);
  
  let first = id.substring(0,1);
  //console.log(first, id);

  const nick = first.toUpperCase() + id.substring(1,id.length);

  return (
    <div className="wrapper">
    <h3>Profil: { nick }</h3>
    <div className='userContainer'>
      {properties.map((item, index) => (
        <Box key={index} value1={ String(item[0]).length >= 71 ? String(item[0]).substring(0,70) : String(item[0]) } value2={String(item[1])} value3={String(item[2])} />
      ))}
    </div>
    </div>
  );
};

export default User;