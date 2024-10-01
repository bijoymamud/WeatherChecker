import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; 
import Body from './coponents/body.jsx';  
import CityWeather from './coponents/CityWeather.jsx'; 
import './styles.css';

import bg3 from './images/bg3.webp';
import bg8 from './images/bg8.jpg';
import bg6 from './images/default.jpg';
import bg7 from './images/default2.jpg';

function App() {
  return (
    <>
      <div className="relative h-screen w-screen">
        <Router>
          <Routes> 
            <Route
              path="/"
              element={<Body
                image1={'https://images.unsplash.com/photo-1419833173245-f59e1b93f9ee?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'}
                image2={'https://images.unsplash.com/photo-1698213120340-3fd8fca285ea?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2VhdGhlciUyMGZvcmVjYXN0fGVufDB8fDB8fHww'}
                image3={bg3}
                image4={'https://images.pexels.com/photos/9733790/pexels-photo-9733790.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                image5={'https://images.pexels.com/photos/28436769/pexels-photo-28436769/free-photo-of-serene-misty-mountain-landscape-photography.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'}
                image6={bg6}
                image7={bg7}
                image8={bg8}
              />}
            />
            <Route path="/city-weather/:cityName" element={<CityWeather />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
