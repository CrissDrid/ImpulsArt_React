import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './LandingPage';
import Login from './Login';
import Register from './Register';
import ContactUs from './ContactUs';
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
import UserData from './UserData';
import ChangePWD from './ChangePWD';
import Galery from './Galery';
import ListUsuario from '../CRUD/List/ListUsuario';
import CreateUsuario from '../CRUD/Create/FormUsuario';
import EditUsuario from '../CRUD/Edit/EditUsuario';
import NoAccess from './no_access';
import ProtectedRoute from './ProtectedRoute'; // Importar ProtectedRoute
import Profile from './Profile';
import SeccionSubasta from './SeccionSubasta';
import DetallesSubasta from './DetallesSubasta';
import Simulacion from './Simulacion';

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
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/userdata' element={<UserData/>}/>
        <Route path='/changePWD' element={<ChangePWD/>}/>
        <Route path='/galery' element={<Galery/>}/>
        <Route path='/SeccionSubasta' element={<SeccionSubasta />}/>
        <Route path='/DetallesSubasta/:pkCodSubasta' element={<DetallesSubasta />}/>
        
        {/*CRUD USUARIOS*/}
        <Route path='/ListUsuario' element={<ProtectedRoute element={ListUsuario} roles={['administrador', 'Administrador']} />} />
        <Route path="/EditUsuario/:identificacion" element={<ProtectedRoute element={EditUsuario} roles={['administrador', 'Administrador']} />} />
        <Route path="/CreateUsuario" element={<ProtectedRoute element={CreateUsuario} roles={['administrador', 'Administrador']} />} />
        {/*CRUD USUARIOS*/}
        
        {/*CRUD OBRAS*/}
        <Route path='/ListObra' element={<ProtectedRoute element={ListObra} roles={['administrador', 'Administrador']} />} />
        <Route path="/EditObra/:pkCod_Producto" element={<ProtectedRoute element={EditObra} roles={['administrador', 'Administrador', 'usuario comun', 'Usuario']} />} />
        <Route path="/CreateObra" element={<ProtectedRoute element={FormObra} roles={['administrador', 'usuario comun', 'Usuario', 'Administrador']} />} />
        {/*CRUD OBRAS*/}

        {/*CRUD SUBASTA*/}
        <Route path='/ListSubasta' element={<ProtectedRoute element={ListSubasta} roles={['administrador', 'Administrador']} />} />
        <Route path="/CreateSubasta" element={<ProtectedRoute element={FormSubasta} roles={['administrador', 'Administrador', 'usuario comun', 'Usuario']} />} />
        <Route path="/EditSubasta/:pkCodSubasta" element={<ProtectedRoute element={EditSubasta} roles={['administrador', 'Administrador', 'usuario comun', 'Usuario']} />} />
        {/*CRUD SUBASTA*/}

        {/*CRUD DESPACHO*/}
        <Route path="/ListDespacho" element={<ProtectedRoute element={ListDespacho} roles={['administrador', 'Administrador']} />} />
        <Route path="/CreateDespacho" element={<ProtectedRoute element={FormDespacho} roles={['administrador', 'Administrador']} />} />
        <Route path="/EditDespacho/:pkCod_Despacho" element={<ProtectedRoute element={EditDespacho} roles={['administrador', 'Administrador']} />} />
        {/*CRUD DESPACHO*/}

        {/*CRUD PQRS*/}
        <Route path="/ListPQRS" element={<ProtectedRoute element={ListPQRS} roles={['administrador', 'Administrador']} />} />
        <Route path="/CreatePQRS" element={<ProtectedRoute element={FormPQRS} roles={['administrador', 'Administrador']} />} />
        <Route path="/EditPQRS/:pkCod_Reclamo" element={<ProtectedRoute element={EditPQRS} roles={['administrador', 'Administrador']} />} />
        {/*CRUD PQRS*/}
         
        <Route path='/Simulacion' element={<ProtectedRoute element={Simulacion} roles={['administrador', 'Administrador']}/>}/>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
