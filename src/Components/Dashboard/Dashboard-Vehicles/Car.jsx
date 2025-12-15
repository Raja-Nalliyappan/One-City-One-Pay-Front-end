import { Footer } from "../Footer";
import { Header } from "../Header";
import { Nav } from "../Nav";
import "./Car.css";
import car1 from "../Dashboard-images/Bike1.png"; // replace with Car image
import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";

export const Car = () => {

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [carRoutes, setCarRoutes] = useState([]);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [fromFocus, setFromFocus] = useState(false);
  const [toFocus, setToFocus] = useState(false);
  const ticketQRRef = useRef(null);
  const [carPickerName, setCarPickerName] = useState(null);
  
  const OTP = Math.floor(Math.random() * 100000);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  // Default Car Routes
  const carRouteList = [
    {
      id: "north-chennai",
      title: "North Chennai",
      routes: [
        { fromTo: "Perambur → Kilpauk", price: "₹60" },
        { fromTo: "Washermenpet → Egmore", price: "₹70" },
        { fromTo: "Kolathur → Anna Nagar", price: "₹80" },
        { fromTo: "Royapuram → Parrys Corner", price: "₹50" },
        { fromTo: "Thiruvottiyur → Broadway", price: "₹65" },
      ],
    },
    {
      id: "east-chennai",
      title: "East Chennai",
      routes: [
        { fromTo: "Perungudi → Adyar", price: "₹110" },
        { fromTo: "Velachery → Adyar", price: "₹80" },
        { fromTo: "OMR → Sholinganallur", price: "₹90" },
        { fromTo: "Thoraipakkam → Perungudi", price: "₹55" },
        { fromTo: "Adyar → Besant Nagar", price: "₹60" },
      ],
    },
    {
      id: "south-chennai",
      title: "South Chennai",
      routes: [
        { fromTo: "Sholinganallur → Velachery", price: "₹120" },
        { fromTo: "Sholinganallur → Thoraipakkam", price: "₹60" },
        { fromTo: "Perungudi → Sholinganallur", price: "₹90" },
        { fromTo: "Mugalivakkam → Sholinganallur", price: "₹120" },
        { fromTo: "Medavakkam → Adyar", price: "₹150" },
      ],
    },
    {
      id: "west-chennai",
      title: "West Chennai",
      routes: [
        { fromTo: "Avadi → Ambattur", price: "₹70" },
        { fromTo: "Ambattur → Koyambedu", price: "₹80" },
        { fromTo: "Porur → DLF IT Park", price: "₹55" },
        { fromTo: "Iyyappanthangal → Ramapuram", price: "₹55" },
        { fromTo: "Kundrathur → Porur", price: "₹65" },
      ],
    },
  ];

  // Fetch from API (optional)
  useEffect(() => {
    const API = process.env.REACT_APP_API_BASE_URL;
    fetch(`${API}/api/Routes/CarRoute`)
      .then((res) => res.json())
      .then((data) => setCarRoutes(data))
      .catch((err) => console.log(err));
  }, []);

  const fromLocations = [...new Set(carRoutes.map((r) => r.fromLocation))].filter(Boolean);
  const toLocations = [...new Set(carRoutes.map((r) => r.toLocation))].filter(Boolean);

  const fromSuggestions = fromLocations.filter((loc) =>
    loc.toLowerCase().includes(searchFrom.toLowerCase())
  );
  const toSuggestions = toLocations.filter((loc) =>
    loc.toLowerCase().includes(searchTo.toLowerCase())
  );

  const carRoutesSearch = () => {
    const filtered = carRoutes.filter((route) => {
      const from = route.fromLocation || "";
      const to = route.toLocation || "";
      return (
        (!searchFrom || from.toLowerCase().includes(searchFrom.toLowerCase())) &&
        (!searchTo || to.toLowerCase().includes(searchTo.toLowerCase()))
      );
    });
    setFilteredRoutes(filtered);
    setShowPopup(true);
  };

  useEffect(() => {
    const filtered = carRoutes.filter((route) => {
      const from = route.fromLocation || "";
      const to = route.toLocation || "";
      return (
        (!searchFrom || from.toLowerCase().includes(searchFrom.toLowerCase())) &&
        (!searchTo || to.toLowerCase().includes(searchTo.toLowerCase()))
      );
    });
    setFilteredRoutes(filtered);
  }, [searchFrom, searchTo, carRoutes]);

  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    setStep(1);
    setPassword("");
    setSuccess(false);
    setTicketData(null);
  };

  const handleRouteSelect = (route) => {
    handleSelectRoute(route);
    setShowPopup(false);
  };

  const getNumericPrice = (price) =>
    typeof price === "string" ? Number(price.replace("₹", "")) : price;

  const handlePay = async () => {
    if (!password) return alert("Please enter your password.");
    if (password !== user.password) return alert("Incorrect password!");
    setLoading(true);
    setSuccess(false);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Payment Successful ✅", {
          body: `You paid ${selectedRoute.price} for ${selectedRoute.fromTo || `${selectedRoute.fromLocation} → ${selectedRoute.toLocation}`}`,
          icon: "https://cdn-icons-png.flaticon.com/512/190/190411.png",
        });
      }
    }, 2000);
    setTimeout(showTicketQR, 3000);

  //Handle for bookings acount and amount
    const bookings = {
      UserName: loggedInUser.name,
      BookingAmount: Number(selectedRoute?.price?.toString().replace("₹", "").trim()||0),
      VehicleType: "Car"
    }

    try{
      const API = process.env.REACT_APP_API_BASE_URL;
      const res = await axios.post(`${API}/api/BookingCountAndAmount/BookingCountAndAmountCar`, bookings);
      console.log("✅ Response:", res.data)
    }catch(err){
      console.log("❌ Error posting booking:", err)
    }
  };

  const showTicketQR = () => {
    const data = {
      ticketID: `TICKET-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      route: selectedRoute.fromTo || `${selectedRoute.fromLocation} → ${selectedRoute.toLocation}`,
      amount: selectedRoute.price,
      time: new Date().toLocaleString(),
    };
    setTicketData(data);
    setStep(3);
  };

  const handleDownloadTicket = () => {
    const canvas = ticketQRRef.current?.querySelector("canvas");
    if (canvas) {
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "CarTicket.png";
      link.click();
    }
  };

  useEffect(() => {
    fetch("https://randomuser.me/api/?results=10000&nat=IN")
      .then((res) => res.json())
      .then((json) => {
        const users = json.results.map((user) => ({
          fullName: `${user.name.first} ${user.name.last}`,
          phone: user.phone,
        }));
        const randomIndex = Math.floor(Math.random() * users.length);
        setCarPickerName(users[randomIndex]);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="car-page">
      <Header />
      <Nav />

      <div className="car-booking">
        <div className="car-booking-left">
          <h1>Request a Car Ride</h1>
          <p>Up to 50% off your first 5 car rides. T&Cs apply. *</p>

          <div className="car-inputs">
            <div className="autocomplete">
              <input
                type="text"
                placeholder="Enter pickup location"
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                onFocus={() => setFromFocus(true)}
                onBlur={() => setTimeout(() => setFromFocus(false), 150)}
              />
              {fromFocus && fromSuggestions.length > 0 && (
                <ul className="suggestions">
                  {fromSuggestions.map((loc, idx) => (
                    <li key={idx} onMouseDown={() => setSearchFrom(loc)}>
                      {loc}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="autocomplete">
              <input
                type="text"
                placeholder="Enter destination"
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                onFocus={() => setToFocus(true)}
                onBlur={() => setTimeout(() => setToFocus(false), 150)}
              />
              {toFocus && toSuggestions.length > 0 && (
                <ul className="suggestions">
                  {toSuggestions.map((loc, idx) => (
                    <li key={idx} onMouseDown={() => setSearchTo(loc)}>
                      {loc}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div className="car-buttons">
            <button onClick={carRoutesSearch}>Check Prices</button>
          </div>

          {showPopup && (
            <div className="popup-overlay" onClick={() => setShowPopup(false)}>
              <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h2>Available Routes</h2>
                <button className="close-btn" onClick={() => setShowPopup(false)}>
                  X
                </button>
                {filteredRoutes.length > 0 ? (
                  <ul>
                    {filteredRoutes.map((route, idx) => (
                      <li key={idx} onClick={() => handleRouteSelect(route)}>
                        {route.fromLocation} → {route.toLocation} : ₹{route.price}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No routes found</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="car-booking-right">
          <img src={car1} alt="Car ride illustration" />
        </div>
      </div>

      <div className="car-routes">
        <h1>Comfortable Car Rides, Low Fares</h1>
        <h3>Top Boarding & Dropping Points in Chennai</h3>
        <p>Choose from popular car routes across Chennai for a smooth and affordable commute.</p>
        <div className="car-routes-container">
          {carRouteList.map((region) => (
            <section className="car-region" key={region.id}>
              <h2>{region.title}</h2>
              <ul>
                {region.routes.map((route, idx) => (
                  <li key={idx} onClick={() => handleSelectRoute(route)}>
                    <div className="car-route-fromto">{route.fromTo}</div>
                    <div className="car-route-price">{route.price}</div>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {selectedRoute && (
        <div className="qr-popup" onClick={() => setSelectedRoute(null)}>
          <div className="qr-container" onClick={(e) => e.stopPropagation()}>
            {step === 1 && (
              <>
                <h3>{selectedRoute.fromTo || `${selectedRoute.fromLocation} → ${selectedRoute.toLocation}`}</h3>
                <p>Amount: <strong>{selectedRoute.price}</strong></p>
                <QRCodeCanvas
                  value={`upi://pay?pa=OneCitOnePay@oksbi&pn=Raja&tn=Car Ride&am=${getNumericPrice(selectedRoute.price)}&cu=INR`}
                  size={180}
                />
                <p className="upi-info">
                  Pay {selectedRoute.price} to <strong>Raja</strong><br />
                  UPI ID: <strong>OneCitOnePay@oksbi</strong><br />
                  Purpose: <strong>Car Ride</strong>
                </p>
                <div className="qr-popup-button">
                  <button onClick={() => setStep(2)}>Use to Pay</button>
                  <button onClick={() => setSelectedRoute(null)}>Close</button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <h3>Confirm Payment</h3>
                <p>
                  Pay {selectedRoute.price} for {selectedRoute.fromTo || `${selectedRoute.fromLocation} → ${selectedRoute.toLocation}`}
                </p>
                <input
                  type="password"
                  placeholder="Enter your login password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {!loading && !success && (
                  <div className="qr-popup-button">
                    <button onClick={handlePay}>Pay</button>
                    <button onClick={() => setSelectedRoute(null)}>Close</button>
                  </div>
                )}
                {loading && <div className="spinner"></div>}
                {success && <div className="success-text">Payment Successful ✅</div>}
              </>
            )}

            {step === 3 && ticketData && (
              <>
                <h3>Your Ticket</h3>
                <p style={{ margin: "5px" }}>Enjoy Your Ride</p>
                <h3 style={{ margin: "5px", color:"green" }}>
                  {selectedRoute.fromTo || `${selectedRoute.fromLocation} → ${selectedRoute.toLocation}`}
                </h3>
                <div ref={ticketQRRef}>
                  <QRCodeCanvas value={JSON.stringify(ticketData)} size={180} />
                </div>
                {carPickerName ? (
                  <div className="pickuper-info">
                    <strong>Driver Name:</strong> {carPickerName.fullName} <br />
                    <strong>Driver Phone:</strong> {carPickerName.phone}<br />
                    <strong>OTP:</strong> {OTP}
                  </div>
                ) : (
                  <p>Loading random driver...</p>
                )}
                <div className="qr-popup-button">
                  <button onClick={handleDownloadTicket}>Download Ticket</button>
                  <button onClick={() => setSelectedRoute(null)}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};
