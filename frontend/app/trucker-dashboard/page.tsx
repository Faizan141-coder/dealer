import { PlaceOrderClient } from "./components/client";
import { cookies } from "next/headers";
import { getAllInvoices } from "@/actions/get-all-invoices";
import { getAllTruckDeliveries } from "@/actions/get-all-truck-deliveries";
import { getUserInfo } from "@/actions/get-user-info";

const DashboardPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  console.log("Token: ", token?.value);
  const data = await getAllTruckDeliveries(token?.value);
  const username = await getUserInfo(token?.value);

  const orders = data?.deliveries || [];
  const Username = username?.username || "";

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PlaceOrderClient data={orders} username={Username} />
      </div>
    </div>
  );
};

export default DashboardPage;
