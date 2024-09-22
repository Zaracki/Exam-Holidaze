import VenueCard from "../cards/VenueCard.jsx";

export const VenueList = ({ products }) => {
  if (products.length === 0) {
    return <div className="text-center mt-6">No results found</div>;
  }

  const sortedProducts = products.sort((a, b) => new Date(b.created) - new Date(a.created));

  return (
    <div className="mx-auto mt-10 max-w-[1152px] w-full px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
        {sortedProducts.map(product => (
          <VenueCard data={product} key={product.id} />
        ))}
      </div>
    </div>
  );
};