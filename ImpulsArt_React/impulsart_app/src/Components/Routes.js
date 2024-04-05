import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import ListObra from '../CRUD/List/ListObra';
import EditObra from '../CRUD/Edit/EditObra';
import FormObra from '../CRUD/Create/FormObra';

function AppRoutes() { // Cambia el nombre de la función a AppRoutes
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />}/>
        <Route path='/home' element={<Home/>}/>
        {/*CRUD OBRAS*/}
        <Route path='/ListObra' element={<ListObra/>}/>
        <Route path="/EditObra/:pkCod_Producto" element = {<EditObra />}/>
        <Route path="/CreateObra" element = {<FormObra />}/>
        {/*CRUD OBRAS*/}
      </Routes>
    </Router>
  );
}

export default AppRoutes;
