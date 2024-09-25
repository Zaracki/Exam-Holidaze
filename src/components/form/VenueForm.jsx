import InputField from "../../components/inputs/InputField";
import PrimaryButton from "../../components/buttons/PrimaryButton";

const VenueForm = ({
  formData,
  setFormData,
  handleSubmit,
  errors,
  loading,
  buttonText,
}) => {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
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
      {errors.title && <p className="mt-2 text-sm text-red-500">{errors.title}</p>}

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
        {errors.description && <p className="mt-2 text-sm text-red-500">{errors.description}</p>}
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
      {errors.city && <p className="mt-2 text-sm text-red-500">{errors.city}</p>}

      <InputField
        type="text"
        id="country"
        name="country"
        label="Country"
        placeholder="Enter country"
        value={formData.country}
        onChange={handleChange}
      />
      {errors.country && <p className="mt-2 text-sm text-red-500">{errors.country}</p>}

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
      {errors.guests && <p className="mt-2 text-sm text-red-500">{errors.guests}</p>}

      <InputField
        type="number"
        id="pricePerNight"
        name="pricePerNight"
        label="Price per Night"
        placeholder="Enter price per night"
        value={formData.pricePerNight}
        onChange={handleChange}
        min="1"
      />
      {errors.pricePerNight && <p className="mt-2 text-sm text-red-500">{errors.pricePerNight}</p>}

      <InputField
        type="text"
        id="venueImgUrl"
        name="venueImgUrl"
        label="Venue Image URL"
        placeholder="Enter image URL"
        value={formData.venueImgUrl}
        onChange={handleChange}
      />
      {errors.venueImgUrl && <p className="mt-2 text-sm text-red-500">{errors.venueImgUrl}</p>}

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
          {buttonText}
        </PrimaryButton>
      </div>
    </form>
  );
};

export default VenueForm;
