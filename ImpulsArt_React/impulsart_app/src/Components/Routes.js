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
import Profile from './Profile';
import UserData from './UserData';
import ChangePWD from './ChangePWD';
import Galery from './Galery';
import Correos, { ContactUs } from './ContactUs';
import ListUsuario from '../CRUD/List/ListUsuario';
import CreateUsuario from '../CRUD/Create/FormUsuario';
import EditUsuario from '../CRUD/Edit/EditUsuario';
import NoAccess from './no_access';
import ProtectedRoute from './ProtectedRoute'; // Importar ProtectedRoute
import Profile from './Profile';

function AppRoutes() { // Cambia el nombre de la función a AppRoutes
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/no-access" element={<NoAccess />} />
        <Route path="/login" element={<Login />} />
        <Route path='/register' element={<Register />}/>
        <Route path='/home' element={<Home/>}/>
        <Route path='/ContactUs' element={<ContactUs/>}/>
        
        {/*CRUD USUARIOS*/}
        <Route path='/ListUsuario' element={<ProtectedRoute element={ListUsuario} roles={['administrador']} />} />
        <Route path="/EditUsuario/:identificacion" element={<ProtectedRoute element={EditUsuario} roles={['administrador']} />} />
        <Route path="/CreateUsuario" element={<ProtectedRoute element={CreateUsuario} roles={['administrador']} />} />
        {/*CRUD USUARIOS*/}
        
        {/*CRUD OBRAS*/}
        <Route path='/ListObra' element={<ProtectedRoute element={ListObra} roles={['administrador']} />} />
        <Route path="/EditObra/:pkCod_Producto" element={<ProtectedRoute element={EditObra} roles={['administrador']} />} />
        <Route path="/CreateObra" element={<ProtectedRoute element={FormObra} roles={['administrador']} />} />
        {/*CRUD OBRAS*/}

        {/*CRUD SUBASTA*/}
        <Route path='/ListSubasta' element={<ProtectedRoute element={ListSubasta} roles={['administrador']} />} />
        <Route path="/CreateSubasta" element={<ProtectedRoute element={FormSubasta} roles={['administrador']} />} />
        <Route path="/EditSubasta/:pkCodSubasta" element={<ProtectedRoute element={EditSubasta} roles={['administrador']} />} />
        {/*CRUD SUBASTA*/}

        {/*CRUD DESPACHO*/}
        <Route path="/ListDespacho" element={<ProtectedRoute element={ListDespacho} roles={['administrador']} />} />
        <Route path="/CreateDespacho" element={<ProtectedRoute element={FormDespacho} roles={['administrador']} />} />
        <Route path="/EditDespacho/:pkCod_Despacho" element={<ProtectedRoute element={EditDespacho} roles={['administrador']} />} />
        {/*CRUD DESPACHO*/}

        {/*CRUD PQRS*/}
        <Route path="/ListPQRS" element={<ProtectedRoute element={ListPQRS} roles={['administrador']} />} />
        <Route path="/CreatePQRS" element={<ProtectedRoute element={FormPQRS} roles={['administrador']} />} />
        <Route path="/EditPQRS/:pkCod_Reclamo" element={<ProtectedRoute element={EditPQRS} roles={['administrador']} />} />
        {/*CRUD PQRS*/}



<Route path="/Correo" element = {<Correo />}/>

      </Routes>
    </Router>
  );
}

export default AppRoutes;
