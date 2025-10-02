import { IoCloseOutline } from "react-icons/io5";
import { LuDelete } from "react-icons/lu";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Button from "../Controls/Button";
import { isEqual } from "lodash";

const SelectedFilters = ({ queryFilter, handleFilterClick, handleReset, handleApplyFilter, productsQuery, queryFilterLocal }) => {

    const activeFilters = Object.entries(queryFilter)
        .flatMap(([type, values]) => values.map((val) => ({ type, val })));

    return (
        <div className="flex flex-col gap-3 bg-primary p-3 border border-border rounded-lg">
            <div className="flex items-center justify-between">
                <p className="text-[34px]/[34px] text-secondary font-semibold">
                    Filters
                </p>
                <Button
                    action={handleApplyFilter}
                    disabled={isEqual(productsQuery, queryFilterLocal)}
                    variant="secondary"
                    size="small"
                    corner="full"
                    label="Apply Changes"
                />
            </div>
            {!activeFilters.length ? (
                <div className="border-y border-border py-2.5 flex items-center justify-center mx-2">
                    <p className="text-lText text-sm">No Filters Selected</p>
                </div>
            ) : (
                <div className="flex flex-wrap items-center gap-2 border-y border-border py-2 ">
                    {activeFilters.map((filter, idx) => (
                        <div
                            key={idx}
                            className="flex items-center gap-1.5 bg-border/50 border border-border text-secondary/70 px-3 py-1 rounded-full text-xs"
                        >
                            <span>{filter.val}</span>
                            <button
                                onClick={() => handleFilterClick(filter.type, filter.val)}
                                className="hover:text-red-500 cursor-pointer"
                            >
                                <IoCloseOutline size={14} />
                            </button>
                        </div>
                    ))}

                    <button
                        onClick={handleReset}
                        className="flex items-center gap-1 bg-red-100 text-red-600 border border-red-400 px-3 py-1 rounded-full text-xs hover:bg-red-200"
                    >
                        <MdOutlineDeleteOutline size={16} />
                        Remove All Filters
                    </button>

                </div>
            )}

        </div>
    );
};

export default SelectedFilters