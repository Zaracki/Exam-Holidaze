import { Link } from "react-router-dom";

const VenueCard = ({ data }) => {
  const { id, name, price, rating } = data;

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  const locationText = data.location?.city && data.location?.country
    ? `${data.location.city}, ${data.location.country}`
    : "Location unavailable";

  const venueName = name ? truncateText(name, 20) : "Unnamed Venue";

  const venuePrice = price !== undefined ? `$${price} / Night` : "Price unavailable";
  const venueRating = rating !== undefined ? `Rating ${rating}` : "Rating unavailable";


  const fallbackImage = "src/assets/fallback-img.png";

  return (
    <Link to={`/Venue/${id}`}>
      <div className="w-[331px] h-[339px] overflow-hidden relative bg-stone-800">
        <div className="h-[233px] w-full">
          <img
            src={data.media[0]?.url || fallbackImage}
            alt={data.media[0]?.alt || "Venue image"}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = fallbackImage; }}
          />
        </div>
        <div className="pl-4 pt-2 flex relative">
          <div className="flex flex-col flex-1 pr-4">
            <p className="mb-1 text-xs text-white">
              {locationText}
            </p>
            <h2 className="text-2xl font-bold mb-1 text-white">
              {venueName}
            </h2>
            <h3 className="text-xl font-semibold text-white">{venuePrice}</h3>
          </div>
          <div className="absolute top-1 right-4">
            <span className="text-xs text-white">{venueRating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VenueCard;
