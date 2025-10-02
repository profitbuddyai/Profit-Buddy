import ContentLoader from 'react-content-loader'
import { useSelector } from 'react-redux';

const GraphCardLoader = () => {
    const { theme } = useSelector((state) => state.system);

    const backgroundColor = theme ? "#ededeb90" : "#dadada";
    const foregroundColor = theme ? "#e8e8e3" : "#b6b6b6";
    return (
        <div className='flex items-center justify-start max-w-full overflow-hidden rounded-[8px] bg-primary h-[280px]'>
            <div className='h-full flex-1 w-full'>
                <ContentLoader
                    speed={1}
                    width={"100%"}
                    height={"100%"}
                    // viewBox="0 0 350 190"
                    backgroundColor={backgroundColor}
                    foregroundColor={foregroundColor}
                >
                    <rect x="0%" y="0" rx="5" ry="5" width="100%" height="100%" />
                </ContentLoader>
            </div>
        </div>
    )
}

export default GraphCardLoader