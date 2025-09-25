import React, { useEffect, useState } from "react";

function Sales({ products, recordSale }) {
  const storedSales = JSON.parse(localStorage.getItem("sales")) || [];
  const [sales, setSales] = useState(storedSales);
  const [quantities, setQuantities] = useState({}); // track quantities entered

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  const handleQuantityChange = (id, value) => {
    setQuantities({ ...quantities, [id]: value });
  };

  const handleConfirmSale = () => {
    const saleItems = products
      .filter((p) => quantities[p.id] && Number(quantities[p.id]) > 0)
      .map((p) => {
        const qty = Number(quantities[p.id]);
        if (qty > p.quantity) {
          alert(`Not enough stock for ${p.name}`);
          return null;
        }
        return {
          id: p.id,
          productName: p.name,
          quantitySold: qty,
          total: p.price * qty,
        };
      })
      .filter(Boolean);

    if (saleItems.length === 0) {
      return alert("Enter at least one valid quantity to sell");
    }

    // Save sales
    setSales([...sales, ...saleItems]);

    // Update inventory
    saleItems.forEach((item) => {
      recordSale(item.id, item.quantitySold);
    });

    // Reset quantities
    setQuantities({});
  };

  // 🔥 Find top selling product
  const getTopSelling = () => {
    if (sales.length === 0) return null;

    const totals = {};
    sales.forEach((s) => {
      totals[s.productName] = (totals[s.productName] || 0) + s.quantitySold;
    });

    let topProduct = null;
    let maxQty = 0;
    for (const [name, qty] of Object.entries(totals)) {
      if (qty > maxQty) {
        maxQty = qty;
        topProduct = { name, qty };
      }
    }
    return topProduct;
  };

  const topSelling = getTopSelling();

  return (
    <div className="sales">
      

      {/* Top Selling Section */}
      {topSelling && (
        <div className="top-selling" style={{ marginBottom: "20px" }}>
          <h3>Top Selling Product</h3>
          <p>
            {topSelling.name} — Sold {topSelling.qty} 
          </p>
        </div>
      )}

      {/* Product List with Quantity Inputs */}
      <div className="add-sale">
        <h3>Select Products to Sell</h3>
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Stock</th>
              <th>Price</th>
              <th>Quantity to Sell</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.quantity}</td>
                <td>R{p.price.toFixed(2)}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={quantities[p.id] || ""}
                    onChange={(e) => handleQuantityChange(p.id, e.target.value)}
                    style={{ width: "60px" }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleConfirmSale} style={{ marginTop: "10px" }}>
          Confirm Sale
        </button>
      </div>

      {/* Past Sales */}
      {sales.length === 0 ? (
        <p>No sales recorded yet.</p>
      ) : (
        <>
          <h2>Sales History</h2>
          <table className="sales-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity Sold</th>
                <th>Total (R)</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((s, index) => (
                <tr key={index}>
                  <td>{s.productName}</td>
                  <td>{s.quantitySold}</td>
                  <td>R{s.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default Sales;
