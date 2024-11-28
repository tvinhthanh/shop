import { useQuery } from "react-query";
import * as apiClient from "../api-client";
import LatestDestinationCard from "../components/LastestDestinationCard";

const Home = () => {
  const { data: hotels, isLoading, isError } = useQuery("fetchQuery", () =>
    apiClient.fetchHotels()
  );

  // Handle loading and error states
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !hotels) {
    return <div>Something went wrong. Please try again later.</div>;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-3xl font-bold">Điểm đến mới nhất</h2>
      <p>Các điểm đến gần đây nhất</p>

      <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
        {/* Loop through all hotels and display them */}
        {hotels.map((hotel) => (
          <LatestDestinationCard key={hotel._id} hotel={hotel} />
        ))}
      </div>
    </div>
  );
};

export default Home;
