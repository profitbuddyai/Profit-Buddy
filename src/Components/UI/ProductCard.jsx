import { useEffect, useState } from 'react'
import Rating from './Rating'
import CopyButton from '../Controls/CopyText'
import { formatNumberWithCommas } from '../../Utils/NumberUtil'
import { calculateEstimatSellerAsinRevenue, calculateMaxCost, calculateProfit, calculateTotalFees } from '../../Utils/CalculationUtils'
import { abbreviateNumber } from './../../Utils/NumberUtil';
import { Link } from 'react-router-dom'
import ProductImageGrid from './ProductImageGrid'
import { FiLoader } from 'react-icons/fi'
import { Tooltip } from 'react-tooltip'
import { getProductOffers } from '../../Apis/Offer'
import AnimationWrapper from '../Layout/AnimationWrapper'
import ProductActionButtons from './ProductActionButtons'
import { OfferData } from '../../Utils/MockData'
import { redirectForSeller } from '../../Helpers/Redirects'
import ChartWraaper from '../Layout/ChartWraaper'
import { FaArrowRightLong } from "react-icons/fa6";


const ProductCard = ({ product }) => {

  const { info, graphData, images, reviews } = product
  const [loading, setloading] = useState(false)
  const [productOffers, setproductOffers] = useState({})
  const [showChart, setShowChart] = useState(false);

  const { offers } = productOffers || {}

  const handleGetOffers = async () => {
    try {
      setloading(true)
      const responce = await getProductOffers(product?.asin)
      setproductOffers(responce?.offer)
      setloading(false)
    } catch (error) {
      setloading(false)
      console.error(error.response ? error.response.data.message : error.message);
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => setShowChart(true), 0);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!product) return
    handleGetOffers()
  }, [product])

  return (
    <Link to={`/detail?asin=${product?.asin}`}>
      <AnimationWrapper>
        <div className='p-3 rounded-[10px] bg-primary transition-shadow cursor-pointer productCardShadow border-border border'>
          <div className='flex gap-2 md:gap-3  lg:flex-nowrap flex-wrap w-full items-center '>
            <div className='flex flex-1 gap-3'>
              <div className=' flex flex-col sm:flex-row flex-1 gap-2 w-full col-span-4 relative md:h-[auto]'>
                <ProductImageGrid images={images} listPrice={info?.buybox} className={'!aspect-square !w-[100%] !max-w-[100%] sm:!w-[200px]'} />

                <div className='flex flex-col flex-1 justify-evenly gap-3'>
                  <p className="text-secondary font-semibold text-sm/[20px] capitalize tracking-tight line-clamp-2" title={product?.title}>
                    {product?.title}
                  </p>
                  <div className='flex items-end gap-2.5'>
                    <div className='flex flex-1 flex-col gap-3  justify-between  '>
                      <div className='flex flex-wrap gap-2 items-end'>
                        {product?.category && (<p className='text-[14px]/[14px] capitalize flex items-end gap-1 text-secondary font-medium'><span className='text-lText text-[14px]/[14px]'>Category:</span>{product?.category}</p>)}
                        <span className='text-lText text-[14px]/[14px]'>||</span>
                        {product?.brand && (<p className='text-[14px]/[14px] capitalize flex items-end gap-1 text-secondary font-medium'><span className='text-lText text-[14px]/[14px]'>Brand:</span>{product?.brand}</p>)}
                      </div>
                      {/* {product?.category && (<p className='text-[14px]/[14px] flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>Category:</span>{product?.category}</p>)} */}
                      {/* {product?.brand && (<p className='text-[14px]/[14px] flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>Brand:</span>{product?.brand}</p>)} */}
                      <Rating rating={reviews?.rating} count={reviews?.count} />
                      <p className='text-[14px]/[14px] flex items-end gap-1 text-secondary'><span className='text-lText text-[12px]/[12px]'>ASIN:</span>{product?.asin} <CopyButton text={product.asin} /></p>
                      {calculateEstimatSellerAsinRevenue(product) > 0 && (
                        <div className='flex flex-col items-start gap-1.5'>
                          <p className='text-[22px]/[22px] flex items-end gap-1 font-semibold text-secondary'>{formatNumberWithCommas(calculateEstimatSellerAsinRevenue(product))}</p>
                          <p className='text-lText font-medium text-[14px]/[14px] tracking-tight'>EST Monthly Product Rev</p>
                        </div>
                      )}
                      <div className="overflow-x-auto border-[1.5px] border-accent rounded-lg content-end">
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
                                  // const maxCost = calculateMaxCost(info?.salePrice, totalFees);
                                  const profit = calculateProfit(info?.salePrice, 0, totalFees);
                                  return formatNumberWithCommas(profit);
                                })()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className='flex gap-3 items-center'>
                      <ProductActionButtons product={product} className={'!static !w-[30px]'} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="hidden md:flex flex-col border-[1.5px] border-accent w-[200px] rounded-lg bg-accent/5 h-[260px] overflow-hidden">
                <div className='text-sm px-3 py-2 flex justify-center items-center text-start bg-accent/60 text-secondary font-medium rounded-t-md w-full'>
                  <p className="">
                    AI Store Spy
                  </p>
                  {/* <p className="flex gap-2 items-center px-1 font-normal">
                    See All <FaArrowRightLong/>
                  </p> */}
                </div>

                <div className="w-full grid grid-cols-3 bg-accent/10 backdrop-blur-2xl z-10">
                  {/* <p className="py-1.5 text-center text-sm font-medium text-secondary border-r border-accent max-w-[80px]">#</p> */}
                  <p className="py-1.5 text-center text-xs font-medium text-secondary border-r border-accent">Seller</p>
                  <p className="py-1.5 text-center text-xs font-medium text-secondary border-r border-accent">Stock</p>
                  <p className="py-1.5 text-center text-xs font-medium text-secondary">Price</p>
                </div>
                <div className='flex-1 overflow-auto hideScroll '>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-3 align-middle text-gray-500 bg-transparent">
                      <FiLoader className="w-6 h-6 animate-spin mb-2" />
                      <p className="text-sm">Loading Offers...</p>
                    </div>
                  ) : (
                    !offers?.length ? (
                      <div>
                        <p className="text-center text-lText py-3 align-middle ">No offers</p>
                      </div>
                    ) : (
                      offers?.map((offer, index) => (
                        <div key={index} className="bg-transparent hover:bg-accent/10  transition text-xs text-center text-lText grid grid-cols-3 ">
                          {/* <p className="px-1 py-1.5 border-r border-accent max-w-[80px]">{index + 1 || "-"}</p> */}
                          <p className="px-1 py-1.5 border-r border-accent font-medium">
                            <span
                              data-tooltip-id={`${offer?.sellerInfo?.id}-${index}`}
                              onClick={(e) => redirectForSeller(e, offer?.sellerInfo?.id)}
                              className="cursor-pointer hover:text-accent "
                            >
                              {offer?.seller}
                            </span>
                          </p>
                          <p className="px-1 py-1.5 border-r border-accent">{offer?.stock || "-"}</p>
                          <p className="px-1 py-1.5">{formatNumberWithCommas(offer?.price)}</p>
                          <Tooltip
                            id={`${offer?.sellerInfo?.id}-${index}`}
                            place="top"
                            opacity={1}
                            className="!bg-secondary !z-[20]  !p-2 !text-[12px] !text-primary !items-center !rounded-md !shadow-none "
                            content={
                              <div className="text-left space-y-0.5">
                                <div className="font-medium text-primary mb-1 text-[12px]">{offer?.sellerInfo?.name}</div>
                                <Rating className={'text-[12px] !text-primary'} count={offer?.sellerInfo?.ratingCount} rating={offer?.sellerInfo?.rating} />
                              </div>
                            }
                          />
                        </div>
                      ))
                    )
                  )}
                </div>
              </div>
            </div>


            <div onClick={(e) => {
              e?.preventDefault();
              e?.stopPropagation();
            }} className='hidden lg:flex  gap-0 pl-[10px] max-w-[500px] max-h-[460px] overflow-hidden items-start h-full  rounded-lg '>

              <div className='max-w-[750px] min-w-[750px] h-max overflow-hidden flex items-end  justify-end  '>
                {/* {showChart && ( */}
                  <ChartWraaper product={product} className='origin-top-left' size='small' />
                {/* )} */}
              </div>

            </div>
          </div >
        </div >
      </AnimationWrapper >
    </Link>


  )
}

export default ProductCard