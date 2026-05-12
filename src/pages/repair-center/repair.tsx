import AdminPanel from "../../adminpages/AdminPanel";
import RepairDashboard from "../../adminpages/RepairDashboard";

export default function RepairPage() {
  return (
    <AdminPanel mode="repairs">
      <RepairDashboard />
    </AdminPanel>
  );
}
