import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useSearchParams } from 'react-router-dom';
import { setHistoryData, setHistoryError, setHistoryLoading, setHistoryPage } from '../Redux/Slices/HistorySlice';
import { getHistory } from '../Apis/History';
import Pagination from '../Components/Controls/Pagination';
import CustomCard from './../Components/UI/CustomCard';
import Button from '../Components/Controls/Button';
import ProductImageGrid from '../Components/UI/ProductImageGrid';
import CopyButton from '../Components/Controls/CopyText';
import { MdOutlineSearchOff } from 'react-icons/md';
import { FiLoader } from 'react-icons/fi';

const History = () => {
  const dispatch = useDispatch();
  const { products, loading, error, page, limit, totalCount } = useSelector(
    (state) => state.history
  );

  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    fetchHistory(currentPage, limit);
  }, [currentPage, limit]);

  const fetchHistory = async (page, limit) => {
    dispatch(setHistoryLoading(true));
    try {
      const data = await getHistory({ page, limit });
      const totalPages = Math.ceil(data?.totalCount / limit);
      if (totalPages < page) {
        return handlePageChange(totalPages)
      }
      dispatch(
        setHistoryData({
          products: data.products,
          totalCount: data.totalCount,
          page,
          limit,
        })
      );
    } catch (err) {
      dispatch(setHistoryError(err.message || 'Failed to fetch history'));
    }
  };

  const handlePageChange = (newPage) => {
    setSearchParams({ page: newPage });
    dispatch(setHistoryPage(newPage));
  };

  return (
    <div className='py-4'>
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500 bg-primary">
          <FiLoader className="w-6 h-6 animate-spin mb-2" />
          <p className="text-sm">Loading History...</p>
        </div>
      )}
      {!loading && !products?.length && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-500">
          <MdOutlineSearchOff className="w-8 h-8 mb-2" />
          <p className="text-sm">Oops, looks like history does not exist.</p>
        </div>
      )}

      {!loading && products?.length > 0 && (
        <>
          <div
            className='p-4 flex flex-col gap-3'
          >
            <div className='flex justify-between items-end'>
              <h1 className='text-[24px]/[24px] text-secondary font-semibold fontDmmono'>History</h1>

              {/* <p className='text-2xl/[24px] font-semibold text-secondary'>History</p>
              <Button
                label='Refresh'
                size='medium'
                variant='secondary'
                action={() => { }}
              /> */}

            </div>
            {products.map((product) => (
              <Link to={`/detail?asin=${product?.asin}`}>

                <CustomCard
                  key={product.asin}
                  className="hover:shadow-md transition-shadow"
                >
                  <div className=' flex flex-col sm:flex-row gap-3'>

                    <div>
                      <ProductImageGrid images={product?.images} className={'!aspect-square !w-[100%] !max-w-[100%] sm:!w-[160px]'} />
                    </div>

                    <div className='flex-1 flex flex-col justify-between'>
                      <div className='flex flex-col gap-3'>
                        <p className='font-semibold text-base/[22px] text-secondary capitalize line-clamp-2  tracking-tight' title={product?.title}>{product?.title}</p>

                        <div className='flex flex-wrap gap-2 items-end'>
                          {product?.category && (<p className='text-[14px]/[14px] capitalize flex items-end gap-1 text-secondary font-medium'><span className='text-lText text-[14px]/[14px]'>Category:</span>{product?.category}</p>)}
                          {product?.brand && (<p className='text-[14px]/[14px] capitalize flex items-end gap-1 text-secondary font-medium'><span className='text-lText text-[14px]/[14px]'>|| Brand:</span>{product?.brand}</p>)}
                        </div>
                        <a className='text-[14px]/[14px] flex items-end gap-1 text-secondary font-medium'><span className='text-lText text-[14px]/[14px]'>ASIN:</span>{product?.asin} <CopyButton text={product?.asin} /></a>

                      </div>
                      <div className="text-right mt-2 sm:mt-0">
                        <p className="text-sm text-lText py-2">
                          Last visited:{" "}
                          {product.updatedAt
                            ? new Date(product.updatedAt).toLocaleString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                            : "N/A"}
                        </p>
                      </div>
                    </div>
                  </div>
                </CustomCard>
              </Link>

            ))}
          </div>

        </>
      )}
      <Pagination
        currentPage={page}
        totalCount={totalCount}
        limit={limit}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default History;
