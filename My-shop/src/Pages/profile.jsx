import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Toaster, toast } from 'sonner';
import axios from 'axios';
import { motion } from "framer-motion";
import { Link } from 'react-router-dom';
import "../Styles/style.css";

function Profile() {
  const [isLoading, setIsLoading] = useState(true);
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: { fullName: "", lastName: "", gender: "", email: "", mobile: "", Address: "" },
  });
 
  const [userImage, setUserImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState({ firstName: "", lastName: "" });
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 992);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCookieValue = (name) => {
    const cookies = document.cookie.split("; ");
    const cookie = cookies.find((row) => row.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
  };

  useEffect(() => {
    const token = getCookieValue("token");
    if (!token) return;

    try {
      const user = JSON.parse(atob(token));
      const userId = user._id;

      if (!userId) return;

      axios.get(`http://localhost:4000/api/users/${userId}`)
        .then((res) => {
          const userData = res.data;
          reset({
            fullName: userData.fullName || "",
            lastName: userData.lastName || "",
            gender: userData.gender || "",
            email: userData.email || "",
            mobile: userData.mobile || "",
            Address: userData.Address || "",
          });
          setName({ firstName: userData.fullName || "", lastName: userData.lastName || "" });
          if (userData.image) setUserImage(userData.image);
          setIsLoading(false);
        })
        .catch(() => {
          toast.error("Failed to load profile");
          setIsLoading(false);
        });
    } catch (err) {
      toast.error("Invalid session");
    }
  }, [reset]);

  const onSubmit = async (data) => {
    const token = getCookieValue("token");
    if (!token) return;
    try {
      const user = JSON.parse(atob(token));
      const { _id: userId } = user;
      const updatedData = { ...data, image: previewImage || userImage || "" };
      const response = await axios.put(`http://localhost:4000/api/users/${userId}`, updatedData);
      
      if (updatedData.image) setUserImage(updatedData.image);
      setName({ firstName: data.fullName, lastName: data.lastName });
      setIsEditing(false);
      reset(data);
      document.cookie = `token=${btoa(JSON.stringify(response.data))}; path=/;`;
      toast.success("Profile refined successfully");
    } catch (err) {
      toast.error("Update failed.");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ backgroundColor: '#fff', fontFamily: "'Jost', sans-serif" }}>
      <Toaster position="bottom-right" richColors />
      
      {/* HERO SECTION */}
      <div style={{ 
        height: '240px', 
        backgroundColor: '#050505', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ 
            position: 'absolute', inset: 0, 
            backgroundImage: 'url("https://images.unsplash.com/photo-1549439602-43ebcb23258?q=80&w=2070&auto=format&fit=crop")', 
            backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.2, filter: 'grayscale(1)' 
        }}></div>
        
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', position: 'relative', zIndex: 2, paddingTop: '60px' }}>
          <h1 style={{ color: '#fff', fontSize: '42px', fontWeight: '900', letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>PROFILE</h1>
          <div className="mt-2 d-flex justify-content-center gap-3" style={{ fontSize: '10px', letterSpacing: '3px', fontWeight: 'bold' }}>
             <Link to="/home" style={{ color: '#aaa', textDecoration: 'none' }}>HOME</Link>
             <span style={{ color: '#e64e4e' }}>/</span>
             <span style={{ color: '#fff' }}>ACCOUNT DETAILS</span>
          </div>
        </motion.div>
      </div>

      {isLoading ? (
        <div className="text-center py-5" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ letterSpacing: '2px', fontSize: '12px', fontWeight: 'bold' }}>LOADING PROFILE...</span>
        </div>
      ) : (
        <div className="container py-5">
          <div className="row g-5">
            {/* PORTRAIT & HELLO */}
            <div className="col-lg-4">
              <div className="p-5 text-center" style={{ backgroundColor: '#f9f9f9', border: '1px solid #eee' }}>
                <div className="position-relative d-inline-block mb-4">
                  {previewImage || userImage ? (
                    <img
                      src={previewImage || userImage}
                      alt="Profile"
                      style={{ width: '160px', height: '160px', objectFit: 'cover', borderRadius: '50%', border: '5px solid #fff', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' }}
                    />
                  ) : (
                    <div style={{ 
                        width: '160px', height: '160px', backgroundColor: '#f5f5f5', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '50%', border: '5px solid #fff', boxShadow: '0 15px 35px rgba(0,0,0,0.1)' 
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '72px', color: '#ddd', fontWeight: '200' }}>person</span>
                    </div>
                  )}
                  {isEditing && (
                    <label htmlFor="profileImage" style={{ 
                      position: 'absolute', bottom: '5px', right: '5px', 
                      backgroundColor: '#e64e4e', color: '#fff', padding: '12px', 
                      borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center',
                      boxShadow: '0 5px 15px rgba(230, 78, 78, 0.4)'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>edit_square</span>
                      <input type="file" id="profileImage" accept="image/*" style={{ display: "none" }} onChange={handleImageChange} />
                    </label>
                  )}
                </div>
                <div className="mt-3" style={{ fontSize: '10px', color: '#e64e4e', fontWeight: '900', letterSpacing: '3px', textTransform: 'uppercase' }}>Greeting</div>
                <h2 style={{ fontSize: '24px', fontWeight: '900', marginTop: '10px', textTransform: 'uppercase' }}>{name.firstName} {name.lastName}</h2>
                <p className="text-muted small mt-2" style={{ letterSpacing: '1px' }}>KUSHI Member since 2024</p>
                
                <div className="mt-5">
                   <button className="btn btn-outline-dark rounded-0 w-100" style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '2px', padding: '15px' }} onClick={() => setIsEditing(!isEditing)}>
                      {isEditing ? "CANCEL EDIT" : "EDIT PROFILE"}
                   </button>
                </div>
              </div>
            </div>

            {/* PROFILE FORM */}
            <div className="col-lg-8">
              <div style={{ padding: isMobile ? '40px 30px' : '20px' }}>
                <div style={{ textAlign: isMobile ? 'center' : 'left' }}>
                  <span style={{ fontSize: '11px', color: '#e64e4e', fontWeight: '900', letterSpacing: '5px', textTransform: 'uppercase' }}>Identity</span>
                  <h3 style={{ fontSize: isMobile ? '28px' : '32px', fontWeight: '900', margin: '15px 0 45px', letterSpacing: '-1px' }}>PERSONAL DETAILS</h3>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="row g-5">
                    <div className="col-md-6 mb-3">
                        <label style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', color: '#bbb' }}>FIRST NAME</label>
                        <input type="text" className={`form-control rounded-0 border-0 border-bottom bg-transparent ps-0 ${errors.fullName ? 'is-invalid' : ''}`} style={{ fontSize: '14px', padding: '10px 0' }} {...register("fullName", { required: true })} readOnly={!isEditing} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', color: '#bbb' }}>LAST NAME</label>
                        <input type="text" className={`form-control rounded-0 border-0 border-bottom bg-transparent ps-0 ${errors.lastName ? 'is-invalid' : ''}`} style={{ fontSize: '14px', padding: '10px 0' }} {...register("lastName", { required: true })} readOnly={!isEditing} />
                    </div>
                  </div>

                  <div className="mb-5 mt-4 pt-3">
                    <label style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', color: '#bbb', display: 'block', marginBottom: '15px' }}>GENDER</label>
                    <div className="d-flex gap-4">
                      <div className="form-check">
                        <input type="radio" className="form-check-input" id="genderMale" value="Male" {...register("gender")} disabled={!isEditing} />
                        <label className="form-check-label small fw-bold" htmlFor="genderMale" style={{ letterSpacing: '1px' }}>MALE</label>
                      </div>
                      <div className="form-check">
                        <input type="radio" className="form-check-input" id="genderFemale" value="Female" {...register("gender")} disabled={!isEditing} />
                        <label className="form-check-label small fw-bold" htmlFor="genderFemale" style={{ letterSpacing: '1px' }}>FEMALE</label>
                      </div>
                    </div>
                  </div>

                  <div className="mb-5 pt-3">
                    <label style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', color: '#bbb' }}>EMAIL ADDRESS</label>
                    <input type="email" className={`form-control rounded-0 border-0 border-bottom bg-transparent ps-0 ${errors.email ? 'is-invalid' : ''}`} style={{ fontSize: '14px', padding: '10px 0' }} {...register("email", { required: true })} readOnly={!isEditing} />
                  </div>

                  <div className="mb-5 pt-3">
                    <label style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', color: '#bbb' }}>MOBILE NUMBER</label>
                    <input type="tel" className={`form-control rounded-0 border-0 border-bottom bg-transparent ps-0 ${errors.mobile ? 'is-invalid' : ''}`} style={{ fontSize: '14px', padding: '10px 0' }} {...register("mobile", { required: true })} readOnly={!isEditing} />
                  </div>

                  <div className="mb-5 pt-3">
                    <label style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px', color: '#bbb' }}>SHIPPING ADDRESS</label>
                    <textarea rows="3" className={`form-control rounded-0 border-0 border-bottom bg-transparent ps-0 ${errors.Address ? 'is-invalid' : ''}`} style={{ fontSize: '14px', padding: '10px 0' }} {...register("Address", { required: true })} readOnly={!isEditing} />
                  </div>

                  {isEditing && (
                    <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} type="submit" style={{ width: '100%', background: '#000', color: '#fff', border: 'none', padding: '18px', fontWeight: 'bold', letterSpacing: '3px', fontSize: '12px', textTransform: 'uppercase' }}>
                      SAVE CHANGES
                    </motion.button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

