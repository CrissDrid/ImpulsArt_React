import Footer from './Footer';
import Navbar_init from './Navbar_init';

export const Responder = () => {
  return (
    <div>
      <Navbar_init />
      <div className="container mt-5">
        <form>
          {/* Campo para el correo electrónico */}
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo Electrónico:</label>
            <input type="email" id="user_email" className="form-control" placeholder="tuemail@ejemplo.com" />
          </div>

          {/* Campo para la respuesta */}
          <div className="mb-3">
            <label htmlFor="largeText" className="form-label fs-4">Escribe aquí tu respuesta:</label>
            <textarea id="user_message" className="form-control" rows="4"></textarea>
          </div>

          {/* Botón de envío */}
          <div className="d-grid gap-2">
            <button type="submit" className="btn btn-primary iniciar-btn">Enviar</button>
          </div>
        </form>
        <Footer />
      </div>
    </div>
  );
};

export default Responder;
