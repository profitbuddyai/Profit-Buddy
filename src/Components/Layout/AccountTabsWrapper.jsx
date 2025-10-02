"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ProfileTab from "../Widgets/ProfileTab";
import SubscriptionTab from "../Widgets/SubscriptionTab";
import BillingTab from "../Widgets/BillingTab";

const TABS_ORDER = ["profile", "subscription", "billing"];

const normalize = (s) => (typeof s === "string" ? s.toLowerCase() : s);

const AccountTabsWrapper = ({ activeTab }) => {
  const prevIndexRef = useRef(TABS_ORDER.indexOf(normalize(activeTab)));
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const currentIndex = TABS_ORDER.indexOf(normalize(activeTab));
    const prevIndex = prevIndexRef.current;

    if (currentIndex === -1) return;

    const dir = currentIndex > prevIndex ? 1 : currentIndex < prevIndex ? -1 : 1;

    prevIndexRef.current = currentIndex;
    setDirection(dir);
  }, [activeTab]);

  const variants = {
    enter: (dir) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="relative w-full overflow-hidden min-h-[200px]">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={normalize(activeTab)}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {normalize(activeTab) === "profile" && <ProfileTab />}
          {normalize(activeTab) === "subscription" && <SubscriptionTab />}
          {normalize(activeTab) === "billing" && <BillingTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default AccountTabsWrapper;
