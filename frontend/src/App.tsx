// src/App.tsx
import { Outlet } from 'react-router-dom';

function App() {
  return (
    <div>
      <h1>Minha Aplicação (Layout Principal)</h1>
      <hr />
      <main>
        {/* O Outlet é o espaço onde a página da rota atual 
            (HomePage, SobrePage, etc.) será renderizada */}
        <Outlet />
      </main>
    </div>
  )
}

export default App;