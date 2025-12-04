import { Footer } from "../Footer";
import { Header } from "../Header";
import { Nav } from "../Nav";
import trainImg from "../Dashboard-images/Dashboard-LocalTrain.png";  
import "./Local-Train.css";
import { useState, useEffect, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import axios from "axios";

export const LocalTrain = () => {

  const [selectedRoute, setSelectedRoute] = useState(null);
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [ticketData, setTicketData] = useState(null);
  const [trainRoutes, setTrainRoutes] = useState([]);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [fromFocus, setFromFocus] = useState(false);
  const [toFocus, setToFocus] = useState(false);
  const ticketQRRef = useRef(null);
  const [trainPickerName, setTrainPickerName] = useState(null);

  const OTP = Math.floor(Math.random() * 100000);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser")) || {};

  // Static example routes
  const trainRouteList = [
    {
      id: "north-line",
      title: "North Line",
      routes: [
        { fromTo: "Chennai Central → Washermenpet", price: "₹10" },
        { fromTo: "Washermenpet → Royapuram", price: "₹5" },
        { fromTo: "Royapuram → Ennore", price: "₹15" },
        { fromTo: "Ennore → Thiruvottiyur", price: "₹10" },
        { fromTo: "Thiruvottiyur → Perambur", price: "₹15" },
      ],
    },
    {
      id: "south-line",
      title: "South Line",
      routes: [
        { fromTo: "Chennai Beach → Tambaram", price: "₹20" },
        { fromTo: "Tambaram → Chromepet", price: "₹10" },
        { fromTo: "Chromepet → Guindy", price: "₹15" },
        { fromTo: "Guindy → Saidapet", price: "₹10" },
        { fromTo: "Saidapet → St. Thomas Mount", price: "₹10" },
      ],
    },
    {
      id: "west-line",
      title: "West Line",
      routes: [
        { fromTo: "Avadi → Ambattur", price: "₹10" },
        { fromTo: "Ambattur → Perambur", price: "₹15" },
        { fromTo: "Perambur → Chennai Central", price: "₹15" },
        { fromTo: "Avadi → Tiruvallur", price: "₹20" },
        { fromTo: "Tiruvallur → Pattabiram", price: "₹10" },
      ],
    },
    {
      id: "east-line",
      title: "East Line",
      routes: [
        { fromTo: "Chennai Beach → Royapuram", price: "₹5" },
        { fromTo: "Royapuram → Washermenpet", price: "₹5" },
        { fromTo: "Washermenpet → Chennai Central", price: "₹10" },
        { fromTo: "Chennai Central → Egmore", price: "₹10" },
        { fromTo: "Egmore → Chetpet", price: "₹15" },
      ],
    },
  ];

  useEffect(() => {
    fetch("https://localhost:7172/api/Routes/LocalTrainRoute")
      .then((res) => res.json())
      .then((data) => setTrainRoutes(data))
      .catch((err) => console.log(err));
  }, []);

  const fromLocations = [...new Set(trainRoutes.map((r) => r.fromLocation))].filter(Boolean);
  const toLocations = [...new Set(trainRoutes.map((r) => r.toLocation))].filter(Boolean);

  const fromSuggestions = fromLocations.filter((loc) =>
    loc.toLowerCase().includes(searchFrom.toLowerCase())
  );
  const toSuggestions = toLocations.filter((loc) =>
    loc.toLowerCase().includes(searchTo.toLowerCase())
  );

  const trainRoutesSearch = () => {
    const filtered = trainRoutes.filter((route) => {
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
    const filtered = trainRoutes.filter((route) => {
      const from = route.fromLocation || "";
      const to = route.toLocation || "";
      return (
        (!searchFrom || from.toLowerCase().includes(searchFrom.toLowerCase())) &&
        (!searchTo || to.toLowerCase().includes(searchTo.toLowerCase()))
      );
    });
    setFilteredRoutes(filtered);
  }, [searchFrom, searchTo, trainRoutes]);

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
    if (password !== loggedInUser.password) return alert("Incorrect password!");
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
      VehicleType: "LocalTrain"
    }

    try{
      const res = await axios.post("https://localhost:7172/api/BookingCountAndAmount/BookingCountAndAmountLocalTrain", bookings);
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
      link.download = "TrainTicket.png";
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
        setTrainPickerName(users[randomIndex]);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="local-train-page">
      <Header />
      <Nav />

      <div className="train-booking">
        <div className="train-booking-left">
          <h1>Book a Local Train Ride</h1>
          <p>Fast & affordable city train rides</p>

          <div className="train-inputs">
            <div className="autocomplete">
              <input
                type="text"
                placeholder="Enter boarding station"
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
                placeholder="Enter destination station"
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

          <div className="train-buttons">
            <button onClick={trainRoutesSearch}>Check Prices</button>
          </div>

          {showPopup && (
            <div className="popup-overlay" onClick={() => setShowPopup(false)}>
              <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                <h2>Available Train Routes</h2>
                <button className="close-btn" onClick={() => setShowPopup(false)}>X</button>
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

        <div className="train-booking-right">
          <img src={trainImg} alt="Train ride illustration" />
        </div>
      </div>

      <div className="train-routes">
        <h1>Popular Local Train Routes</h1>
        <p>Quick access to Chennai’s busiest train routes</p>
        <div className="train-routes-container">
          {trainRouteList.map((region) => (
            <section className="train-region" key={region.id}>
              <h2>{region.title}</h2>
              <ul>
                {region.routes.map((route, idx) => (
                  <li key={idx} onClick={() => handleSelectRoute(route)}>
                    <div className="train-route-fromto">{route.fromTo}</div>
                    <div className="train-route-price">{route.price}</div>
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
                  value={`upi://pay?pa=OneCitOnePay@oksbi&pn=Raja&tn=Train Ride&am=${getNumericPrice(selectedRoute.price)}&cu=INR`}
                  size={180}
                />
                <p className="upi-info">
                  Pay {selectedRoute.price} to <strong>Raja</strong><br />
                  UPI ID: <strong>OneCitOnePay@oksbi</strong><br />
                  Purpose: <strong>Local Train Ride</strong>
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
                <p>Pay {selectedRoute.price} for {selectedRoute.fromTo || `${selectedRoute.fromLocation} → ${selectedRoute.toLocation}`}</p>
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
                {trainPickerName ? (
                  <div className="pickuper-info">
                    <strong>Train Attendant:</strong> {trainPickerName.fullName} <br />
                    <strong>Phone:</strong> {trainPickerName.phone}<br />
                    <strong>OTP:</strong> {OTP}
                  </div>
                ) : (
                  <p>Loading staff details...</p>
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
