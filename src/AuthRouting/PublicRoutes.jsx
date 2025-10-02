import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../Components/Loaders/Loader";

const PublicRoutes = () => {
  const { user, userLoading } = useSelector((state) => state?.user);

  if (userLoading) return <Loader />;

  const sub = user?.currentSubscription;
  const now = new Date();

  if (user && (sub?.status === "active" || sub?.status === "trialing") && (!sub.currentPeriodEnd || new Date(sub.currentPeriodEnd) >= now)) {
    return <Navigate to="/" replace />;
  }
  
  if (user) {
    return <Navigate to="/plans" replace />;
  }

  return <Outlet />;
};


export default PublicRoutes;
