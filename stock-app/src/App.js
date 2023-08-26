import logo from './logo.svg';
import './App.css';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Stockpage from './Pages/Stockpage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<><Homepage/></>}/>
        <Route path="/stocks" element={<><Stockpage/></>}/>

      </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
