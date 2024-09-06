import Navbar_init from './Navbar_init';



function EstadoEntrega (){
    return (<div>
         <Navbar_init />
         <div>
  
  <div className="container mt-5">
    <form >
      {/* Row for Select Input */}
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="selectState" className="form-label">Estado:</label>
          <select id="selectState" className="form-select">
            <option value="preparando">Preparando</option>
            <option value="en_camino">En camino</option>
            <option value="entregado">Entregado</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="d-grid gap-2">
        <button type="submit" className="btn btn-primary iniciar-btn">Enviar</button>
      </div>
    </form>
   
  </div>
</div>


    </div>)
}
export default EstadoEntrega;