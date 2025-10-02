import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setTheme } from "../../Redux/Slices/SystemSlice";
import { getUserDetail } from "../../Apis/User";
import { setUser, setUserLoading } from "../../Redux/Slices/UserSlice";
import { NODE_ENV } from "../../../config";

export default function UserProvider({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchUser = async () => {
            const userToken = localStorage.getItem("ProfitBuddyToken");
            if (!userToken) {
                dispatch(setUser(null))
                dispatch(setUserLoading(false))
                return;
            };

            try {
                dispatch(setUserLoading(true));
                const data = await getUserDetail();
                console.log(data?.nodeEnv, NODE_ENV , "🛍️🛍️🛍️");

                dispatch(setUser(data?.user));
            } catch (err) {
                // localStorage.removeItem("ProfitBuddyToken");
                dispatch(setUser(null));
            } finally {
                dispatch(setUserLoading(false));
            }
        };

        fetchUser();
    }, [dispatch]);

    return children;
}
