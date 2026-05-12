import { useEffect } from "react";
import { useRouter } from "next/router";

export default function RepairIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/repair-center/repair");
  }, [router]);

  return <p>Redirecting to repair center...</p>;
}
