import AdminPanel from "../../adminpages/AdminPanel";
import CreateSaleSlip from "../../adminpages/CreateSaleSlip";

export default function SalesSlipPage() {
  return (
    <AdminPanel mode="inventory">
      <CreateSaleSlip />
    </AdminPanel>
  );
}
