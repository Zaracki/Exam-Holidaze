import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import usePost from '../../hooks/usePost';
import VenueDetails from '../../components/VenueDetails';
import BookingForm from '../../components/form/BookingForm';
import LoadingSpinner from '../../components/LoadingSpinner';
import { isLoggedIn } from '../../utils/LocalStorage';
import fallbackImage from '../../assets/fallback-img.png';

export const Venue = () => {
  const { id } = useParams();
  const { data: venue, isLoading, hasError } = useFetch(`https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true&_bookings=true`);
  const { post, loading: bookingLoading, error: bookingError } = usePost('https://v2.api.noroff.dev/holidaze/bookings');
  const loggedIn = isLoggedIn();
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBooking = async (e, dateFrom, dateTo, guests, dateOverlapError) => {
    e.preventDefault();

    if (dateOverlapError) {
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
        setBookingSuccess(true);
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

  return (
    <main className="bg-zinc-900 min-h-screen flex flex-col items-center px-10 pt-16">
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
        <BookingForm
          venue={venue}
          handleBooking={handleBooking}
          bookingLoading={bookingLoading}
          bookingError={bookingError}
          bookingSuccess={bookingSuccess}
          loggedIn={loggedIn}
        />
      </div>
    </main>
  );
};