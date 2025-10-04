import { useState, useEffect } from 'react';
import { 
  UserCircleIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon, 
  CalendarIcon, 
  ArrowUpTrayIcon, 
  XMarkIcon 
} from '@heroicons/react/24/solid';

import { getImageUrl } from "../utility/utility";

const User = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch user details on component mount
  useEffect(() => {
    fetchUserDetails();
  }, []);

const fetchUserDetails = async () => {
    try {
      // 🚨 1. Retrieve the entire JSON string from local storage 🚨
      const authStorageString = localStorage.getItem('auth-storage');
      
      if (!authStorageString) {
        console.error('No authentication state found in local storage.');
        setLoading(false);
        return;
      }
      
      // 2. Parse the JSON string to get the authentication object
      const authData = JSON.parse(authStorageString);
      
      // 🚨 3. Extract the nested token 🚨
      const token = authData?.state?.token;

      if (!token) {
        console.error('Token not found in authentication state.');
        setLoading(false);
        return;
      }

      // 4. Proceed with the fetch request using the extracted token
      const response = await fetch('http://localhost:5000/api/user/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        // Log the response text for better debugging if the fetch fails
        const errorText = await response.text();
        throw new Error(`Failed to fetch user details (Status: ${response.status}): ${errorText}`);
      }

      const data = await response.json();
      setUser(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user:', error);
      setLoading(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setSelectedFile(file);
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      // 🚨 1. Retrieve the entire JSON string from local storage 🚨
      const authStorageString = localStorage.getItem('auth-storage');

       if (!authStorageString) {
        console.error('No authentication state found in local storage.');
        setLoading(false);
        return;
      }
      
      // 2. Parse the JSON string to get the authentication object
      const authData = JSON.parse(authStorageString);
      
      // 🚨 3. Extract the nested token 🚨
      const token = authData?.state?.token;

      if (!token) {
        console.error('Token not found in authentication state.');
        setLoading(false);
        return;
      }


      
      const response = await fetch('http://localhost:5000/api/user/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update user state with new image
        setUser({ ...user, profileImage: data.imageUrl });
        setSelectedFile(null);
        setPreviewUrl(null);
        alert('Image uploaded successfully!');
      } else {
        alert(data.msg || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const cancelUpload = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) return imagePath;
    // Otherwise, prepend your backend URL
    return `http://localhost:5000/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">Failed to load user details</div>
          <button 
            onClick={fetchUserDetails}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-12">
            <div className="flex flex-col items-center">
              {/* Profile Image */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
                  {previewUrl ? (
                    <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : user.image ? (
                    <img 
                      src={getImageUrl(user.image)} 
                      alt={user.name || user.userName || 'User'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', e.target.src);
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em" font-size="40"%3E?%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-blue-200">
                      <UserCircleIcon className="w-16 h-16 text-blue-600" />
                    </div>
                  )}
                </div>

                {/* Upload Button */}
                <label 
                  htmlFor="image-upload" 
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition"
                  title="Upload profile picture"
                >
                  <ArrowUpTrayIcon className="w-5 h-5 text-blue-600" />
                  <input 
                    id="image-upload"
                    type="file" 
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Upload Actions */}
              {selectedFile && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleImageUpload}
                    disabled={uploading}
                    className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploading ? 'Uploading...' : 'Save Image'}
                  </button>
                  <button
                    onClick={cancelUpload}
                    disabled={uploading}
                    className="p-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Cancel upload"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* User Name */}
              <h1 className="mt-4 text-3xl font-bold text-white">
                {user.name || user.userName || 'User'}
              </h1>
              <p className="mt-1 text-blue-100">{user.role || 'Member'}</p>
            </div>
          </div>

          {/* Details Section */}
          <div className="px-8 py-8 space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 rounded-lg p-3">
                <EnvelopeIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-500 uppercase">Email</h3>
                <p className="mt-1 text-lg text-gray-900">{user.email}</p>
              </div>
            </div>

            {/* Username */}
            {user.userName && (
              <div className="flex items-start gap-4">
                <div className="bg-indigo-100 rounded-lg p-3">
                  <UserCircleIcon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Username</h3>
                  <p className="mt-1 text-lg text-gray-900">{user.userName}</p>
                </div>
              </div>
            )}

            {/* First Name & Last Name */}
            {(user.firstName || user.lastName) && (
              <div className="flex items-start gap-4">
                <div className="bg-teal-100 rounded-lg p-3">
                  <UserCircleIcon className="w-6 h-6 text-teal-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Full Name</h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {user.firstName} {user.lastName}
                  </p>
                </div>
              </div>
            )}

            {/* Phone */}
            {user.phone && (
              <div className="flex items-start gap-4">
                <div className="bg-green-100 rounded-lg p-3">
                  <PhoneIcon className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Phone</h3>
                  <p className="mt-1 text-lg text-gray-900">{user.phone}</p>
                </div>
              </div>
            )}

            {/* Location */}
            {user.location && (
              <div className="flex items-start gap-4">
                <div className="bg-purple-100 rounded-lg p-3">
                  <MapPinIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Location</h3>
                  <p className="mt-1 text-lg text-gray-900">{user.location}</p>
                </div>
              </div>
            )}

            {/* Join Date */}
            {user.createdAt && (
              <div className="flex items-start gap-4">
                <div className="bg-orange-100 rounded-lg p-3">
                  <CalendarIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-500 uppercase">Member Since</h3>
                  <p className="mt-1 text-lg text-gray-900">
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Bio */}
            {user.bio && (
              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">About</h3>
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;