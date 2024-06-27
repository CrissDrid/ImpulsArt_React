import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './Login';
import Register from './Register';
import Correo from './Correo';
import Home from './Home';
import ListObra from '../CRUD/List/ListObra';
import EditObra from '../CRUD/Edit/EditObra';
import FormObra from '../CRUD/Create/FormObra';
import ListSubasta from '../CRUD/List/ListSubasta';
import FormSubasta from '../CRUD/Create/FormSubasta';
import EditSubasta from '../CRUD/Edit/EditSubasta';
import ListDespacho from '../CRUD/List/ListDespacho';
import FormDespacho from '../CRUD/Create/FormDespacho';
import EditDespacho from '../CRUD/Edit/EditDespacho';
import ListPQRS from '../CRUD/List/ListPQRS';
import FormPQRS from '../CRUD/Create/FormPQRS';
import EditPQRS from '../CRUD/Edit/EditPQRS';

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

       {/*CRUD SUBASTA*/}
<Route path='/ListSubasta' element = {<ListSubasta />}/>
<Route path="/CreateSubasta" element = {<FormSubasta />}/>
<Route path="/EditSubasta/:pkCodSubasta" element = {<EditSubasta />}/>
{/*CRUD SUBASTA*/}

{/*CRUD DESPACHO*/}
<Route path="/ListDespacho" element = {<ListDespacho />}/>
<Route path="/CreateDespacho" element = {<FormDespacho />}/>
<Route path="/EditDespacho/:pkCod_Despacho" element = {<EditDespacho />}/>
{/*CRUD DESPACHO*/}

{/*CRUD PQRS*/}
<Route path="/ListPQRS" element = {<ListPQRS />}/>
<Route path="/CreatePQRS" element = {<FormPQRS />}/>
<Route path="/EditPQRS/:pkCod_PQRS" element = {<EditPQRS />}/>
{/*CRUD PQRS*/}

<Route path="/Correo" element = {<Correo />}/>

      </Routes>
    </Router>
  );
}

export default AppRoutes;
