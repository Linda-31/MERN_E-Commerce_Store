import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "sonner";
import Spinner from "./Spinner";

function UserEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const fileInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isVerySmall, setIsVerySmall] = useState(window.innerWidth < 576);
  const [loading, setLoading] = useState(true);

  const [userData, setUserData] = useState({
    fullName: "",
    lastName: "",
    gender: "",
    email: "",
    mobile: "",
    Address: "",
    status: "Active",
    userPic: ""
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsVerySmall(window.innerWidth < 576);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    axios.get(`https://mern-store-server.onrender.com/api/users/${id}`)
      .then(res => {
        setUserData(res.data);
        if (res.data.image) {
           setPreviewImage(res.data.image);
        } else if (res.data.userPic) {
           setPreviewImage(res.data.userPic);
        }
      })
      .catch(err => {
        console.error("Failed to fetch user:", err);
        toast.error("User not found");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setPreviewImage("");
    if (fileInputRef.current) {
       fileInputRef.current.value = "";
    }
    toast.success("Image removed from view. Save to apply.");
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const UpdateData = {
        ...userData,
        image: previewImage // attach base64 string or empty to clear
      };

      await axios.put(`https://mern-store-server.onrender.com/api/users/${id}`, UpdateData);
      toast.success("User profile updated successfully");
      setTimeout(() => navigate(-1), 1500);
    } catch (err) {
      console.error("Error updating user:", err);
      toast.error("Failed to update user profile");
    }
  };

  if (loading) return <Spinner />;

  return (
    <div style={{
      padding: isMobile ? '20px 10px 100px' : '0 20px 40px', // Standard desktop padding (0 top, 20 left/right)
      fontFamily: "'Jost', sans-serif",
      backgroundColor: '#fafafa',
      minHeight: '100vh',
      transition: 'all 0.3s ease'
    }}>
      <Toaster richColors position="top-right" />
      
      <div style={{ maxWidth: '900px', margin: isMobile ? '0 auto' : '0', background: '#fff', borderRadius: '8px', boxShadow: '0 10px 40px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
        {/* Header Section */}
        <div style={{ 
          padding: isMobile ? '25px 20px' : '40px', 
          borderBottom: '1px solid #f0f0f0', 
          display: 'flex', 
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'flex-start' : 'center', 
          justifyContent: 'space-between',
          gap: '20px'
        }}>
           <div>
             <span style={{ color: '#e64e4e', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '9px', fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>User Management</span>
             <h2 style={{ fontSize: isMobile ? '22px' : '28px', fontWeight: '800', color: '#000', margin: 0 }}>Edit Profile: {userData.fullName}</h2>
           </div>
           <button onClick={() => navigate(-1)} style={{ background: 'transparent', border: '1px solid #ddd', padding: '8px 16px', fontSize: '10px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', borderRadius: '4px', cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}>
              Back
           </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: isMobile ? '25px 20px' : '40px' }}>
          
          {/* Avatar Section */}
          <div style={{ display: 'flex', flexDirection: isVerySmall ? 'column' : 'row', alignItems: isVerySmall ? 'center' : 'flex-start', gap: '30px', marginBottom: '40px' }}>
            <div style={{ position: 'relative' }}>
              <div style={{ 
                width: '130px', height: '130px', borderRadius: '50%', backgroundColor: '#f5f5f5', border: '2px dashed #ddd',
                display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.05)'
              }}>
                {previewImage ? (
                  <img src={previewImage} alt="User" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: '40px', color: '#ccc' }}>person</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: isVerySmall ? 'center' : 'left' }}>
               <h4 style={{ fontSize: '14px', fontWeight: '800', color: '#000', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Profile Image</h4>
               <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px', maxWidth: '300px' }}>Upload a high-resolution image to represent the user in the portal.</p>
               
               <div style={{ display: 'flex', gap: '15px', justifyContent: isVerySmall ? 'center' : 'flex-start' }}>
                 <button 
                   type="button" 
                   onClick={triggerFileInput}
                   style={{ background: '#000', color: '#fff', border: 'none', padding: '10px 20px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', borderRadius: '4px', cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}
                 >
                   Change Photo
                 </button>
                 <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
                 
                 {previewImage && (
                   <button 
                     type="button"
                     onClick={handleRemoveImage}
                     style={{ background: 'transparent', color: '#e64e4e', border: '1px solid #e64e4e', padding: '10px 20px', fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase', borderRadius: '4px', cursor: 'pointer', fontFamily: "'Jost', sans-serif" }}
                   >
                     Remove
                   </button>
                 )}
               </div>
            </div>
          </div>

          <hr style={{ borderTop: '1px solid #f0f0f0', margin: '0 0 40px' }} />

          {/* Form Fields Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '25px' }}>
            {/* Field */}
            <div>
              <label style={labelStyle}>First Name</label>
              <input type="text" name="fullName" style={{...inputStyle}} value={userData.fullName} onChange={handleChange} placeholder="Enter first name" />
            </div>

            {/* Field */}
            <div>
              <label style={labelStyle}>Last Name</label>
              <input type="text" name="lastName" style={{...inputStyle}} value={userData.lastName} onChange={handleChange} placeholder="Enter last name" />
            </div>

            {/* Field */}
            <div>
              <label style={labelStyle}>Gender</label>
              <select name="gender" style={{...inputStyle}} value={userData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Field */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <input type="email" name="email" style={{...inputStyle}} value={userData.email} onChange={handleChange} placeholder="user@example.com" />
            </div>

            {/* Field */}
            <div>
              <label style={labelStyle}>Phone Number</label>
              <input type="text" name="mobile" style={{...inputStyle}} value={userData.mobile} onChange={handleChange} placeholder="+1 (555) 000-0000" />
            </div>

            {/* Field */}
            <div>
              <label style={labelStyle}>Account Status</label>
              <select name="status" style={{...inputStyle}} value={userData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            {/* Field Full Width */}
            <div style={{ gridColumn: isMobile ? '1' : '1 / -1' }}>
              <label style={labelStyle}>Residential Address</label>
              <input type="text" name="Address" style={{...inputStyle}} value={userData.Address} onChange={handleChange} placeholder="Full address" />
            </div>
          </div>

          <div style={{ marginTop: '50px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #f0f0f0', paddingTop: '30px' }}>
             <button 
               type="submit" 
               style={{ background: '#e64e4e', color: '#fff', border: 'none', padding: '15px 40px', fontSize: '12px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 5px 15px rgba(230,78,78,0.3)', fontFamily: "'Jost', sans-serif", transition: 'background-color 0.2s ease, transform 0.2s ease' }}
               onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c73e3e'}
               onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#e64e4e'}
             >
               <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
               Update User
             </button>
          </div>

        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: 'block', fontSize: '10px', fontWeight: 'bold', color: '#888', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '8px'
};

const inputStyle = {
  width: '100%', padding: '14px 16px', border: '1px solid #e8e8e8', outline: 'none', fontSize: '14px', fontFamily: "'Jost', sans-serif", borderRadius: '4px', background: '#fafafa', color: '#333'
};

export default UserEdit;
