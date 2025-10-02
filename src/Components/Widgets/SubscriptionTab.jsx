import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import Button from '../Controls/Button';
import { formatDate, formatYear } from '../../Utils/GraphUtils';
import { SUBSCRIPTION_PLANS_DATA } from '../../Enums/Enums';
import { cancelSubscription } from '../../Apis/Subscription';
import { toast } from 'react-toastify';
import useConfirm from '../../Hooks/useConfirm';
import { useNavigate } from 'react-router-dom';
import { setUserSubscription } from '../../Redux/Slices/UserSlice';
import { TbExternalLink } from 'react-icons/tb';

const SubscriptionTab = () => {
    const { user } = useSelector((state) => state?.user);
    const [remainingDays, setRemainingDays] = useState(0);
    const [cancelPlanLoading, setCancelPlanLoading] = useState(false);
    const { confirm, ConfirmationModal } = useConfirm()

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const subscription = user?.currentSubscription;
    const PlanData = SUBSCRIPTION_PLANS_DATA?.[subscription?.planName]



    useEffect(() => {
        if (subscription?.currentPeriodEnd) {
            const now = new Date();
            const end = new Date(subscription.currentPeriodEnd);
            const diffTime = end.getTime() - now.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setRemainingDays(diffDays > 0 ? diffDays : 0);
        }
    }, [subscription]);

    const handleCancelSubscription = async () => {
        try {
            const ok = await confirm(
                "Cancel Your Subscription?",
                "If you proceed, your current subscription will be canceled and you will need to subscribe again to continue using our services.",
                "No, keep it",
                "Yes, cancel",
                "danger"
            );
            if (!ok) return
            setCancelPlanLoading(true)
            const responce = await cancelSubscription()
            dispatch(setUserSubscription(responce?.subscription))
            toast.success(responce?.message)
        } catch (err) {
            const message = err.response ? err.response.data.message : err.message
            toast.error(message)
        } finally {
            setCancelPlanLoading(false)
        }
    };

    const handleRenewSubscription = (url) => {
        navigate(url)
    };

    const subscriptionStatus = () => {
        if (!subscription) return "No active subscription";
        if (subscription.status === "active") return "Active";
        if (subscription.status === "canceled") return "Canceled";
        return subscription.status;
    };

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-4 h-max">
            <div className="flex flex-col gap-4 bg-primary border border-border rounded-xl p-4">
                <div className='flex justify-between items-center'>
                    <p className="text-2xl text-secondary/80 font-medium ">Subscription</p>
                    <p className="text-sm text-blue-500 cursor-pointer hover:opacity-70 font-medium flex items-center justify-center gap-1" onClick={() => navigate("/plans")}>
                        See all pricing plans
                        <TbExternalLink size={14} />
                    </p>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-base  text-secondary/80">Plan Name</p>
                    <p className="text-base text-lText">{PlanData?.name || "-"}</p>
                </div>

                <div className="flex justify-between items-center">
                    <p className="text-base  text-secondary/80">Status</p>
                    <p className={`text-base  px-3 rounded-full ${subscriptionStatus() === "Active" ? "text-green-500 bg-green-500/20" :
                        subscriptionStatus() === "Canceled" ? "text-red-500 bg-red-500/20" : "text-yellow-500 bg-yellow-500/20"
                        }`}>
                        {subscriptionStatus()}
                    </p>
                </div>

                {subscription?.currentPeriodStart && subscription?.currentPeriodEnd && (
                    <>
                        <div className="flex justify-between items-center">
                            <p className="text-base  text-secondary/80">Start Date</p>
                            <p className="text-base text-lText">{formatDate(subscription?.currentPeriodStart)}, {formatYear(subscription?.currentPeriodStart)}</p>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-base  text-secondary/80">End Date</p>
                            <p className="text-base text-lText">{formatDate(subscription.currentPeriodEnd)}, {formatYear(subscription.currentPeriodEnd)}</p>
                        </div>

                        <div className="flex justify-between items-center">
                            <p className="text-base  text-secondary/80">Remaining Days</p>
                            <p className="text-base text-lText">{remainingDays}</p>
                        </div>
                    </>
                )}

                {subscription && (
                    <div className="flex justify-between items-center">
                        <p className="text-base  text-secondary/80">AI Buddy Quota Used</p>
                        <p className="text-base text-lText">{PlanData?.quotas?.aiChat === -1 ? "Unlimited Access" : `${user?.quotasUsed?.aiChat || 0} / ${PlanData?.quotas?.aiChat || 0}`}</p>
                    </div>
                )}

                <div className="flex gap-2 mt-4">
                    {(subscription?.status === "active" || subscription?.status === "trialing") && (
                        <>
                            <Button
                                corner="small"
                                variant="danger"
                                label="Cancel Subscription"
                                size="medium"
                                action={handleCancelSubscription}
                                loading={cancelPlanLoading}
                            />
                            <Button
                                corner="small"
                                variant="secondary"
                                label="Upgrade Plan"
                                size="medium"
                                action={() => handleRenewSubscription('/plans')}
                            />
                        </>
                    )}
                    {subscription?.status === "canceled" && (
                        <Button
                            corner="small"
                            variant="secondary"
                            label="Renew Subscription"
                            size="medium"
                            action={() => handleRenewSubscription(`/checkout?planName=${PlanData?.id}`)}
                        />
                    )}
                    {!subscription && (
                        <Button
                            corner="small"
                            variant="secondary"
                            label="Upgrade Plan"
                            size="medium"
                            action={() => handleRenewSubscription('/plans')}
                        />
                    )}
                </div>
            </div>
            {ConfirmationModal}
        </div>
    )
}

export default SubscriptionTab;
