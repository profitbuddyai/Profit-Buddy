import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setTheme } from "../../Redux/Slices/SystemSlice";

export default function ThemeProvider({ children }) {
    const { theme } = useSelector((state) => state.system);
    const dispatch = useDispatch();

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme !== null) {
            dispatch(setTheme(storedTheme === "dark"));
        }
    }, [dispatch]);

    useEffect(() => {
        if (theme) {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    return children;
}
