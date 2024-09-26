import { useState } from "react";
import PrimaryButton from "../../components/buttons/PrimaryButton";
import { useFetch } from "../../hooks/useFetch";
import { API_URL, VENUES } from "../../api/Constants";
import { VenueList } from "../../components/lists/VenueList";
import LoadingSpinner from "../../components/LoadingSpinner";
import heroImage from "../../assets/hero-image.png"

export const Home = () => {
  const { data: venues, isLoading, hasError } = useFetch(`${API_URL}${VENUES}`);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVenues, setFilteredVenues] = useState([]);

  const handleSearch = () => {
    if (venues) {
      const filtered = venues.filter(venue =>
        venue.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredVenues(filtered);
    }
  };

  return (
    <div className="bg-zinc-900 min-h-screen">
      <div className="relative">
        <img
          src={heroImage}
          alt="Hero"
          className="w-full h-[500px] object-cover mx-auto"
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 tracking-wide text-[#DAB674]">
            Find Your Perfect Getaway at Holidaze
          </h1>
          <p className="text-white text-xl md:text-2xl max-w-[637px] mx-auto mb-6 font-medium">
            We specialize in providing the best locations for your unforgettable holiday experience.
          </p>
          <div className="flex items-center justify-center mt-5 w-full max-w-[660px]">
            <input
              type="text"
              id="search-query"
              name="search-query"
              placeholder="Search for your getaway..."
              className="flex-1 h-10 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <PrimaryButton className="ml-1" onClick={handleSearch}>Search</PrimaryButton>
          </div>
        </div>
      </div>
      {isLoading && <LoadingSpinner />}
      {hasError && <p>Something went wrong, please try again later.</p>}
      {!isLoading && !hasError && <VenueList products={filteredVenues.length > 0 ? filteredVenues : venues} />}
    </div>
  );
};