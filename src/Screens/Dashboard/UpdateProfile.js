import React from "react";
import SideBar from "./SideBar";
import Uploader from "../../Components/Uploader";
import { Input } from "../../Components/UsedInputs";
import { Link } from "react-router-dom";

function UpdateProfile() {
  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Update Profile</h2>
        <Uploader />
        <Input label="Full Name" placeholder="cinemate" type="text" bg={true} />
        <Input
          label="Email"
          placeholder="cinemate@gmail.com"
          type="email"
          bg={true}
        />

        <div className="flex gap-2 flex-wrap flex-col-reverse sm:flex-row justify-between items-center my-4">
          <Link
            to="/profile"
            className="bg-red-500 font-medium transitions hover:bg-red-900  border border-red-400 flex-rows gap-4 text-white py-3 px-24 rounded-2xl w-full sm:w-auto"
          >
            Cancel
          </Link>
          <button className="bg-main font-medium transitions hover:bg-beige3 border border-beige3 flex-rows gap-4 text-white py-3 px-6 rounded-2xl w-full sm:w-auto">
            Save Changes
          </button>
        </div>
      </div>
    </SideBar>
  );
}

export default UpdateProfile;
