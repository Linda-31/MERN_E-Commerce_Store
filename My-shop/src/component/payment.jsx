import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { toast, Toaster } from "sonner";
import axios from "axios";
import StripeCheckout from "react-stripe-checkout";
import { motion } from "framer-motion";
import "../Styles/style.css";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalAmount, orderId } = location.state || { totalAmount: 0 };
  
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateField, setStateField] = useState("");
  const [pincode, setPincode] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("gpay");

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

      axios.get(`/api/users/${userId}`)
        .then((res) => {
          const userData = res.data;
          if (userData.deliveryAddress) {
            setName(userData.deliveryAddress.fullName || "");
            setAddress(userData.deliveryAddress.address || "");
            setCity(userData.deliveryAddress.city || "");
            setStateField(userData.deliveryAddress.state || "");
            setPincode(userData.deliveryAddress.pincode || "");
          }
        })
        .catch((err) => console.error("Error fetching delivery address:", err));
    } catch (error) {
      console.error("Error parsing token:", error);
    }
  }, []);

  useEffect(() => {
    if (paymentMethod !== "gpay") return;

    const loadGPayButton = () => {
      if (!window.google) return;
      const paymentsClient = new window.google.payments.api.PaymentsClient({ environment: "TEST" });
      const isReadyToPayRequest = {
        apiVersion: 2,
        apiVersionMinor: 0,
        allowedPaymentMethods: [{
          type: "CARD",
          parameters: { allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"], allowedCardNetworks: ["VISA", "MASTERCARD"] },
          tokenizationSpecification: { type: "PAYMENT_GATEWAY", parameters: { gateway: "example", gatewayMerchantId: "exampleMerchantId" } },
        }],
      };

      paymentsClient.isReadyToPay(isReadyToPayRequest).then((response) => {
        if (response.result) {
          const container = document.getElementById("gpay-container");
          if (!container) return;
          container.innerHTML = "";
          const button = paymentsClient.createButton({
            onClick: () => {
              paymentsClient.loadPaymentData({
                ...isReadyToPayRequest,
                transactionInfo: { totalPriceStatus: "FINAL", totalPrice: totalAmount.toString(), currencyCode: "INR", countryCode: "IN" },
                merchantInfo: { merchantId: "12345678901234567890", merchantName: "Atelier Boutique" },
              }).then(() => {
                toast.success("Payment Received Successfully");
                navigate("/Success", { state: { orderId } });
              }).catch(console.error);
            },
          });
          container.appendChild(button);
        }
      }).catch(console.error);
    };

    if (!window.google) {
      const script = document.createElement("script");
      script.src = "https://pay.google.com/gp/p/js/pay.js";
      script.async = true;
      script.onload = loadGPayButton;
      document.body.appendChild(script);
    } else { loadGPayButton(); }
  }, [paymentMethod, totalAmount, navigate, orderId]);

  const handleSaveAddress = async () => {
    try {
      const token = getCookieValue("token");
      if (!token) return toast.error("Authentication required");
      const user = JSON.parse(atob(token));
      await axios.put(`/api/users/${user._id}/delivery-address`, {
        deliveryAddress: { fullName: name, address, city, state: stateField, pincode }
      });
      toast.success("Shipping details secured");
    } catch (err) { toast.error("Update failed"); }
  };

  return (
    <div style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: "'Jost', sans-serif" }}>
      <Toaster position="bottom-right" richColors />
      
      {/* HEADER */}
      <div style={{ padding: '120px 0 40px', borderBottom: '1px solid #f0f0f0', textAlign: 'center' }}>
          <h1 style={{ fontSize: '32px', fontWeight: '900', letterSpacing: '4px', textTransform: 'uppercase', margin: 0 }}>SECURE CHECKOUT</h1>
          <div className="mt-2 d-flex justify-content-center gap-3" style={{ fontSize: '10px', letterSpacing: '3px', fontWeight: 'bold' }}>
             <Link to="/cart" style={{ color: '#aaa', textDecoration: 'none' }}>BAG</Link>
             <span style={{ color: '#e64e4e' }}>/</span>
             <span style={{ color: '#000' }}>PAYMENT</span>
          </div>
      </div>

      <div className="container py-5">
        <div className="row g-5">
          {/* SHIPPING & PAYMENT LEFT COLUMN */}
          <div className="col-lg-7">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              {/* SHIPPING FORM */}
              <div className="mb-5">
                <h5 style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '30px' }}>01. SHIPPING CONCIERGE</h5>
                <div className="row g-4">
                  <div className="col-12">
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#888', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>FULL RECIPIENT NAME</label>
                    <input type="text" className="form-control rounded-0 border-0" style={{ backgroundColor: '#f9f9f9', padding: '15px' }} value={name} onChange={(e) => setName(e.target.value)} />
                  </div>
                  <div className="col-12">
                    <label style={{ fontSize: '11px', fontWeight: 'bold', color: '#888', letterSpacing: '1px', marginBottom: '8px', display: 'block' }}>STREET ADDRESS</label>
                    <input type="text" className="form-control rounded-0 border-0" style={{ backgroundColor: '#f9f9f9', padding: '15px' }} value={address} onChange={(e) => setAddress(e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <input type="text" className="form-control rounded-0 border-0" style={{ backgroundColor: '#f9f9f9', padding: '15px' }} placeholder="CITY" value={city} onChange={(e) => setCity(e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <input type="text" className="form-control rounded-0 border-0" style={{ backgroundColor: '#f9f9f9', padding: '15px' }} placeholder="STATE" value={stateField} onChange={(e) => setStateField(e.target.value)} />
                  </div>
                  <div className="col-md-4">
                    <input type="text" className="form-control rounded-0 border-0" style={{ backgroundColor: '#f9f9f9', padding: '15px' }} placeholder="PINCODE" value={pincode} onChange={(e) => setPincode(e.target.value)} />
                  </div>
                  <div className="col-12">
                     <button onClick={handleSaveAddress} className="btn btn-dark rounded-0 px-5 py-3" style={{ fontSize: '10px', fontWeight: '900', letterSpacing: '2px' }}>SAVE ADDRESS</button>
                  </div>
                </div>
              </div>

              {/* PAYMENT METHODS */}
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '30px' }}>02. PAYMENT CURATION</h5>
                <div className="d-flex flex-column gap-3 mb-4">
                   {[
                     { id: 'gpay', label: 'GOOGLE PAY', iconPath: 'https://cdn-icons-png.flaticon.com/512/6124/6124998.png' },
                     { id: 'card', label: 'CREDIT / DEBIT CARD', iconPath: 'https://cdn-icons-png.flaticon.com/512/349/349221.png' },
                     { id: 'netbanking', label: 'NET BANKING', iconPath: 'https://cdn-icons-png.flaticon.com/512/2830/2830284.png' },
                     { id: 'cod', label: 'CASH ON DELIVERY', iconPath: 'https://cdn-icons-png.flaticon.com/512/2489/2489190.png' }
                   ].map(method => (
                     <label key={method.id} style={{ 
                        display: 'flex', alignItems: 'center', gap: '15px', padding: '20px', 
                        border: paymentMethod === method.id ? '2px solid #000' : '1px solid #eee',
                        cursor: 'pointer', transition: 'all 0.3s ease'
                     }}>
                        <input 
                          type="radio" name="paymentMethod" value={method.id} 
                          checked={paymentMethod === method.id} 
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          style={{ accentColor: '#000' }}
                        />
                        <img src={method.iconPath} style={{ width: '24px', opacity: paymentMethod === method.id ? 1 : 0.4 }} alt="" />
                        <span style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '1px' }}>{method.label}</span>
                     </label>
                   ))}
                </div>

                {/* DYNAMIC PAYMENT UI */}
                <div style={{ minHeight: '100px' }}>
                    {paymentMethod === "gpay" && <div id="gpay-container"></div>}
                    
                    {paymentMethod === "card" && (
                        <StripeCheckout
                            stripeKey="pk_test_51QDOQMEJjow2uAPKioatoIZwZjZ96BsTQqxFAK0CYzujCXojVDAKJDxneRl9Ix1d0LWetkpRgYUrT364XfcoM0dz00Ks4PujG6"
                            token={(token) => { toast.success("Securely processed"); navigate("/Success", { state: { orderId } }); }}
                            amount={totalAmount * 100} name="Atelier Boutique" currency="INR"
                        >
                            <button className="btn btn-dark rounded-0 px-5 py-3 w-100" style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '2px' }}>INITIALIZE CARD TRANSACTION</button>
                        </StripeCheckout>
                    )}

                    {paymentMethod === "netbanking" && (
                        <div className="p-4" style={{ backgroundColor: '#f9f9f9' }}>
                            <select className="form-select border-0 mb-4 rounded-0" style={{ padding: '15px' }}>
                                <option>SELECT PREFERRED BANK</option>
                                <option>HDFC BANK</option>
                                <option>ICICI BANK</option>
                                <option>SBI BANK</option>
                                <option>AXIS BANK</option>
                            </select>
                            <button className="btn btn-dark rounded-0 px-5 py-3 w-100" style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '2px' }} onClick={() => toast.success("Gateway Initiated")}>CONNECT TO GATEWAY</button>
                        </div>
                    )}

                    {paymentMethod === "cod" && (
                        <button className="btn btn-dark rounded-0 px-5 py-3 w-100" style={{ fontSize: '11px', fontWeight: '900', letterSpacing: '2px' }} onClick={() => { toast.success("Order Reserved"); navigate("/Success", { state: { orderId } }); }}>RESERVE ORDER ON DELIVERY</button>
                    )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* SUMMARY RIGHT COLUMN */}
          <div className="col-lg-5">
            <div className="p-5 sticky-top" style={{ backgroundColor: '#000', color: '#fff', top: '40px', borderRadius: '4px' }}>
                <h5 style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '3px', marginBottom: '40px' }}>VALUATION SUMMARY</h5>
                <div className="d-flex justify-content-between mb-3" style={{ fontSize: '13px', opacity: 0.6 }}>
                    <span style={{ letterSpacing: '1px' }}>CURATION VALUE</span>
                    <span>₹{totalAmount?.toFixed(0)}</span>
                </div>
                <div className="d-flex justify-content-between mb-4" style={{ fontSize: '13px', opacity: 0.6 }}>
                    <span style={{ letterSpacing: '1px' }}>SECURE DELIVERY</span>
                    <span>COMPLIMENTARY</span>
                </div>
                <hr style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '30px 0' }} />
                <div className="d-flex justify-content-between mb-5">
                    <h6 style={{ fontSize: '14px', fontWeight: '900', letterSpacing: '2px' }}>GRAND TOTAL</h6>
                    <h6 style={{ fontSize: '24px', fontWeight: '300', color: '#e64e4e' }}>₹{totalAmount?.toFixed(2)}</h6>
                </div>
                <div className="p-4" style={{ backgroundColor: 'rgba(230,78,78,0.1)', borderRadius: '4px' }}>
                    <p style={{ fontSize: '11px', letterSpacing: '1px', lineHeight: '1.8', margin: 0, color: '#e64e4e' }}>
                       ⚠️ Please ensure the shipping conciliaries details are accurate before proceeding to the final transaction stage.
                    </p>
                </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
