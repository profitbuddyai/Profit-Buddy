import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiLoader } from "react-icons/fi";
import { MdOutlineSearchOff } from "react-icons/md";
import { isEmpty, isEqual } from "lodash";

import SellerInfo from "../Components/Widgets/SellerInfo";
import ProductCardLoader from "../Components/Loaders/ProductCardLoader";
import ProductCard from "../Components/UI/ProductCard";
import SelectedFilters from "../Components/UI/SelectedFilters";
import Button from "../Components/Controls/Button";

import { getSellerInfo, getSellerRevenue } from "../Apis/Seller";
import { findProductAsin, getProduct } from "../Apis/Product";
import { buildSellerAsinQuery } from "../Helpers/BuildQuery";

import { pushSellerProducts, setSeller, setSellerAsins, setSellerCurrentPage, setSellerLoading, setSellerProducts, setSellerProductsLoading, } from "../Redux/Slices/SellerSlice";

const FILTER_INITIAL = { rootCategory: [], brand: [] };
const LIMIT = 10;

const SellerProfile = () => {
    const [searchParams] = useSearchParams();
    const sellerId = searchParams.get("sellerid");

    const dispatch = useDispatch();
    const { seller, sellerLoading, sellerCurrentPage, sellerProductsLoading } = useSelector((state) => state?.seller);
    const { products = [], asins = [] } = seller || {};
    const [productsQuery, setProductsQuery] = useState({});
    const [sellerRevenue, setSellerRevenue] = useState(0);
    const [sellerRevenueLoading, setSellerRevenueLoading] = useState(true);
    const [queryFilterLocal, setQueryFilterLocal] = useState(FILTER_INITIAL);

    /** Fetch Seller Info */
    const handleGetSeller = useCallback(async () => {
        if (!sellerId) return;
        try {
            dispatch(setSellerLoading(true));
            const response = await getSellerInfo(sellerId);
            dispatch(setSeller(response));
        } catch (error) {
            console.error("Failed to fetch Seller:", error);
        } finally {
            dispatch(setSellerLoading(false));
        }
    }, [dispatch, sellerId]);

    /** Fetch Seller ASINs */
    const handleGetSellerAsins = useCallback(async () => {
        if (!sellerId) return;
        try {
            dispatch(setSellerProductsLoading(true));
            const asinList = await findProductAsin(
                buildSellerAsinQuery(productsQuery, seller, sellerId)
            );
            if (!asinList) throw new Error("ASINs not found");

            dispatch(setSellerAsins(asinList));
            dispatch(setSellerCurrentPage(1));
        } catch (error) {
            console.error("Failed to fetch Seller Asins:", error);
        } finally {
            dispatch(setSellerProductsLoading(false));
        }
    }, [dispatch, productsQuery, seller, sellerId]);

    /** Fetch Products */
    const handleGetSellerProducts = useCallback(async () => {
        if (!asins?.length) return;
        try {
            dispatch(setSellerProductsLoading(true));
            const start = (sellerCurrentPage - 1) * LIMIT;
            const validPageAsins = asins.slice(start, start + LIMIT);

            const productsResp = await getProduct(validPageAsins);
            dispatch(
                sellerCurrentPage === 1
                    ? setSellerProducts(productsResp)
                    : pushSellerProducts(productsResp)
            );
        } catch (error) {
            console.error("Failed to fetch Seller Products:", error);
        } finally {
            dispatch(setSellerProductsLoading(false));
        }
    }, [dispatch, asins, sellerCurrentPage]);

    /** Fetch Seller Revenue */
    const handleGetSellerRevenue = useCallback(async () => {
        if (!asins?.length || !sellerId) return;
        try {
            setSellerRevenueLoading(true);
            const validPageAsins = Array.isArray(asins) ? asins.slice(0, 90).join(",") : "";
            const sellerRevenue = await getSellerRevenue(sellerId, validPageAsins);
            setSellerRevenue(sellerRevenue);
        } catch (error) {
            console.error("Failed to fetch Seller Products:", error);
        } finally {
            setSellerRevenueLoading(false);
        }
    }, [asins]);

    /** Filter Handlers */
    const handleFilterClick = (type, value) => {
        setQueryFilterLocal((prev) => {
            const currentValues = prev[type] || [];
            return {
                ...prev,
                [type]: currentValues.includes(value)
                    ? currentValues.filter((v) => v !== value)
                    : [...currentValues, value],
            };
        });
    };

    const handleRemove = (type, value) => {
        setQueryFilterLocal((prev) => ({
            ...prev,
            [type]: prev[type].filter((v) => v !== value),
        }));
    };

    const handleReset = () => setQueryFilterLocal(FILTER_INITIAL);

    const handleApplyFilter = () => {
        if (!isEmpty(queryFilterLocal)) {
            setProductsQuery(queryFilterLocal);
        }
    };

    /** Effects */
    useEffect(() => {
        if (sellerId && seller?.id !== sellerId) handleGetSeller();
    }, [sellerId, handleGetSeller]);

    useEffect(() => {
        if (sellerId) handleGetSellerAsins();
    }, [sellerId, productsQuery]);

    useEffect(() => {
        if (asins?.length) handleGetSellerProducts();
    }, [asins, sellerCurrentPage]);

    // useEffect(() => {
    //     if (asins?.length) handleGetSellerRevenue();
    // }, [asins]);

    /** UI States */
    if (sellerLoading) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-lText bg-primary">
                <FiLoader className="w-8 h-8 animate-spin mb-2" />
                <p className="text-lg">Loading Seller...</p>
            </div>
        );
    }

    if (isEmpty(seller)) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-lText">
                <MdOutlineSearchOff className="w-8 h-8 mb-2" />
                <p className="text-lg">Oops, looks like this seller does not exist.</p>
            </div>
        );
    }

    return (
        <div className="bg-lBackground p-4 flex flex-col gap-4">
            <SellerInfo
                className="col-span-2"
                seller={seller}
                handleFilterClick={handleFilterClick}
                queryFilter={queryFilterLocal}
                sellerRevenue={sellerRevenue}
                sellerRevenueLoading={sellerRevenueLoading}
            />

            <SelectedFilters
                queryFilter={queryFilterLocal}
                handleFilterClick={handleFilterClick}
                handleReset={handleReset}
                handleApplyFilter={handleApplyFilter}
                productsQuery={productsQuery}
                queryFilterLocal={queryFilterLocal}
            />

            {/* Products */}
            <div className="flex flex-col gap-4 col-span-4">
                {sellerProductsLoading && sellerCurrentPage === 1 ? (
                    Array.from({ length: 5 }).map((_, i) => <ProductCardLoader key={i} />)
                ) : (
                    products.map((prod, i) => <ProductCard product={prod} key={i} />)
                )}
            </div>

            {/* Load More */}
            {(products?.length > 0 && asins?.length > products?.length) && (
                <div className="w-full flex justify-center">
                    <Button
                        label="Load More"
                        loading={sellerProductsLoading && sellerCurrentPage > 1}
                        corner="full"
                        variant="secondary"
                        size="medium"
                        action={() =>
                            dispatch(setSellerCurrentPage(sellerCurrentPage + 1))
                        }
                    />
                </div>
            )}
        </div>
    );
};

export default SellerProfile;
