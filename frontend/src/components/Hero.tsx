import React, { useState, useEffect } from 'react';

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    {
      src: '../images/1.jpg',
      caption: 'Ốp lưng điện thoại cao cấp - Bảo vệ toàn diện',
    },
    {
      src: '../images/2.jpg',
      caption: 'Ốp lưng hiện đại, thiết kế đa năng',
    },
    {
      src: '../images/3.jpg',
      caption: 'Ốp lưng thời trang, bảo vệ hoàn hảo',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Chuyển slide mỗi 3 giây

    return () => clearInterval(interval); // Dọn dẹp interval khi component unmount
  }, []);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + images.length) % images.length
    );
  };

  return (
    <div className="relative">
      {/* Slider List */}
      <div
        className="relative w-full overflow-hidden"
        style={{
          height: '600px', // Chiều cao cố định cho Banner
        }}
      >
        <div
          className="flex transition-transform duration-1000 ease-in-out"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`, // Di chuyển các slide
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <img
                src={image.src}
                alt={image.caption}
                className="w-full h-full object-cover"
              />
              {/* Overlay with caption */}
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-center text-white px-4">
                <h2 className="text-3xl font-bold">{image.caption}</h2>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Prev & Next Buttons */}
      <div className="absolute top-1/2 left-5 transform -translate-y-1/2">
        <button
          onClick={goToPrev}
          className="bg-white text-black font-bold rounded-full p-3 shadow-lg"
        >
          &lt;
        </button>
      </div>
      <div className="absolute top-1/2 right-5 transform -translate-y-1/2">
        <button
          onClick={goToNext}
          className="bg-white text-black font-bold rounded-full p-3 shadow-lg"
        >
          &gt;
        </button>
      </div>

      {/* Dots Navigation */}
      <ul className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <li
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 bg-white rounded-full transition-all duration-300 cursor-pointer ${
              currentIndex === index ? 'w-8 bg-green-500' : 'opacity-50'
            }`}
          ></li>
        ))}
      </ul>
    </div>
  );
};


export default Hero;
