import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Route } from "react-router-dom";
//import App from './App';
import Register from './components/Register';
import Login from './components/Login';
import Error from './components/Error';
import Test from './components/Test';
import Paste from './components/Paste';
import Add from './components/Add';
import EditPaste from './components/EditPaste';
import User from './components/User';
import { AuthProvider } from './context/AuthProvider';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Add />,
    errorElement: <Error />,
  },  
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <Error />,
  },
  {
    path: "/test",
    element: <Test />,
    errorElement: <Error />,
  },
  { ///Remove ??
    path: "/new",
    element: <Paste />,
    errorElement: <Error />,
  },
  {
    path: "/edit/:id",
    element: <EditPaste />,
    errorElement: <Error />,
  },
  {
    path: "/user/:id",
    element: <User />,
    errorElement: <Error />,
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <RouterProvider router={router}>
        <AuthProvider />
      </RouterProvider>
  </React.StrictMode>
)
