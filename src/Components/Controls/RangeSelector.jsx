import React from "react";
import InfoTooltip from "./InfoTooltip";

const RangeSelector = ({
    value,
    min = 0,
    max = 100,
    step = 1,
    onChange,
    label,
    info,
    className,
}) => {
    // percentage fill for gradient
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className={`flex flex-col gap-2 w-full ${className}`}>
            {label && (
                <label className="flex gap-2 items-center text-sm font-medium text-secondary fontDmmono">
                    {label}
                    {info && (<InfoTooltip content={info} id={`InputInfo_${label}`} />)}
                    <p className="text-secondary">{value}</p>
                </label>
            )}

            <div className="relative w-full">
                {/* Slider */}
                <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    style={{
                        background: `linear-gradient(to right, var(--secondary) ${percentage}%, var(--border) ${percentage}%)`
                    }}
                    className="w-full appearance-none h-2 rounded-lg cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none 
            [&::-webkit-slider-thumb]:h-4 
            [&::-webkit-slider-thumb]:w-4 
            [&::-webkit-slider-thumb]:rounded-full 
            [&::-webkit-slider-thumb]:bg-secondary 
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:h-4 
            [&::-moz-range-thumb]:w-4 
            [&::-moz-range-thumb]:rounded-full 
            [&::-moz-range-thumb]:cursor-pointer
            "
                />

                {/* Value Bubble */}
                {/* <div
                    className="absolute -top-8 left-0 transform -translate-x-1/2"
                    style={{ left: `${percentage}%` }}
                >
                    <span className="px-3 py-1 text-sm font-semibold text-primary bg-secondary rounded-lg shadow">
                        {value}
                    </span>
                </div> */}
            </div>
        </div>
    );
};

export default RangeSelector;
