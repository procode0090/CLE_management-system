import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AdminGateway from "../adminpages/AdminGateway";
import MainPage from "../page-components/MainPage";

export default function HomePage() {
  const router = useRouter();
  const [isAdminView, setIsAdminView] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    setIsAdminView(router.query.view === "admin");
  }, [router.isReady, router.query.view]);

  return isAdminView ? <AdminGateway /> : <MainPage />;
}
