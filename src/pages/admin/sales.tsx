import AdminPanel from "../../adminpages/AdminPanel";
import SalesHistory from "../../adminpages/SalesHistory";

export default function SalesPage() {
  return (
    <AdminPanel mode="inventory">
      <SalesHistory />
    </AdminPanel>
  );
}
