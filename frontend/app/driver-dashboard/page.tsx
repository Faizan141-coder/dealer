import { cookies } from "next/headers";
import { getPendingDeliveries } from "@/actions/get-pending-deliveries";
import { PlaceOrderClient } from "./components/client";

const DashboardPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  console.log("Token: ", token?.value);
  const data = await getPendingDeliveries(token?.value);

  const orders = data || [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PlaceOrderClient data={orders} />
      </div>
    </div>
  );
};

export default DashboardPage;
