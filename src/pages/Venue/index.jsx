import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PrimaryButton from '../../components/buttons/PrimaryButton';
import { useFetch } from '../../hooks/useFetch';
import usePost from '../../hooks/usePost';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import MetaTags from '../../components/MetaTags';

export const Venue = () => {
  const { id } = useParams();
  const { data: venue, isLoading, hasError } = useFetch(`https://v2.api.noroff.dev/holidaze/venues/${id}?_owner=true&_bookings=true`);
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [guests, setGuests] = useState(1);
  const [dateOverlapError, setDateOverlapError] = useState(false);
  const { post, loading: bookingLoading, error: bookingError } = usePost('https://v2.api.noroff.dev/holidaze/bookings');

  const handleBooking = async (e) => {
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

  const mediaUrl = venue.media && venue.media.length > 0 ? venue.media[0].url : 'src/assets/hero-image.png';
  const mediaAlt = venue.media && venue.media.length > 0 ? venue.media[0].alt : 'Hero';
  const city = venue.location?.city || 'Unknown city';
  const country = venue.location?.country || 'Unknown country';
  const ownerAvatarUrl = venue.owner?.avatar?.url || '';
  const ownerAvatarAlt = venue.owner?.avatar?.alt || 'Owner avatar';
  const ownerName = venue.owner?.name || 'Unknown owner';

  const isDateUnavailable = (date) => {
    return venue.bookings.some(booking => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);
      return date >= bookingStart && date <= bookingEnd;
    });
  };

  const handleDateFromChange = (date) => {
    setDateFrom(date);
    setDateTo(null);
    setDateOverlapError(false);
  };

  const handleDateToChange = (date) => {
    setDateTo(date);
    const overlap = venue.bookings.some(booking => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);
      return (dateFrom <= bookingEnd && date >= bookingStart);
    });
    setDateOverlapError(overlap);
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center px-10">
      <div className="w-full max-w-[1152px]">
        <img
          src={mediaUrl}
          alt={mediaAlt}
          className="w-full h-[500px] object-cover mx-auto"
        />
      </div>
      <div className="flex flex-col md:flex-row justify-center items-start mt-8 max-w-[1152px] w-full">
        <div className="flex-1 max-w-full md:max-w-[1156px]">
          <div className="mb-8 text-white">
            <h1 className="text-3xl font-bold">{venue.name}</h1>
            <p className="text-lg">{city}, {country}</p>
            <div className="flex items-center mt-4">
              <div className="w-[45px] h-[45px] bg-gray-300 rounded-full">
                <img src={ownerAvatarUrl} alt={ownerAvatarAlt} className="w-full h-full rounded-full" />
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-semibold">{ownerName}</h2>
                <p>Host</p>
              </div>
            </div>
            <hr className="mt-3 mb-3 border-gray-600" />
            <p className="mt-2">{venue.description}</p>
            <hr className="mt-3 mb-3 border-gray-600" />
            <MetaTags meta={venue.meta} />
          </div>
        </div>
        <div className="w-full md:w-[400px] p-4 bg-[#282828] mt-8 md:mt-0 md:ml-8 rounded-md">
          <h2 className="text-2xl text-white font-semibold mb-4">Booking Details</h2>
          <form onSubmit={handleBooking}>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="date-from">
                Date From
              </label>
              <DatePicker
                selected={dateFrom}
                onChange={handleDateFromChange}
                selectsStart
                startDate={dateFrom}
                endDate={dateTo}
                minDate={new Date()}
                filterDate={(date) => !isDateUnavailable(date)}
                placeholderText="Select start date"
                className="w-full p-2 border border-gray-600 bg-white text-grey rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="date-to">
                Date To
              </label>
              <DatePicker
                selected={dateTo}
                onChange={handleDateToChange}
                selectsEnd
                startDate={dateFrom}
                endDate={dateTo}
                minDate={dateFrom ? new Date(dateFrom.getTime() + 86400000) : new Date()}
                filterDate={(date) => !isDateUnavailable(date)}
                placeholderText="Select end date"
                className="w-full p-2 border border-gray-600 bg-white text-grey rounded-md"
                required
              />
              {dateOverlapError && <div className="text-red-500 mt-2">You cannot overlap with existing bookings.</div>}
            </div>
            <div className="mb-4">
              <label className="block text-white text-sm font-bold mb-2" htmlFor="guests">
                Number of Guests
              </label>
              <select
                id="guests"
                name="guests"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full p-2 border border-gray-600 bg-white text-grey rounded-md"
                required
              >
                {Array.from({ length: venue.maxGuests }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <p className="text-lg text-white font-semibold">Total: {venue.price}</p>
            </div>
            {bookingError && <div className="text-red-500 mb-4">{bookingError}</div>}
            <PrimaryButton>
              {bookingLoading ? 'Booking...' : 'Book'}
            </PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  );
};