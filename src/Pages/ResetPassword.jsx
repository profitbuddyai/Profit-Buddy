import { useEffect, useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import LightLogoImage from '../Assets/Profit Buddy AI/Sign/PNG/Black Sign.png'
import { requestPasswordReset, resetPassword, verifyResetToken } from "../Apis/User";
import { IoCheckmarkCircleOutline, IoWarningOutline } from "react-icons/io5";
import Loader from "../Components/Loaders/Loader";
import CustomInput from "../Components/Controls/CustomInput";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Button from "../Components/Controls/Button";

export default function ResetPasswordPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const email = searchParams.get("email");
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [linkStatus, setLinkStatus] = useState({ valid: false, message: '' });
    const [resetPasswordStatus, setResetPasswordStatus] = useState({ success: false, message: '' })
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        newPassword: '',
        confirmNewPassword: '',
    });

    useEffect(() => {
        const verifyToken = async () => {
            try {
                const data = await verifyResetToken({ email, token });
                setLinkStatus({ valid: true, message: data?.message });
            } catch (err) {
                console.error(err);
                const message = err.response ? err.response.data.message : err.message
                setLinkStatus({ valid: false, message });
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [email, token]);

    const validateForm = () => {
        let newErrors = {};

        if (!formData.newPassword) {
            newErrors.newPassword = 'Password is required';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }

        if (!formData.confirmNewPassword) {
            newErrors.confirmNewPassword = 'Confirm Password is required';
        } else if (formData.confirmNewPassword !== formData.newPassword) {
            newErrors.confirmNewPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' })); // clear error on change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            setSubmitting(true);
            setErrors("");
            setResetPasswordStatus({ success: false, message: '' })
            const data = await resetPassword({ email, token, newPassword: formData?.newPassword, });
            setResetPasswordStatus({ success: true, message: data?.message })
        } catch (err) {
            console.error(err);
            const message = err.response ? err.response.data.message : err.message
            setResetPasswordStatus({ success: false, message })
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader />;

    if (!linkStatus?.valid) return (
        <div className="flex items-center justify-center min-h-screen bg-primary">
            <div className="flex flex-col gap-4 items-center p-6 text-red-500 rounded-lg font-normal text-center bg-red-100 max-w-[400px]">
                <IoWarningOutline className="text-[40px]" />
                <p>{linkStatus?.message}</p>
                <Link to="/authentication?tab=login" className="text-blue-500 font-normal cursor-pointer w-full block text-end hover:opacity-85 ">Go to login page</Link>

            </div>
        </div>
    )

    return (
        <div className='flex items-center w-screen h-screen hideScroll justify-center bg-lBackground px-4'>
            <form
                className='flex flex-col gap-5 w-full px-5 py-4 max-w-[400px] bg-primary shadow-md rounded-xl border border-border'
                onSubmit={handleSubmit}
            >
                <div className='flex items-center justify-center'>
                    <img src={LightLogoImage} alt="" className='w-[50px]' />
                </div>

                <div className='flex flex-col items-center'>
                    <p className='text-secondary text-center font-bold text-2xl/[26px]'>Reset your password</p>
                    <p className='text-lText text-center font- text-sm'>Please enter the new password</p>
                </div>
                {resetPasswordStatus?.message && (
                    <div className={`flex flex-col gap-4 text-sm  py-2 px-4 rounded-lg font-normal ${resetPasswordStatus?.success ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'} `}>
                        {resetPasswordStatus?.success ? (
                            <p>Password reseted successfully now you can, <Link to="/authentication?tab=login" className="text-blue-500 font-normal cursor-pointer hover:opacity-85">Login Here</Link></p>
                        ) : (
                            resetPasswordStatus?.message
                        )}
                    </div>
                )}

                <CustomInput
                    type={showPassword ? 'text' : 'password'}
                    name='newPassword'
                    placeholder='Enter your new password'
                    label='New Password'
                    value={formData.newPassword}
                    onChange={(e) => handleChange('newPassword', e.target.value)}
                    error={errors.newPassword}
                    inputClassName='!rounded-xl'
                    suffix={
                        <Button
                            variant='transparent'
                            label={showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            action={() => setShowPassword(!showPassword)}
                            className='!px-3 !text-base'
                        />
                    }
                />

                <CustomInput
                    type={showPassword ? 'text' : 'password'}
                    name='confirmNewPassword'
                    placeholder='Re-enter your new password'
                    label='Confirm New Password'
                    value={formData.confirmNewPassword}
                    onChange={(e) => handleChange('confirmNewPassword', e.target.value)}
                    error={errors.confirmNewPassword}
                    inputClassName='!rounded-xl'
                    suffix={
                        <Button
                            variant='transparent'
                            label={showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            action={() => setShowPassword(!showPassword)}
                            className='!px-3 !text-base'
                        />
                    }
                />

                <Button
                    corner='small'
                    label='Reset Password'
                    variant='secondary'
                    size='medium'
                    className='!h-10 !rounded-xl'
                    type='submit'
                    loading={submitting}
                />

                <p className="text-sm text-lText text-center">
                    Dont want to rest?{" "}
                    <Link
                        to={'/authentication?tab=login'}
                        className="text-accent font-medium cursor-pointer hover:text-accent/70 transition"
                    >
                        Login here
                    </Link>
                </p>

            </form >
        </div >
    );
}
