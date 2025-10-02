import { Navigate, Outlet } from "react-router-dom";
import Loader from "../Components/Loaders/Loader";
import { useSelector } from "react-redux";

const SubscriptionRoute = () => {
    const { user, userLoading } = useSelector((state) => state?.user);

    if (userLoading) return <Loader />;

    if (!user) return <Navigate to="/authentication?tab=login" replace />;

    const sub = user.currentSubscription;
    const now = new Date();

    // if (user && sub?.status === "active" && (!sub.currentPeriodEnd || new Date(sub.currentPeriodEnd) >= now)) {
    //     return <Navigate to="/" replace />;
    // }

    return <Outlet />;
};

export default SubscriptionRoute;