import React, { useState } from "react";

function Inventory({ products, addProduct, editProduct, deleteProduct }) {
  const [editProductId, setEditProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [newProduct, setNewProduct] = useState({
    name: "",
    quantity: "",
    price: "",
    image: null,
  });

  const startEdit = (product) => {
    setEditProductId(product.id);
    setEditedProduct({ ...product });
  };

  const saveEdit = () => {
    const updated = {
      ...editedProduct,
      price: Number(editedProduct.price),
      quantity: Number(editedProduct.quantity),
    };
    editProduct(updated);
    setEditProductId(null);
  };

  const fileToBase64 = (file, callback) => {
    const reader = new FileReader();
    reader.onloadend = () => callback(reader.result);
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!newProduct.image) return alert("Please select an image");

    fileToBase64(newProduct.image, (base64Image) => {
      const productToAdd = {
        ...newProduct,
        id: Date.now(),
        price: Number(newProduct.price),
        quantity: Number(newProduct.quantity),
        image: base64Image,
      };

      addProduct(productToAdd);
      setNewProduct({ name: "", quantity: "", price: "", image: null });
    });
  };

  return (
    <div className="inventory">
      <h1>Inventory</h1>

      {products.length === 0 ? (
        <p>No products available</p>
      ) : (
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Quantity</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <td>
                  <img
                    src={p.image}
                    alt={p.name}
                    style={{ width: "50px", height: "50px", borderRadius: "5px" }}
                  />
                </td>
                <td>
                  {editProductId === p.id ? (
                    <input
                      type="text"
                      value={editedProduct.name}
                      onChange={(e) =>
                        setEditedProduct({ ...editedProduct, name: e.target.value })
                      }
                    />
                  ) : (
                    p.name
                  )}
                </td>
                <td>
                  {editProductId === p.id ? (
                    <input
                      type="number"
                      value={editedProduct.quantity}
                      onChange={(e) =>
                        setEditedProduct({ ...editedProduct, quantity: e.target.value })
                      }
                    />
                  ) : (
                    p.quantity
                  )}
                </td>
                <td>
                  {editProductId === p.id ? (
                    <input
                      type="number"
                      value={editedProduct.price}
                      onChange={(e) =>
                        setEditedProduct({ ...editedProduct, price: e.target.value })
                      }
                    />
                  ) : (
                    `R${p.price.toFixed(2)}`
                  )}
                </td>
                <td>
                  {editProductId === p.id ? (
                    <>
                      <button onClick={saveEdit}>Save</button>
                      <button onClick={() => setEditProductId(null)}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(p)}>Edit</button>
                      <button onClick={() => deleteProduct(p.id)}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <h2 style={{ marginTop: "30px" }}>Add New Product</h2>
      <form onSubmit={handleAddProduct} className="add-product-form">
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={newProduct.quantity}
          onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          required
        />
        <label className="custom-file-upload">
          {newProduct.image ? "Image Selected " : "Select Image"}
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setNewProduct({ ...newProduct, image: e.target.files[0] })
            }
            required
          />
        </label>
        <button type="submit">Add your Product</button>
      </form>
    </div>
  );
}

export default Inventory;
