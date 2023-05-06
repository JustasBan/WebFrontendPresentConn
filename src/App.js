import './styles/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Uploads } from './Components/Uploads/Uploads';
import { OrdersList } from './Components/OrdersList/OrdersList';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Uploads />} />
          <Route path="/ordersList" element={<OrdersList />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
