import React from "react";
import '../Styles/style.css';
import PieChart from "../Component/piechart";
import SalesOverviewChart from '../Component/SalesOverviewChart';

function Home() {
  const stats = [
    { title: "ALL-TIME VALUATION", value: "₹1,20,500", icon: "bi-cash-coin" },
    { title: "ARTISANAL SALES", value: "3,250", icon: "bi-bag-heart" },
    { title: "BOUTIQUE CLIENTS", value: "1,420", icon: "bi-people" },
    { title: "CURRENT CURATION", value: "48 Orders", icon: "bi-clock-history" }
  ];

  return (
    <div className="home-dashboard">
      <div className="text-head">
        DASHBOARD OVERVIEW
        <span>Real-time curation insights</span>
      </div>

      <div className="row g-4 dashboard-container">
        {stats.map((stat, idx) => (
          <div className="col-lg-3 col-md-6" key={idx}>
            <div className="stat-card">
              <i className={`bi ${stat.icon} fs-4`}></i>
              <h5>{stat.title}</h5>
              <p className="card-text">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-5 mt-4">
        <div className="col-lg-8">
           <div className="table-wrap">
              <h5 style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '2px', marginBottom: '30px', textTransform: 'uppercase' }}>Valuation Distribution</h5>
              <div style={{ height: '350px' }}>
                <SalesOverviewChart />
              </div>
           </div>
        </div>

        <div className="col-lg-4">
           <div className="table-wrap h-100">
              <h5 style={{ fontSize: '12px', fontWeight: '900', letterSpacing: '2px', marginBottom: '30px', textTransform: 'uppercase' }}>Collection Insights</h5>
              <div style={{ height: '350px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PieChart />
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

export default Home;