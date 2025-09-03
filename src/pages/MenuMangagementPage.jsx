import React, { useEffect, useState } from "react";
import {
  fetchMenuItemsApi,
  addMenuItemApi,
  editMenuItemApi,
  deleteMenuItemApi,
} from "../services/authAPI.jsx";
import { Link } from "react-router-dom";
import AdminNavBar from "./AdminNavBar.jsx";

// Use the exact names you want to show on the site
const CATEGORY_OPTIONS = [
  "Lunch & Dinner",
  "Banquets",
  "Family Feast",
  "Bar Snacks",
  "Cocktails",
  "Wines",
  "Beer",
  "Free From Booze",
  "Happy Hour",
];

export const MenuPage = () => {
  const [menu, setMenu] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    _id: null,
    name: "",
    category: CATEGORY_OPTIONS[0],  // default to first option
    description: "",
    price: "",
    available: true,
  });
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    setLoading(true);
    setError("");
    const res = await fetchMenuItemsApi();
    if (res.status === "success") {
      setMenu(res.data || []);
    } else {
      setError(res.message || "Failed to load menu.");
    }
    setLoading(false);
  };

  // Filter list uses fixed categories (plus "All")
  const filteredMenu =
    filter === "All" ? menu : menu.filter((m) => m.category === filter);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      ...form,
      price: Number(form.price), // ensure number
    };

    let res;
    if (isEditing) {
      res = await editMenuItemApi(form._id, payload);
    } else {
      res = await addMenuItemApi(payload);
    }

    if (res.status === "success") {
      await fetchMenu();
      resetForm();
    } else {
      setError(res.message || "Failed to save menu item.");
    }
    setLoading(false);
  };

  const handleEdit = (item) => {
    // If old data has a category not in our list, fall back to first option
    const safeCategory = CATEGORY_OPTIONS.includes(item.category)
      ? item.category
      : CATEGORY_OPTIONS[0];

    setForm({
      _id: item._id,
      name: item.name || "",
      category: safeCategory,
      description: item.description || "",
      price: item.price ?? "",
      available: !!item.available,
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    setLoading(true);
    const res = await deleteMenuItemApi(id);
    if (res.status === "success") await fetchMenu();
    else setError(res.message || "Failed to delete menu item.");
    setLoading(false);
  };

  const resetForm = () => {
    setForm({
      _id: null,
      name: "",
      category: CATEGORY_OPTIONS[0],
      description: "",
      price: "",
      available: true,
    });
    setIsEditing(false);
  };

  return (
    <div className="container mt-4">
      <AdminNavBar />
      <h2>Menu Management</h2>

      {/* ADD / EDIT FORM */}
      <div className="mb-4" style={{ maxWidth: 700 }}>
        <h5>{isEditing ? "Edit Menu Item" : "Add Menu Item"}</h5>
        <form onSubmit={handleFormSubmit} className="row g-2">
          <div className="col-md-6">
            <input
              type="text"
              className="form-control"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="Name"
              required
            />
          </div>

          <div className="col-md-6">
            {/* Category dropdown (beginner friendly) */}
            <select
              className="form-select"
              name="category"
              value={form.category}
              onChange={handleFormChange}
              required
            >
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="col-12">
            <input
              type="text"
              className="form-control"
              name="description"
              value={form.description}
              onChange={handleFormChange}
              placeholder="Description"
              required
            />
          </div>

          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              name="price"
              value={form.price}
              onChange={handleFormChange}
              placeholder="Price"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="col-md-4 d-flex align-items-center">
            <input
              type="checkbox"
              className="form-check-input me-2"
              name="available"
              checked={form.available}
              onChange={handleFormChange}
              id="availableCheck"
            />
            <label className="form-check-label" htmlFor="availableCheck">
              Available
            </label>
          </div>

          <div className="col-md-4">
            <button className="btn btn-success" type="submit" disabled={loading}>
              {isEditing ? "Update" : "Add"}
            </button>
            {isEditing && (
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Filter */}
      <div className="mb-3">
        <label>Filter by Category: </label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="ms-2"
        >
          <option value="All">All</option>
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {error && <div className="text-danger mb-2">{error}</div>}
      {loading && <div>Loading...</div>}

      {/* Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Description</th>
            <th className="text-end">Price</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredMenu.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                No menu items found.
              </td>
            </tr>
          ) : (
            filteredMenu.map((item) => (
              <tr key={item._id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.description}</td>
                <td className="text-end">${Number(item.price).toFixed(2)}</td>
                <td>{item.available ? "Yes" : "No"}</td>
                <td>
                  <button
                    className="btn btn-sm btn-info me-2"
                    onClick={() => handleEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(item._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Link to="/" className="btn btn-secondary">Go Back</Link>
    </div>
  );
};
