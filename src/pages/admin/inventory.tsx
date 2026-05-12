import AdminPanel from "../../adminpages/AdminPanel";
import Inventory from "../../adminpages/Inventory";

export default function InventoryPage() {
  return (
    <AdminPanel mode="inventory">
      <Inventory />
    </AdminPanel>
  );
}
