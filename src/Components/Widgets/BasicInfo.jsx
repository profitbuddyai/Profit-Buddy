import Rating from '../UI/Rating'
import CopyButton from '../Controls/CopyText'
import CustomCard from '../UI/CustomCard'
import Button from '../Controls/Button'
import { TbExternalLink } from 'react-icons/tb'
import ProductActionButtons from '../UI/ProductActionButtons'
import ProductImageGrid from '../UI/ProductImageGrid'
import ScoreChart from '../UI/ScoreChart'
import { abbreviateNumber, formatNumberWithCommas } from '../../Utils/NumberUtil'
import { calculateEstimatSellerAsinRevenue, calculateProfit, calculateTotalFees } from '../../Utils/CalculationUtils'

const BasicInfo = ({ product }) => {

    const { info } = product || {}


    return (
        <div className='flex flex-col sm:flex-row  gap-4 relative '>
            <ProductImageGrid images={product?.images} listPrice={product?.info?.buybox} className={'!aspect-square !w-[100%] !max-w-[100%] sm:!w-[200px]'} />
            {/* <div className=''>
                    <img src={product?.images[0]} className=' w-full h-full min-w-[250px] max-w-[250px] aspect-square bg-white rounded-lg  object-contain border border-border' alt="" />
                </div> */}
            <div className='flex flex-col gap-2.5 flex-1 '>
                <p className='font-semibold text-xl/[28px]  capitalize line-clamp-2  tracking-tight' title={product?.title}>{product?.title}</p>
                <div className='flex items-end h-full gap-2 flex-1'>
                    <div className='flex flex-1 flex-col gap-3 justify-between h-full'>
                        <div className='flex flex-wrap gap-2 items-end'>
                            {product?.category && (<p className='text-[14px]/[14px] capitalize flex items-end gap-1 text-secondary font-medium'><span className='text-lText text-[14px]/[14px]'>Category:</span>{product?.category}</p>)}
                            {product?.brand && (<p className='text-[14px]/[14px] capitalize flex items-end gap-1 text-secondary font-medium'><span className='text-lText text-[14px]/[14px]'>|| Brand:</span>{product?.brand}</p>)}
                        </div>
                        <Rating rating={product?.reviews?.rating} count={product?.reviews?.count} />
                        <a className='text-[14px]/[14px] flex items-end gap-1 text-secondary font-medium'><span className='text-lText text-[14px]/[14px]'>ASIN:</span>{product?.asin} <CopyButton text={product?.asin} /></a>
                        {calculateEstimatSellerAsinRevenue(product) > 0 && (
                            <div className='flex flex-col items-start gap-1.5'>
                                <p className='text-[22px]/[22px] flex items-end gap-1 font-semibold text-secondary'>{formatNumberWithCommas(calculateEstimatSellerAsinRevenue(product, 3))}</p>
                                <p className='text-lText font-medium text-[14px]/[14px] tracking-tight'>EST Monthly Product Rev</p>
                            </div>
                        )}
                        <div className="overflow-x-auto border-[1.5px] border-accent rounded-lg max-w-md content-end">
                            <table className="min-w-full border border-accent rounded-lg overflow-hidden !text-sm">
                                <thead className="bg-accent/15">
                                    <tr>
                                        <th className="px-1 py-1.5 text-center font-medium text-secondary border-r border-accent">
                                            Est Sales
                                        </th>
                                        <th className="px-1 py-1.5 text-center font-medium text-secondary border-r border-accent">
                                            Buy Box
                                        </th>
                                        <th className="px-1 py-1.5 text-center font-medium text-secondary border-r border-accent">
                                            BSR Rank
                                        </th>
                                        <th className="px-1 py-1.5 text-center font-medium text-secondary">
                                            Profit
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="hover:bg-accent/5 transition">
                                        <td className="px-1 py-1.5 text-center text-lText border-r border-accent">{info?.monthlySold ? `${abbreviateNumber(info?.monthlySold)}+/mo` : 'Unknown'}</td>
                                        <td className="px-1 py-1.5 text-center text-lText border-r border-accent">{info?.buybox <= 0 ? 'Surpressed BB' : formatNumberWithCommas(info?.buybox)}</td>
                                        <td className="px-1 py-1.5 text-center text-lText border-r border-accent">{(info?.sellRank && info?.sellRank >= 0) ? `#${formatNumberWithCommas(info?.sellRank, 0, false, true)}` : 'Unknown'}</td>
                                        <td className="px-1 py-1.5 text-center text-lText">
                                            {(() => {
                                                const totalFees = calculateTotalFees(product, info?.salePrice)?.totalFees || 0;
                                                const profit = calculateProfit(info?.salePrice, 0, totalFees);
                                                return formatNumberWithCommas(profit);
                                            })()}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className='flex items-end gap-2 '>
                        {/* <div className='hidden xs:block'>
                            <ScoreChart />
                        </div> */}
                        <ProductActionButtons product={product} />
                    </div>
                </div>
            </div>


        </div>
    )
}

export default BasicInfo