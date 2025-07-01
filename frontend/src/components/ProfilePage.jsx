import React, { useEffect, useState } from "react";
import { Camera, Edit3, Mail, Calendar, User } from "lucide-react";
import { toast } from "react-toastify";
import axiosInstance from "../axiosInstance/axiosInstance";
import useAuth from "../Conetxt/AuthContext";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    image: "",
    createdAt: "",
    updatedAt: "",
  });

  const [editData, setEditData] = useState(userData);
  const [imagePreview, setImagePreview] = useState(null);

  const { user } = useAuth();

  useEffect(() => {
    if (!user || !user._id) return;

    const getUser = async () => {
      try {
        const { data } = await axiosInstance.get(`/auth/get-user/${user._id}`);
        if (data.success) {
          setUserData(data.user); 
        } else {
          toast.error("Failed to fetch user data.");
        }
      } catch (error) {
        console.error("API error:", error);
        toast.error(error.response?.data?.message || "Something went wrong.");
      }
    };

    getUser();
  }, [user]);

  // Keep edit form data in sync with user data
  useEffect(() => {
    setEditData(userData);
  }, [userData]);

  const handleEdit = () => {
    setIsEditing(true);
    setImagePreview(null);
  };

 const handleSave = async (e) => {
  e.preventDefault();
  try {
    const formData = new FormData();
    formData.append("name", editData.name);
    formData.append("email", editData.email);

    if (imagePreview) {
      // convert base64 back to a blob (or send base64 if your backend accepts it)
      const res = await fetch(imagePreview);
      const blob = await res.blob();
      formData.append("image", blob, "profile.jpg");
    }

    const { data } = await axiosInstance.patch(
      `/auth/update-user/${user._id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (data.success) {
      toast.success(data.message);
      setUserData(data.user); // update UI with response
      setIsEditing(false);
      setImagePreview(null);
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Update failed.");
  }
};


  const handleCancel = () => {
    setEditData(userData);
    setIsEditing(false);
    setImagePreview(null);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(0,0,0,0.15) 1px, transparent 0)`,
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            User Profile
          </h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
            <div className="h-48 bg-gradient-to-r from-purple-500 via-blue-500 to-indigo-600 relative">
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>

            <div className="relative px-8 pb-8">
              <div className="flex justify-center -mt-20 mb-6">
                <div className="relative group">
                  <div className="w-40 h-40 rounded-full border-6 border-white shadow-2xl overflow-hidden bg-gray-100">
                    {imagePreview || userData.image ? (
                      <img
                        src={imagePreview || userData.image}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-purple-400 to-blue-500 flex items-center justify-center">
                        <User size={60} className="text-white" />
                      </div>
                    )}
                  </div>

                  <div className="absolute bottom-2 right-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      disabled={!isEditing}
                      className="hidden"
                      id="imageUpload"
                    />
                    <label
                      htmlFor="imageUpload"
                      className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg transition-all duration-200 cursor-pointer ${
                        isEditing
                          ? "bg-blue-500 hover:bg-blue-600 hover:scale-110"
                          : "bg-gray-400 cursor-not-allowed"
                      } text-white`}
                    >
                      <Camera size={20} />
                    </label>
                  </div>

                  {imagePreview && (
                    <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                      Preview
                    </div>
                  )}
                </div>
              </div>

              {/* Editable fields */}
              <div className="text-center mb-8">
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="relative">
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`w-full text-2xl font-bold text-center rounded-xl px-4 py-3 transition-all duration-200 ${
                        isEditing
                          ? "bg-white border-2 border-blue-200 focus:border-blue-500 focus:outline-none shadow-md"
                          : "bg-transparent border-2 border-transparent text-gray-800 cursor-default"
                      }`}
                      placeholder="Enter your name"
                    />
                  </div>

                  <div className="relative flex items-center justify-center">
                    <Mail size={18} className="mr-2 text-gray-600" />
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) =>
                        setEditData({ ...editData, email: e.target.value })
                      }
                      disabled={!isEditing}
                      className={`text-lg text-center rounded-xl px-4 py-2 transition-all duration-200 ${
                        isEditing
                          ? "bg-white border-2 border-blue-200 focus:border-blue-500 focus:outline-none shadow-md"
                          : "bg-transparent border-2 border-transparent text-gray-600 cursor-default"
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div className="flex justify-center space-x-4 mt-6">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-green-500 cursor-pointer hover:bg-green-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-500 cursor-pointer hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={handleEdit}
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg flex items-center"
                    >
                      <Edit3 size={20} className="mr-2" />
                      Edit Profile
                    </button>
                  )}
                </div>

                {imagePreview && isEditing && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-800 text-sm flex items-center justify-center">
                      <Camera size={16} className="mr-2" />
                      New image selected! Click "Save Changes" to update your
                      profile picture.
                    </p>
                  </div>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-6 border border-purple-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <User size={20} className="mr-2 text-purple-600" />
                    Account Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-purple-100">
                      <span className="text-gray-600 font-medium">
                        Full Name
                      </span>
                      <span className="font-semibold">{userData.name}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-purple-100">
                      <span className="text-gray-600 font-medium">
                        Email Address
                      </span>
                      <span className="font-semibold">{userData.email}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-600 font-medium">
                        Account Status
                      </span>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                        Active
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                    <Calendar size={20} className="mr-2 text-blue-600" />
                    Activity Timeline
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-gray-800 font-medium">
                          Profile Updated
                        </p>
                        <p className="text-gray-600 text-sm">
                          {userData.updatedAt
                            ? formatDate(userData.updatedAt)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="text-gray-800 font-medium">
                          Account Created
                        </p>
                        <p className="text-gray-600 text-sm">
                          {userData.createdAt
                            ? formatDate(userData.createdAt)
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white text-center">
                  <div className="text-3xl font-bold mb-2">247</div>
                  <div className="text-purple-100">Days Active</div>
                </div>
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center">
                  <div className="text-3xl font-bold mb-2">12</div>
                  <div className="text-blue-100">Profile Updates</div>
                </div>
                <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white text-center">
                  <div className="text-3xl font-bold mb-2">98%</div>
                  <div className="text-indigo-100">Profile Complete</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
};

export default ProfilePage;
