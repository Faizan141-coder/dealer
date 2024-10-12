import { PlaceOrderClient } from "./components/client";
import { cookies } from "next/headers";
import { getAllSalesOrders } from "@/actions/get-all-sales-orders";
import { getUserInfo } from "@/actions/get-user-info";
import { redirect } from "next/navigation";

const PlaceOrderPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  console.log("Token: ", token?.value);
  const data = await getAllSalesOrders(token?.value);
  const username = await getUserInfo(token?.value);

  const orders = data || [];
  const Username = username?.username || "";

  console.log("Orders: ", orders);

  if (!token) {
    redirect("/");
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PlaceOrderClient data={orders} username={Username} />
      </div>
    </div>
  );
};

export default PlaceOrderPage;
