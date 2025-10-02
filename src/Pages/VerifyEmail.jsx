import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { verifyEmail, verifyResetToken } from "../Apis/User";
import { IoCheckmarkCircleOutline, IoWarningOutline } from "react-icons/io5";
import Loader from "../Components/Loaders/Loader";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";

export default function VerifyEmailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [emailStatus, setEmailStatus] = useState({ valid: false, message: '' });

    useEffect(() => {
        const handleVerifyEmail = async () => {
            try {
                const data = await verifyEmail({ token });
                setEmailStatus({ valid: true, message: data?.message });
            } catch (err) {
                console.error(err);
                const message = err.response ? err.response.data.message : err.message
                setEmailStatus({ valid: false, message });
            } finally {
                setLoading(false);
            }
        };

        handleVerifyEmail();
    }, [token]);


    if (loading) return <Loader />;

    return (
        <div className="flex items-center justify-center min-h-screen bg-primary">
            <div className={`flex flex-col gap-4 items-center p-6 rounded-lg font-normal text-center max-w-[400px] ${emailStatus?.valid ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'} `}>
                {emailStatus.valid ? <IoIosCheckmarkCircleOutline className="text-[40px]" /> : <IoWarningOutline className="text-[40px]" />}
                <p>{emailStatus?.message}</p>
                <Link to="/authentication?tab=login" className="text-blue-500 font-normal cursor-pointer w-full block text-end hover:opacity-85 ">Go to login page</Link>
            </div>
        </div>
    )
}
