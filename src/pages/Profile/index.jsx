import React, { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { load } from "../../utils/LocalStorage";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import { Link } from "react-router-dom";
import usePut from "../../hooks/usePut";
import useDelete from "../../hooks/useDelete";

const Profile = () => {
  const userProfile = load('userProfile');
  const profileName = userProfile ? userProfile.name : 'defaultProfileName';
  const bookingsUrl = `https://v2.api.noroff.dev/holidaze/profiles/${profileName}?_bookings=true`;
  const venuesUrl = `https://v2.api.noroff.dev/holidaze/profiles/${profileName}/venues?_bookings=true`;
  const { data: bookingsData, isLoading: isLoadingBookings, hasError: hasErrorBookings } = useFetch(bookingsUrl);
  const { data: fetchedVenuesData, isLoading: isLoadingVenues, hasError: hasErrorVenues } = useFetch(venuesUrl);
  const { put, loading, error } = usePut(bookingsUrl);
  const { del, loading: deleteLoading, error: deleteError } = useDelete();

  const [avatarUrl, setAvatarUrl] = useState('');
  const [venuesData, setVenuesData] = useState([]);
  const [collapsedVenues, setCollapsedVenues] = useState({});

  useEffect(() => {
    if (fetchedVenuesData) {
      setVenuesData(fetchedVenuesData);
    }
  }, [fetchedVenuesData]);

  const handleSubmit = async () => {
    const updateData = {
      avatar: { url: avatarUrl, alt: bookingsData?.avatar?.alt || '' },
    };
    await put(updateData);
    window.location.reload();
  };

  const handleDelete = async (venueId) => {
    const deleteUrl = `https://v2.api.noroff.dev/holidaze/venues/${venueId}`;
    const success = await del(deleteUrl);
    if (success) {
      setVenuesData((prevData) => prevData.filter((venue) => venue.id !== venueId));
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleCollapse = (venueId) => {
    setCollapsedVenues((prev) => ({
      ...prev,
      [venueId]: !prev[venueId],
    }));
  };

  if (isLoadingBookings || isLoadingVenues) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="grid min-h-[140px] w-full place-items-center overflow-x-scroll rounded-lg p-6 lg:overflow-visible">
          <svg className="text-gray-300 animate-spin" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="48" height="48">
            <path
              d="M32 3C35.8083 3 39.5794 3.75011 43.0978 5.20749C46.6163 6.66488 49.8132 8.80101 52.5061 11.4939C55.199 14.1868 57.3351 17.3837 58.7925 20.9022C60.2499 24.4206 61 28.1917 61 32C61 35.8083 60.2499 39.5794 58.7925 43.0978C57.3351 46.6163 55.199 49.8132 52.5061 52.5061C49.8132 55.199 46.6163 57.3351 43.0978 58.7925C39.5794 60.2499 35.8083 61 32 61C28.1917 61 24.4206 60.2499 20.9022 58.7925C17.3837 57.3351 14.1868 55.199 11.4939 52.5061C8.801 49.8132 6.66487 46.6163 5.20749 43.0978C3.7501 39.5794 3 35.8083 3 32C3 28.1917 3.75011 24.4206 5.2075 20.9022C6.66489 17.3837 8.80101 14.1868 11.4939 11.4939C14.1868 8.80099 17.3838 6.66487 20.9022 5.20749C24.4206 3.7501 28.1917 3 32 3L32 3Z"
              stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"></path>
            <path
              d="M32 3C36.5778 3 41.0906 4.08374 45.1692 6.16256C49.2477 8.24138 52.7762 11.2562 55.466 14.9605C58.1558 18.6647 59.9304 22.9531 60.6448 27.4748C61.3591 31.9965 60.9928 36.6232 59.5759 40.9762"
              stroke="currentColor" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
            </path>
          </svg>
        </div>
      </div>
    );
  }

  if (hasErrorBookings || hasErrorVenues) return <p>Error loading profile.</p>;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-grey p-4">
      <div className="max-w-[632px] w-full mb-8">
        <h1 className="text-3xl font-medium mb-6">Profile</h1>
        <div className="bg-white border p-6 mb-5 bg-grey">
          <div className="flex items-center mb-6">
            {bookingsData?.avatar ? (
              <img
                src={bookingsData.avatar.url}
                alt={bookingsData.avatar.alt}
                className="w-[100px] h-[100px] rounded-full bg-gray-300 object-cover"
              />
            ) : (
              <div className="w-[100px] h-[100px] rounded-full bg-gray-300"></div>
            )}
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{bookingsData?.name || 'No Name'}</h2>
              <p className="text-gray-600">{userProfile?.venueManager ? 'Host' : 'Customer'}</p>
            </div>
          </div>
          <div className="mb-4">
            <label>Avatar URL:</label>
            <input
              type="text"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="border p-2 w-full"
            />
          </div>
          <PrimaryButton onClick={handleSubmit}>Update Avatar</PrimaryButton>
        </div>
        {userProfile?.venueManager && (
          <>
            <div className="flex justify-center">
              <Link to="/CreateVenue">
                <PrimaryButton>Create Venue</PrimaryButton>
              </Link>
            </div>
            <h2 className="text-3xl font-medium mb-4 mt-6">My Venues</h2>
            <hr className="mt-3 mb-6 border-gray-400" />
            <div className="space-y-4">
              {venuesData && venuesData.length > 0 ? (
                venuesData.map((venue) => (
                  <div key={venue.id} className="bg-white p-4 rounded-lg shadow-md relative">
                    <p className="font-semibold">Name: {venue.name}</p>
                    <p>Price: {venue.price}</p>
                    <p>Max Guests: {venue.maxGuests}</p>
                    <p>Rating: {venue.rating}</p>
                    <p>Location: {venue.location.city}, {venue.location.country}</p>
                    <div className="flex space-x-2 mt-2">
                      <Link to={`/EditVenue/${venue.id}`}>
                        <button className="text-sm bg-blue-500 text-white py-1 px-2 rounded">Edit</button>
                      </Link>
                      <button onClick={() => handleDelete(venue.id)} className="text-sm bg-red-500 text-white py-1 px-2 rounded">Delete</button>
                    </div>
                    {venue.bookings && venue.bookings.length > 0 && (
                      <>
                        <button onClick={() => toggleCollapse(venue.id)} className="mt-4 text-blue-500">
                          {collapsedVenues[venue.id] ? 'Hide Bookings' : 'Show Bookings'}
                        </button>
                        {collapsedVenues[venue.id] && (
                          <ul className="mt-4">
                            {venue.bookings.map((booking) => (
                              <li key={booking.id} className="border-t pt-2 mt-2">
                                <p><strong>User:</strong> {booking.customer.name}</p>
                                <p><strong>From:</strong> {formatDate(booking.dateFrom)}</p>
                                <p><strong>To:</strong> {formatDate(booking.dateTo)}</p>
                                <p><strong>Guests:</strong> {booking.guests}</p>
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                ))
              ) : (
                <p>No venues found.</p>
              )}
            </div>
          </>
        )}
        <h2 className="text-3xl font-medium mb-4 mt-6">My bookings</h2>
        <hr className="mt-3 mb-6 border-gray-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookingsData?.bookings && bookingsData.bookings.length > 0 ? (
            bookingsData.bookings.map((booking) => (
              <div key={booking.id} className="bg-white p-4 rounded-lg shadow-md">
                <img
                  src={booking.venue.media[0]?.url || ''}
                  alt={booking.venue.media[0]?.alt || 'No Image'}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <p className="font-semibold">Venue: {booking.venue.name}</p>
                <p>From: {formatDate(booking.dateFrom)}</p>
                <p>To: {formatDate(booking.dateTo)}</p>
                <p>Guests: {booking.guests}</p>
              </div>
            ))
          ) : (
            <p>No bookings found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;