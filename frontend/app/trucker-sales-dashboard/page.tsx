import { PlaceOrderClient } from "./components/client";
import { cookies } from "next/headers";
import { getAllInvoices } from "@/actions/get-all-invoices";
import { getAllTruckDeliveries } from "@/actions/get-all-truck-deliveries";

const DashboardPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  console.log("Token: ", token?.value);
  const data = await getAllTruckDeliveries(token?.value);

  const orders = data?.deliveries || [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PlaceOrderClient data={orders} />
      </div>
    </div>
  );
};

export default DashboardPage;
