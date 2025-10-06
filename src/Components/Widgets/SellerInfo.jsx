import React from 'react'
import CustomCard from '../UI/CustomCard'
import Rating from '../UI/Rating'
import Button from '../Controls/Button';
import { LuUserRound } from "react-icons/lu";
import { CiDeliveryTruck } from "react-icons/ci";
import CopyButton from '../Controls/CopyText';
import { SlKey } from "react-icons/sl";
import { IconImages } from '../../Enums/Enums';
import { useSelector } from 'react-redux';
import { redirectToAmazonSellerPage } from '../../Helpers/Redirects';
import { FiLoader } from 'react-icons/fi';
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { IoBagOutline } from 'react-icons/io5';
import { formatNumberWithCommas } from '../../Utils/NumberUtil';

const SellerInfo = ({ className, seller, handleFilterClick, queryFilter, sellerRevenue, sellerRevenueLoading }) => {
    const { theme } = useSelector((state) => state.system);
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 h-auto items-start text-secondary ${className}`}>
            <CustomCard className={'sm:col-span-2'} label={'Seller Info'}>
                <div className='flex items-start justify-between gap-2'>
                    <div>
                        <p className='text-2xl font-semibold break-all'>{seller?.name}</p>
                        <div className='text-xl flex gap-2 items-center'><span className='font-semibold text-base'>Seller Reviews:</span> <Rating count={seller?.ratingCount} rating={seller?.rating} /></div>
                    </div>

                    <Button
                        variant='outline'
                        className='!text-secondary'
                        corner='full'
                        size='small'
                        action={(e) => redirectToAmazonSellerPage(e, seller?.id)}
                        label={<span className='flex items-center gap-2'>
                            <img className='w-[20px]' src={!theme ? IconImages?.amazon : IconImages?.whiteAmzon} alt="Amazon Search" />
                            View On Amazon
                        </span>}
                    />
                </div>

                <div className='pt-[20px] '>
                    <div className='flex flex-col gap-3  overflow-hidden text-sm '>

                        <div className='flex  justify-between bg-border/50 rounded-md ap-2   py-2 px-3'>
                            <p className='text-base flex gap-2 items-center text-secondary/90'><IoBagOutline strokeWidth={0} size={18} />Product Count</p>
                            <p className='text-secondary flex items-center gap-2 text-base'>{seller?.totalAsins}</p>
                        </div>
                        <div className='flex  justify-between bg-border/50 rounded-md ap-2  py-2 px-3'>
                            <p className='text-base flex gap-2 items-center text-secondary/90'><LuUserRound size={18} />Seller ID</p>
                            <p className='text-secondary flex items-center gap-2 text-base'>{seller?.id} <CopyButton className={'hover:text-secondary/50'} text={seller?.id} /></p>
                        </div>
                        {/* <div className='flex  justify-between bg-border/50 rounded-md ap-2   py-2 px-3'>
                            <p className='text-base flex gap-2 items-center text-secondary/90'><RiMoneyDollarCircleLine strokeWidth={0} size={20} />Seller Revenue</p>
                            <p className='text-secondary flex items-center gap-2 text-base'>{sellerRevenueLoading ? <FiLoader className="w-4 h-4 animate-spin" /> : formatNumberWithCommas(sellerRevenue / 100)}</p>
                        </div> */}
                    </div>

                </div>
            </CustomCard >

            <CustomCard className={'sm:col-span-1'} label={'Categories'}>
                <div className='flex flex-col gap-4 max-h-[180px] overflow-auto customScroll pr-2'>
                    {seller?.categories?.map((category, idx) => (
                        <div key={idx} className='flex justify-between items-center bg-border/50 rounded-md py-2 px-3'>
                            <p onClick={() => handleFilterClick("rootCategory", category?.name)} className={`text-sm flex gap-2 items-center text-secondary/90 cursor-pointer hover:text-secondary/60 ${queryFilter?.rootCategory?.includes(category.name) ? "font-semibold !text-secondary" : ""}`}>{category?.name}</p>
                            <p className='text-secondary flex items-center gap-2 text-base'>{category?.count}</p>
                        </div>
                    ))}
                </div>
            </CustomCard>

            <CustomCard className={'sm:col-span-1'} label={'Brands'}>
                <div className='flex flex-col gap-4 max-h-[180px] overflow-auto customScroll pr-2'>
                    {seller?.brands?.map((brand, idx) => (
                        <div key={idx} className='flex justify-between items-center bg-border/50 rounded-md py-2 px-3'>
                            <p onClick={() => handleFilterClick("brand", brand?.name)} className={`text-sm flex gap-2 items-center text-secondary/90 cursor-pointer hover:text-secondary/60 ${queryFilter?.brand?.includes(brand.name) ? "font-semibold !text-secondary" : ""}`}>{brand?.name}</p>
                            <p className='text-secondary flex items-center gap-2 text-base'>{brand?.count}</p>
                        </div>
                    ))}
                </div>
            </CustomCard>
        </div>

    )
}

export default SellerInfo