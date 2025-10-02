import { useState } from "react";
import { FaRegCopy, FaCheck } from "react-icons/fa";
import { IoCheckmarkOutline } from "react-icons/io5";
import { MdCheck, MdContentCopy } from "react-icons/md";

const CopyButton = ({ text ,className}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault(); 
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    } catch (error) {
      console.error("Copy failed", error);
    }
  };

  return (
    <span
      className={`cursor-pointer text-sm select-none text-secondary hover:text-accent transition-colors ${className}`}
      onClick={handleCopy}
    >
      {copied ? <MdCheck /> : <MdContentCopy />}
    </span>
  );
};

export default CopyButton;
