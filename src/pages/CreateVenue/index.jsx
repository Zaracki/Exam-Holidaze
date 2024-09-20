import React, { useState } from "react";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import usePost from "../../hooks/usePost";

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

  const { post, loading, error } = usePost('https://v2.api.noroff.dev/holidaze/venues');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
    } catch (err) {
      console.error('Error creating venue:', err);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">Create Venue</h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="title">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter venue title"
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter venue description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="city">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter city"
              value={formData.city}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="country">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter country"
              value={formData.country}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="guests">
              Guests
            </label>
            <input
              type="number"
              id="guests"
              name="guests"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter number of guests"
              value={formData.guests}
              onChange={handleChange}
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="pricePerNight">
              Price per Night
            </label>
            <input
              type="number"
              id="pricePerNight"
              name="pricePerNight"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter price per night"
              value={formData.pricePerNight}
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="venueImgUrl">
              Venue Image URL
            </label>
            <input
              type="text"
              id="venueImgUrl"
              name="venueImgUrl"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter image URL"
              value={formData.venueImgUrl}
              onChange={handleChange}
            />
          </div>

          <div className="flex items-center">
            <input
              id="pets"
              name="pets"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              checked={formData.pets}
              onChange={handleChange}
            />
            <label htmlFor="pets" className="ml-2 block text-sm text-gray-900">
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
            <label htmlFor="wifi" className="ml-2 block text-sm text-gray-900">
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
            <label htmlFor="breakfast" className="ml-2 block text-sm text-gray-900">
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
            <label htmlFor="parking" className="ml-2 block text-sm text-gray-900">
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
      </div>
    </div>
  );
};

export default CreateVenue;