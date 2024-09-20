import { Link } from "react-router-dom";

const VenueCard = ({ data }) => {
  const { id, name, price, rating } = data;

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <Link to={`/Venue/${id}`}>
      <div className="w-[331px] h-[339px] overflow-hidden relative bg-white">
        <div className="h-[233px] w-full">
          <img
            src={data.media[0]?.url || "src/assets/test-img.jpeg"}
            alt={data.media[0]?.alt || "Venue image"}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="pl-4 pt-2 flex relative">
          <div className="flex flex-col flex-1 pr-4">
            <p className="mb-1 text-xs">
              {data.location.city}, {data.location.country}
            </p>
            <h2 className="text-2xl font-bold mb-1">
              {truncateText(name, 20)}
            </h2>
            <h3 className="text-xl font-semibold">${price} / Night</h3>
          </div>
          <div className="absolute top-1 right-4">
            <span className="text-xs">Rating {rating}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VenueCard;