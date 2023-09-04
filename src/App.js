import logo from './logo.svg';
import './App.css';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Homepage from './Pages/Homepage';
import Stockpage from './Pages/Stockpage';
import News from './Pages/News';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
      <Routes>
        <Route path="/StockApp" element={<><Homepage/></>}/>
        <Route path="/stocks" element={<><Stockpage/></>}/>
        <Route path="/StockApp/stocks/news/:symbol" element = {<><News/></>} />

      </Routes>
      </BrowserRouter>

    </div>
  );
}

export default App;
