import { getAllDetails } from "@/actions/get-all-details";
import { cookies } from "next/headers";
import SalesDashboard from "./components/columns";

const DashboardPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  const data = await getAllDetails(token?.value);

  const orders = data?.products_details || [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SalesDashboard initialData={orders} />
      </div>
    </div>
  );
};

export default DashboardPage;