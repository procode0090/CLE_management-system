import React from "react";
import { motion } from "framer-motion";
import { Clock, ShieldCheck, UserCheck } from "lucide-react";

const ServiceTrinity = () => {
  const pillars = [
    {
      icon: <Clock className="w-10 h-10" />,
      title: "24/7 Concierge",
      description: "Round-the-clock access to our specialists. Whether you are in London or Tokyo, our team is available to assist with your collection at any hour."
    },
    {
      icon: <ShieldCheck className="w-10 h-10" />,
      title: "Secure Custody",
      description: "Beyond insurance, we provide total peace of mind. Every asset in our archive is protected by military-grade encryption and physical vault security."
    },
    {
      icon: <UserCheck className="w-10 h-10" />,
      title: "Private Acquisition",
      description: "We prioritize discretion. All transfers are handled via private consultation and secure wire, ensuring the highest level of financial privacy."
    }
  ];

  return (
    <section className="py-32 bg-[#fafafa] px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Title Section */}
        <div className="text-center mb-24">
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-[11px] uppercase tracking-[0.6em] text-[#006666] font-bold mb-4"
          >
            The CLE Experience
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif text-gray-900 tracking-tight"
          >
            Elite Client Services
          </motion.h2>
        </div>

        {/* Three Points Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {pillars.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2, duration: 0.8 }}
              className="group flex flex-col items-center text-center space-y-8 p-10 bg-white rounded-[40px] shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100"
            >
              {/* Brand Color Icon Container */}
              <div className="p-6 bg-gray-50 text-[#006666] rounded-full group-hover:bg-[#006666] group-hover:text-white transition-all duration-500 transform group-hover:scale-110">
                {item.icon}
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-serif text-gray-900 group-hover:text-[#006666] transition-colors">
                  {item.title}
                </h3>
                {/* Brand Color Divider */}
                <div className="w-8 h-[2px] bg-[#006666] mx-auto transition-all duration-500 group-hover:w-16" />
                <p className="text-gray-500 leading-relaxed font-light text-base px-2">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Contact Note */}
        {/* <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-gray-200 bg-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#006666] animate-pulse" />
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-500 font-medium">
              Private wire instructions available upon request
            </p>
          </div>
        </motion.div> */}

      </div>
    </section>
  );
};

export default ServiceTrinity;