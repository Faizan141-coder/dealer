import { PlaceOrderClient } from "./components/client";

const PlaceOrderPage = async ({ params }: { params: { storeId: string } }) => {
  // in categories display id, title, status
  const categories = [
    { id: "1", title: "Category 1", status: "pending" },
    { id: "2", title: "Category 2", status: "approved" },
    { id: "3", title: "Category 3", status: "pending" },
    { id: "4", title: "Category 4", status: "approved" },
    { id: "5", title: "Category 5", status: "pending" },
  ];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PlaceOrderClient data={categories} />
      </div>
    </div>
  );
};

export default PlaceOrderPage;
