import React from "react";
import { Route, Routes } from "react-router-dom";
import AboutUs from "./Screens/AboutUs";
import HomeScreen from "./Screens/HomeScreen";
import NotFound from "./Screens/NotFound";
import ContactUs from "./Screens/ContactUs";
import SingleMovie from "./Screens/SingleMovie";
import WatchPage from "./Screens/WatchPage";
import Login from "./Screens/Login";
import ForgetPassword from "./Screens/ForgetPassword";
import Profile from "./Screens/Dashboard/Profile";
import UpdateProfile from "./Screens/Dashboard/UpdateProfile";
import Aos from "aos";
import Password from "./Screens/Dashboard/Password";
import FavoritesMovies from "./Screens/Dashboard/FavoritesMovies";
import MoviesList from "./Screens/Dashboard/Admin/MovieList"; // استيراد مكون قائمة الأفلام
import Dashboard from "./Screens/Dashboard/Admin/Dashboard";
import Categories from "./Screens/Dashboard/Admin/Categories";
import Users from "./Screens/Dashboard/Admin/Users";
import AddMovie from "./Screens/Dashboard/Admin/AddMovie";
import Snacks from "./Screens/Snacks";
import Snaks from "./Screens/Snaks";
import Popcornd from "./Screens/Popcornd";
import SinglePopcorn from "./Screens/SinglePopcorn";
import Nachosd from "./Screens/Nachosd";
import SingleNachos from "./Screens/SingleNachos";
import SingleDrink from "./Screens/SingleDrink";
import Drinkd from "./Screens/Drinkd";
import SnackList from "./Screens/Dashboard/Admin/SnackList";
import Drinks from "./Screens/Drinks";
import AddSnack from "./Screens/Dashboard/Admin/AddSnack";
import Varieties from "./Screens/Dashboard/Admin/Varieties";
import CinemaHalls from "./Screens/Dashboard/Admin/Halls";
import CreateCinemaHall from "./Screens/Dashboard/Admin/CreateHall";
import EditeCinemaHall from "./Screens/Dashboard/Admin/EditeHall";
import Tickets from "./Screens/Dashboard/Admin/Tickets";
import Respits from "./Screens/Dashboard/Admin/AcceptResipts";
import Employes from "./Screens/Dashboard/Admin/Employes";
import Booking from "./Screens/Dashboard/Booking";
import BookNow from "./Screens/Dashboard/BookNow";
import ScrollOnTop from "./ScrollOnTop";
import DrawerContext from "./Context/DrawerContext";
import { Toaster } from "react-hot-toast";
import TicketPricing from "./Screens/Dashboard/Admin/TicketPricing";
import { withAuth } from "./Components/AuthGuard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  Aos.init();

  // تطبيق حماية المصادقة على المكونات التي تتطلب المصادقة
  const AuthProfile = withAuth(Profile);
  const AuthUpdateProfile = withAuth(UpdateProfile);
  const AuthPassword = withAuth(Password);
  const AuthFavoritesMovies = withAuth(FavoritesMovies);
  const AuthBooking = withAuth(Booking);
  const AuthBookNow = withAuth(BookNow);

  // المكونات الخاصة بالإدارة
  const AuthDashboard = withAuth(Dashboard);
  const AuthMoviesList = withAuth(MoviesList);
  const AuthCategories = withAuth(Categories);
  const AuthTicketPricing = withAuth(TicketPricing);
  const AuthUsers = withAuth(Users);
  const AuthAddMovie = withAuth(AddMovie);
  const AuthSnackList = withAuth(SnackList);
  const AuthAddSnack = withAuth(AddSnack);
  const AuthVarieties = withAuth(Varieties);
  const AuthCinemaHalls = withAuth(CinemaHalls);
  const AuthCreateCinemaHall = withAuth(CreateCinemaHall);
  const AuthEditeCinemaHall = withAuth(EditeCinemaHall);
  const AuthTickets = withAuth(Tickets);
  const AuthRespits = withAuth(Respits);
  const AuthEmployes = withAuth(Employes);

  return (
    <DrawerContext>
      {/* إضافة ToastContainer لعرض رسائل react-toastify */}
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#333",
            color: "#fff",
          },
          success: {
            style: {
              background: "#22c55e",
            },
          },
          error: {
            style: {
              background: "#ef4444",
            },
          },
        }}
      />
      <ScrollOnTop>
        <Routes>
          {/* المسارات العامة */}
          <Route path="/" element={<HomeScreen />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/movie/:id" element={<SingleMovie />} />
          <Route path="/watch/:id" element={<WatchPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forget-password" element={<ForgetPassword />} />
          {/* المسارات الخاصة بالمستخدم - محمية بالمصادقة */}
          <Route path="/profile" element={<AuthProfile />} />
          <Route path="/update-profile" element={<AuthUpdateProfile />} />
          <Route path="/password" element={<AuthPassword />} />
          <Route path="/favorites" element={<AuthFavoritesMovies />} />
          <Route path="/booking/:name" element={<AuthBooking />} />
          <Route path="/book-now" element={<AuthBookNow />} />

          {/* المسارات الخاصة بالأفلام - محمية بالمصادقة */}
          <Route path="/movies" element={<AuthMoviesList />} />

          {/* المسارات الخاصة بالإدارة - محمية بالمصادقة */}
          <Route path="/dashboard" element={<AuthDashboard />} />
          <Route path="/movieslist" element={<AuthMoviesList />} />
          <Route path="/categories" element={<AuthCategories />} />
          <Route path="/ticket-pricing" element={<AuthTicketPricing />} />
          <Route path="/users" element={<AuthUsers />} />
          <Route path="/addmovie" element={<AuthAddMovie />} />
          <Route path="/snacks" element={<Snacks />} />
          <Route path="/snaks" element={<Snaks />} />
          <Route path="/drinks" element={<Drinks />} />
          <Route path="/popcorn" element={<Popcornd />} />
          <Route path="/popcorn/:id" element={<SinglePopcorn />} />
          <Route path="/nachos" element={<Nachosd />} />
          <Route path="/nachos/:id" element={<SingleNachos />} />
          <Route path="/drink" element={<Drinkd />} />
          <Route path="/drink/:id" element={<SingleDrink />} />
          <Route path="/snacklist" element={<AuthSnackList />} />
          <Route path="/addsnack" element={<AuthAddSnack />} />
          <Route path="/varieties" element={<AuthVarieties />} />
          <Route path="/halls" element={<AuthCinemaHalls />} />
          <Route path="/create-hall" element={<AuthCreateCinemaHall />} />
          <Route path="/edite-hall" element={<AuthEditeCinemaHall />} />
          <Route path="/tickets" element={<AuthTickets />} />
          <Route path="/accept-resipts" element={<AuthRespits />} />
          <Route path="/employe" element={<AuthEmployes />} />
          {/* المسار الافتراضي */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ScrollOnTop>
    </DrawerContext>
  );
}

export default App;
