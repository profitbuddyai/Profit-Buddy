import LightLogoImage from '../../Assets/Profit Buddy AI/Logo/PNG/White.png'
import DarkLogoImage from '../../Assets/Profit Buddy AI/Logo/PNG/Primary.png'
import { useSelector } from 'react-redux'
import SearchProducts from '../Widgets/SearchProducts'
import { Link } from 'react-router-dom'

import HeaderMenu from '../UI/HeaderMenu'
import { useEffect, useState } from 'react'

const Header = () => {

    const { user } = useSelector((state) => state?.user);
    const { theme } = useSelector((state) => state.system)

    const [isSubscribed, setIsSubscribed] = useState(false)

    const sub = user?.currentSubscription;

    useEffect(() => {
        if (!sub || (sub.status !== "active" && sub.status !== "trialing") || (sub?.currentPeriodEnd && new Date(sub?.currentPeriodEnd) < new Date())) {
            setIsSubscribed(false)
        } else {
            setIsSubscribed(true)
        }
    }, [user])

    return (
        <div className='w-full bg-primary p-4 border-b border-border flex flex-col gap-6 '>
            <div className='flex justify-between'>
                <Link to="/">
                    <img
                        src={theme ? LightLogoImage : DarkLogoImage}
                        alt="logo"
                        className="w-[150px] md:w-[200px] cursor-pointer"
                    />
                </Link>
                <HeaderMenu isSubscribed={isSubscribed} />
            </div>
            {isSubscribed && (
                <div className='inline flex-col  flex-1'>
                    <SearchProducts />
                </div>
            )}
        </div>
    )
}

export default Header