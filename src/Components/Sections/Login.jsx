import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'
import LightLogoImage from '../../Assets/Profit Buddy AI/Sign/PNG/Black Sign.png'
import CustomInput from './../Controls/CustomInput';
import Button from './../Controls/Button';
import { loginUser } from '../../Apis/User';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import ResetPasswordModal from '../UI/ResetPasswordModal';

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [resetModalOpen, setResetModalOpen] = useState(false);
    const [loginStatus, setLoginStatus] = useState({ success: false, message: '' })

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        } else if (/\s/.test(formData.email)) {
            newErrors.email = "Email must not contain spaces";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (!/^[\w!@#$%^&*()_+=[\]{};':"\\|,.<>/?-]+$/.test(formData.password)) {
            newErrors.password = "Password contains invalid characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoginStatus({ success: false, message: '' })

            if (!validateForm()) return;
            setLoading(true)
            await loginUser(formData)
            navigate("/")
        } catch (err) {
            console.error(err);
            const message = err.response ? err.response.data.message : err.message
            setLoginStatus({ success: false, message })
            setLoading(false)
        }
    };

    return (
        <div className='flex items-center w-screen hideScroll h-screen justify-center bg-lBackground px-4'>
            <form
                className='flex flex-col gap-4 w-full px-5 py-8 max-w-[400px] bg-primary rounded-xl border border-border'
                onSubmit={handleSubmit}
            >
                <div className='flex items-center justify-center'>
                    <img src={LightLogoImage} alt="" className='w-[60px]' />
                </div>
                <div className='flex flex-col items-center'>
                    <p className='text-2xl text-secondary/80 font-medium'>Welcome back</p>
                    <p className='text-lText text-center text-sm'>Please enter your details to login</p>
                </div>

                {loginStatus?.message && (
                    <div className={`flex flex-col gap-4 text-xs py-2 px-4 rounded-lg font-normal ${loginStatus?.success ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'} `}>
                        {loginStatus?.message}
                    </div>
                )}

                <CustomInput
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="abc@example.com"
                    label="Email"
                    // inputClassName="!rounded-xl"
                    error={errors.email}
                />

                <CustomInput
                    type={showPassword ? "text" : "password"}
                    name={"password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    label={
                        <div className='flex items-end justify-between w-full'>
                            <span className='text-secondary'>Password</span>
                            <span className='text-accent font-normal text-sm cursor-pointer hover:opacity-70' onClick={() => setResetModalOpen(true)}>Forgot your password?</span>
                        </div>}
                    // inputClassName="!rounded-xl"
                    error={errors.password}
                    suffix={
                        <Button
                            variant="transparent"
                            label={showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            action={() => setShowPassword(!showPassword)}
                            className="!px-3 !text-base"
                        />
                    }
                />

                <Button
                    corner="small"
                    label="Login"
                    variant="secondary"
                    size="medium"
                    type="submit"
                    loading={loading}
                />

                <p className="text-sm text-lText text-center">
                    Don’t have an account?{" "}
                    <Link
                        to={'/authentication?tab=register'}
                        className="text-accent cursor-pointer font-medium hover:text-accent/70 transition"
                    >
                        Sign up here
                    </Link>
                </p>
            </form>
            <ResetPasswordModal isOpen={resetModalOpen} setIsOpen={setResetModalOpen} />
        </div>
    )
}

export default Login
