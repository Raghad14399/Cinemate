import React from "react";
import SideBar from "./SideBar";
import { Input } from "../../Components/UsedInputs";
import { Link } from "react-router-dom";

function Profile() {
  return (
    <SideBar>
      <div className="flex flex-col gap-6 items-center p-4">
        <h1 className="text-3xl font-bold text-center">Profile</h1>

        <div className="w-44 h-44 rounded-full overflow-hidden border-2 border-main flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
          <img
            src="/images/halls/hall1.jpg"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="w-full space-y-4">
          <Input
            label="Full Name"
            placeholder="cinemate"
            type="text"
            bg={true}
          />
          <Input
            label="Email"
            placeholder="cinemate@gmail.com"
            type="email"
            bg={true}
          />
        </div>

        <div className="flex justify-center w-full my-6">
          <Link
            to="/update-profile"
            className="bg-main font-medium transitions hover:bg-beige3 border border-beige3 flex-rows gap-4 text-white py-3 px-7 rounded-2xl text-center text-lg"
          >
            Edit Profile
          </Link>
        </div>
      </div>
    </SideBar>
  );
}

export default Profile;
