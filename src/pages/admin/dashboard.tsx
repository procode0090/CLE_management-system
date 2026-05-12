import AdminPanel from "../../adminpages/AdminPanel";
import AdminDashboard from "../../adminpages/AdminDashbaord";

export default function DashboardPage() {
  return (
    <AdminPanel mode="inventory">
      <AdminDashboard />
    </AdminPanel>
  );
}
