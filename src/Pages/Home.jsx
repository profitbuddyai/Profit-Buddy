import ProductCard from '../Components/UI/ProductCard'
import { useDispatch, useSelector } from 'react-redux'
import ProductCardLoader from '../Components/Loaders/ProductCardLoader'
import Button from '../Components/Controls/Button'
import { useEffect } from 'react'
import { searchProducts } from '../Apis/Product'
import { toast } from 'react-toastify'
import { pushProducts, setCurrentPage, setLoadmoreLoading, setSearchTerm } from '../Redux/Slices/ProductSlice'
import { ProductSearchData } from '../Utils/MockData'
import CustomerSupport from '../Components/Widgets/CustomerSupport'

const Home = () => {
  const { products, currentPage, productsLoading, searchTerm, loadmoreLoading } = useSelector((state) => state?.products)
  const dispatch = useDispatch()

  const handleLoadMoreProducts = async (page) => {
    try {
      dispatch(setLoadmoreLoading(true));
      const products = await searchProducts(searchTerm, page);
      dispatch(pushProducts(products));
      dispatch(setCurrentPage(page));
    } catch (error) {
      toast.error(error.response ? error.response.data.message : error.message);
    } finally {
      dispatch(setLoadmoreLoading(false));
    }
  };


  return (
    <div className='bg-lBackground min-h-screen p-5 flex flex-col gap-4'>

      {/* <ProductCard product={ProductSearchData?.[0]} /> */}



      {productsLoading && [1, 2, 3, 4, 5].map((_, index) => (
        <ProductCardLoader key={index} />
      ))}

      {products?.length === 0 ? (
        <>
          <p className="text-secondary font-semibold text-[30px]">
            Featured Products
          </p>
          {ProductSearchData?.map((prod, index) => (
            <ProductCard product={prod} key={prod?.asin || index} />
          ))}
        </>
      ) : (
        products?.map((prod, index) => (
          <ProductCard product={prod} key={prod?.asin || index} />
        ))
      )}

      <div className='w-full flex justify-center'>
        {products?.length > 0 && (
          <Button label='Load More' loading={loadmoreLoading} corner='full' variant='secondary' size='medium' action={() => handleLoadMoreProducts(currentPage + 1 || 0)} />
        )}
      </div>
    </div>
  )
}

export default Home