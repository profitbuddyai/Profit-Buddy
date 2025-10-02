import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { CURRENCY, MIN_PROFIT, MIN_ROI, PLACEMENT_FEE_TYPES } from '../../Enums/Enums';
import ToggleSwitch from '../Controls/ToggleSwitch';
import RangeSelector from '../Controls/RangeSelector';
import CustomInput from '../Controls/CustomInput';
import { IoIosArrowDown } from 'react-icons/io';
import { formatNumberWithCommas, toCents } from '../../Utils/NumberUtil';
import { PiApproximateEquals } from 'react-icons/pi';
import { setBuyCost, setFbmFee, setFulfillment, setPlacementFeeType, setsalePrice, setStorageMonth } from '../../Redux/Slices/profitCalcSlice';
import CustomCard from '../UI/CustomCard';
import Button from '../Controls/Button';
import { TbExternalLink } from 'react-icons/tb';
import { redirectToSellerCentralAddProduct } from '../../Helpers/Redirects';

const ProfitCalculator = () => {
    const [isBreakdownOpen, setIsBreakdownOpen] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const dispatch = useDispatch()

    const {
        buyCost,
        salePrice,
        storageMonth,
        fulfillment,
        fees,
        maxCost,
        profit,
        roi,
        placementFeeType,
        fbmFee,
        product,
    } = useSelector((state) => state.profitCalc);

    const handleTogglePlacementFeeType = () => {
        const currentIndex = PLACEMENT_FEE_TYPES.indexOf(placementFeeType);
        const nextIndex = (currentIndex + 1) % PLACEMENT_FEE_TYPES.length;
        const nextType = PLACEMENT_FEE_TYPES[nextIndex];

        dispatch(setPlacementFeeType(nextType));
    };


    return (
        <div className='flex flex-col gap-4'>
            {/* <div className="border p-3 rounded-lg bg-border flex justify-between text-sm">
                    <p className="font-medium">Estimated Maximum Buy Cost:</p>
                    <p className="text-end">{formatNumberWithCommas(maxCost)}</p>
                </div> */}
            <div className='flex gap-4'>
                <CustomInput
                    placeholder="Buy Cost"
                    prefix={CURRENCY}
                    label="Buy Cost"
                    value={buyCost ?? ""}
                    type='number'
                    size='large'
                    onChange={(e) => {
                        const val = toCents(e.target.value);
                        const formatted = val ? (val / 100).toFixed(2) : '';
                        dispatch(setBuyCost(formatted));
                    }}
                    onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault();
                    }}
                />
                <CustomInput
                    placeholder="Sale Price"
                    prefix={CURRENCY}
                    label="Sale Price"
                    value={salePrice ?? ""}
                    type='number'
                    size='large'
                    min={0}
                    onChange={(e) => {
                        const val = toCents(e.target.value);
                        const formatted = val ? (val / 100).toFixed(2) : ''; // string, e.g. "40.00"
                        dispatch(setsalePrice(formatted)); // send string
                    }}
                    onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault(); // block weird keys
                    }}
                />
            </div>
             <div className="grid grid-cols-2 gap-2">
                <div className={`border p-3 rounded-lg flex justify-between text-lg transition-colors
                     ${profit < 0
                        ? 'border-[red] bg-[#ff000038]'
                        : profit < MIN_PROFIT
                            ? 'border-[orange] bg-[#ffa50038]'
                            : 'border-[green] bg-[#00800038]'
                    }
                    `}>
                    <p className="font-medium">Profit:</p>
                    <p className="text-end">{formatNumberWithCommas(profit)}</p>
                </div>
                <div className={`border p-3 rounded-lg flex justify-between text-lg transition-colors
                         ${profit < 0
                        ? 'border-[red] bg-[#ff000038]'
                        : profit < MIN_PROFIT
                            ? 'border-[orange] bg-[#ffa50038]'
                            : 'border-[green] bg-[#00800038]'
                    }
                         `}>
                    <p className="font-medium">ROI(%):</p>
                    <p className="text-end">{formatNumberWithCommas(roi, 2, false, false)}%</p>
                </div>
            </div>
            <Button
                label={
                    <span className='flex items-center justify-center gap-2'>
                        Check Eligibility
                        <TbExternalLink size={18} />
                    </span>}
                size='large'
                action={(e) => redirectToSellerCentralAddProduct(e, product?.asin)}
                variant='secondary'
            />
            <ToggleSwitch
                options={[{ label: 'FBA', value: 'FBA' }, { label: 'FBM', value: 'FBM' }]}
                label="Fulfillment Type:"
                selected={fulfillment}
                onChange={(value) => dispatch(setFulfillment(value))}
            />

            {fulfillment === "FBA" && (
                <RangeSelector
                    min={0}
                    max={12}
                    step={1}
                    value={storageMonth}
                    onChange={(value) => dispatch(setStorageMonth(value))}
                    marks={[0, 3, 6, 9, 12]}
                    label="Storage Months:"
                />
            )}
           

            <div className='flex flex-col w-full'>
                <div
                    className="border p-3 rounded-lg bg-border select-none flex justify-between text-lg hover:opacity-90 cursor-pointer"
                    onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
                >
                    <p className="font-medium ">Total Fees:</p>
                    <p className="flex gap-2 items-center">
                        {formatNumberWithCommas(fees?.totalFees)} <IoIosArrowDown className={`${isBreakdownOpen ? 'rotate-180' : 'rotate-0'} transition-all`} />
                    </p>
                </div>
                <div className={` space-y-2 pr-[2px] text-lText text-sm transition-all duration-500 overflow-hidden ${isBreakdownOpen ? 'max-h-[400px]' : 'max-h-0'}`}>

                    <div className={`flex justify-between pt-[20px]  `}>
                        <span>Referral Fee:</span>
                        <span className='flex items-center gap-1.5'>
                            {fees?.referralFeePercent * 100}% <PiApproximateEquals /> {formatNumberWithCommas(fees?.referralFee)}
                        </span>
                    </div>
                    <div className={`flex justify-between items-center`}>
                        <span>Fulfilment Fee ({fulfillment}):</span>
                        <span className='flex items-center gap-1.5'>
                            {fulfillment === "FBA" ? (
                                formatNumberWithCommas(fees?.fulfillmentFee)
                            ) : (
                                <CustomInput
                                    prefix={'$'}
                                    size='small'
                                    value={fbmFee}
                                    type='number'
                                    min={0}
                                    onChange={(e) => {
                                        const val = toCents(e.target.value);
                                        const formatted = val ? (val / 100).toFixed(2) : ''; // string, e.g. "40.00"
                                        dispatch(setFbmFee(formatted)); // send string
                                    }}
                                    onKeyDown={(e) => {
                                        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault(); // block weird keys
                                    }}
                                    className='!w-[95px]'
                                    inputClassName='!h-8' />
                            )}
                        </span>
                    </div>
                    <div className={`flex justify-between ${fulfillment === 'FBM' && 'line-through'}`}>
                        <span>Inbound Shipping Fee:</span>
                        <span className='flex items-center gap-1.5'>{formatNumberWithCommas(fees?.inboundShippingFee)}</span>
                    </div>
                    <div className={`flex justify-between ${fulfillment === 'FBM' && 'line-through'}`}>
                        <span>Storage Fee:</span>
                        <span className='flex items-center gap-1.5'>{formatNumberWithCommas(fees?.storageFee)}</span>
                    </div>
                    <div className={`flex justify-between ${fulfillment === 'FBM' && 'line-through'}`}>
                        <span>Preparation Fee:</span>
                        <span className='flex items-center gap-1.5'>{formatNumberWithCommas(fees?.prepFee)}</span>
                    </div>
                    <div className={`flex justify-between ${fulfillment === 'FBM' && 'line-through'}`}>
                        <span onClick={handleTogglePlacementFeeType} className='cursor-pointer hover:opacity-85 underline capitalize'>Placement Fee ({placementFeeType}):</span>
                        <span className='flex items-center gap-1.5'>{formatNumberWithCommas(fees?.placementFee)}</span>
                    </div>
                    <div className={`flex justify-between`}>
                        <span>Closing Fee:</span>
                        <span className='flex items-center gap-1.5'>{formatNumberWithCommas(fees?.closingFee)}</span>
                    </div>
                </div>
            </div>


            <CustomInput
                placeholder="Quantity"
                prefix={'#'}
                label="Quantity"
                value={quantity ?? 1}
                onChange={(e) => {
                    const val = e.target.value;
                    if (/^\d*$/.test(val)) {
                        setQuantity(val);
                    }
                }}
                type='number'
                step="1"
                min="1"
            />
            <div className={`mt-2 space-y-2 text-lText text-sm transition-all overflow-hidden duration-500 ${quantity > 1 ? 'max-h-[130px]' : 'max-h-0'}`}>
                <div className={`flex justify-between`}>
                    <span>Total Cost:</span>
                    <span className='flex items-center gap-1.5'>{formatNumberWithCommas(buyCost * quantity)}</span>
                </div>
                <div className={`flex justify-between`}>
                    <span>Total Fees:</span>
                    <span className='flex items-center gap-1.5'>{formatNumberWithCommas(fees?.totalFees * quantity)}</span>
                </div>
                <div className={`flex justify-between`}>
                    <span>Sale Price:</span>
                    <span className='flex items-center gap-1.5'>{formatNumberWithCommas(salePrice * quantity)}</span>
                </div>
                <div className={`flex justify-between border-t border-border pt-2 text-secondary/80`}>
                    <span>Total Profit:</span>
                    <span className='flex items-center gap-1.5'>{formatNumberWithCommas(profit * quantity)}</span>
                </div>
            </div>
        </div>
    )
}

export default ProfitCalculator