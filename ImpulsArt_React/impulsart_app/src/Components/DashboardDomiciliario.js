import { Link } from 'react-router-dom';
import Navbar_init from './Navbar_init';

function DashboardDomiciliario() {

    return (
        <div>
            <Navbar_init />
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">Nombre Cliente</th>
                        <th scope="col">Numero Contacto</th>
                        <th scope="col">Fecha de Asignacion</th>
                        <th scope="col">Ciudad</th>
                        <th scope="col">Dirección</th>
                        <th scope="col">Especificaciones</th>
                        <th scope="col">Botones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Mark</td>
                        <td>Otto</td>
                        <td>@mdo</td>
                        <td>Ciudad 1</td>
                        <td>jkkasj</td>
                        <td>jsajkasjksa</td>
                        <td>
                            <button className="btn btn-primary">
                                <Link to={'/EstadoEntrega'} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    <i className="bi bi-truck"></i>
                                </Link>
                            </button>

                        </td>
                    </tr>
                    <tr>
                        <td>Jacob</td>
                        <td>Thornton</td>
                        <td>@fat</td>
                        <td>Ciudad 2</td>
                        <td>Calle 456</td>
                        <td>Con especificaciones</td>
                        <td>
                            <button className="btn btn-primary">
                                <Link to={'/EstadoEntrega'} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    <i className="bi bi-truck"></i>
                                </Link>
                            </button>

                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">Larry the Bird</td>
                        <td>@twitter</td>
                        <td>Ciudad 3</td>
                        <td>Calle 789</td>
                        <td>Sin especificaciones</td>
                        <td>
                            <button className="btn btn-primary">
                                <Link to={'/EstadoEntrega'} style={{ color: 'inherit', textDecoration: 'none' }}>
                                    <i className="bi bi-truck"></i>
                                </Link>
                            </button>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default DashboardDomiciliario;