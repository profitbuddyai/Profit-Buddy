import React, { useEffect, useRef, useState } from "react";
import { FiMessageSquare, FiSend, FiX } from "react-icons/fi";
import { IconImages } from "../../Enums/Enums";
import AnimationWrapper from "../Layout/AnimationWrapper";
import { AnimatePresence, motion } from "framer-motion";

const CustomerSupport = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const messengerRef = useRef(null)
    const [chat, setChat] = useState([
        { sender: "bot", text: "Hi there! 👋 How can we help you today?" },
    ]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!message.trim()) return;

        setChat([...chat, { sender: "user", text: message }]);
        setMessage("");

        setTimeout(() => {
            setChat((prev) => [
                ...prev,
                { sender: "bot", text: "Thanks for your message! Our team will reply shortly ⏳", },
            ]);
        }, 1000);
    };

    useEffect(() => {
        if (messengerRef.current) {
            messengerRef.current.scrollTop = messengerRef.current.scrollHeight;
        }
    }, [chat, isOpen]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setIsOpen(false);
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [isOpen]);

    return (
        <div className="z-50 bg-primary">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-4 right-4 bg-accent/20 backdrop-blur-[2px]  border-[1.5px] animteUpDown border-accent outline-accent cursor-pointer group p-4 rounded-full shadow-lg  transition "
            >
                <img src={IconImages?.robot} alt="Robot Image" className="w-[30px] group-hover:scale-110  transition-transform" />
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="chat-popup"
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30, mass: 0.5 }}
                        className="fixed bottom-24 right-8 w-[350px] h-[450px] bg-primary border-[1px] border-border rounded-xl productCardShadow flex flex-col overflow-hidden"
                    >
                        <div className="flex items-center justify-between bg-primary text-secondary  p-3">
                            <div className="flex items-center gap-2">
                                <img src={IconImages?.robot} alt="" className="w-[40px]" />
                                <h3 className="font-semibold text-2xl">Hey Buddy,</h3>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="cursor-pointer hover:opacity-80">
                                <FiX size={20} />
                            </button>
                        </div>

                        <div ref={messengerRef} className="flex-1 p-4 scroll-smooth customScroll space-y-3 max-h-80 border-t-[1px] border-border">
                            {chat.map((msg, idx) => (
                                <div
                                    key={idx}
                                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`px-3 py-2 rounded-xl max-w-[75%] text-sm ${msg.sender === "user"
                                            ? "bg-border/50 text-secondary rounded-br-none"
                                            : "bg-accent/20 text-secondary rounded-bl-none"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <form
                            onSubmit={handleSend}
                            className="flex items-center p-2 bg-primary"
                        >
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-1 px-3 py-2 text-sm text-lText rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-secondary"
                            />
                            <button
                                type="submit"
                                className="ml-2 bg-accent text-primary p-2 rounded-lg hover:bg-accent/80 cursor-pointer transition"
                            >
                                <FiSend size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CustomerSupport;
