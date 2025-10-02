import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import CustomInput from '../Controls/CustomInput';
import Button from '../Controls/Button';
import { updateProfile } from '../../Apis/User';
import { toast } from 'react-toastify';
import { setUser } from '../../Redux/Slices/UserSlice';
import ResetPasswordModal from '../UI/ResetPasswordModal';
import DeleteAccountModal from '../UI/DeleteAccountModal';

const ProfileTab = () => {
    const { user } = useSelector((state) => state?.user);
    const [userName, setUserName] = useState('');
    const [loading, setLoading] = useState(false);
    const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
    const [deleteAccountModalOpen, setDeleteAccountModalOpen] = useState(false);

    const dispatch = useDispatch()

    const handleEditProfile = async () => {
        try {
            setLoading(true)
            const responce = await updateProfile({ userName })
            dispatch(setUser(responce?.user))
            toast.success(responce?.message)
        } catch (error) {
            const message = err.response ? err.response.data.message : err.message
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { setUserName(user?.userName) }, [user?.userName])
    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 h-max">
            <div className="flex flex-col gap-4  bg-primary border border-border rounded-xl p-4">
                <p className="text-2xl text-secondary/80 font-medium">Personel Information</p>
                <CustomInput
                    label={'User Name'}
                    placeholder={'e.g. Jhon Doe'}
                    size="small"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    suffix={<Button
                        corner="none"
                        variant="secondary"
                        label="Save"
                        size="medium"
                        loading={loading}
                        disabled={user?.userName === userName}
                        action={() => handleEditProfile()}
                    />}
                />
                <div>
                    <p className="text-base font-medium  text-secondary/80">Email</p>
                    <p className="text-lText text-lg">{user?.email}</p>
                </div>
            </div>

            <div className="flex flex-col gap-4  bg-primary border border-border rounded-xl p-4">
                <p className="text-2xl text-secondary/80 font-medium">Security</p>
                <div className="flex flex-col w-full justify-center gap-0">
                    <p className="text-base/[20px] font-medium  text-secondary/80">Password</p>
                    <p className="text-sm  text-lText pb-2">Changing your password will log you out from all devices.</p>
                    <Button
                        corner="small"
                        variant="secondary"
                        label="Change Password"
                        size="medium"
                        action={() => setChangePasswordModalOpen(true)}

                    />
                </div>
                <div className="flex flex-col w-full justify-center gap-1">
                    <p className="text-base font-medium  text-secondary/80">Account</p>
                    <Button
                        corner="small"
                        variant="danger"
                        label="Delete Account"
                        size="medium"
                        action={() => setDeleteAccountModalOpen(true)}
                    />
                </div>
            </div>
            <ResetPasswordModal preFilledEmail={user?.email} isOpen={changePasswordModalOpen} setIsOpen={setChangePasswordModalOpen} />
            <DeleteAccountModal isOpen={deleteAccountModalOpen} setIsOpen={setDeleteAccountModalOpen} />

        </div>
    )
}

export default ProfileTab