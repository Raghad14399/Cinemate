import React, { useContext } from "react";
import { BsCollectionPlay } from "react-icons/bs";
import { CgMenuBoxed } from "react-icons/cg";
import { FiUserCheck } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import MenuDrawer from "../../Components/Drawer/MenuDrawer";
import { SidebarContext } from "../../Context/DrawerContext";
import { GiTicket } from "react-icons/gi";

function MobileFooter() {
  const { mobileDrawer, toggleDrawer } = useContext(SidebarContext);

  // التحقق من حالة تسجيل الدخول
  const isLoggedIn = localStorage.getItem('token'); // افترض أن التوكن يُخزن في localStorage

  const active = "bg-white text-beige3";
  const inActive =
    "transitions text-2xl flex-colo hover:bg-beige hover:text-main text-beige3 rounded-2xl px-4 py-3";
  const Hover = ({ isActive }) =>
    isActive ? `${active} ${inActive}` : inActive;

  return (
    <>
      <div className="flex flex-col h-full justify-between align-middle bg-white rounded-2xl cursor-pointer flex-grow w-full">
        <MenuDrawer drawerOpen={mobileDrawer} toggleDrawer={toggleDrawer} />
      </div>
      <footer className="lg:hidden fixed z-50 bottom-0 w-full px-1">
        <div className="bg-dry rounded-2xl flex-btn w-full p-1">
          {/* أيقونة الأفلام - تعرض فقط إذا كان المستخدم مسجل الدخول */}
          {isLoggedIn && (
            <NavLink to="/movies" className={Hover}>
              <BsCollectionPlay />
            </NavLink>
          )}

          {/* أيقونة التذاكر - تعرض فقط إذا كان المستخدم مسجل الدخول */}
          {isLoggedIn && (
            <NavLink to="/favorites" className={Hover}>
              <div className="relative">
                <div className="absolute top-0 right-3 w-5 h-5 flex items-center justify-center rounded-full text-xs bg-beige text-main transform translate-x-1/2 -translate-y-1/2">
                  3
                </div>
                <GiTicket />
              </div>
            </NavLink>
          )}

          {/* أيقونة تسجيل الدخول */}
          <NavLink to="/login" className={Hover}>
            <FiUserCheck />
          </NavLink>

          {/* زر القائمة */}
          <button onClick={toggleDrawer} className={inActive}>
            <CgMenuBoxed />
          </button>
        </div>
      </footer>
    </>
  );
}

export default MobileFooter;