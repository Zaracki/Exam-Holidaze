import MetaTags from '../components/MetaTags';

const VenueDetails = ({ venue }) => {
  const city = venue.location?.city;
  const country = venue.location?.country;
  const location = city && country ? `${city}, ${country}` : 'Location unavailable';
  const ownerAvatarUrl = venue.owner?.avatar?.url || '';
  const ownerAvatarAlt = venue.owner?.avatar?.alt || 'Owner avatar';
  const ownerName = venue.owner?.name || 'Unknown owner';
  const venueName = venue.name || 'Venue name unavailable';
  const venueDescription = venue.description || 'Description unavailable';

  return (
    <div className="flex-1 max-w-full md:max-w-[1156px]">
      <div className="mb-8 text-white">
        <h1 className="text-3xl font-bold">{venueName}</h1>
        <p className="text-lg">{location}</p>
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
        <p className="mt-2">{venueDescription}</p>
        <hr className="mt-3 mb-3 border-gray-600" />
        <MetaTags meta={venue.meta} />
      </div>
    </div>
  );
};

export default VenueDetails;