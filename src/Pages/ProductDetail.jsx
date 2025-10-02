import { useSearchParams } from 'react-router-dom';
import ProfitCalculator from '../Components/Widgets/ProfitCalculator';
import { useEffect, useMemo, useState } from 'react';
import { setProduct } from '../Redux/Slices/profitCalcSlice';
import { useDispatch, useSelector } from 'react-redux';
import TopOffers from '../Components/Widgets/TopOffers';
import BasicInfo from '../Components/Widgets/BasicInfo';
import CustomCard from '../Components/UI/CustomCard';
import { getProduct, searchProducts } from '../Apis/Product';
import { FiLoader } from "react-icons/fi";
import { MdOutlineSearchOff } from "react-icons/md";
import { getProductOffers } from '../Apis/Offer';
import AnimationWrapper from '../Components/Layout/AnimationWrapper';
import SellerCentral from '../Components/Widgets/SellerCentral';
import SalesAndOfferDygraphs from '../Components/Widgets/SalesAndOfferDygraphs ';
import ChartWraaper from '../Components/Layout/ChartWraaper';
import ChatBuddy from '../Components/Widgets/ChatBuddy';
import { upsertHistory } from '../Apis/History';
import { debounce } from 'lodash';
import ScoreChart from '../Components/UI/ScoreChart';


const ProductDetail = () => {
    const [searchParams] = useSearchParams();
    const asin = searchParams.get("asin");

    const [loading, setLoading] = useState(false);
    const [offerLoading, setOfferLoading] = useState(false);
    const [productOffers, setProductOffers] = useState(null);

    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.products);
    const { product } = useSelector((state) => state.profitCalc);
    const { buyCost } = useSelector((state) => state.profitCalc);

    const debouncedUpsert = useMemo(
        () =>
            debounce((asin, cost) => {
                upsertHistory({ asin, buyCost: Number(cost) });
            }, 500),
        []
    );

    const handleGetProduct = async () => {
        const found = products?.find((p) => p?.asin === asin);
        product?.asin === asin;
        if (found) {
            dispatch(setProduct(found));
        } else if (product && product?.asin === asin) {
            dispatch(setProduct(product));
        } else {
            try {
                setLoading(true);
                const result = await getProduct(asin);
                if (result?.length) {
                    dispatch(setProduct(result[0]));
                }
            } catch (error) {
                console.error("Failed to fetch product:", error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleGetOffer = async () => {
        try {
            setOfferLoading(true);
            const responce = await getProductOffers(asin);
            setProductOffers(responce?.offer);
        } catch (error) {
            console.error("Failed to fetch offers:", error);
        } finally {
            setOfferLoading(false);
        }
    };



    useEffect(() => {
        if (!asin) return;
        handleGetProduct();
        handleGetOffer();
    }, [asin, products]);

    useEffect(() => {
        if (!product?.asin) return;
        debouncedUpsert(product.asin, buyCost);
        return () => debouncedUpsert.cancel();
    }, [buyCost, product?.asin, debouncedUpsert]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-primary">
                <FiLoader className="w-6 h-6 animate-spin mb-2" />
                <p className="text-sm">Loading product...</p>
            </div>
        );
    }

    if (!product || Object.keys(product).length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <MdOutlineSearchOff className="w-8 h-8 mb-2" />
                <p className="text-sm">Oops, looks like this product does not exist.</p>
            </div>
        );
    }

    return (
        <div className='bg-lBackground  min-h-screen'>

            <div className='grid grid-cols-1 lg:grid-cols-5  gap-4 h-full items-start p-4 text-secondary bg-lBackground'>
                <div className='lg:col-span-3 flex flex-col gap-4'>


                    <AnimationWrapper>
                        <CustomCard label={'Basic Info'}>
                            <BasicInfo product={product} />
                        </CustomCard>
                    </AnimationWrapper>

                    {/* <AnimationWrapper className={'block xs:hidden'} >
                        <CustomCard label={'Score Buddy'}>
                            <ScoreChart />
                        </CustomCard>
                    </AnimationWrapper> */}

                    <AnimationWrapper>
                        <CustomCard label={'Graphs'}>
                            <ChartWraaper product={product} size='large' />
                        </CustomCard>
                    </AnimationWrapper>
                    
                    <AnimationWrapper>
                        <CustomCard label={"Store Spy"}>
                            <TopOffers product={product} productOffers={productOffers} offerLoading={offerLoading} />
                        </CustomCard>
                    </AnimationWrapper>
                    
                </div>

                <div className='lg:col-span-2 flex flex-col gap-4'>
                    <AnimationWrapper>
                        <CustomCard label={'Profit Calculator'}>
                            <ProfitCalculator product={product} />
                        </CustomCard>
                    </AnimationWrapper>
                    <AnimationWrapper>
                        <CustomCard label={'Seller Central'}>
                            <SellerCentral product={product} />
                        </CustomCard>
                    </AnimationWrapper>
                    <AnimationWrapper>
                        <CustomCard label={'AI Buddy'} actio={<p className='text-lText text-sm'>20 / 100 Chat Limit</p>}>
                            <ChatBuddy />
                        </CustomCard>
                    </AnimationWrapper>
                    

                </div>
            </div>
        </div>
    );
}

export default ProductDetail