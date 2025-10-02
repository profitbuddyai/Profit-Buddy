import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { deleteCoupon, generateCoupon, getCoupons } from "../../Apis/Coupon";
import CustomInput from "../Controls/CustomInput";
import RadioButton from "../Controls/RadioButton";
import { SUBSCRIPTION_PLANS_DATA } from "../../Enums/Enums";
import Button from "../Controls/Button";
import CopyButton from "../Controls/CopyText";
import { AiOutlineDelete } from "react-icons/ai";

const CouponTab = () => {
    const [couponName, setCouponName] = useState("");
    const [planName, setPlanName] = useState('basic_monthly');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [coupons, setCoupons] = useState([]);
    const [deleteLoading, setDeleteLoading] = useState(false);


    // Fetch coupons on mount
    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                setFetching(true);
                const res = await getCoupons();
                setCoupons(res?.coupons || []);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch coupons");
            } finally {
                setFetching(false);
            }
        };
        fetchCoupons();
    }, []);

    const handleGenerateCoupon = async () => {
        if (!couponName.trim() || !planName.trim()) {
            return toast.error("Please fill in both fields");
        }

        try {
            setLoading(true);
            const response = await generateCoupon({
                name: couponName,
                planName,
            });

            toast.success(response?.message || "Coupon generated successfully!");

            // Add new coupon at the top of the list
            if (response?.coupon) {
                setCoupons((prev) => [response.coupon, ...prev]);
            }

            setCouponName("");
            setPlanName("");
        } catch (err) {
            const message = err.response ? err.response.data.message : err.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteCoupon = async (couponId) => {
        if (!couponId) {
            return toast.error("Invalid coupon ID");
        }

        try {
            setDeleteLoading(true)
            const response = await deleteCoupon(couponId);

            toast.success(response?.message || "Coupon deleted successfully!");

            // Remove the deleted coupon from the list
            setCoupons((prev) => prev.filter(coupon => coupon._id !== couponId));

        } catch (err) {
            const message = err.response ? err.response.data.message : err.message;
            toast.error(message);
        } finally {
            setDeleteLoading(false)
        }
    };


    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 h-max">
            <div className="flex flex-col gap-4 bg-primary border border-border rounded-xl p-4 w-full">
                <p className="text-2xl text-secondary/80 font-medium">
                    Coupon Generator
                </p>

                <CustomInput
                    label="Coupon Name"
                    placeholder="e.g. #SAVE20"
                    size="small"
                    value={couponName}
                    onChange={(e) => setCouponName(e.target.value)}
                />

                {/* <RadioButton
                    label="Select Plan"
                    options={Object.values(SUBSCRIPTION_PLANS_DATA).map(plan => ({
                        label: plan.idName,
                        value: plan.id
                    }))}
                    selectedOption={planName}
                    setSelectedOption={setPlanName}
                /> */}

                <Button
                    corner="small"
                    variant="secondary"
                    label="Generate Coupon"
                    size="medium"
                    loading={loading}
                    disabled={!couponName.trim() || !planName.trim()}
                    action={handleGenerateCoupon}
                />
            </div>

            <div className="flex flex-col gap-4 bg-primary border border-border rounded-xl p-4 w-full ">
                <p className="text-2xl text-secondary/80 font-medium">
                    Generated Coupons
                </p>

                {fetching ? (
                    <p className="text-lText text-sm">Loading coupons...</p>
                ) : coupons.length > 0 ? (
                    <div className="flex flex-col gap-2 w-full max-h-[280px] overflow-y-auto customScroll pr-3">
                        {coupons.map((coupon) => (
                            <div
                                key={coupon._id || coupon.id}
                                className="flex justify-between items-center border border-border rounded-lg p-2 bg-secondary/5"
                            >
                                <div className="flex flex-col">
                                    <span className="text-base flex gap-2 items-center font-medium text-secondary">
                                        {coupon.name} <CopyButton className={'text-xs'} text={coupon.name} />
                                    </span>
                                    <span className="text-sm text-lText">
                                        Used by: {coupon.usedBy.length} users
                                    </span>
                                </div>
                                <div className="flex  items-center gap-2">
                                    <span
                                        className={`text-sm font-medium px-4 py-1 h-max w-max rounded-full ${coupon.usedBy.length
                                            ? "bg-green-500/20 text-green-500"
                                            : "bg-yellow-500/20 text-yellow-500"
                                            }`}
                                    >
                                        {coupon.usedBy.length ? "Used" : "Unused"}
                                    </span>
                                    {deleteLoading ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-2  border-t-secondary border-border"></div>
                                    ) : (
                                        <AiOutlineDelete onClick={() => handleDeleteCoupon(coupon._id)} className="text-lText hover:text-red-500 cursor-pointer" />
                                    )}
                                    {/* <span className="text-xs text-lText">
                                        {SUBSCRIPTION_PLANS_DATA?.[coupon.planName]?.idName || "N/A"}
                                    </span> */}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-lText text-sm">No coupons generated yet.</p>
                )}
            </div>
        </div>
    )
}

export default CouponTab