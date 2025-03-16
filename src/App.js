import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AboutUs from './Screens/AboutUs';
import HomeScreen from './Screens/HomeScreen';
import NotFound from './Screens/NotFound';
import ContactUs from './Screens/ContactUs';
import SingleMovie from './Screens/SingleMovie';
import WatchPage from './Screens/WatchPage';
import Login from './Screens/Login';
import ForgetPassword from './Screens/ForgetPassword';
import Profile from './Screens/Dashboard/Profile';
import UpdateProfile from './Screens/Dashboard/UpdateProfile';
import Aos from 'aos';
import Password from './Screens/Dashboard/Password';
import FavoritesMovies from './Screens/Dashboard/FavoritesMovies';
import MoviesList from './Screens/Dashboard/Admin/MovieList';
import Dashboard from './Screens/Dashboard/Admin/Dashboard';
import Categories from './Screens/Dashboard/Admin/Categories';
import Users from './Screens/Dashboard/Admin/Users';
import AddMovie from './Screens/Dashboard/Admin/AddMovie';
import Snacks from './Screens/Snacks';
import Popcornd from './Screens/Popcornd';
import SinglePopcorn from './Screens/SinglePopcorn';
import Nachosd from './Screens/Nachosd';
import SingleNachos from './Screens/SingleNachos';
import SingleDrink from './Screens/SingleDrink';
import Drinkd from './Screens/Drinkd';
import SnackList from './Screens/Dashboard/Admin/SnackList';
import AddSnack from './Screens/Dashboard/Admin/AddSnack';
import Varieties from './Screens/Dashboard/Admin/Varieties';
import CinemaHalls from './Screens/Dashboard/Admin/Halls';
import CreateCinemaHall from './Screens/Dashboard/Admin/CreateHall';
import EditeCinemaHall from './Screens/Dashboard/Admin/EditeHall';
import Tickets from './Screens/Dashboard/Admin/Tickets';
import Respits from './Screens/Dashboard/Admin/AcceptResipts';
import Employes from './Screens/Dashboard/Admin/Employes';
import Booking from './Screens/Dashboard/Booking';
import BookNow from './Screens/Dashboard/BookNow';
import ScrollOnTop from './ScrollOnTop';
import DrawerContext from './Context/DrawerContext';


function App() {
  Aos.init();
  return (
    <DrawerContext >
    <ScrollOnTop>
    <Routes>
    <Route path='/' element={<HomeScreen />} />
      <Route path='/about-us' element={<AboutUs />} />
      <Route path='/contact-us' element={<ContactUs />} />
      <Route path='/movie/:id' element={<SingleMovie />} />
      <Route path='/watch/:id' element={<WatchPage />} /> 
      <Route path='/login' element={<Login />} />
      <Route path='/forget-password' element={<ForgetPassword />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/update-profile' element={<UpdateProfile />} />
      <Route path='/password' element={<Password />} />
      <Route path='/favorites' element={<FavoritesMovies />} />
      <Route path='/movieslist' element={<MoviesList />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/categories' element={<Categories />} />
      <Route path='/users' element={<Users />} />
      <Route path='/addmovie' element={<AddMovie />} />
      <Route path='/snacks' element={<Snacks />} />
      <Route path='/popcorn' element={<Popcornd />} />
      <Route path='/popcorn/:id' element={<SinglePopcorn />} />
      <Route path="/nachos" element={<Nachosd />} />
      <Route path='/nachos/:id' element={<SingleNachos />} />
      <Route path="/drink" element={<Drinkd />} />
      <Route path='/drink/:id' element={<SingleDrink />} />
      <Route path='/snacklist' element={<SnackList />} />
      <Route path='/addsnack' element={<AddSnack />} />
      <Route path='/varieties' element={<Varieties />} />
      <Route path='/halls' element={<CinemaHalls />} />
      <Route path="/create-hall" element={<CreateCinemaHall />} />
      <Route path="/edite-hall" element={<EditeCinemaHall />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/respits" element={<Respits />} />
      <Route path="/employe" element={<Employes />} />
      <Route path="/booking/:name" element={<Booking />} />
      <Route path="/book-now" element={<BookNow />} />

      <Route path='*' element={<NotFound />} />
    </Routes>
    </ScrollOnTop>
    </DrawerContext>
  );
}

export default App;
