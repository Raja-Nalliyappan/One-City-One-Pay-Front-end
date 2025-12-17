import { useState, useEffect } from 'react';
import "./Admin.css"
import { useNavigate } from 'react-router-dom';

export const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [summary, setSummary] = useState({});
  const [isLoading, setisLoading] = useState(false)

  useEffect(() => {
    summarizeBookings();
  }, [bookings]);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  const summarizeBookings = () => {
    const newSummary = {};
    bookings.forEach((booking) => {
      const { vehicleType, bookingAmount } = booking;
      if (!newSummary[vehicleType]) {
        newSummary[vehicleType] = { count: 0, amount: 0 };
      }
      newSummary[vehicleType].count += 1;
      newSummary[vehicleType].amount += bookingAmount;
    });
    setSummary(newSummary);
  };

  const filteredBookings = bookings.filter((booking) => {
    return (
      booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.vehicleType.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const filteredUserList = users.filter((user) => {
    return (
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  //logout
  const navigate = useNavigate();
  const handleLogout = () => {
    const adminLogoutConfirmation = window.confirm("You have been logged out!")
    if (adminLogoutConfirmation) {
      navigate("/login-page")
    }
  }

  const API = process.env.REACT_APP_API_BASE_URL;
  //Bike Booking Count and amount 
  useEffect(() => {

    fetch(`${API}/api/Users/GetRegisterUserList`)
      .then((response) => response.json())
      .then((users) => {
        setUsers(users);
      })
  }, [API])

  useEffect(() => {
    const fetchBookingList = async () => {
      setisLoading(true)
      try {
        const [bikeRes, autoRes, carRes, busRes, metroRes, localTrainRes] = await Promise.all([
          fetch(`${API}/api/BookingCountAndAmount/GetBikeBookingCountAndAmount`),
          fetch(`${API}/api/BookingCountAndAmount/GetAutoBookingCountAndAmount`),
          fetch(`${API}/api/BookingCountAndAmount/GetCarBookingCountAndAmount`),
          fetch(`${API}/api/BookingCountAndAmount/GetBusBookingCountAndAmount`),
          fetch(`${API}/api/BookingCountAndAmount/GetMetroBookingCountAndAmount`),
          fetch(`${API}/api/BookingCountAndAmount/GetLocalTrainBookingCountAndAmount`)
        ])
        const [bikeData, autoData, carData, busData, metroData, localTraindData] = await Promise.all([bikeRes.json(), autoRes.json(), carRes.json(), busRes.json(), metroRes.json(), localTrainRes.json()]);

        setBookings([...bikeData, ...autoData, ...carData, ...busData, ...metroData, ...localTraindData])
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setisLoading(false)
      }
    }
    fetchBookingList()
  }, [API])



  return (
    <>
      <div className="admin-dashboard">
        <aside className="sidebar">
          <h2>One City One Pay</h2>
          <nav>
            {['dashboard', 'bookings', 'users'].map((section) => (
              <a
                href="#"
                key={section}
                className={activeSection === section ? 'active' : ''}
                onClick={() => handleSectionChange(section)}
              >
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </a>
            ))}
            <a
              href="#"
              onClick={handleLogout}
              className="logout-button">Logout
            </a>
          </nav>
        </aside>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-bar-container">
              <div className="loading-bar" id="loading-bar"></div>
            </div>
            <div id="loading-text">Loading information...</div>
          </div>
        ) : (
          <main>
            {/* Dashboard Section */}
            {activeSection === 'dashboard' && (
              <section id="dashboard" className="content-section active">
                <div className="cards">
                  <div className="card">
                    <h3>Total Bookings</h3>
                    <p>{bookings.length.toLocaleString()}</p>
                  </div>
                  <div className="card">
                    <h3>Total Payments</h3>
                    <p>${(bookings.reduce((sum, b) => sum + (b.bookingAmount ?? 0), 0)).toLocaleString()}</p>
                  </div>
                  <div className="card">
                    <h3>Active Users</h3>
                    <p>{[...new Set(users.map((user) => user.name).filter(Boolean))].length.toLocaleString()}</p>
                  </div>
                </div>

                <div className='booking-count-list' style={{ marginTop: "50px" }}>
                  <h2>Bookings Summary by Type</h2>
                  <div className="cards" id="bookingSummaryCards">
                    {Object.keys(summary).map((vehicleType) => (
                      <div key={vehicleType} className="card">
                        <h3>{vehicleType} Bookings</h3>
                        <p>Count: {summary[vehicleType].count.toLocaleString()}</p>
                        <p>Amount: ${summary[vehicleType].amount.toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Bookings Section */}
            {activeSection === 'bookings' && (
              <section id="bookings" className="content-section active">
                <h2>Bookings</h2>
                <div className="search-box">
                  <input
                    type="text"
                    id="bookingSearchInput"
                    placeholder="Search bookings by user name or booking types..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                  />
                </div>
                <table id="bookingsTable">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Booking Type</th>
                      <th>Date</th>
                      <th>Fare</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking, index) => (
                      <tr key={booking.id}>
                        <td>{index + 1}</td>
                        <td>{booking.userName}</td>
                        <td>{booking.vehicleType}</td>
                        <td>{booking.bookingDate ? booking.bookingDate.slice(0, 10) : 0}</td>
                        <td>{booking.bookingAmount?.toLocaleString() || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {/* Users Section */}
            {activeSection === 'users' && (
              <section id="users" className="content-section active">
                <h2>Users</h2>
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Search users by name or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <table id="usersTable">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>phone</th>
                      <th>Registered On</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUserList.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.phone}</td>
                        <td>{user.registerDate ? user.registerDate.slice(0, 10) : ""}</td>
                        <td>
                          <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}
          </main>
        )}
      </div>
    </>
  );
};

