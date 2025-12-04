import "./Footer.css";

export const Footer = () => {
  return (
    <footer>
      <div className="footer-container">
        <div className="footer-col">
          <h3>One City One Pay</h3>
          <p>
            Simplifying city life, one payment at a time. From public transport to utility bills, manage everything effortlessly — one card, one app, one city. Your convenience is our priority.
          </p>
        </div>

        <div className="footer-col quick-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">How It Works</a></li>
            <li><a href="#">Recharge</a></li>
            <li><a href="#">Support</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <h3>Contact</h3>
          <p>Email: support@onecityonepay.com</p>
          <p>Phone: +91 98765 43210</p>
          <p>Address: 123 City Hub, Chennai, India</p>
        </div>

        <div className="footer-col">
          <h3>Follow Us</h3>
          <div className="social-links">
            <a href="#" className="tooltip" data-tooltip="Facebook">F</a>
            <a href="#" className="tooltip" data-tooltip="Twitter">T</a>
            <a href="#" className="tooltip" data-tooltip="Instagram">I</a>
            <a href="#" className="tooltip" data-tooltip="LinkedIn">L</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © 2025 One City One Pay. All rights reserved.
      </div>
    </footer>
  );
};
