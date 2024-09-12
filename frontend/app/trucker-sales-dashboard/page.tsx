import Component from "./components/columns";
import { cookies } from "next/headers";
import { getAllTruckSales } from "@/actions/get-all-truck-sales";

const DashboardPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  const data = await getAllTruckSales(token?.value);

  const orders = data?.invoices || [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <Component data={orders} />
      </div>
    </div>
  );
};

export default DashboardPage;
