import { getAllOrders } from "@/actions/get-all-orders";
import { PlaceOrderClient } from "./components/client";
import { cookies } from "next/headers";

const PlaceOrderPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  console.log("Token: ", token?.value);
  const data = await getAllOrders(token?.value);

  const orders = data || [];

  console.log("Orders: ", orders);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PlaceOrderClient data={orders} />
      </div>
    </div>
  );
};

export default PlaceOrderPage;
