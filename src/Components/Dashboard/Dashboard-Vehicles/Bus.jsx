import { Footer } from "../Footer";
import { Header } from "../Header";
import { Nav } from "../Nav";
import "./Bus.css";
import busImage from "../Dashboard-images/Dashboard-Bus.png"; // replace with Bus image if available
import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";

export const Bus = () => {

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [busRoutes, setBusRoutes] = useState([]);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [fromFocus, setFromFocus] = useState(false);
  const [toFocus, setToFocus] = useState(false);
  const ticketQRRef = useRef(null);
  const [busPickerName, setBusPickerName] = useState(null);

  const OTP = Math.floor(Math.random() * 100000);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  const busRouteList = [
    {
      id: "north-chennai",
      title: "North Chennai",
      routes: [
        { fromTo: "Perambur → Kilpauk", price: "₹20" },
        { fromTo: "Washermenpet → Egmore", price: "₹25" },
        { fromTo: "Kolathur → Anna Nagar", price: "₹30" },
        { fromTo: "Royapuram → Parrys Corner", price: "₹15" },
        { fromTo: "Thiruvottiyur → Broadway", price: "₹20" },
      ],
    },
    {
      id: "east-chennai",
      title: "East Chennai",
      routes: [
        { fromTo: "Perungudi → Adyar", price: "₹50" },
        { fromTo: "Velachery → Adyar", price: "₹35" },
        { fromTo: "Old Mahabalipuram Road → Sholinganallur", price: "₹40" },
        { fromTo: "Thoraipakkam → Perungudi", price: "₹20" },
        { fromTo: "Adyar → Besant Nagar", price: "₹25" },
      ],
    },
    {
      id: "south-chennai",
      title: "South Chennai",
      routes: [
        { fromTo: "Sholinganallur → Velachery", price: "₹40" },
        { fromTo: "Sholinganallur → Thoraipakkam", price: "₹15" },
        { fromTo: "Perungudi → Sholinganallur", price: "₹25" },
        { fromTo: "Mugalivakkam → Sholinganallur", price: "₹40" },
        { fromTo: "Medavakkam → Adyar", price: "₹85" },
      ],
    },
    {
      id: "west-chennai",
      title: "West Chennai",
      routes: [
        { fromTo: "Avadi → Ambattur", price: "₹25" },
        { fromTo: "Ambattur → Koyambedu", price: "₹30" },
        { fromTo: "Porur → DLF IT Park", price: "₹20" },
        { fromTo: "Iyyappanthangal → Ramapuram", price: "₹20" },
        { fromTo: "Kundrathur → Porur", price: "₹25" },
      ],
    },
  ];

  useEffect(() => {
    const API = process.env.REACT_APP_API_BASE_URL;
    fetch(`${API}/api/Routes/BusRoute`)
      .then((res) => res.json())
      .then((data) => setBusRoutes(data))
      .catch((err) => console.log(err));
  }, []);

  const fromLocations = [...new Set(busRoutes.map((r) => r.fromLocation))].filter(Boolean);
  const toLocations = [...new Set(busRoutes.map((r) => r.toLocation))].filter(Boolean);

  const fromSuggestions = fromLocations.filter((loc) =>
    loc.toLowerCase().includes(searchFrom.toLowerCase())
  );
  const toSuggestions = toLocations.filter((loc) =>
    loc.toLowerCase().includes(searchTo.toLowerCase())
  );

  const busRoutesSearch = () => {
    const filtered = busRoutes.filter((route) => {
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
    const filtered = busRoutes.filter((route) => {
      const from = route.fromLocation || "";
      const to = route.toLocation || "";
      return (
        (!searchFrom || from.toLowerCase().includes(searchFrom.toLowerCase())) &&
        (!searchTo || to.toLowerCase().includes(searchTo.toLowerCase()))
      );
    });
    setFilteredRoutes(filtered);
  }, [searchFrom, searchTo, busRoutes]);

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

  const getNumericPrice = (price) => {
    if (typeof price === "number") return price;
    if (typeof price === "string") return Number(price.replace("₹", ""));
    return 0;
  };

  const handlePay = async () => {
    if (!password) return alert("Please enter your password.");
    if (password !== password) return alert("Incorrect password!");
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
      VehicleType: "Bus"
    }

    try{
      const API = process.env.REACT_APP_API_BASE_URL;
      const res = await axios.post(`${API}/api/BookingCountAndAmount/BookingCountAndAmountBus`, bookings);
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
      link.download = "BusTicket.png";
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
        setBusPickerName(users[randomIndex]);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="bus-page">
      <Header />
      <Nav />

      <div className="bus-booking">
        <div className="bus-booking-left">
          <h1>Request a Bus Ride</h1>
          <p>Up to 50% off your first 5 bus rides. T&Cs apply. *</p>

          <div className="bus-inputs">
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

          <div className="bus-buttons">
            <button onClick={busRoutesSearch}>Check Prices</button>
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

        <div className="bus-booking-right">
          <img src={busImage} alt="Bus ride illustration" />
        </div>
      </div>

      <div className="bus-routes">
        <h1>Quick Bus Rides, Low Fares</h1>
        <h3>Top Boarding & Dropping Points in Chennai</h3>
        <p>
          Choose from popular bus routes across Chennai for a fast and affordable commute.
          Prices are estimated.
        </p>
        <div className="bus-routes-container">
          {busRouteList.map((region) => (
            <section className="bus-region" key={region.id}>
              <h2>{region.title}</h2>
              <ul>
                {region.routes.map((route, idx) => (
                  <li key={idx} onClick={() => handleSelectRoute(route)}>
                    <div className="bus-route-fromto">{route.fromTo}</div>
                    <div className="bus-route-price">{route.price}</div>
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
                  value={`upi://pay?pa=OneCitOnePay@oksbi&pn=Raja&tn=Bus Ride&am=${getNumericPrice(selectedRoute.price)}&cu=INR`}
                  size={180}
                />
                <p className="upi-info">
                  Pay {selectedRoute.price} to <strong>Raja</strong><br />
                  UPI ID: <strong>OneCitOnePay@oksbi</strong><br />
                  Purpose: <strong>Bus Ride</strong>
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
                {busPickerName ? (
                  <div className="pickuper-info">
                    <strong>Driver Name:</strong> {busPickerName.fullName} <br />
                    <strong>Driver Phone:</strong> {busPickerName.phone}<br />
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
