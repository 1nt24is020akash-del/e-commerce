import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const BannerCarousel = () => {
  const banners = [
    {
      id: 1,
      image: '/images/offer1.png',
      title: 'Summer Sale',
      subtitle: 'Up to 50% Off'
    },
    {
      id: 2,
      image: '/images/offer2.png',
      title: 'Electronics Extravaganza',
      subtitle: 'Best Prices Guaranteed'
    },
    {
      id: 3,
      image: '/images/offer3.png',
      title: 'Fresh From Farm',
      subtitle: '20% Off on Groceries'
    },
    {
      id: 4,
      image: '/images/offer4.png',
      title: 'New Arrivals',
      subtitle: 'Elevate Your Style'
    }
  ];

  return (
    <div className="banner-carousel-container">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect={'fade'}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        loop={true}
        className="banner-swiper"
      >
        {banners.map((banner) => (
          <SwiperSlide key={banner.id}>
            <div className="banner-slide">
              <img src={banner.image} alt={banner.title} className="banner-image" />
              <div className="banner-overlay">
                <div className="banner-content">
                  <h2 className="banner-title">{banner.title}</h2>
                  <p className="banner-subtitle">{banner.subtitle}</p>
                  <button className="btn btn-primary banner-btn">Shop Now</button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default BannerCarousel;
