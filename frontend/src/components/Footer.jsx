import { FaFacebook, FaTwitter, FaYoutube, FaInstagram, FaBriefcase, FaStar, FaGift, FaQuestionCircle, FaWhatsapp, FaTelegram, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="main-footer">
      <div className="footer-top">
        <div className="container footer-grid">
          <div className="footer-col">
            <h4>ABOUT</h4>
            <ul>
              <li>Contact Us</li>
              <li>About Us</li>
              <li>Careers</li>
              <li>MERN E-Shop Stories</li>
              <li>Press</li>
              <li>Corporate Information</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>GROUP COMPANIES</h4>
            <ul>
              <li>Myntra</li>
              <li>Cleartrip</li>
              <li>Shopsy</li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>HELP</h4>
            <ul>
              <li>Payments</li>
              <li>Shipping</li>
              <li>Cancellation & Returns</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div className="footer-col border-left">
            <h4>Mail Us:</h4>
            <p>
              <a href="mailto:akashs14102005@gmail.com" className="footer-link">
                <FaEnvelope style={{marginRight: '5px'}} /> akashs14102005@gmail.com
              </a>
            </p>
            
            <h4 className="social-head">Social:</h4>
            <div className="social-icons">
              <a href="https://wa.me/8660385303" target="_blank" rel="noreferrer" title="WhatsApp"><FaWhatsapp /></a>
              <a href="https://t.me/+918660385303" target="_blank" rel="noreferrer" title="Telegram"><FaTelegram /></a>
              <a href="https://www.instagram.com/skyy._.1114?igsh=MWh3c2ZxZnV4anN6MQ==" target="_blank" rel="noreferrer" title="Instagram"><FaInstagram /></a>
              <FaFacebook /> <FaTwitter /> <FaYoutube />
            </div>
          </div>
          <div className="footer-col">
            <h4>Registered Office Address:</h4>
            <p>MERN E-Shop Private Limited,</p>
            <p>Bengaluru, 560103, Karnataka, India</p>
            <p>Telephone: <a href="tel:8660385303" className="blue-text">8660385303</a></p>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="container footer-bottom-flex">
          <div className="bottom-links">
            <span><FaBriefcase className="yellow-icon" /> Become a Seller</span>
            <span><FaStar className="yellow-icon" /> Advertise</span>
            <span><FaGift className="yellow-icon" /> Gift Cards</span>
            <span><FaQuestionCircle className="yellow-icon" /> Help Center</span>
          </div>
          <div className="copyright">
            &copy; 2007-{currentYear} MERN E-Shop.com | <span className="creator-credit">Created by Akash</span>
          </div>
          <div className="payment-methods">
            <img src="https://static-assets-web.flixcart.com/batman-returns/batman-returns/p/images/payment-method-c45441.svg" alt="Payment Methods" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
