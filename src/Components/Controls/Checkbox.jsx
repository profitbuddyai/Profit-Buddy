import React from "react";
import { IoCheckmark } from "react-icons/io5";
import InfoTooltip from "./InfoTooltip";
import { LuCheck } from "react-icons/lu";

const Checkbox = ({ checked = false, onChange = () => { }, id = "animatedCheck", label = "" , info='' , className='' }) => {
    return (
        <label
            htmlFor={id}
            className={`flex items-center gap-1.5 cursor-pointer select-none ${className}`}
        >
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="sr-only peer"
                aria-checked={checked}
            />

            <span
                className={`relative w-[15px] h-[15px] rounded-sm border-[1.5px] flex items-center justify-center transition-colors duration-300 select-none
        ${checked ? "bg-secondary border-secondary" : "bg-primary border-border"}`}
            >
                <LuCheck
                    className={`text-primary !text-[12px] transition-opacity duration-300
          ${checked ? "opacity-100" : "opacity-0"}`}
                />
            </span>

            {label && (
                <div className="flex gap-2 items-center text-[12px] font-medium text-secondary">
                    {label}
                    {info && (<InfoTooltip content={info} id={`InputInfo_${label}`} />)}
                </div>
            )}
        </label>
    );
};

export default Checkbox;
