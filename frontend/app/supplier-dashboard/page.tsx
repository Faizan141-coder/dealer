import { PlaceOrderClient } from "./components/client";
import { cookies } from "next/headers";
import { getAllInvoices } from "@/actions/get-all-invoices";
import { getUserInfo } from "@/actions/get-user-info";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("authToken");
  console.log("Token: ", token?.value);
  const data = await getAllInvoices(token?.value);
  const username = await getUserInfo(token?.value);

  const orders = data?.invoices || [];
  const Username = username?.username || "";

  console.log("Orders:", orders);

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

export default DashboardPage;
