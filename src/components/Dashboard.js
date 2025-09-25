import React from "react";
import "./Dashboard.css";

function Dashboard({ products }) {
  return (
    <div className="dashboard">
      <h1> Have a taste of our amazing delicacies </h1>
      <div className="product-grid">
        {products.length === 0 ? (
          <p>No products available</p>
        ) : (
          products.map((p) => (
            <div
              key={p.id}
              className={`product-card ${p.quantity <= 5 ? "low-stock" : ""}`}
            >
              <img
                src={p.image}
                alt={p.name}
                className="product-image"
              />
              <h3>{p.name}</h3>
              <p>Price: R{p.price.toFixed(2)}</p>
              <p className="quantity">
                Quantity: {p.quantity}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
