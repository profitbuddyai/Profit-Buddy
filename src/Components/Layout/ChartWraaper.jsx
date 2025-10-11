import React, { useEffect, useState } from 'react'
import { getGraphData } from '../../Apis/Graph';
import { isEqual } from 'lodash';
import { toast } from 'react-toastify';
import SalesAndOfferDygraphs from '../Widgets/SalesAndOfferDygraphs ';

const ChartWraaper = ({ product, size = 'large', buyboxSellerHistory = [], sellerData = {}, className = '' }) => {
    const { asin, historyLength } = product || {};
    const { keepaGraphData } = product?.graphData || {};
    const [graphData, setGraphData] = useState([]);
    const [formattedGraphData, setFormattedGraphData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentFilter, setCurrentFilter] = useState(90);
    const [initialLoad, setInitialLoad] = useState(true);

    useEffect(() => {
        setGraphData(keepaGraphData);
        setFormattedGraphData(keepaGraphData);
    }, [keepaGraphData]);

    useEffect(() => {
        if (initialLoad && currentFilter === 90) {
            setInitialLoad(false);
            return;
        }
        handleFilterDays();
    }, [currentFilter]);

    const handleFilterDays = async () => {
        if (!currentFilter || loading) return;
        try {
            setLoading(true);
            const response = await getGraphData(asin, currentFilter);
            setGraphData(response?.keepaGraphData);
            setFormattedGraphData(response?.keepaGraphData);
        } catch (error) {
            toast.error("Error occurred while fetching graph data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`flex flex-col gap-4 w-full ${className}`}>
            {formattedGraphData && formattedGraphData.length > 0 ? (
                <SalesAndOfferDygraphs
                    key={asin}
                    graphData={formattedGraphData}
                    productInfo={product?.info}
                    currentFilter={currentFilter}
                    loading={loading}
                    setCurrentFilter={setCurrentFilter}
                    size={size}
                    totalDays={historyLength}
                    buyboxSellerHistory={buyboxSellerHistory}
                    sellerData={sellerData}
                />
            ) : (
                <div className="flex justify-center items-center h-[300px] text-gray-500">
                    Loading chart...
                </div>
            )}
        </div>
    );
};

export default React.memo(ChartWraaper, (prevProps, nextProps) => {
  return (
    prevProps.product.asin === nextProps.product.asin &&
    prevProps.size === nextProps.size &&
    prevProps.className === nextProps.className &&
    isEqual(prevProps.product?.graphData?.keepaGraphData, nextProps.product?.graphData?.keepaGraphData) &&
    isEqual(prevProps.buyboxSellerHistory, nextProps.buyboxSellerHistory) &&
    isEqual(prevProps.sellerData, nextProps.sellerData)
  );
});
