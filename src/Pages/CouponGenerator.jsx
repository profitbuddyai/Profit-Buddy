// import { useEffect, useState } from "react";
// import { toast } from "react-toastify";
// import CustomInput from "../Components/Controls/CustomInput";
// import Button from "../Components/Controls/Button";
// import { SUBSCRIPTION_PLANS_DATA } from "../Enums/Enums";
// import { generateCoupon, getCoupons } from "../Apis/Coupon";
// import RadioButton from "../Components/Controls/RadioButton";
// import CopyButton from "../Components/Controls/CopyText";

// const CouponGenerator = () => {
//     const [couponName, setCouponName] = useState("");
//     const [planName, setPlanName] = useState("");
//     const [loading, setLoading] = useState(false);
//     const [fetching, setFetching] = useState(true);
//     const [coupons, setCoupons] = useState([]);

//     // Fetch coupons on mount
//     useEffect(() => {
//         const fetchCoupons = async () => {
//             try {
//                 setFetching(true);
//                 const res = await getCoupons();
//                 setCoupons(res?.coupons || []);
//             } catch (err) {
//                 toast.error(err.response?.data?.message || "Failed to fetch coupons");
//             } finally {
//                 setFetching(false);
//             }
//         };
//         fetchCoupons();
//     }, []);

//     const handleGenerateCoupon = async () => {
//         if (!couponName.trim() || !planName.trim()) {
//             return toast.error("Please fill in both fields");
//         }

//         try {
//             setLoading(true);
//             const response = await generateCoupon({
//                 name: couponName,
//                 planName,
//             });

//             toast.success(response?.message || "Coupon generated successfully!");

//             // Add new coupon at the top of the list
//             if (response?.coupon) {
//                 setCoupons((prev) => [response.coupon, ...prev]);
//             }

//             setCouponName("");
//             setPlanName("");
//         } catch (err) {
//             const message = err.response ? err.response.data.message : err.message;
//             toast.error(message);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="grid grid-cols-3">
//             {/* Left Side - Coupon Generator Form */}
//             <div className="w-full col-span-2 flex flex-col md:flex-row justify-center items-start gap-6 pt-[40px]">
//                 <div className="flex flex-col gap-4 bg-primary border border-border rounded-xl p-4 w-full max-w-md">
//                     <p className="text-2xl text-secondary/80 font-medium">
//                         Coupon Generator
//                     </p>

//                     <CustomInput
//                         label="Coupon Name"
//                         placeholder="e.g. #SAVE20"
//                         size="small"
//                         value={couponName}
//                         onChange={(e) => setCouponName(e.target.value)}
//                     />

//                     <RadioButton
//                         label="Select Plan"
//                         options={Object.values(SUBSCRIPTION_PLANS_DATA).map(plan => ({
//                             label: plan.idName,
//                             value: plan.id
//                         }))}
//                         selectedOption={planName}
//                         setSelectedOption={setPlanName}
//                     />

//                     <Button
//                         corner="small"
//                         variant="secondary"
//                         label="Generate Coupon"
//                         size="medium"
//                         loading={loading}
//                         disabled={!couponName.trim() || !planName.trim()}
//                         action={handleGenerateCoupon}
//                     />
//                 </div>
//             </div>

//             {/* Right Side - Coupons List */}
//             <div className="border-l w-full flex-1 p-4 border-border flex flex-col gap-4">
//                 <p className="text-2xl text-secondary/80 font-medium">
//                     Generated Coupons
//                 </p>

//                 {fetching ? (
//                     <p className="text-lText text-sm">Loading coupons...</p>
//                 ) : coupons.length > 0 ? (
//                     <div className="flex flex-col gap-2 w-full">
//                         {coupons.map((coupon) => (
//                             <div
//                                 key={coupon._id || coupon.id}
//                                 className="flex justify-between items-center border border-border rounded-lg p-2 bg-secondary/5"
//                             >
//                                 <div className="flex flex-col">
//                                     <span className="text-base flex gap-2 items-center font-medium text-secondary">
//                                         {coupon.name} <CopyButton className={'text-xs'} text={coupon.name} />
//                                     </span>
//                                     <span className="text-sm text-lText">
//                                         {coupon.used
//                                             ? `Used by: ${coupon.userEmail}`
//                                             : "Not used yet"}
//                                     </span>
//                                 </div>
//                                 <div className="flex flex-col items-end gap-2">
//                                     <span
//                                         className={`text-sm font-medium px-4 py-1 h-max w-max rounded-full ${coupon.used
//                                                 ? "bg-green-500/20 text-green-500"
//                                                 : "bg-yellow-500/20 text-yellow-500"
//                                             }`}
//                                     >
//                                         {coupon.used ? "Used" : "Unused"}
//                                     </span>
//                                     <span className="text-xs text-lText">
//                                         {SUBSCRIPTION_PLANS_DATA?.[coupon.planName]?.idName || "N/A"}
//                                     </span>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 ) : (
//                     <p className="text-lText text-sm">No coupons generated yet.</p>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default CouponGenerator;
