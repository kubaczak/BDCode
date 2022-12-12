import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from '../axios';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';

function EditPaste() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState("console.log('hello world!');");
  const [lang, setLang] = useState('j');
  const [listedS, setListedS] = useState('');
  const [listed, setListed] = useState(true);
  const [success, setSuccess] = useState(false);

  const url = '/post/' + id;

  useEffect(() => {
    if (listedS === 'pub') setListed(true);
    else setListed(false);
  }, [listedS]);

  async function download() {
    try {
      //console.log(code, listed, lang);
      const response = await axios.get(url, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      //console.log(JSON.stringify(response.data));
      const pattern = '\\n';
      const replacement = '\n';
      setCode(
        String(
          JSON.stringify(response.data.paste)
            .substring(1, JSON.stringify(response.data.paste).length - 1)
            .replaceAll(pattern, replacement)
        )
      );
      setLang(
        String(
          JSON.stringify(response.data.lang).substring(
            1,
            JSON.stringify(response.data.lang).length - 1
          )
        )
      );
      //console.log(lang);
    } catch (err) {
      alert(err);
    }
  }
  useEffect(() => {
    download();
  }, []);
  // document.addEventListener(onload, download());
  // download();

  const onChange = React.useCallback((value, viewUpdate) => {
    setCode(String(value));
    setSuccess(false);
    //console.log(value);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        url,
        JSON.stringify({ paste: code, listed, lang }),
        {
          headers: { 'Content-Type': 'application/json' },
          withCredentials: true,
        }
      );
      setSuccess(true);
    } catch (err) {
      alert(err);
    }
  };

  const del = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(url, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      const userGet = await axios.get('/user', {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true,
      });
      if (userGet?.data?.username) {
        const user = JSON.stringify(userGet?.data?.username).substring(
          1,
          JSON.stringify(userGet?.data?.username).length - 1
        );
        navigate('/user/' + user);
      } else {
        navigate('/');
      }
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
        <button>Zapisz zmiany</button>
      </form>
      <form onSubmit={del}>
        <button>Usuń paste'a</button>
      </form>
      <CodeMirror
        value={code}
        height="75vh"
        width="80vw"
        theme={oneDark}
        extensions={[lang === 'p' ? python() : javascript({ jsx: true })]}
        onChange={onChange}
      />
    </main>
  );
}

export default EditPaste;
