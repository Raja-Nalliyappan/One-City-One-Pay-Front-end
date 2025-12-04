import { useEffect, useState } from "react";
import "./Dashboard.css";
import dashboardLogo from "../Dashboard/Dashboard-images/DashboardLogo.png";
import { Footer } from "../Dashboard/Footer";
import { Header } from "./Header";
import { Nav } from "./Nav";

export const Dashboard = () => {

const [formData, setFormData] = useState({ name: "", comment: "" });
const [reviewComments, setReviewComments] = useState([]);

const fetchReviews = async () => {
  try {
    const res = await fetch("https://localhost:7172/api/Reviews/GetUserReviewsComments");
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    setReviewComments(await res.json());
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  fetchReviews();
}, []);

const submitReview = (e) => {
  e.preventDefault();
  const { name, comment } = formData;
  fetch(`https://localhost:7172/api/Reviews/AddUserReviewComments?Name=${encodeURIComponent(name)}&ReviewComments=${encodeURIComponent(comment)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Name: name, ReviewComments: comment }),
    }
    ).then((res) => {
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return res.text();
    }).then((data) => {
      alert(data);
      setFormData({ name: "", comment: "" });
      fetchReviews();
    })
    .catch((err) => console.error(err));
};



  const offers = [
    { code: "EARLYBIRD", status:"Available Shortly...", description: "Get Rs 200 off on rides or tickets. Valid till 03 Nov." },
    { code: "OFFER100", status:"Available Shortly...", description: "Get Rs 100 off on bus/train bookings. Valid till 03 Nov." },
    { code: "SUPERB60", status:"Available Shortly...", description: "Get Rs 60 off on all rides. Valid till 03 Nov." },
    { code: "NOFEE", status:"Available Shortly...", description: "Zero convenience fee on metro and local train bookings. Valid till 03 Nov." },
  ];

  const transportModes = [
    { name: "Bike", icon: "https://img.icons8.com/ios-filled/100/000000/motorcycle.png", desc: "Book bikes instantly for short and fast city trips." },
    { name: "Auto", icon: "https://img.icons8.com/ios-filled/100/000000/auto-rickshaw.png", desc: "Affordable auto rides for convenient local travel." },
    { name: "Car", icon: "https://img.icons8.com/ios-filled/100/000000/car.png", desc: "Comfortable cars for personal and family trips." },
    { name: "Bus", icon: "https://img.icons8.com/ios-filled/100/000000/bus.png", desc: "Book city and intercity buses with real-time seat confirmation." },
    { name: "Metro", icon: "https://img.icons8.com/ios-filled/100/000000/subway.png", desc: "Plan your metro rides across the city effortlessly." },
    { name: "Local Train", icon: "https://img.icons8.com/ios-filled/100/000000/train.png", desc: "Book local train tickets easily for hassle-free travel." },
  ];

  const popularRoutes = [
    "City Center → Airport",
    "Station → City Center",
    "Metro Line 1",
    "Bus Route A",
    "Bike → Work",
    "Auto → Mall",
  ];

  const faqs = [
    { q: "Which transport modes are available?", a: "Bike, Auto, Car, Bus, Metro, Local Train — all included in one platform." },
    { q: "How do I book tickets?", a: "Select your transport mode, enter origin and destination, confirm your booking." },
    { q: "Is One City One Pay safe?", a: "Yes, all payments are secure and bookings are verified." },
  ];

  const handleCopy = (code, btn) => {
    navigator.clipboard.writeText(code);
    btn.textContent = "Copied!";
    setTimeout(() => (btn.textContent = "Copy"), 1500);
  };



  return (
    <>
    <Header />
    <Nav />
    <div className="dashboard">
      <div className="dashboard-image">
        <img src={dashboardLogo} alt="Chennai" />
      </div>

      <header>All Transport. One Platform. Seamless Travel.</header>

      <section>
        <h2>All Transport Modes</h2>
        <div className="feature-box">
          {transportModes.map((mode, idx) => (
            <div className="feature" key={idx}>
              <img src={mode.icon} alt={mode.name} />
              <h3>{mode.name}</h3>
              <p>{mode.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2>Offers</h2>
        {offers.map((offer, idx) => (
          <div className="offer" key={idx}>
            <div className="offer-flex">
              <div>
                <div style={{display:"flex", color:"#c41d7f", alignItems:"center"}}>
                  <h4>{offer.code}</h4>
                  <h5 style={{position:"absolute", top:"40%", right:"30%"}}>{offer.status}</h5>
                </div>
                <p>{offer.description}</p>
              </div>
              <button className="btn" onClick={(e) => handleCopy(offer.code, e.target)}>
                Copy
              </button>
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2>Most Popular Routes</h2>
        <div className="tabs">
          {popularRoutes.map((route, idx) => (
            <div className="tab" key={idx}>{route}</div>
          ))}
        </div>
      </section>

      <section>
        <h2>User Testimonials</h2>
        <div id="testimonialsContainer">
          {reviewComments?.map((comments) => (
            <div className="testimonial" key={comments.id}>
              <p>"{comments.reviewComments}"</p>
              <h4>{comments.name}</h4>
            </div>
          ))}
        </div>

        <div className="comment-form">
          <h3>Leave a Testimonial</h3>
          <form onSubmit={submitReview}>
            <input
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <textarea
              placeholder="Leave Your Comment"
              rows="4"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              required
            ></textarea>
            <button type="submit" className="btn">Submit</button>
          </form>
        </div>
      </section>

      <section>
        <h2>FAQs</h2>
        {faqs.map((faq, idx) => (
          <div className="faq" key={idx}>
            <h4>{faq.q}</h4>
            <p>{faq.a}</p>
          </div>
        ))}
      </section>
    </div>
    <Footer />
    </>
  );
};
