import React from 'react'
import { Tooltip } from 'react-tooltip';
import { IconImages } from '../../Enums/Enums';
import { useSelector } from 'react-redux';
import { redirectToAmazonProductPage, redirectToGoogleSearch } from '../../Helpers/Redirects';

const ProductActionButtons = ({ product, className }) => {

    const { dimension } = product || {}
    const { theme } = useSelector((state) => state.system);

    return (
        <div>
            <div className={`grid grid-rows-4 gap-2 w-[35px] static right-0 bottom-0 ${className}`}>
                <button className='p-1.5 flex items-center justify-center bg-accent/20 border border-accent rounded-md cursor-pointer hover:bg-accent/40' data-tooltip-id={`Dimension-${product?.asin}`}>
                    <img src={IconImages?.dimention} alt="" />
                </button>
                <button
                    className="p-1.5 flex items-center justify-center bg-accent/20 border border-accent rounded-md cursor-pointer hover:bg-accent/40"
                    onClick={(e) => redirectToGoogleSearch(e, product?.title)}
                >
                    <img src={IconImages?.google} alt="Google Search" />
                </button>
                <button
                    className="p-1.5 flex items-center justify-center bg-accent/20 border border-accent rounded-md cursor-pointer hover:bg-accent/40"
                    onClick={(e) => redirectToAmazonProductPage(e, product?.asin)}
                >
                    <img src={!theme ? IconImages?.amazon : IconImages?.whiteAmzon} alt="Amazon Search" />
                </button>
                <button className='p-1.5 flex items-center justify-center bg-accent/20 border border-accent rounded-md cursor-not-allowed hover:bg-accent/40'>
                    <img src={IconImages?.sheets} alt="" />
                </button>
            </div>
            <Tooltip
                id={`Dimension-${product?.asin}`}
                place="left"
                className="!bg-secondary !backdrop-opacity-100 !max-w-[220px] !p-2 !text-[12px] !text-primary !items-center"
                content={
                    <div className="text-left space-y-0.5">
                        <div className="font-semibold mb-1 text-[13px]">Dimensions :</div>
                        <div>Width: {dimension?.width || 'Unknown'}</div>
                        <div>Height: {dimension?.height || 'Unknown'}</div>
                        <div>Length: {dimension?.length || 'Unknown'}</div>
                        <div>Weight: {dimension?.weight || 'Unknown'}</div>
                    </div>
                }
            />
            <Tooltip
                id="buttons"
                place="bottom"
                className="!bg-secondary !backdrop-opacity-100 !max-w-[220px] !p-2 !text-[12px] !text-secondary !items-center"
            />
        </div>
    )
}

export default ProductActionButtons