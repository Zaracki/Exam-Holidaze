import { useState, useEffect } from "react";
import usePut from "../../hooks/usePut";
import { useFetch } from "../../hooks/useFetch";
import { useParams, useNavigate } from "react-router-dom";
import VenueForm from "../../components/form/VenueForm";
import { API_URL, VENUES } from "../../api/Constants";
import LoadingSpinner from "../../components/LoadingSpinner";
import useVenueValidation from "../../hooks/useVenueValidation";

const EditVenue = () => {
  const { venueId } = useParams();
  const navigate = useNavigate();
  const venueUrl = `${API_URL}${VENUES}/${venueId}`;
  const { data: initialData, isLoading, hasError } = useFetch(venueUrl);

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
  const { put, loading, error } = usePut(venueUrl);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.name || "",
        description: initialData.description || "",
        city: initialData.location?.city || "",
        country: initialData.location?.country || "",
        guests: initialData.maxGuests || 1,
        pricePerNight: initialData.price || "",
        venueImgUrl: initialData.media?.[0]?.url || "",
        pets: initialData.meta?.pets || false,
        wifi: initialData.meta?.wifi || false,
        breakfast: initialData.meta?.breakfast || false,
        parking: initialData.meta?.parking || false,
      });
    }
  }, [initialData]);

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
      const result = await put(venueData);
      setSuccessMessage("Venue updated successfully, redirecting...");
      setTimeout(() => {
        navigate("/Profile");
      }, 500);
    } catch (err) {
      console.error("Error updating venue:", err);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (hasError) return <p>Error loading venue data.</p>;

  return (
    <main className="flex justify-center items-center min-h-screen bg-zinc-900 pt-16">
      <div className="w-full max-w-md p-8 space-y-6 bg-stone-800 text-white">
        <h1 className="text-2xl font-bold text-center">Edit Venue</h1>
        <VenueForm
          formData={formData}
          setFormData={setFormData}
          handleSubmit={handleSubmit}
          errors={errors}
          loading={loading}
          buttonText="Edit Venue"
        />
        {error && <p className="text-red-400">{error.message}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}
      </div>
    </main>
  );
};

export default EditVenue;
