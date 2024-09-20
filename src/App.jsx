import './index.css'; 
import { Route, Routes } from 'react-router-dom';
import { Home } from "./pages/Home";
import { Layout } from './components/layout/Layout';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import CreateVenue from './pages/CreateVenue';
import { Venue } from './pages/Venue';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />}/>
          <Route path="/Register" element={<Register />}/>
          <Route path="/Login" element={<Login />}/>
          <Route path="/Profile" element={<Profile />}/>
          <Route path="/CreateVenue" element={<CreateVenue />}/>
          <Route path="/Venue/:id" element={<Venue />}/>
        </Route>
      </Routes>
    </>

  )
}

export default App