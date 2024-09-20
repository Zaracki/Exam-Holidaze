import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { load } from "../../utils/LocalStorage";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import { Link } from "react-router-dom";
import usePut from "../../hooks/usePut";

const Profile = () => {
  const userProfile = load('userProfile');
  const profileName = userProfile ? userProfile.name : 'defaultProfileName';
  const bookingsUrl = `https://v2.api.noroff.dev/holidaze/profiles/${profileName}?_bookings=true`;
  const venuesUrl = `https://v2.api.noroff.dev/holidaze/profiles/${profileName}/venues`;
  const { data: bookingsData, isLoading: isLoadingBookings, hasError: hasErrorBookings } = useFetch(bookingsUrl);
  const { data: venuesData, isLoading: isLoadingVenues, hasError: hasErrorVenues } = useFetch(venuesUrl);
  const { put, loading, error } = usePut(bookingsUrl);

  const [avatarUrl, setAvatarUrl] = useState('');

  const handleSubmit = async () => {
    const updateData = {
      avatar: { url: avatarUrl, alt: bookingsData.avatar.alt },
    };
    await put(updateData);
    window.location.reload();
  };

  if (isLoadingBookings || isLoadingVenues) return <p>Loading...</p>;
  if (hasErrorBookings || hasErrorVenues) return <p>Error loading profile.</p>;

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="max-w-[632px] w-full mb-8">
        <h1 className="text-3xl font-medium mb-6">Profile</h1>
        <div className="bg-white p-6">
          <div className="flex items-center mb-6">
            {bookingsData.avatar ? (
              <img
                src={bookingsData.avatar.url}
                alt={bookingsData.avatar.alt}
                className="w-[100px] h-[100px] rounded-full bg-gray-300 object-cover"
              />
            ) : (
              <div className="w-[100px] h-[100px] rounded-full bg-gray-300"></div>
            )}
            <div className="ml-4">
              <h2 className="text-xl font-semibold">{bookingsData.name}</h2>
              <p className="text-gray-600">Host</p>
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
        <Link to="/CreateVenue">
          <PrimaryButton>Create Venue</PrimaryButton>
        </Link>
        <h2 className="text-3xl font-medium mb-4 mt-6">My bookings</h2>
        <hr className="mt-3 mb-6 border-gray-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {bookingsData.bookings && bookingsData.bookings.length > 0 ? (
            <ul>
              {bookingsData.bookings.map((booking) => (
                <li key={booking.id}>
                  <p>Venue: {booking.venue.name}</p>
                  <p>From: {booking.dateFrom}</p>
                  <p>To: {booking.dateTo}</p>
                  <p>Guests: {booking.guests}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No bookings found.</p>
          )}
        </div>
        <h2 className="text-3xl font-medium mb-4 mt-6">My Venues</h2>
        <hr className="mt-3 mb-6 border-gray-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {venuesData && venuesData.length > 0 ? (
            <ul>
              {venuesData.map((venue) => (
                <li key={venue.id}>
                  <p>Name: {venue.name}</p>
                  <p>Description: {venue.description}</p>
                  <p>Price: {venue.price}</p>
                  <p>Max Guests: {venue.maxGuests}</p>
                  <p>Rating: {venue.rating}</p>
                  <p>Location: {venue.location.city}, {venue.location.country}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No venues found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;