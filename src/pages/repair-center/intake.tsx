import AdminPanel from "../../adminpages/AdminPanel";
import AddRepairIntake from "../../adminpages/AddRepairIntake";

export default function RepairIntakePage() {
  return (
    <AdminPanel mode="repairs">
      <AddRepairIntake />
    </AdminPanel>
  );
}
