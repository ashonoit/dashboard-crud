import React from "react";

export default function EditUserModal({ editing, setEditing, saveEdit }) {
  if (!editing) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    saveEdit();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <h3>Edit User</h3>
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Name</label>
            <input type="text" name="name" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" value={editing.email} onChange={(e) => setEditing({ ...editing, email: e.target.value })} required />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" name="phoneNumber" value={editing.phoneNumber || ""} onChange={(e) => setEditing({ ...editing, phoneNumber: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Age</label>
            <input type="number" name="age" value={editing.age || ""} onChange={(e) => setEditing({ ...editing, age: e.target.value })} />
          </div>

          <div className="form-group">
            <label>Father's Name</label>
            <input type="text" name="fathersNumber" value={editing.fathersNumber || ""} onChange={(e) => setEditing({ ...editing, fathersNumber: e.target.value })} />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn">Save</button>
            <button type="button" className="btn secondary" onClick={() => setEditing(null)}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
