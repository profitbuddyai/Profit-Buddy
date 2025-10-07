import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Loader from "../Components/Loaders/Loader";

const PrivateRoutes = () => {
  const { user, userLoading } = useSelector((state) => state?.user);

  if (userLoading) return <Loader />;

  if (!user) return <Navigate to="/authentication?tab=login" />;

  const sub = user.currentSubscription;
  const now = new Date();

  if (!sub || (sub.status !== "active" && sub.status !== "trialing") || (sub.currentPeriodEnd && new Date(sub.currentPeriodEnd) < now)) {
    return <Navigate to="/plans" />;
  }

  return <Outlet />;
};

export default PrivateRoutes