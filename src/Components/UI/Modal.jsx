import { useEffect, useCallback } from "react";
import { VscClose } from "react-icons/vsc";
import { AnimatePresence, motion } from "framer-motion";
import { IoPricetagsOutline } from "react-icons/io5";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { scale: 1, opacity: 0, y: -50 },
  visible: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 1, opacity: 0, y: -50 },
};

const Modal = ({
  isOpen,
  setIsOpen,
  label = '',
  subText = '',
  actions = null,
  className = '',
  extraFuntion = () => { },
  closeOnEsc = true,
  children,
}) => {

  const closeModal = useCallback(() => {
    extraFuntion();
    setIsOpen(false);
  }, [extraFuntion, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `2.5px`;
    } else {
      document.body.style.overflow = "auto";
      document.body.style.paddingRight = "0px";
    }

    const handleKeyDown = (e) => {
      if (e.key === "Escape" && closeOnEsc) closeModal();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, closeModal]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`inset-0 flex items-center justify-center bg-primary/80  z-[150] p-6 fixed`}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.div
            className={`relative bg-primary rounded-xl shadow-lg border border-border max-w-[550px] max-h-[600px] w-full overflow-auto customScroll ${className}`}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-2 right-2 text-lText hover:text-secondary cursor-pointer z-[1]"
              onClick={closeModal}
            >
              <VscClose size={22} />
            </button>

            {(label || subText) && (
                <div className='flex flex-col gap-2 px-4 pt-4 w-full'>
                    {label && <h1 className='w-full text-secondary/90 text-[28px]/[28px] font-semibold '>{label}</h1>}
                  {subText && <p className='text-lText text-sm'>{subText}</p>}
                </div>
            )}

            <div className="h-full px-4 py-6">
              {children}
            </div>

            {actions && (
              <div className='flex gap-2 justify-end bg-lBackground px-4 py-4 w-full border-t border-border'>
                {actions}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
