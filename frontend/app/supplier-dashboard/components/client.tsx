// "use client";

// import { Heading } from "@/components/ui/heading";
// import { Separator } from "@/components/ui/separator";
// import { columns, PlaceOrderColumn } from "./columns";
// import { DataTable } from "@/components/ui/data-table";
// import { Button } from "@/components/ui/button";
// import Cookies from "js-cookie";
// import { useRouter } from "next/navigation";
// import toast from "react-hot-toast";

// interface PlaceOrderClientProps {
//   data: PlaceOrderColumn[];
// }

// export const PlaceOrderClient: React.FC<PlaceOrderClientProps> = ({ data }) => {

//   const router = useRouter();

//   const handleLogout = () => {
//     Cookies.remove("authToken");
//     Cookies.remove("userRole");
//     toast.success("Logged out successfully");
//     router.push("/");
//   };

//   return (
//     <>
//       <div className="flex items-center justify-between">
//         <Heading
//           title="Supplier Dashboard"
//           description={`Total (${data.length})`}
//         />
//         <Button onClick={handleLogout}>
//           Logout
//         </Button>
//       </div>
//       <Separator />
//       <DataTable searchKey="product_name" columns={columns} data={data} />
//     </>
//   );
// };


"use client";

import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { columns, PlaceOrderColumn } from "./columns";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface PlaceOrderClientProps {
  data: any[]; // Data structure from the backend
}

export const PlaceOrderClient: React.FC<PlaceOrderClientProps> = ({ data }) => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("authToken");
    Cookies.remove("userRole");
    toast.success("Logged out successfully");
    router.push("/");
  };

  // Map backend data to the frontend format
  // const mappedData: PlaceOrderColumn[] = data.flatMap((invoice: any) =>
  //   invoice.ProductDetail.sub_products.map((subProduct: any) => ({
  //     id: subProduct.id.toString(),
  //     product_name: subProduct.product_name,
  //     product_type: subProduct.product_type,
  //     product_quantity: subProduct.quantity.toString(),
  //     client_address: subProduct.delivery_address,
  //     delivery_date: subProduct.delivery_date,
  //     status: subProduct.sub_status,
  //   }))
  // );

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title="Supplier Dashboard"
          description={`Total (${data.length})`}
        />
        <Button onClick={handleLogout}>
          Logout
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="product_name" columns={columns} data={data} />
    </>
  );
};