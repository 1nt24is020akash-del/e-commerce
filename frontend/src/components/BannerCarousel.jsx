import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import ReactPlayer from 'react-player';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const BannerCarousel = () => {
  const [swiper, setSwiper] = useState(null);

  const banners = [
    {
      id: 0,
      type: 'video',
      video: '/videos/promo.mp4',
      title: 'Experience Modern Shopping',
      subtitle: 'Fast, Reliable, and Premium'
    },
    {
      id: 1,
      type: 'image',
      image: '/images/offer1.png',
      title: 'Summer Sale',
      subtitle: 'Up to 50% Off'
    },
    {
      id: 2,
      type: 'image',
      image: '/images/offer2.png',
      title: 'Electronics Extravaganza',
      subtitle: 'Best Prices Guaranteed'
    },
    {
      id: 3,
      type: 'image',
      image: '/images/offer3.png',
      title: 'Fresh From Farm',
      subtitle: '20% Off on Groceries'
    },
    {
      id: 4,
      type: 'image',
      image: '/images/offer4.png',
      title: 'New Arrivals',
      subtitle: 'Elevate Your Style'
    }
  ];

  const handleVideoEnd = () => {
    if (swiper) {
      swiper.slideNext();
    }
  };

  return (
    <div className="banner-carousel-container">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect={'fade'}
        spaceBetween={0}
        slidesPerView={1}
        onSwiper={setSwiper}
        autoplay={{
          delay: 5000,
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
              {banner.type === 'youtube' ? (
                <div className="banner-video-wrapper">
                  <ReactPlayer
                    url={banner.video}
                    playing={true}
                    muted={true}
                    width="100%"
                    height="100%"
                    onEnded={handleVideoEnd}
                    config={{
                      youtube: {
                        playerVars: { showinfo: 0, controls: 0, rel: 0, modestbranding: 1 }
                      }
                    }}
                    className="react-player"
                  />
                </div>
              ) : banner.type === 'video' ? (
                <video 
                  src={banner.video} 
                  autoPlay 
                  loop 
                  muted 
                  playsInline
                  className="banner-video"
                />
              ) : (
                <img src={banner.image} alt={banner.title} className="banner-image" />
              )}
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
