import { getAllOrders } from "@/actions/get-all-orders";
import { PlaceOrderClient } from "./components/client";
import { cookies } from "next/headers";
import { getUserInfo } from "@/actions/get-user-info";

const PlaceOrderPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  console.log("Token: ", token?.value);
  const data = await getAllOrders(token?.value);
  const usernmae = await getUserInfo(token?.value);

  const orders = data || [];
  const Username = usernmae?.username || "";

  console.log("Orders: ", orders);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PlaceOrderClient data={orders} username={Username} />
      </div>
    </div>
  );
};

export default PlaceOrderPage;
