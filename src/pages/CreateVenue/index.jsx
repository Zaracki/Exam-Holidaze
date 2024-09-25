import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import usePost from "../../hooks/usePost";
import InputField from "../../components/inputs/InputField";
import { API_URL, VENUES } from "../../api/Constants";

const CreateVenue = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    city: "",
    country: "",
    guests: 1,
    pricePerNight: "",
    venueImgUrl: "",
    pets: false,
    wifi: false,
    breakfast: false,
    parking: false,
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const { post, loading, error } = usePost(`${API_URL}${VENUES}`);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

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

    return newErrors;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const venueData = {
      name: formData.title,
      description: formData.description,
      media: formData.venueImgUrl ? [{ url: formData.venueImgUrl, alt: formData.title }] : [],
      price: parseFloat(formData.pricePerNight),
      maxGuests: parseInt(formData.guests, 10),
      meta: {
        wifi: formData.wifi,
        parking: formData.parking,
        breakfast: formData.breakfast,
        pets: formData.pets,
      },
      location: {
        city: formData.city,
        country: formData.country,
      },
    };

    try {
      const result = await post(venueData);
      console.log('Venue created:', result);
      setSuccessMessage("Venue created, redirecting...");

      setTimeout(() => {
        navigate("/Profile");
      }, 500);

    } catch (err) {
      console.error('Error creating venue:', err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-stone-800">
        <h1 className="text-2xl font-bold text-center text-white">Create Venue</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <InputField
            type="text"
            id="title"
            name="title"
            label="Title"
            placeholder="Enter venue title"
            value={formData.title}
            onChange={handleChange}
          />
          {errors.title && (
            <p className="mt-2 text-sm text-red-500">{errors.title}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-white" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className={`mt-1 block w-full px-3 py-2 border ${errors.description ? "border-red-500" : "border-gray-300"
                } rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
              placeholder="Enter venue description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
            {errors.description && (
              <p className="mt-2 text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <InputField
            type="text"
            id="city"
            name="city"
            label="City"
            placeholder="Enter city"
            value={formData.city}
            onChange={handleChange}
          />
          {errors.city && (
            <p className="mt-2 text-sm text-red-500">{errors.city}</p>
          )}

          <InputField
            type="text"
            id="country"
            name="country"
            label="Country"
            placeholder="Enter country"
            value={formData.country}
            onChange={handleChange}
          />
          {errors.country && (
            <p className="mt-2 text-sm text-red-500">{errors.country}</p>
          )}

          <InputField
            type="number"
            id="guests"
            name="guests"
            label="Guests"
            placeholder="Enter number of guests"
            value={formData.guests}
            onChange={handleChange}
            min="1"
          />
          {errors.guests && (
            <p className="mt-2 text-sm text-red-500">{errors.guests}</p>
          )}

          <InputField
            type="number"
            id="pricePerNight"
            name="pricePerNight"
            label="Price per Night"
            placeholder="Enter price per night"
            value={formData.pricePerNight}
            onChange={handleChange}
            min="1"
            className={errors.pricePerNight ? "border-red-500" : ""}
          />
          {errors.pricePerNight && (
            <p className="mt-2 text-sm text-red-500">{errors.pricePerNight}</p>
          )}

          <InputField
            type="text"
            id="venueImgUrl"
            name="venueImgUrl"
            label="Venue Image URL"
            placeholder="Enter image URL"
            value={formData.venueImgUrl}
            onChange={handleChange}
            className={errors.venueImgUrl ? "border-red-500" : ""}
          />
          {errors.venueImgUrl && (
            <p className="mt-2 text-sm text-red-500">{errors.venueImgUrl}</p>
          )}

          <div className="flex items-center">
            <input
              id="pets"
              name="pets"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={formData.pets}
              onChange={handleChange}
            />
            <label htmlFor="pets" className="ml-2 block text-sm text-white">
              Pets allowed
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="wifi"
              name="wifi"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={formData.wifi}
              onChange={handleChange}
            />
            <label htmlFor="wifi" className="ml-2 block text-sm text-white">
              Wifi available
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="breakfast"
              name="breakfast"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={formData.breakfast}
              onChange={handleChange}
            />
            <label htmlFor="breakfast" className="ml-2 block text-sm text-white">
              Breakfast included
            </label>
          </div>

          <div className="flex items-center">
            <input
              id="parking"
              name="parking"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={formData.parking}
              onChange={handleChange}
            />
            <label htmlFor="parking" className="ml-2 block text-sm text-white">
              Parking available
            </label>
          </div>

          <div>
            <PrimaryButton className="w-full" type="submit" disabled={loading}>
              Create Venue
            </PrimaryButton>
          </div>
        </form>

        {error && <p className="text-red-500">{error.message}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
      </div>
    </div>
  );
};

export default CreateVenue;
