import AdminPanel from "../../adminpages/AdminPanel";
import AddProducts from "../../adminpages/AddProducts";

export default function AddProductPage() {
  return (
    <AdminPanel mode="inventory">
      <AddProducts />
    </AdminPanel>
  );
}
