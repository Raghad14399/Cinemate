import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import { Input } from "../../Components/UsedInputs";
import { Link } from "react-router-dom";
import { authService } from "../../api/services";

function Profile() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError("");
      try {
        const userId = localStorage.getItem("userID");
        if (!userId) {
          throw new Error("User ID not found. Please log in again.");
        }
        const role = localStorage.getItem("role");
        let res;

        // Use the appropriate service function based on the user's role
        if (role === 'CUSTOMER') {
          res = await authService.getUserById(userId);
        } else {
          // Assuming other roles like ADMIN, SUPER_ADMIN, SCANNER are employees
          res = await authService.getEmployeeById(userId);
        }
        
        if (res?.success && res.data) {
          setEmployee(res.data);
        } else {
          setError("User not found.");
        }
      } catch (err) {
        setError(err.message || "Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  return (
    <SideBar>
      <div className="flex flex-col gap-6 items-center p-4">
        <h1 className="text-3xl font-bold text-center">Profile</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
             <div className="text-lg text-main font-bold">Loading...</div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 text-lg font-bold">{error}</div>
          </div>
        ) : (
          <>
            <div className="w-44 h-44 rounded-full overflow-hidden border-2 border-main flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300">
              {employee?.image?.url ? (
                <img
                  src={`http://cinemate-001-site1.jtempurl.com/${employee.image.url}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-dry border border-border rounded-full">
                  <svg className="w-full h-full" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="12" fill="#1f2937"/>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#9ca3af"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="w-full space-y-4">
              <Input
                label="User Name"
                placeholder="cinemate"
                type="text"
                bg={true}
                value={employee?.fullName || ""}
                readOnly
              />
              <Input
                label="Email"
                placeholder="cinemate@gmail.com"
                type="email"
                bg={true}
                value={employee?.email || ""}
                readOnly
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
          </>
        )}
      </div>
    </SideBar>
  );
}

export default Profile;
