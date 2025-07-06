import React, { useState, useEffect } from "react";
import {
  MdDashboard,
  MdFastfood,
  MdPeopleOutline,
  MdMeetingRoom,
  MdSettings,
  MdAccountCircle,
  MdLockOutline,
  MdExpandMore,
  MdChevronRight,
  MdAddCircleOutline,
  MdCategory,
  MdLogout, // أيقونة تسجيل الخروج
} from "react-icons/md";
import { NavLink, useLocation, useNavigate } from "react-router-dom"; // إضافة useNavigate للتوجيه
import Layout from "../../Layout/Layout";
import { BsFillPersonVcardFill } from "react-icons/bs";
import { MdEventSeat } from "react-icons/md";
import { FaFilm } from "react-icons/fa";
import { BiMoviePlay } from "react-icons/bi";
import { BsCurrencyDollar } from "react-icons/bs";
import { GiTicket } from "react-icons/gi";

function SideBar({ children }) {
  const [openMenus, setOpenMenus] = useState({
    movies: false,
    snacks: false,
    settings: false,
  });

  const location = useLocation();
  const navigate = useNavigate(); // Hook لتوجيه المستخدم

  useEffect(() => {
    const path = location.pathname;

    setOpenMenus((prev) => ({
      ...prev,
      movies:
        path.startsWith("/movieslist") ||
        path.startsWith("/addmovie") ||
        path.startsWith("/categories") ||
        path.startsWith("/favorites"),
      snacks:
        path.startsWith("/snacklist") ||
        path.startsWith("/addsnack") ||
        path.startsWith("/varieties"),
      settings: path.startsWith("/profile") || path.startsWith("/password"),
    }));
  }, [location]);

  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menuName]: !prev[menuName],
    }));
  };

  // دالة تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("token"); // حذف التوكن
    navigate("/login"); // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول
  };

  const SideLinks = [
    {
      name: "Dashboard",
      link: "/dashboard",
      icon: MdDashboard,
    },
    {
      name: "Movies",
      link: " ",
      icon: BiMoviePlay,
      subLinks: [
        {
          name: "Movies List",
          link: "/movieslist",
          icon: FaFilm,
        },
        {
          name: "Add Movie",
          link: "/addmovie",
          icon: MdAddCircleOutline,
        },
        {
          name: "Movie Types",
          link: "/categories",
          icon: MdCategory,
        },
       
      ],
    },
    {
      name: "Snacks",
      link: " ",
      icon: MdFastfood,
      subLinks: [
        {
          name: "Snacks List",
          link: "/snacklist",
          icon: MdFastfood,
        },
        {
          name: "Add Snacks",
          link: "/addsnack",
          icon: MdAddCircleOutline,
        },
        {
          name: "Varieties",
          link: "/varieties",
          icon: MdCategory,
        },
      ],
    },
    {
      name: "Halls",
      link: "/halls",
      icon: MdMeetingRoom,
    },
    {
      name: "Payment Verification",
      link: "/tickets",
      icon: GiTicket,
    },
    {
      name: "Ticket Pricing",
      link: "/ticket-pricing",
      icon: BsCurrencyDollar,
    },
    {
      name: "Users",
      link: "/users",
      icon: MdPeopleOutline,
    },
    {
      name: "Employees",
      link: "/employe",
      icon: BsFillPersonVcardFill,
    },
    {
      name: "Setting",
      link: " ",
      icon: MdSettings,
      subLinks: [
        {
          name: "Profile",
          link: "/profile",
          icon: MdAccountCircle,
        },
        {
          name: "Password",
          link: "/password",
          icon: MdLockOutline,
        },
      ],
    },
  ];

  const active = "bg-beige text-beige3";
  const hover = "hover:text-white hover:bg-main";
  const inActive =
    "rounded-2xl font-medium text-sm transition-all ease-in-out duration-300 flex gap-4 items-center p-5";
  const Hover = ({ isActive }) =>
    isActive ? `${active} ${inActive}` : `${inActive} ${hover}`;

  return (
    <Layout>
      <div className="min-h-screen container mx-auto px-4">
        <div className="xl:grid grid-cols-8 gap-14 items-start md:py-14 py-8">
          {/* القائمة الجانبية */}
          <div className="col-span-2 sticky bg-dry border border-gray-800 p-6 rounded-2xl xl:mb-0 mb-6">
            {SideLinks.map((link, index) => (
              <div key={index}>
                <NavLink
                  to={link.link}
                  className={Hover}
                  onClick={(e) => {
                    if (link.subLinks) {
                      e.preventDefault(); // منع الانتقال الفوري للرابط
                      toggleMenu(link.name.toLowerCase());
                    }
                  }}
                >
                  <link.icon size={20} />
                  <p className="ml-2 text-medium font-semibold">{link.name}</p>
                  {link.subLinks && (
                    <span className="ml-auto cursor-pointer">
                      {openMenus[link.name.toLowerCase()] ? (
                        <MdExpandMore />
                      ) : (
                        <MdChevronRight />
                      )}
                    </span>
                  )}
                </NavLink>
                {link.subLinks && openMenus[link.name.toLowerCase()] && (
                  <div className="pl-5 mt-3 transition-all duration-300 ease-in-out border-l-2 border-border block">
                    {link.subLinks.map((subLink, subIndex) => (
                      <NavLink
                        to={subLink.link}
                        key={subIndex}
                        className={Hover}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <subLink.icon size={20} /> <p>{subLink.name}</p>
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* زر تسجيل الخروج */}
            <button
              className={`${inActive} ${hover} w-full text-left`}
              onClick={handleLogout}
            >
              <MdLogout size={20} />
              <p className="ml-2 text-medium font-semibold">Logout</p>
            </button>
          </div>

          {/* محتوى الصفحة */}
          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            data-aos-delay="10"
            data-aos-offset="200"
            className="col-span-6 rounded-2xl bg-dry border border-gray-800 p-6"
          >
            {children}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default SideBar;