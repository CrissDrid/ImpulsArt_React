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
import DetalleObras from './DetalleObras';
import Simulacion from './Simulacion';
import Dashboard from './Dashboard';
import Help from './Help';
import CarritoCompras from './CarritoCompras';
import PasarelaPagos from './PasarelaPagos';
import Stepts from './Stepts';
import DashboardAsesor from './DashboardAsesor';
import ReportForm from './Reportes';
import Responder from './Responder';
import DashboardDomiciliario from './DashboardDomiciliario';
import EstadoEntrega from './EstadoEntrega';
import CrearDireccion from './CrearDireccion'; 

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
        <Route path='/Carrito' element={<CarritoCompras/>}/>
        <Route path='/pasarela' element={<PasarelaPagos/>}/>
        <Route path='/stepts' element={<Stepts/>}/>
        <Route path='/Dashboard' element={<Dashboard />}/>
        <Route path='/Help' element={<Help />}/>
        <Route path='/DashboardAsesor' element={<DashboardAsesor />}/>
        <Route path="/ReportForm/:pkCod_Producto" element={<ReportForm />} />
        <Route path='/Responder' element={<Responder />}/>
        <Route path='/DashboardDomiciliario' element={<DashboardDomiciliario />}/>
        <Route path='/EstadoEntrega' element={<EstadoEntrega />}/>
        <Route path='/CrearDireccion' element={<CrearDireccion />}/>


        <Route path="/DetalleObras/:pkCod_Producto" element={<DetalleObras />} />
        
        {/*CRUD USUARIOS*/}
        <Route path='/ListUsuario' element={<ProtectedRoute element={ListUsuario} rol={['ADMIN']} />} />
        <Route path="/EditUsuario/:identificacion" element={<ProtectedRoute element={EditUsuario} rol={['ADMIN']} />} />
        <Route path="/CreateUsuario" element={<ProtectedRoute element={CreateUsuario} rol={['ADMIN']} />} />
        {/*CRUD USUARIOS*/}
        
        {/*CRUD OBRAS*/}
        <Route path='/ListObra' element={<ProtectedRoute element={ListObra} rol={['ADMIN']} />} />
        <Route path="/EditObra/:pkCod_Producto" element={<ProtectedRoute element={EditObra} rol={['ADMIN', 'USER', 'ASESOR', 'DOMICILIARIO']} />} />
        <Route path="/CreateObra" element={<ProtectedRoute element={FormObra} rol={['ADMIN', 'USER', 'ASESOR', 'DOMICILIARIO']} />} />
        {/*CRUD OBRAS*/}

        {/*CRUD SUBASTA*/}
        <Route path='/ListSubasta' element={<ProtectedRoute element={ListSubasta} rol={['ADMIN']} />} />
        <Route path="/CreateSubasta" element={<ProtectedRoute element={FormSubasta} rol={['ADMIN', 'USER', 'ASESOR', 'DOMICILIARIO']} />} />
        <Route path="/EditSubasta/:pkCodSubasta" element={<ProtectedRoute element={EditSubasta} rol={['ADMIN', 'USER', 'ASESOR', 'DOMICILIARIO']} />} />
        {/*CRUD SUBASTA*/}

        {/*CRUD DESPACHO*/}
        <Route path="/ListDespacho" element={<ProtectedRoute element={ListDespacho} rol={['ADMIN']} />} />
        <Route path="/CreateDespacho" element={<ProtectedRoute element={FormDespacho} rol={['ADMIN']} />} />
        <Route path="/EditDespacho/:pkCod_Despacho" element={<ProtectedRoute element={EditDespacho} rol={['ADMIN']} />} />
        {/*CRUD DESPACHO*/}

        {/*CRUD PQRS*/}
        <Route path="/ListPQRS" element={<ProtectedRoute element={ListPQRS} rol={['ADMIN']} />} />
        <Route path="/CreatePQRS" element={<ProtectedRoute element={FormPQRS} rol={['ADMIN']} />} />
        <Route path="/EditPQRS/:pkCod_Reclamo" element={<ProtectedRoute element={EditPQRS} rol={['ADMIN']} />} />
        {/*CRUD PQRS*/}
         
        <Route path='/Simulacion' element={<ProtectedRoute element={Simulacion} rol={['ADMIN']}/>}/>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
