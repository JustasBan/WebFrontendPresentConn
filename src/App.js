import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Uploads } from './Components/Uploads/Uploads';
import { OrdersList } from './Components/OrdersList/OrdersList';

// create a topping [main page]
// create order with toppings and size[main page] & get price estimate
// view order list [order page]

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
