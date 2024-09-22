import React from 'react';

const MetaTags = ({ meta }) => {
  if (!meta) {
    return null;
  }

  return (
    <div>
      {meta.wifi && (
        <div className="flex items-center mt-4">
          <i className="fas fa-wifi w-6 h-6"></i>
          <div className="ml-4">
            <h3 className="text-lg font-medium">Wifi</h3>
            <p>
              Our high-speed WiFi is available throughout the property, ensuring a
              seamless online experience for all guests.
            </p>
          </div>
        </div>
      )}
      {meta.pets && (
        <div className="flex items-center mt-4">
          <i className="fas fa-paw w-6 h-6"></i>
          <div className="ml-4">
            <h3 className="text-lg font-medium">Pets</h3>
            <p>
              We welcome your furry friends! Our property is pet-friendly, ensuring a
              comfortable stay for you and your pets.
            </p>
          </div>
        </div>
      )}
      {meta.parking && (
        <div className="flex items-center mt-4">
          <i className="fas fa-car w-6 h-6"></i>
          <div className="ml-4">
            <h3 className="text-lg font-medium">Parking</h3>
            <p>
              Convenient parking is available for all guests, with secure on-site and
              nearby parking options.
            </p>
          </div>
        </div>
      )}
      {meta.breakfast && (
        <div className="flex items-center mt-4">
          <i className="fas fa-coffee w-6 h-6"></i>
          <div className="ml-4">
            <h3 className="text-lg font-medium">Breakfast</h3>
            <p>
              Start your day with our complimentary breakfast, offering a range of
              delicious options for every taste.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MetaTags;