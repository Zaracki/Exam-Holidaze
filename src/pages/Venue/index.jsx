import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import usePost from '../../hooks/usePost';
import VenueDetails from '../../components/VenueDetails';
import BookingForm from '../../components/form/BookingForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import { isLoggedIn } from '../../utils/LocalStorage';
import { Link } from 'react-router-dom';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import SecondaryButton from '../../components/buttons/SecondaryButton';

export const Venue = () => {
  const { id } = useParams();
  const { data: venue, isLoading, hasError } = useFetch(`https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true&_bookings=true`);
  const { post, loading: bookingLoading, error: bookingError } = usePost('https://v2.api.noroff.dev/holidaze/bookings');
  const loggedIn = isLoggedIn();

  const handleBooking = async (e, dateFrom, dateTo, guests, dateOverlapError) => {
    e.preventDefault();

    if (dateOverlapError) {
      alert('You cannot overlap with existing bookings.');
      return;
    }

    const bookingData = {
      dateFrom: dateFrom.toISOString(),
      dateTo: dateTo.toISOString(),
      guests: parseInt(guests, 10),
      venueId: id,
    };

    try {
      const result = await post(bookingData);
      if (result) {
        alert('Booking successful!');
      }
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (hasError) {
    return <div>Error loading venue data.</div>;
  }

  if (!venue) {
    return <div>No venue data available.</div>;
  }

  const fallbackImage = '../../../src/assets/hero-image.png';

  return (
    <div className="bg-zinc-900 min-h-screen flex flex-col items-center px-10">
      <div className="w-full max-w-[1152px]">
        <img
          src={venue.media && venue.media.length > 0 ? venue.media[0].url : fallbackImage}
          alt={venue.media && venue.media.length > 0 ? venue.media[0].alt : 'No Image'}
          className="w-full h-[500px] object-cover mx-auto"
          onError={(e) => { e.target.src = fallbackImage; }}
        />
      </div>
      <div className="flex flex-col md:flex-row justify-center items-start mt-8 max-w-[1152px] w-full">
        <VenueDetails venue={venue} />
        {loggedIn ? (
          <BookingForm
            venue={venue}
            handleBooking={handleBooking}
            bookingLoading={bookingLoading}
            bookingError={bookingError}
          />
        ) : (
          <div className="w-full md:w-[400px] p-4 bg-[#282828] mt-8 md:mt-0 md:ml-8 rounded-md">
            <h2 className="text-2xl text-white font-semibold mb-4">Log in to make a booking</h2>
            <p className="text-white mb-4">You need to be logged in to book this venue. Please log in or sign up to proceed.</p>
            <div className="flex flex-col items-center">
              <Link to="/login" className="w-full mb-4">
                <PrimaryButton className="w-full">Log in</PrimaryButton>
              </Link>
              <Link to="/register" className="w-full">
                <SecondaryButton className="w-full">Register</SecondaryButton>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
