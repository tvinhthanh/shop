import { useForm } from "react-hook-form";
import { useSearchContext } from "../../contexts/SearchContext";
import { useParams } from "react-router-dom";

export type BookingFormData = {
  firstName: string;
  lastName: string;
  email: string;
  adultCount: number;
  childCount: number;
  checkIn: string;
  checkOut: string;
  hotelId: string;
  totalCost: number;
};

const BookingForm = () => {
  const search = useSearchContext();
  const { hotelId } = useParams();

  const { handleSubmit, register } = useForm<BookingFormData>({
    defaultValues: {
      firstName: "John", // Mock data
      lastName: "Doe",
      email: "johndoe@example.com",
      adultCount: search?.adultCount || 2,
      childCount: search?.childCount || 1,
      checkIn: new Date().toISOString(),
      checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 ngày sau
      hotelId: hotelId || "defaultHotelId",
      totalCost: 150.0,
    },
  });

  const onSubmit = (formData: BookingFormData) => {
    console.log("Form Submitted: ", formData);
    alert("Booking Confirmed!");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid grid-cols-1 gap-5 rounded-lg border border-slate-300 p-5"
    >
      <span className="text-3xl font-bold">Confirm Your Details</span>
      <div className="grid grid-cols-2 gap-6">
        <label className="text-gray-700 text-sm font-bold flex-1">
          First Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("firstName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Last Name
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("lastName")}
          />
        </label>
        <label className="text-gray-700 text-sm font-bold flex-1">
          Email
          <input
            className="mt-1 border rounded w-full py-2 px-3 text-gray-700 bg-gray-200 font-normal"
            type="text"
            readOnly
            disabled
            {...register("email")}
          />
        </label>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Your Price Summary</h2>

        <div className="bg-blue-200 p-4 rounded-md">
          <div className="font-semibold text-lg">Total Cost: £150.00</div>
          <div className="text-xs">Includes taxes and charges</div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white p-2 font-bold hover:bg-blue-500 text-md"
        >
          Confirm Booking
        </button>
      </div>
    </form>
  );
};

export default BookingForm;
