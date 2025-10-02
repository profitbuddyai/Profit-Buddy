import React, { useState } from 'react'
import { IoIosArrowDown } from 'react-icons/io'
import { AnimatePresence, motion } from 'framer-motion';

const CustomCard = ({ label, action, className, children, wantsDrawer = true }) => {
    const [isOpen, setIsOpen] = useState(true);

    const toggleDrawer = () => {
        if (wantsDrawer) {
            setIsOpen((prev) => !prev);
        }
    };
    return (
        <div className={`border border-border rounded-lg flex flex-col w-full bg-primary ${className}`}>
            {(label || action) && (
                <div
                    className={`flex justify-between w-full items-center  p-4 rounded-t-lg ${wantsDrawer ? 'border-b border-border cursor-pointer hover:bg-secondary/5 bg-secondary/5 ' : ''}`}
                    onClick={toggleDrawer}
                >
                    {label && (<h1 className='text-[24px]/[24px] text-secondary font-semibold fontDmmono'>{label}</h1>)}
                    <div className="flex items-center gap-2">
                        {action && action}
                        {wantsDrawer && (
                            <motion.div
                                animate={{ rotate: isOpen ? 0 : -90 }}
                                transition={{ duration: 0.3 }}
                            >
                                <IoIosArrowDown size={20} />
                            </motion.div>
                        )}
                    </div>
                </div>)}
            <AnimatePresence initial={false}>
                <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.35, ease: "easeInOut" }}
                    className="overflow-hidden"
                >
                    <div className="p-4">{children}</div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}

export default CustomCard