import React, { useEffect, useState } from 'react'
import Modal from './Modal'
import CustomInput from '../Controls/CustomInput'
import Button from '../Controls/Button'
import axios from 'axios'
import { requestDeleteAccount, requestPasswordReset } from '../../Apis/User'

const DeleteAccountModal = ({ isOpen, setIsOpen, preFilledEmail = '' }) => {
    const [loading, setLoading] = useState(false)
    const [emailSendStatus, setEmailSendStatus] = useState({ success: false, message: '' })
    const [error, setError] = useState('')

    const handleSendEmail = async () => {
        setError('')
        setEmailSendStatus({ success: false, message: '' })
        setLoading(true)

        try {
            const data = await requestDeleteAccount()
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
            label={'Delete Account'}
            subText='We’ll send you a verification link to delete your account.'
            extraFuntion={onClose}
            actions={<>
                <Button label='Cancel' size='medium' variant='outline' action={() => { onClose(); setIsOpen(false) }} />
                <Button
                    type='button'
                    label={'Delete Account'}
                    size='medium'
                    variant='danger'
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
                <p className='text-secondary'>
                    This will delete all your data, including personal information, history, and billing details.
                </p>
            </div>
        </Modal>
    )
}

export default DeleteAccountModal
