import { getAllInvoicesFromSupplier } from "@/actions/get-all-invoices-from-supplier";
import { PlaceOrderClient } from "./components/client";
import { cookies } from "next/headers";
import { getUserInfo } from "@/actions/get-user-info";

const DashboardPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  console.log("Token: ", token?.value);
  const data = await getAllInvoicesFromSupplier(token?.value);
  const usernmae = await getUserInfo(token?.value);

  const orders = data?.invoices || [];
  const Username = usernmae?.username || "";

  console.log("Orders:", orders);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <PlaceOrderClient data={orders} username={Username} />
      </div>
    </div>
  );
};

export default DashboardPage;
