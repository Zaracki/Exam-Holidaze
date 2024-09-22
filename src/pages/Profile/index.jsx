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

  if (isLoadingBookings || isLoadingVenues) return <p>Loading...</p>;
  if (hasErrorBookings || hasErrorVenues) return <p>Error loading profile.</p>;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-[632px] w-full mb-8">
        <h1 className="text-3xl font-medium mb-6">Profile</h1>
        <div className="bg-white p-6">
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
            <Link to="/CreateVenue">
              <PrimaryButton>Create Venue</PrimaryButton>
            </Link>
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