import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    course: ""
  });
  const [editingId, setEditingId] = useState(null);

  const loadUsers = () => {
    fetch("/api/users")
      .then((response) => response.json())
      .then((data) => setUsers(data))
      .catch((error) => console.log(error));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const saveUser = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.course) {
      alert("Please fill all fields");
      return;
    }

    const url = editingId
      ? `/api/users/${editingId}`
      : "/api/users";

    const method = editingId ? "PUT" : "POST";

    fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    })
      .then((response) => response.json())
      .then((savedUser) => {
        if (editingId) {
          setUsers(
            users.map((user) =>
              user.id === editingId ? savedUser : user
            )
          );
        } else {
          setUsers([...users, savedUser]);
        }

        resetForm();
      })
      .catch((error) => console.log(error));
  };

  const editUser = (user) => {
    setEditingId(user.id);

    setFormData({
      name: user.name,
      email: user.email,
      course: user.course
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const deleteUser = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (!confirmDelete) {
      return;
    }

    fetch(`/api/users/${id}`, {
      method: "DELETE"
    })
      .then(() => {
        setUsers(users.filter((user) => user.id !== id));
      })
      .catch((error) => console.log(error));
  };

  const resetForm = () => {
    setEditingId(null);

    setFormData({
      name: "",
      email: "",
      course: ""
    });
  };

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-dark bg-dark shadow">
        <div className="container">
          <span className="navbar-brand fw-bold fs-4">
            College Management System
          </span>
        </div>
      </nav>

      <div className="container py-5">

        <div className="text-center mb-5">
          <h1 className="fw-bold">Student Management</h1>
          <p className="text-muted">
            Manage college users with Create, Read, Update and Delete operations
          </p>
        </div>

        <div className="row g-4">

          <div className="col-lg-4">

            <div className="card border-0 shadow-sm rounded-4">
              <div className="card-body p-4">

                <h3 className="fw-bold mb-4">
                  {editingId ? "Edit User" : "Add User"}
                </h3>

                <form onSubmit={saveUser}>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter email"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Course
                    </label>

                    <input
                      type="text"
                      name="course"
                      className="form-control"
                      value={formData.course}
                      onChange={handleChange}
                      placeholder="Enter course"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 fw-semibold"
                  >
                    {editingId ? "Update User" : "Add User"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100 mt-2"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}

                </form>

              </div>
            </div>

          </div>

          <div className="col-lg-8">

            <div className="card border-0 shadow-sm rounded-4">

              <div className="card-body p-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                  <div>
                    <h3 className="fw-bold mb-1">
                      Users
                    </h3>

                    <p className="text-muted mb-0">
                      Total Users: {users.length}
                    </p>
                  </div>

                  <span className="badge bg-primary fs-6">
                    {users.length}
                  </span>

                </div>

                {users.length === 0 ? (
                  <div className="text-center py-5">
                    <h5 className="text-muted">
                      No users found
                    </h5>

                    <p className="text-muted">
                      Add your first user using the form.
                    </p>
                  </div>
                ) : (

                  <div className="table-responsive">

                    <table className="table table-hover align-middle">

                      <thead className="table-dark">

                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Course</th>
                          <th>Actions</th>
                        </tr>

                      </thead>

                      <tbody>

                        {users.map((user) => (

                          <tr key={user.id}>

                            <td className="fw-semibold">
                              {user.name}
                            </td>

                            <td>
                              {user.email}
                            </td>

                            <td>
                              <span className="badge bg-light text-dark border">
                                {user.course}
                              </span>
                            </td>

                            <td>

                              <button
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => editUser(user)}
                              >
                                Edit
                              </button>

                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteUser(user.id)}
                              >
                                Delete
                              </button>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default App;
