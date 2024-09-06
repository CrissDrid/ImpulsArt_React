import Navbar_init from './Navbar_init';

function CrearDireccion (){
 

return(<div>
    <Navbar_init/>
    <div>
  
  <div className="container mt-5">
    <form>
      {/* Row for Address Inputs */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="street" className="form-label">Calle:</label>
          <input type="text" id="street" className="form-control" placeholder="Ingresa tu calle" />
        </div>
        <div className="col-md-6">
          <label htmlFor="city" className="form-label">Ciudad:</label>
          <input type="text" id="city" className="form-control" placeholder="Ingresa tu ciudad" />
        </div>
        <div className="col-md-6 mt-3">
          <label htmlFor="Departamento" className="form-label">Departamento:</label>
          <input type="text" id="Departamento" className="form-control" placeholder="Ingresa tu Departamento" />
        </div>
      </div>

      {/* Submit Button */}
      <div className="d-grid gap-2">
        <button type="submit" className="btn btn-primary iniciar-btn">Enviar</button>
      </div>
    </form>
   
  </div>
</div>

    
    
    
    
    
     </div>);
} 
export default CrearDireccion;