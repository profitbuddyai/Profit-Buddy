import { useState, useEffect } from 'react';
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa';
import LightLogoImage from '../../Assets/Profit Buddy AI/Sign/PNG/Black Sign.png';
import CustomInput from './../Controls/CustomInput';
import Button from './../Controls/Button';
import Checkbox from './../Controls/Checkbox';
import { registerUser } from '../../Apis/User';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [registerStatus, setRegisterStatus] = useState({ success: false, message: '' });
    const navigate = useNavigate();
    const location = useLocation();

    const [inviteData, setInviteData] = useState({ token: '', email: '' });

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        terms: false,
    });
    const [errors, setErrors] = useState({});

    // ✅ Extract token and email from query on mount
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const registerToken = queryParams.get('register-token');
        const invitedEmail = queryParams.get('email');

        if (registerToken && invitedEmail) {
            setInviteData({ token: registerToken, email: invitedEmail });
            setFormData((prev) => ({ ...prev, email: invitedEmail })); // prefill email
        }
    }, [location.search]);

    // ✅ Handle input change
    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    // ✅ Validation
    const validateForm = () => {
        let newErrors = {};

        if (!formData.email) newErrors.email = 'Email is required';
        else if (!/^\S+@\S+\.\S+$/.test(formData.email))
            newErrors.email = 'Invalid email format';

        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6)
            newErrors.password = 'Password must be at least 6 characters';

        if (!formData.confirmPassword)
            newErrors.confirmPassword = 'Confirm Password is required';
        else if (formData.confirmPassword !== formData.password)
            newErrors.confirmPassword = 'Passwords do not match';

        if (!formData.terms)
            newErrors.terms = 'You must accept the Terms and Conditions';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setRegisterStatus({ success: false, message: '' });
            if (!validateForm()) return;
            setLoading(true);

            const payload = {
                email: formData.email,
                password: formData.password,
                terms: formData.terms,
            };

            // If user came from invitation, include token
            if (inviteData.token) {
                payload.inviteToken = inviteData.token;
            }

            const data = await registerUser(payload);
            setRegisterStatus({ success: true, message: data?.message });
        } catch (err) {
            console.error(err);
            const message = err.response ? err.response.data.message : err.message;
            setRegisterStatus({ success: false, message });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center w-screen min-h-screen !py-3 hideScroll justify-center bg-lBackground px-4'>
            <form
                className='flex flex-col gap-4 w-full px-5 py-4 max-w-[400px] bg-primary rounded-xl border border-border'
                onSubmit={handleSubmit}
            >
                <div className='flex items-center justify-center'>
                    <img src={LightLogoImage} alt="" className='w-[50px]' />
                </div>

                <div className='flex-1 flex flex-col items-center'>
                    <p className='text-2xl text-secondary/80 font-medium'>
                        Create an account
                    </p>
                    <p className='text-lText text-center text-sm'>
                        Please fill in the details to get started
                    </p>
                </div>

                {registerStatus?.message && (
                    <div
                        className={`flex flex-col gap-4 text-xs py-2 px-4 rounded-lg font-normal ${registerStatus?.success
                                ? 'bg-green-100 text-green-500'
                                : 'bg-red-100 text-red-500'
                            }`}
                    >
                        {registerStatus?.message}
                    </div>
                )}

                <CustomInput
                    name='email'
                    placeholder='abc@example.com'
                    label='Email'
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                    disabled={!!inviteData.email} // disable if invited
                />

                <CustomInput
                    type={showPassword ? 'text' : 'password'}
                    name='password'
                    placeholder='Enter your password'
                    label='Password'
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    error={errors.password}
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
                    name='confirmPassword'
                    placeholder='Re-enter your password'
                    label='Confirm Password'
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    error={errors.confirmPassword}
                    suffix={
                        <Button
                            variant='transparent'
                            label={showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            action={() => setShowPassword(!showPassword)}
                            className='!px-3 !text-base'
                        />
                    }
                />

                <div>
                    <Checkbox
                        label='I accept Terms and Conditions'
                        checked={formData.terms}
                        onChange={(e) => handleChange('terms', e.target.checked)}
                    />
                    {errors.terms && (
                        <p className='text-red-500 text-xs mt-1'>{errors.terms}</p>
                    )}
                </div>

                <Button
                    corner='small'
                    label='Create an account'
                    variant='secondary'
                    size='medium'
                    type='submit'
                    loading={loading}
                />

                <p className='text-sm text-lText text-center'>
                    Already have an account?{' '}
                    <Link
                        to={'/authentication?tab=login'}
                        className='text-accent font-medium cursor-pointer hover:text-accent/70 transition'
                    >
                        Login here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;
