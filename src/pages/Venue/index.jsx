import React from 'react';
import { useParams } from 'react-router-dom';
import { useFetch } from '../../hooks/useFetch';
import usePost from '../../hooks/usePost';
import VenueDetails from '../../components/VenueDetails';
import BookingForm from '../../components/form/BookingForm';

export const Venue = () => {
  const { id } = useParams();
  const { data: venue, isLoading, hasError } = useFetch(`https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true&_bookings=true`);
  const { post, loading: bookingLoading, error: bookingError } = usePost('https://v2.api.noroff.dev/holidaze/bookings');

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
    return <div>Loading...</div>;
  }

  if (hasError) {
    return <div>Error loading venue data.</div>;
  }

  if (!venue) {
    return <div>No venue data available.</div>;
  }

  return (
    <div className="bg-black min-h-screen flex flex-col items-center px-10">
      <div className="w-full max-w-[1152px]">
        <img
          src={venue.media && venue.media.length > 0 ? venue.media[0].url : 'src/assets/hero-image.png'}
          alt={venue.media && venue.media.length > 0 ? venue.media[0].alt : 'Hero'}
          className="w-full h-[500px] object-cover mx-auto"
        />
      </div>
      <div className="flex flex-col md:flex-row justify-center items-start mt-8 max-w-[1152px] w-full">
        <VenueDetails venue={venue} />
        <BookingForm venue={venue} handleBooking={handleBooking} bookingLoading={bookingLoading} bookingError={bookingError} />
      </div>
    </div>
  );
};