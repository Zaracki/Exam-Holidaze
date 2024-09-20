import './index.css'; 
import { Route, Routes } from 'react-router-dom';
import { Home } from "./pages/Home";
import { Layout } from './components/layout/Layout';
import Register from './pages/Register';
import Login from './pages/Login';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}/>
          <Route path="/Register" element={<Register />}/>
          <Route path="/Login" element={<Login />}/>
        </Route>
      </Routes>
    </>

  )
}

export default App