import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "../Components/Sections/Login";
import Register from "../Components/Sections/Register";
import {useSearchParams } from "react-router-dom";

const Authentication = () => {

    const [searchParams] = useSearchParams();

    const tab = searchParams.get("tab");
    const [isLogin, setIsLogin] = useState(tab !== "register");

    useEffect(() => {
        if (tab === "register") {
            setIsLogin(false);
        } else {
            setIsLogin(true);
        }
    }, [tab]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-lBackground hideScroll !overflow-hidden">
            <AnimatePresence mode="wait" initial={false}>
                {isLogin ? (
                    <motion.div
                        key="login"
                        initial={{ x: "-40%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "-40%", opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute w-full"
                    >
                        <Login />
                    </motion.div>
                ) : (
                    <motion.div
                        key="register"
                        initial={{ x: "40%", opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: "40%", opacity: 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                        className="absolute w-full"
                    >
                        <Register />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default Authentication;