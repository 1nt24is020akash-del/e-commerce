import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FaTshirt, FaMobileAlt, FaMagic, FaLaptop, FaHome, FaTv, FaGamepad, 
  FaUtensils, FaCar, FaMotorcycle, FaBaseballBall, FaBook, FaChair, FaThLarge 
} from 'react-icons/fa';

const CategoryNav = () => {
  const categories = [
    { name: 'For You', icon: <FaThLarge />, color: '#2874f0' },
    { name: 'Fashion', icon: <FaTshirt />, color: '#ff4d4d' },
    { name: 'Mobiles', icon: <FaMobileAlt />, color: '#4d79ff' },
    { name: 'Beauty', icon: <FaMagic />, color: '#ff4dff' },
    { name: 'Electronics', icon: <FaLaptop />, color: '#4dff4d' },
    { name: 'Home', icon: <FaHome />, color: '#ffa64d' },
    { name: 'Appliances', icon: <FaTv />, color: '#4dffff' },
    { name: 'Toys', icon: <FaGamepad />, color: '#ffff4d' },
    { name: 'Food', icon: <FaUtensils />, color: '#ff4d4d' },
    { name: 'Auto', icon: <FaCar />, color: '#808080' },
    { name: 'Bikes', icon: <FaMotorcycle />, color: '#333' },
    { name: 'Sports', icon: <FaBaseballBall />, color: '#ff8c00' },
    { name: 'Books', icon: <FaBook />, color: '#8b4513' },
    { name: 'Furniture', icon: <FaChair />, color: '#deb887' },
  ];

  return (
    <div className="category-nav-wrapper">
      <div className="container category-nav">
        {categories.map((cat) => (
          <Link 
            key={cat.name} 
            to={`/?category=${cat.name}`} 
            className="cat-item"
          >
            <div className="cat-icon" style={{ color: cat.color }}>
              {cat.icon}
            </div>
            <span>{cat.name}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
