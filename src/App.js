import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Inventory from "./components/Inventory";
import Sales from "./components/Sales";
import Report from "./components/Report";
import "./App.css";

function App() {
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem("products");
    return saved
      ? JSON.parse(saved)
      : [
          { id: 1, name: "Apple", quantity: 50, price: 4, image: "./apple.jpg" },
          { id: 2, name: "Banana", quantity: 30, price: 4, image: "./banana.jpg" },
          { id: 3, name: "Orange", quantity: 20, price: 4, image: "./orange.jpg" },
        ];
  });

  const [sales, setSales] = useState(() => {
    const saved = localStorage.getItem("sales");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem("sales", JSON.stringify(sales));
  }, [sales]);

  const fileToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  // Add product with unique name check
  const addProduct = (product) => {
    const exists = products.some(
      (p) => p.name.toLowerCase() === product.name.toLowerCase()
    );
    if (exists) {
      return alert("A product with this name already exists!");
    }

    if (product.image instanceof File) {
      fileToBase64(product.image, (base64) => {
        const newProduct = { ...product, id: Date.now(), image: base64 };
        setProducts([...products, newProduct]);
      });
    } else {
      setProducts([...products, { ...product, id: Date.now() }]);
    }
  };

  // Edit product and save edit history
  const editProduct = (updatedProduct) => {
    setProducts((prevProducts) => {
      const oldProduct = prevProducts.find((p) => p.id === updatedProduct.id);
      if (!oldProduct) return prevProducts;

      const newProducts = prevProducts.map((p) =>
        p.id === updatedProduct.id ? updatedProduct : p
      );

      // Save edit log
      const edits = JSON.parse(localStorage.getItem("edits")) || [];
      edits.push({
        id: updatedProduct.id,
        name: updatedProduct.name,
        oldQuantity: oldProduct.quantity,
        newQuantity: updatedProduct.quantity,
        oldPrice: oldProduct.price,
        newPrice: updatedProduct.price,
        date: new Date().toLocaleString(),
      });
      localStorage.setItem("edits", JSON.stringify(edits));

      return newProducts;
    });
  };

  const deleteProduct = (id) =>
    setProducts(products.filter((p) => p.id !== id));

  // Pass recordSale into Sales instead of Inventory
  const recordSale = (productId, quantitySold) => {
    const product = products.find((p) => p.id === productId);
    if (!product || product.quantity < quantitySold)
      return alert("Not enough stock!");

    const updatedProduct = {
      ...product,
      quantity: product.quantity - quantitySold,
    };
    editProduct(updatedProduct);

    setSales([
      ...sales,
      {
        id: Date.now(),
        productName: product.name,
        quantitySold,
        total: quantitySold * product.price,
      },
    ]);
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <h2> Wings Cafe</h2>
          <ul>
            <li><Link to="/">Dashboard</Link></li>
            <li><Link to="/inventory">Inventory</Link></li>
            <li><Link to="/sales">Sales</Link></li>
            <li><Link to="/report">Report</Link></li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Dashboard products={products} />} />
          <Route
            path="/inventory"
            element={
              <Inventory
                products={products}
                addProduct={addProduct}
                editProduct={editProduct}
                deleteProduct={deleteProduct}
              />
            }
          />
          <Route
            path="/sales"
            element={
              <Sales
                salesProp={sales}
                products={products}
                recordSale={recordSale}
              />
            }
          />
          <Route
            path="/report"
            element={<Report products={products} sales={sales} />}
          />
        </Routes>

        <footer className="footer">
          © 2025 Wings Cafe | Spending money on us is not such a bad idea.
                 Contact us at:+266 69175507.
        </footer>
        
      </div>
    </Router>
  );
}

export default App;
