import React from "react";

const RadioButton = ({
  label = "",
  options = [],
  selectedOption = "",
  setSelectedOption = () => {},
  className = "",
}) => {
  const isObjectOption = typeof options?.[0] === "object";

  const getOptionValue = (option) => (isObjectOption ? option.value : option);
  const getOptionLabel = (option) => (isObjectOption ? option.label : option);

  return (
    <div className={`flex flex-col  ${className}`}>
      {label && <p className="flex gap-2 items-center text-base mb-1 font-medium  text-secondary/80">{label}</p>}

      <div className="flex flex-wrap gap-2">
        {options.map((option, index) => {
          const value = getOptionValue(option);
          const optionLabel = getOptionLabel(option);
          const isSelected = selectedOption === value;

          return (
            <button
              key={index}
              onClick={() => setSelectedOption(value)}
              className={`px-4 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all border-[1.5px]
                ${
                  isSelected
                    ? "bg-primary border-secondary font-semibold text-secondary"
                    : "bg-lBackground hover:bg-secondary/5 border-border text-secondary"
                }`}
            >
              {optionLabel}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RadioButton;
