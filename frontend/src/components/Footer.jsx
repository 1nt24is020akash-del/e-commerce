import { FaFacebook, FaTwitter, FaYoutube, FaInstagram, FaBriefcase, FaStar, FaGift, FaQuestionCircle } from 'react-icons/fa';

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
          <div className="footer-col">
            <h4>CONSUMER POLICY</h4>
            <ul>
              <li>Cancellation & Returns</li>
              <li>Terms Of Use</li>
              <li>Security</li>
              <li>Privacy</li>
              <li>Sitemap</li>
              <li>Grievance Redressal</li>
            </ul>
          </div>
          <div className="footer-col border-left">
            <h4>Mail Us:</h4>
            <p>MERN E-Shop Private Limited,</p>
            <p>Buildings Alyssa, Begonia &</p>
            <p>Clove Embassy Tech Village,</p>
            <p>Outer Ring Road, Devarabeesanahalli Village,</p>
            <p>Bengaluru, 560103,</p>
            <p>Karnataka, India</p>
            
            <h4 className="social-head">Social:</h4>
            <div className="social-icons">
              <FaFacebook /> <FaTwitter /> <FaYoutube /> <FaInstagram />
            </div>
          </div>
          <div className="footer-col">
            <h4>Registered Office Address:</h4>
            <p>MERN E-Shop Private Limited,</p>
            <p>Buildings Alyssa, Begonia &</p>
            <p>Clove Embassy Tech Village,</p>
            <p>Outer Ring Road, Devarabeesanahalli Village,</p>
            <p>Bengaluru, 560103,</p>
            <p>Karnataka, India</p>
            <p>CIN : U51109KA2012PTC066107</p>
            <p>Telephone: <span className="blue-text">044-45614700 / 044-67415800</span></p>
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
            &copy; 2007-{currentYear} MERN E-Shop.com
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
