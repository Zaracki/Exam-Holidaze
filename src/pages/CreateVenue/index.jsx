import { useState } from "react";
import { useNavigate } from "react-router-dom";
import usePost from "../../hooks/usePost";
import VenueForm from "../../components/form/VenueForm";
import { API_URL, VENUES } from "../../api/Constants";
import useVenueValidation from "../../hooks/useVenueValidation";

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

  const { validateForm, errors } = useVenueValidation(formData);
  const [successMessage, setSuccessMessage] = useState("");
  const { post, loading, error } = usePost(`${API_URL}${VENUES}`);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

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
      setSuccessMessage("Venue created, redirecting...");
      setTimeout(() => {
        navigate("/Profile");
      }, 500);
    } catch (err) {
      console.error("Error creating venue:", err);
    }
  };

  return (
    <main className="flex justify-center items-center min-h-screen bg-zinc-900 pt-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-stone-800">
        <h1 className="text-2xl font-bold text-center text-white">Create Venue</h1>
        <VenueForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          errors={errors}
          loading={loading}
          buttonText="Create Venue"
        />
        {error && <p className="text-red-400">{error.message}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
      </div>
    </main>
  );
};

export default CreateVenue;
