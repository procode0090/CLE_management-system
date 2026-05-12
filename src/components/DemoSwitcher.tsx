import { useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/router";
import { Repeat } from "lucide-react";

const DemoSwitcher = () => {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith("/admin") || router.pathname.startsWith("/repair-center");
  const isHome = router.pathname === "/";

  const activeIndicatorClass = useMemo(
    () => (isAdminRoute ? "bg-orange-500" : "bg-[#008080]"),
    [isAdminRoute]
  );

  const toggleView = () => {
    if (isHome) {
      const showAdmin = router.query.view !== "admin";
      router.replace(
        {
          pathname: "/",
          query: showAdmin ? { view: "admin" } : {},
        },
        undefined,
        { shallow: true }
      );
    } else {
      router.push(isAdminRoute ? "/" : "/admin/dashboard");
    }
  };

  return (
    <div className="fixed bottom-10 left-10 z-[100]">
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-black/90 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex items-center gap-2 shadow-2xl"
      >
        {/* Label Display */}


        {/* Switch Action */}
        <button
          onClick={toggleView}
          className="bg-white text-black px-4 py-3 rounded-xl flex items-center gap-2 hover:bg-[#008080] hover:text-white transition-all duration-300 group"
        >
          <Repeat size={14} className="group-hover:rotate-180 transition-transform duration-500" />
        </button>
      </motion.div>

      {/* Subtle indicator pulse */}
      <div className={`absolute -top-1 -right-1 w-3 h-3 rounded-full animate-ping ${activeIndicatorClass}`} />
    </div>
  );
};

export default DemoSwitcher;