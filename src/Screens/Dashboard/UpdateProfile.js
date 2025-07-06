import React, { useEffect, useState } from "react";
import SideBar from "./SideBar";
import Uploader from "../../Components/Uploader";
import { Input } from "../../Components/UsedInputs";
import { authService, imageService } from "../../api/services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function UpdateProfile() {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageId, setImageId] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError("");
      try {
        // Assuming we are fetching the logged-in user's profile
        // This might need adjustment if the logic is different
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
          const emp = res.data;
          setEmployee(emp);
          setFullName(emp.fullName || "");
          setEmail(emp.email || "");
          setImageUrl(emp.image?.url || "");
          setImageId(emp.image?.id || null);
          setPhoneNumber(emp.phoneNumber || "");
        } else {
          setError("User not found.");
        }
      } catch (err) {
        setError("Failed to load user data.");
        toast.error(err.message || "Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const handleFileSelect = (file) => {
    setImageFile(file);
    setImageUrl(URL.createObjectURL(file)); // Show preview
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("handleSubmit triggered.");

    if (!employee) {
      toast.error("Cannot update profile: User data is not loaded correctly.");
      console.error("Employee data is null. Aborting submission.");
      return;
    }
    setIsSubmitting(true);
    console.log("Submitting with:", { fullName, imageFile, imageId });

    try {
      let finalImageId = imageId;

      // 1. Upload new image if selected
      if (imageFile) {
        console.log("Uploading new image...");
        const formData = new FormData();
        // The API requires 'Image', 'Title', and 'Url' fields for upload.
        formData.append("Image", imageFile);
        formData.append("Title", "");
        formData.append("Url", "");
        const res = await imageService.uploadImage(formData);
        // The API response nests the actual data, so we access it via res.data.data
        if (res?.data?.data?.id) {
          finalImageId = res.data.data.id;
          console.log("Image uploaded successfully. New ImageId:", finalImageId);
        } else {
          // Log the actual response for debugging if the structure is not as expected
          console.error("Image upload failed. API response:", res?.data);
          throw new Error("Image upload failed to return an ID.");
        }
      }

      // 2. Prepare data for user update
      const userData = {
        UserName: fullName,
        ImageId: finalImageId,
        PhoneNubmer: phoneNumber, // API requires this field
      };
      console.log("Updating user with data:", userData, "for user ID:", employee.id);

      // 3. Call update user API
      await authService.updateUser(employee.id, userData);
      toast.success("Profile updated successfully!");
      console.log("Profile updated successfully!");
      navigate("/profile");

    } catch (err) {
      console.error("Update failed:", err);
      toast.error(err.message || "Failed to update profile.");
    } finally {
      setIsSubmitting(false);
      console.log("Submission process finished.");
    }
  };

  return (
    <SideBar>
      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-bold">Update Profile</h2>
        {loading ? (
          <div className="text-lg text-main font-bold py-12">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-lg font-bold py-12">{error}</div>
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
                <div className="w-full lg:w-1/4">
                    <Uploader onFileSelect={handleFileSelect} />
                </div>
                <div className="w-full lg:w-3/4 flex justify-center items-center">
                {imageUrl && (
                    <img
                    src={imageUrl.startsWith('blob:') ? imageUrl : `http://cinemate-001-site1.jtempurl.com/${imageUrl}`}
                    alt="Profile Preview"
                    className="w-48 h-48 rounded-full object-cover border-4 border-border"
                    />
                )}
                </div>
            </div>

            <Input
              label="Full Name"
              placeholder="Enter your full name"
              type="text"
              bg={true}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
            <Input
              label="Email"
              placeholder="email@example.com"
              type="email"
              bg={true}
              value={email}
              onChange={() => {}} // No-op
              disabled={true} // Make email read-only
            />
            <div className="flex gap-4 flex-wrap flex-col-reverse sm:flex-row justify-between items-center my-4">
              <button
                type="button"
                onClick={() => window.history.back()} // Simple cancel
                className="bg-red-600 font-medium transitions hover:bg-red-700 border border-red-600 text-white py-3 px-12 rounded-xl w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-main font-medium transitions hover:bg-beige3 border border-beige3 text-white py-3 px-12 rounded-xl w-full sm:w-auto"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>

            </div>
          </div>
        )}
      </div>
    </SideBar>
  );
}

export default UpdateProfile;
