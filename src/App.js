import './App.css';
import 'primereact/resources/themes/saga-blue/theme.css'; // Importar el tema
import 'primereact/resources/primereact.min.css'; // Importar estilos principales
import 'primeicons/primeicons.css';
import Routes from './Components/Routes';

function App() {
  return (
    <div className="App">
      <Routes />
    </div>
  );
}

export default App;
