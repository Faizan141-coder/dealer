import { PlaceOrderClient } from "./components/client";
import { cookies } from "next/headers";
import { getAllInvoices } from "@/actions/get-all-invoices";

const DashboardPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  console.log("Token: ", token?.value);
  const data = await getAllInvoices(token?.value);

  const orders = data?.invoices || [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PlaceOrderClient data={orders} />
      </div>
    </div>
  );
};

export default DashboardPage;
