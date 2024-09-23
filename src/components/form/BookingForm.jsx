import { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import PrimaryButton from '../buttons/PrimaryButton';

const BookingForm = ({ venue, handleBooking, bookingLoading, bookingError }) => {
  const [dateFrom, setDateFrom] = useState(null);
  const [dateTo, setDateTo] = useState(null);
  const [guests, setGuests] = useState(1);
  const [dateOverlapError, setDateOverlapError] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  const isDateUnavailable = (date) => {
    return venue.bookings.some(booking => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);
      return date >= bookingStart && date <= bookingEnd;
    });
  };

  const calculateTotalCost = (dateFrom, dateTo) => {
    if (dateFrom && dateTo) {
      const days = (dateTo - dateFrom) / (1000 * 60 * 60 * 24);
      setTotalCost(Math.floor(days * venue.price));
    } else {
      setTotalCost(0);
    }
  };

  const handleDateFromChange = (date) => {
    setDateFrom(date);
    setDateTo(null);
    setDateOverlapError(false);
    calculateTotalCost(date, null);
  };

  const handleDateToChange = (date) => {
    setDateTo(date);
    const overlap = venue.bookings.some(booking => {
      const bookingStart = new Date(booking.dateFrom);
      const bookingEnd = new Date(booking.dateTo);
      return (dateFrom <= bookingEnd && date >= bookingStart);
    });
    setDateOverlapError(overlap);
    calculateTotalCost(dateFrom, date);
  };

  return (
    <div className="w-full md:w-[400px] p-4 bg-[#282828] mt-8 md:mt-0 md:ml-8 rounded-md">
      <h2 className="text-2xl text-white font-semibold mb-4">Booking Details</h2>
      <form onSubmit={(e) => handleBooking(e, dateFrom, dateTo, guests, dateOverlapError)}>
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
          <p className="text-lg text-white font-semibold">Total: ${totalCost}</p>
        </div>
        {bookingError && <div className="text-red-500 mb-4">{bookingError}</div>}
        <PrimaryButton>
          {bookingLoading ? 'Booking...' : 'Book'}
        </PrimaryButton>
      </form>
    </div>
  );
};

export default BookingForm;