import ContentLoader from 'react-content-loader'
import { useSelector } from 'react-redux';

const ProductCardLoader = (props) => {
    const { theme } = useSelector((state) => state.system);

    const backgroundColor = theme ? "#ededeb90" : "#dadada";
    const foregroundColor = theme ? "#e8e8e3" : "#b6b6b6";

    return (
        <div className='flex items-center justify-start max-w-full overflow-hidden gap-4 border border-border rounded-[18px] bg-primary h-[230px]'>
            <div className='h-[190px] w-[190px] pl-4'>
                <ContentLoader
                    speed={1}
                    width={190}
                    height={190}
                    viewBox="0 0 190 190"
                    backgroundColor={backgroundColor}
                    foregroundColor={foregroundColor}
                    {...props}
                >
                    <rect x="0%" y="0" rx="5" ry="5" width="190px" height="190px" />
                </ContentLoader>
            </div>
            <div className='h-[190px] flex-1  w-[350px] pl-4'>
                <ContentLoader
                    speed={1}
                    width={"350px"}
                    height={190}
                    viewBox="0 0 350 190"
                    backgroundColor={backgroundColor}
                    foregroundColor={foregroundColor}
                    {...props}
                >
                    <rect x="0%" y="0" rx="5" ry="5" width="100%" height="30" />
                    <rect x="0%" y="60" rx="5" ry="5" width="60%" height="15" />
                    <rect x="0%" y="100" rx="5" ry="5" width="30%" height="15" />
                    <rect x="40%" y="100" rx="5" ry="5" width="30%" height="15" />
                    <rect x="0%" y="140" rx="5" ry="5" width="60%" height="10" />
                </ContentLoader>
            </div>
            <div className='h-[190px] w-[150px] pl-4'>
                <ContentLoader
                    speed={1}
                    width={150}
                    height={190}
                    viewBox="0 0 150 190"
                    backgroundColor={backgroundColor}
                    foregroundColor={foregroundColor}
                    {...props}
                >
                    <rect x="0%" y="0" rx="5" ry="5" width="150px" height="190px" />
                </ContentLoader>
            </div>
            <div className='h-[190px] flex-1 w-full !max-w-[385px] pl-4'>
                <ContentLoader
                    speed={1}
                    width={355}
                    height={190}
                    viewBox="0 0 350 190"
                    backgroundColor={backgroundColor}
                    foregroundColor={foregroundColor}
                    {...props}
                >
                    <rect x="0%" y="0" rx="5" ry="5" width="350px" height="190px" />
                </ContentLoader>
            </div>
        </div>
    )
}

export default ProductCardLoader;
