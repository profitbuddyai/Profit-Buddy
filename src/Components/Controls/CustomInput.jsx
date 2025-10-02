import clsx from "clsx";
import InfoTooltip from "./InfoTooltip";

const CustomInput = ({
    label,
    value,
    onChange,
    placeholder,
    prefix,
    suffix,
    className ='',
    error,
    disabled,
    name,
    type = "text",
    info,
    inputClassName = '',
    size = 'small',//small, large
    ...props
}) => {
    return (
        <div className={`w-full fontDmmono ${disabled ? 'opacity-80 pointer-events-none select-none' : ''} ${className}`}>
            {label && (
                <label
                    // htmlFor={name}
                    className="flex gap-2 items-center text-base mb-1 font-medium  text-secondary/80"
                >
                    {label}
                    {info && (<InfoTooltip content={info} id={`InputInfo_${label}`} />)}
                </label>
            )}

            <div
                className={clsx(
                    "flex border rounded-md focus-within:ring focus-within:ring-secondary transition-all overflow-hidden",
                    error ? "border-red-500" : "border-border",
                    disabled && "opacity-60 !cursor-not-allowed",
                    size === 'small'? 'h-10 text-[13px]':'h-11 text-[15px]',
                    inputClassName, 
                )}
            >
                {prefix && (
                    <div className={` ${typeof prefix === "string" ? 'px-3' : ''} flex justify-center items-center text-lText h-full bg-lBackground border-r border-border`}>
                        {prefix}
                    </div>
                )}

                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    disabled={disabled}
                    step="any"
                    className={clsx(
                        "flex-1 bg-transparent border-none h-full outline-none px-3  w-full  font-medium text-secondary/70",
                        "placeholder:text-lText placeholder:font-normal"
                    )}
                    {...props}
                />

                {suffix && (
                    <span className={` ${typeof suffix === "string" ? 'px-3' : ''} flex justify-center items-center text-lText h-full bg-lBackground border-l border-border`}>
                        {suffix}
                    </span>
                )}
            </div>

            {error && <p className="mt-1 text-xs !text-red-500">{error}</p>}
        </div>
    );
};

export default CustomInput;
