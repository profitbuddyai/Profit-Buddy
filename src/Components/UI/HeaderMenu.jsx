import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PopupMenu from '../Controls/PopupMenu';
import Button from '../Controls/Button';
import ToggleSwitch from '../Controls/ToggleSwitch';
import Modal from './Modal';
import CustomInput from '../Controls/CustomInput';
import { setTheme } from '../../Redux/Slices/SystemSlice';
import { setLogout } from '../../Redux/Slices/UserSlice';
import { BiLogOut } from "react-icons/bi";
import { LuHistory, LuUserRound } from 'react-icons/lu';
import { TbSpy } from 'react-icons/tb';
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md';
import { IoChevronDownOutline } from 'react-icons/io5';
import { isSellerId } from '../../Utils/NumberUtil';

const HeaderMenu = ({ isSubscribed = true }) => {
    const { theme } = useSelector((state) => state.system);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [modalOpen, setModalOpen] = useState(false);
    const [sellerId, setSellerId] = useState('');
    const [inputError, setInputError] = useState('');

    const getSellerIdError = (sellerId) => {
        if (!sellerId?.trim()) return "Please fill the input";
        if (!isSellerId(sellerId)) return "Please enter a valid Seller ID (e.g., A1Z5U5O7R7H3DQ)";
        return null;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const error = getSellerIdError(sellerId);
        if (error) {
            setInputError(error);
            return;
        }
        setInputError("");
        window.location.href = `/sellerProfile?sellerid=${encodeURIComponent(sellerId.trim())}`;
    };

    return (
        <div className="flex gap-2 items-center">
            {/* --- Visible ONLY on large screens (>=md) --- */}
            <div className="gap-2 md:flex hidden">
                <ToggleSwitch
                    options={[{ label: 'Dark', value: 'Dark' }, { label: 'Light', value: 'Light' }]}
                    selected={theme ? 'Dark' : 'Light'}
                    onChange={(value) => dispatch(setTheme(value === 'Dark'))}
                />

                {isSubscribed && (
                    <Button
                        size="medium"
                        variant="accent"
                        corner="full"
                        label={<div className="flex gap-2 items-center"><TbSpy size={18} /> Store Spy</div>}
                        action={() => setModalOpen(!modalOpen)}
                    />
                )}
            </div>

            {/* Account button */}
            <Button
                size='medium'
                variant='accent'
                corner='full'
                className='!pl-4 pr-1 rounded-r-none'
                label={<div className='flex gap-2 items-center'><LuUserRound size={18} />Account</div>}
                action={() => navigate('/account?tab=profile')}
            />

            {/* Desktop PopupMenu */}
            <div className="hidden md:block">
                <PopupMenu
                    trigger={
                        <Button
                            size="medium"
                            variant="accent"
                            corner="full"
                            className="!pl-2 !pr-2 -ml-2 rounded-l-none"
                            label={<div className='flex gap-2 items-center'><IoChevronDownOutline size={18} /></div>}
                        />
                    }
                    data={[
                        ...(isSubscribed ? [{
                            icon: <LuHistory size={18} />,
                            name: 'History',
                            action: () => navigate('/history'),
                        }] : []),
                        {
                            icon: <BiLogOut size={18} />,
                            name: 'Logout',
                            action: () => dispatch(setLogout()),
                        },
                    ]}
                />
            </div>

            {/* Mobile PopupMenu */}
            <div className="md:hidden block">
                <PopupMenu
                    trigger={
                        <Button
                            size="medium"
                            variant="accent"
                            corner="full"
                            className="!pl-2 !pr-2 -ml-2 rounded-l-none"
                            label={<div className='flex gap-2 items-center'><IoChevronDownOutline size={18} /></div>}
                        />
                    }
                    data={[
                        ...(isSubscribed ? [{
                            icon: <TbSpy size={18} />,
                            name: 'Store Spy',
                            action: () => setModalOpen(!modalOpen),
                        }] : []),
                        {
                            icon: !theme ? <MdOutlineDarkMode size={18} /> : <MdOutlineLightMode size={18} />,
                            name: !theme ? 'Dark Theme' : 'Light Theme',
                            action: () => dispatch(setTheme(!theme)),
                        },
                        ...(isSubscribed ? [{
                            icon: <LuHistory size={18} />,
                            name: 'History',
                            action: () => navigate('/history'),
                        }] : []),
                        {
                            icon: <BiLogOut size={18} />,
                            name: 'Logout',
                            action: () => dispatch(setLogout()),
                        },
                    ]}
                />
            </div>

            {/* Store Spy Modal */}
            {isSubscribed && (
                <Modal
                    isOpen={modalOpen}
                    setIsOpen={setModalOpen}
                    label='Store Spy'
                    subText="Enter a Seller ID to find and analyze store details, including products, performance, and other insights."
                    actions={
                        <>
                            <Button label='Cancel' size='medium' variant='outline' action={() => setModalOpen(false)} />
                            <Button type='submit' label='Store Spy' size='medium' variant='secondary' action={handleSubmit} />
                        </>
                    }
                >
                    <form onSubmit={handleSubmit}>
                        <CustomInput
                            size='large'
                            placeholder='e.g. A1Z5U5O7R7H3DQ'
                            value={sellerId}
                            onChange={(e) => setSellerId(e.target.value)}
                            error={inputError}
                            prefix='Seller Id'
                        />
                        <button type='submit' className='hidden'></button>
                    </form>
                </Modal>
            )}
        </div>
    );
};

export default HeaderMenu;
