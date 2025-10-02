import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoSearch } from 'react-icons/io5'
import { setCurrentPage, setProducts, setProductsLoading, setSearchTerm } from '../../Redux/Slices/ProductSlice'
import { searchProducts } from '../../Apis/Product'
import { toast } from 'react-toastify'
import CustomInput from '../Controls/CustomInput'
import { isASIN } from '../../Utils/NumberUtil'
import { useNavigate } from 'react-router-dom'

const SearchProducts = () => {

    const { productsLoading , page } = useSelector((state) => state?.products)
    const [searchQuery, setSearchQuerry] = useState('')
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const handleSearchProducts = async (e) => {
        e.preventDefault();
        if (isASIN(searchQuery)) {
           return navigate(`/detail?asin=${searchQuery}`);
        } else {
            navigate(`/`);
        }
        try {
            if (!searchQuery) return;
            dispatch(setProductsLoading(true));
            const products = await searchProducts(searchQuery, page);
            dispatch(setProducts(products));
            dispatch(setCurrentPage(0));
            dispatch(setSearchTerm(searchQuery))
        } catch (error) {
            toast.error(error.response ? error.response.data.message : error.message);
        } finally {
            dispatch(setProductsLoading(false));
        }
    };

    return (
        <form onSubmit={handleSearchProducts}>
            <p className='text-lText text-[15px] mb-2'>
                Search Product with their Keywords, Asins, Upcs
            </p>
            <div className='flex item-start gap-2'>

                <CustomInput
                    value={searchQuery}
                    onChange={(e) => setSearchQuerry(e.target.value)}
                    placeholder={'e.g. #B0053HBJBE OR Title'}
                    prefix={
                        <button
                            type="submit"
                            disabled={productsLoading}
                            className="flex items-center gap-2 h-full px-3 !cursor-pointer focus:outline-none"
                        >
                            <IoSearch /> search
                        </button>
                    }
                />
            </div>
        </form>
    )
}

export default SearchProducts