import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import axios from '../axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { useNavigate } from 'react-router-dom';

function Paste() {
  const [code, setCode] = useState("console.log('hello world!');");
  const [lang, setLang] = useState('j');
  const [listedS, setListedS] = useState('');
  const [listed, setListed] = useState(true);
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (listedS === 'pub') setListed(true);
    else setListed(false);
  }, [listedS]);

  const onChange = React.useCallback((value, viewUpdate) => {
    setCode(value);
    setSuccess(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //console.log(code, listed, lang);
      const response = await axios.post(
        '/post/',
        JSON.stringify({ paste: code, listed, lang }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setSuccess(true);
      navigate('/edit/' + response.data.id);
    } catch (err) {
      alert(err);
    }
  };

  return (
    <main>
      <div className="optWrapper">
        <select onChange={(e) => setLang(String(e.target.value))}>
          <option value="j">Javascript</option>
          <option value="p">Python</option>
        </select>
        <select onChange={(e) => setListedS(String(e.target.value))}>
          <option value="pub">Publiczny</option>
          <option value="priv">Prywatny</option>
        </select>
        {success === true ? (
          <div className="success">Zapisano!</div>
        ) : (
          <div></div>
        )}
      </div>
      <form onSubmit={handleSubmit}>
        <button>Dodaj nowy kod</button>
      </form>
      <CodeMirror
        value="console.log('hello world!');"
        height="60vh"
        width="80vw"
        theme={oneDark}
        extensions={[lang === 'p' ? python() : javascript({ jsx: true })]}
        onChange={onChange}
      />
    </main>
  );
}
export default Paste;
