import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar_init from './Navbar_init';
import Footer from './Footer';

export const ReportForm = () => {
    const location = useLocation();
    const obraId = location.pathname.split('/').pop(); // Obtener el ID de la obra desde la URL

    return (
        <div>
            <Navbar_init />
            <div className="container mt-5">
                <form>
                    <div className="row mb-3">
                        <div className="col-md-12">
                            <label htmlFor="reportOptions" className="form-label">Selecciona una opción para reportar:</label>
                            <select id="reportOptions" className="form-select">
                                <option value="inappropriate">Contenido inapropiado</option>
                                <option value="spam">Spam</option>
                                <option value="scam">Estafa</option>
                                <option value="copyright">Violación de derechos de autor</option>
                                <option value="misleading_ad">Publicidad engañosa</option>
                                <option value="false_info">Información falsa</option>
                                <option value="offensive">Contenido ofensivo</option>
                                <option value="violence">Contenido que promueve violencia</option>
                                <option value="discrimination">Contenido que promueve discriminación</option>
                                <option value="hate">Contenido que promueve odio</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label htmlFor="comment" className="form-label">Comentarios adicionales:</label>
                        <textarea id="comment" className="form-control" rows="4"></textarea>
                    </div>

                    {/* Submit Button */}
                    <div className="d-grid gap-2">
                        <button type="submit" className="btn btn-primary">Enviar Reporte</button>
                    </div>
                </form>
                <Footer />
            </div>
        </div>
    );
};

export default ReportForm;
