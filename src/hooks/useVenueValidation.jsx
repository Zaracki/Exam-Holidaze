import { useState } from "react";

const useVenueValidation = (formData) => {
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required.";
    } else if (formData.description.length < 20) {
      newErrors.description = "Description must be at least 20 characters long.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required.";
    }

    if (!formData.guests || formData.guests < 1) {
      newErrors.guests = "Number of guests must be at least 1.";
    } else if (formData.guests > 100) {
      newErrors.guests = "Number of guests cannot be greater than 100.";
    }

    if (!formData.pricePerNight || formData.pricePerNight < 1) {
      newErrors.pricePerNight = "Price per night must be at least 1.";
    } else if (formData.pricePerNight > 10000) {
      newErrors.pricePerNight = "Price per night cannot be greater than 10,000.";
    }

    if (formData.venueImgUrl && !/^https?:\/\/[^\s]+$/.test(formData.venueImgUrl)) {
      newErrors.venueImgUrl = "Please enter a valid image URL.";
    } else if (!formData.venueImgUrl.trim()) {
      newErrors.venueImgUrl = "Venue image URL is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return { validateForm, errors };
};

export default useVenueValidation;
