import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import CustomInput from '../Controls/CustomInput'
import Button from '../Controls/Button'
import axios from 'axios'
import { requestPasswordReset } from '../../Apis/User'

const ResetPasswordModal = ({ isOpen, setIsOpen, preFilledEmail = null }) => {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [emailSendStatus, setEmailSendStatus] = useState({ success: false, message: '' })
    const [error, setError] = useState('')

    const handleSendEmail = async () => {
        if (!email) {
            setError("Email is required")
            return
        }

        setError('')
        setEmailSendStatus({ success: false, message: '' })
        setLoading(true)

        try {
            const data = await requestPasswordReset({ email })
            setEmailSendStatus({ success: true, message: data?.message })
        } catch (err) {
            console.error(err);
            const message = err.response ? err.response.data.message : err.message
            setEmailSendStatus({ success: false, message })
        } finally {
            setLoading(false)
        }
    }

    const onClose = () => {
        setEmailSendStatus({ success: false, message: '' })
        setError('')
    }

    useEffect(() => {
        if (preFilledEmail) {
            setEmail(preFilledEmail)
        }
    }, [preFilledEmail])

    return (
        <Modal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            label={preFilledEmail ? 'Change Password' : ' Reset Password'}
            subText='We’ll send you a link to reset your password.'
            extraFuntion={onClose}
            actions={<>
                <Button label='Cancel' size='medium' variant='outline' action={() => { onClose(); setIsOpen(false) }} />
                <Button
                    type='button'
                    label={'Send Reset Link'}
                    size='medium'
                    variant='secondary'
                    loading={loading}
                    action={handleSendEmail}
                />
            </>}
        >
            <div className='flex flex-col gap-3'>
                {emailSendStatus?.message && (
                    <div className={`flex flex-col gap-4 text-sm  py-2 px-4 rounded-lg font-normal ${emailSendStatus?.success ? 'bg-green-100 text-green-500' : 'bg-red-100 text-red-500'} `}>
                        {emailSendStatus?.message}
                    </div>
                )}
                <CustomInput
                    name="email"
                    value={email}
                    disabled={!!preFilledEmail}
                    onChange={(e) => { setError(''); setEmail(e.target.value) }}
                    placeholder="e.g. abc@example.com"
                    label="Email"
                    inputClassName="!rounded-xl"
                    error={error}
                />
            </div>
        </Modal>
    )
}

export default ResetPasswordModal
