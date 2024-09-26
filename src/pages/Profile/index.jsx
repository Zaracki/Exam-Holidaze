import { useState, useEffect } from "react";
import { useFetch } from "../../hooks/useFetch";
import { load } from "../../utils/LocalStorage";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import { Link } from "react-router-dom";
import usePut from "../../hooks/usePut";
import useDelete from "../../hooks/useDelete";
import LoadingSpinner from '../../components/LoadingSpinner';
import { API_URL, API_URL_PROFILE, VENUES } from "../../api/Constants";
import fallbackImage from "../../assets/fallback-img.png";

const Profile = () => {
  const userProfile = load('userProfile');
  const profileName = userProfile ? userProfile.name : 'defaultProfileName';
  const bookingsUrl = `${API_URL_PROFILE}/${profileName}?_bookings=true`;
  const venuesUrl = `${API_URL_PROFILE}/${profileName}${VENUES}?_bookings=true`;

  const { data: bookingsData, isLoading: isLoadingBookings, hasError: hasErrorBookings } = useFetch(bookingsUrl);
  const { data: fetchedVenuesData, isLoading: isLoadingVenues, hasError: hasErrorVenues } = useFetch(venuesUrl);

  const { put, loading: putLoading, error: putError } = usePut(bookingsUrl);
  const { del, loading: deleteLoading, error: deleteError } = useDelete();

  const [avatarUrl, setAvatarUrl] = useState('');
  const [venuesData, setVenuesData] = useState([]);
  const [collapsedVenues, setCollapsedVenues] = useState({});
  const [submitError, setSubmitError] = useState(null);


  useEffect(() => {
    if (fetchedVenuesData) {
      setVenuesData(fetchedVenuesData);
    }
  }, [fetchedVenuesData]);

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const handleSubmit = async () => {
    setSubmitError(null);

    if (!avatarUrl) {
      setSubmitError("Avatar URL cannot be empty.");
      return;
    }

    if (!isValidUrl(avatarUrl)) {
      setSubmitError("Invalid URL format. Please enter a valid URL.");
      return;
    }

    try {
      const updateData = {
        avatar: { url: avatarUrl, alt: bookingsData?.avatar?.alt || '' },
      };

      const updatedProfile = await put(updateData);

      if (updatedProfile) {
        bookingsData.avatar.url = avatarUrl;
        setAvatarUrl('');
      }
    } catch (error) {
      setSubmitError("Failed to update avatar. Please try again later.");
    }
  };


  const handleDelete = async (venueId) => {
    try {
      const deleteUrl = `${API_URL}${VENUES}/${venueId}`;
      const success = await del(deleteUrl);
      if (success) {
        setVenuesData((prevData) => prevData.filter((venue) => venue.id !== venueId));
      } else {
        throw new Error('Delete operation unsuccessful.');
      }
    } catch (error) {
      console.error("Failed to delete venue.", error);
    }
  };

  const formatDate = (dateString) => {
    try {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch {
      return 'Invalid date';
    }
  };

  const toggleCollapse = (venueId) => {
    setCollapsedVenues((prev) => ({
      ...prev,
      [venueId]: !prev[venueId],
    }));
  };

  if (isLoadingBookings || isLoadingVenues || putLoading || deleteLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="text-white flex flex-col justify-center items-center min-h-screen bg-zinc-900 p-4">
      <div className="max-w-[632px] w-full mb-8">
        <h1 className="text-3xl font-medium mb-6">Profile</h1>
        {(hasErrorBookings || hasErrorVenues) && (
          <p className="text-red-400 mb-4">Error loading profile data. Please try again later.</p>
        )}
        <div className="p-6 mb-5 bg-stone-800">
          <div className="flex items-center mb-6">
            {bookingsData?.avatar ? (
              <img
                src={bookingsData.avatar.url}
                alt={bookingsData.avatar.alt || 'Avatar'}
                className="w-[100px] h-[100px] rounded-full bg-gray-300 object-cover"
              />
            ) : (
              <div className="w-[100px] h-[100px] rounded-full bg-gray-300"></div>
            )}
            <div className="ml-4">
              <h2 className="text-2xl font-semibold">{bookingsData?.name || 'No Name'}</h2>
              <p>{userProfile?.venueManager ? 'Host' : 'Customer'}</p>
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="avatar-url">Avatar URL:</label>
            <input
              type="text"
              id="avatar-url"
              name="avatar-url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="border p-2 w-full text-black"
            />
            {submitError && <p className="text-red-400">{submitError}</p>}
          </div>


          {putError && <p className="text-red-400 mb-4">Failed to update avatar. Please try again later.</p>}

          <PrimaryButton onClick={handleSubmit}>Update Avatar</PrimaryButton>
        </div>

        {userProfile?.venueManager && (
          <>
            <div className="flex justify-center">
              <Link to="/CreateVenue">
                <PrimaryButton>Create Venue</PrimaryButton>
              </Link>
            </div>
            <h2 className="text-2xl font-medium mb-4 mt-6">My Venues</h2>
            <hr className="mt-3 mb-6 border-gray-400" />
            {deleteError && <p className="text-red-400 mb-4">Failed to delete venue. Please try again later.</p>}
            <div className="space-y-4">
              {venuesData && venuesData.length > 0 ? (
                venuesData.map((venue) => (
                  <div key={venue.id} className="bg-stone-800 text-white p-4 relative">
                    <div className="flex flex-col md:flex-row">
                      {venue.media && venue.media.length > 0 && (
                        <img
                          src={venue.media && venue.media.length > 0 ? venue.media[0].url : fallbackImage}
                          alt={venue.media && venue.media.length > 0 ? venue.media[0].alt : 'No Image'}
                          className="w-48 h-48 object-cover mr-0 md:mr-4 mb-4 md:mb-0"
                          onError={(e) => { e.target.src = fallbackImage; }}
                        />
                      )}
                      <div>
                        <p className="font-semibold">Name: {venue.name || 'Unnamed Venue'}</p>
                        <p>Price: {venue.price || 'Not available'}</p>
                        <p>Max Guests: {venue.maxGuests || 'N/A'}</p>
                        <p>Rating: {venue.rating || '0'}</p>
                        <p>
                          Location: {venue.location?.city || 'Unknown City'},{' '}
                          {venue.location?.country || 'Unknown Country'}
                        </p>
                        <div className="flex space-x-2 mt-2">
                          <Link to={`/EditVenue/${venue.id}`}>
                            <button className="text-sm bg-blue-500 text-white py-1 px-2">Edit</button>
                          </Link>
                          <button
                            onClick={() => handleDelete(venue.id)}
                            className="text-sm bg-red-500 text-white py-1 px-2"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                    {venue.bookings && venue.bookings.length > 0 && (
                      <>
                        <button
                          onClick={() => toggleCollapse(venue.id)}
                          className="mt-4 text-blue-500 hover:underline"
                        >
                          {collapsedVenues[venue.id] ? 'Hide Bookings' : 'Show Bookings'}
                        </button>
                        {collapsedVenues[venue.id] && (
                          <ul className="mt-4">
                            {venue.bookings.map((booking) => (
                              <li key={booking.id} className="border-t pt-2 mt-2">
                                <p>
                                  <strong>User:</strong> {booking.customer.name || 'Unknown User'}
                                </p>
                                <p>
                                  <strong>From:</strong> {formatDate(booking.dateFrom)}
                                </p>
                                <p>
                                  <strong>To:</strong> {formatDate(booking.dateTo)}
                                </p>
                                <p>
                                  <strong>Guests:</strong> {booking.guests || 'N/A'}
                                </p>
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

        <h2 className="text-2xl font-medium mb-4 mt-6">My bookings</h2>
        <hr className="mt-3 mb-6 border-gray-400" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {bookingsData?.bookings && bookingsData.bookings.length > 0 ? (
            bookingsData.bookings.map((booking) => (
              <div key={booking.id} className="bg-stone-800">
                <img
                  src={booking.venue.media[0]?.url || fallbackImage}
                  alt={booking.venue.media[0]?.alt || 'No Image'}
                  className="w-full h-48 object-cover"
                  onError={(e) => { e.target.src = fallbackImage; }}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-xl">{booking.venue.name || 'Unnamed Venue'}</h3>
                  <p>From: {formatDate(booking.dateFrom)}</p>
                  <p>To: {formatDate(booking.dateTo)}</p>
                  <p>Guests: {booking.guests || 'N/A'}</p>
                </div>
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
