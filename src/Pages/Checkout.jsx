"use client";
import { useState, useEffect } from "react";
import { Elements, useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { toast } from "react-toastify";
import { createSubscription, verifyCoupon } from "../Apis/Subscription";
import { formatDate, formatYear } from "../Utils/GraphUtils";
import { useNavigate } from "react-router-dom";
import { SUBSCRIPTION_PLANS_DATA, VITE_STRIPE_PUBLISHABLE_KEY } from "../Enums/Enums";
import { getUserDetail } from "../Apis/User";
import { setUser } from "../Redux/Slices/UserSlice";
import { useDispatch } from "react-redux";
import { BsArrowLeft, BsChevronExpand, BsDot } from "react-icons/bs";
import { authClient } from './../Services/Axios';
import CustomInput from "../Components/Controls/CustomInput";
import Button from "../Components/Controls/Button";
import { GoDash, GoDotFill } from "react-icons/go";
import { IoArrowBack } from "react-icons/io5";
import PopupMenu from "../Components/Controls/PopupMenu";
import { HiOutlineCreditCard } from "react-icons/hi2";
import CheckoutForm from "../Components/Widgets/CheckoutForm";
import { dispatch } from "../Redux/Store";

const stripePromise = loadStripe(VITE_STRIPE_PUBLISHABLE_KEY);


const Checkout = () => {
  const [clientSecret, setClientSecret] = useState(null);
  const [savedCard, setSavedCard] = useState(null);
  const [eligibleForTrial, setEligibleForTrial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [selectedPlanName, setSelectedPlanName] = useState('');
  const [couponData, setCouponData] = useState({});
  const [cardChangeLoading, setCardChangeLoading] = useState(false);
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const navigate = useNavigate();


  const searchParams = new URLSearchParams(window.location.search);
  const planName = searchParams.get("planName");
  // const paramsCouponCode = searchParams.get("couponCode");

  useEffect(() => {
    checkEligibility();
  }, [])

  const handleCardSaved = (paymentMethod) => {
    setSavedCard(paymentMethod);
    setClientSecret(null);
  };

  useEffect(() => {

    fetchPaymentInfo();
  }, []);

  useEffect(() => {
    if (planName) {
      setSelectedPlanName(planName);
    }
  }, [planName]);

  // useEffect(() => {
  //   if (paramsCouponCode) {
  //     setCouponCode(paramsCouponCode);
  //     handleApplyCoupon(paramsCouponCode);
  //   }
  // }, [paramsCouponCode]);


  const fetchPaymentInfo = async () => {
    try {
      setLoading(true)
      const { data } = await authClient.get("/get/defualt-payment-method");
      setSavedCard(data.paymentMethod.card);
    } catch (err) {
      await handleCardChange()
      setSavedCard(null);
      console.error(err);
    } finally {
      setLoading(false)
    }
  };

  const handleCardChange = async () => {
    try {
      setCardChangeLoading(true)
      const { data } = await authClient.post("/post/create-setup-intent");
      setClientSecret(data.clientSecret);
      setSavedCard(null);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setCardChangeLoading(false)
    }
  };

  const handleApplyCoupon = async (coupon = couponCode) => {
    if (!coupon?.trim()) {
      toast.error("Please enter a coupon code.");
      return;
    }
    setCouponLoading(true);
    try {
      const response = await verifyCoupon({ couponCode: coupon });
      if (response.valid) {
        setCouponData({ valid: true, code: coupon });
      } else {
        setCouponData({ valid: false, code: "" });
      }
      toast.success(response.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setCouponData({ valid: false, code: "" });
    } finally {
      setCouponLoading(false);
    }
  };

  const checkEligibility = async () => {
    try {
      setLoading(true);
      const { data } = await authClient.get("/get/verifyCanSubscribe");
      setEligibleForTrial(data?.eligibleForTrial);
    } catch (error) {
      toast.error(error.response?.data?.error || error.message);
      navigate("/plans", { replace: true });
    } finally {
      setLoading(false);
    }
  }

  const handleSubscribe = async () => {
    if (!selectedPlanName) {
      toast.error("Please select a plan.");
      return;
    }
    if (!savedCard) {
      toast.error("Please add a valid payment method.");
      return;
    }

    try {
      setSubscribeLoading(true);
      await createSubscription({ selectedPlanName, couponCode , eligibleForTrial });
      const data = await getUserDetail();
      dispatch(setUser({
        ...data.user,
        currentSubscription: {
          ...(data.user?.currentSubscription ?? {}),
          status: eligibleForTrial ? "trialing" : "active",
        },
      }));
      navigate("/");
      if (eligibleForTrial) {
        toast.success("Your free trial has started.");
      } else {
        toast.success("Subscribed successfully!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setSubscribeLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-t-secondary border-border rounded-full animate-spin"></div>
        <p className="mt-4 text-lText text-lg font-medium">Preparing your checkout...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#fafafa] min-h-screen flex justify-center items-start py-12 px-6 gap-8">
      <div className="flex gap-10 w-full max-w-[1000px]">

        <div className="w-full relative p-6 bg-white border border-border rounded-lg flex flex-col gap-4 h-max">

          <button
            onClick={() => navigate("/")}
            className="flex items-center justify-end w-max gap-1 pb-2 cursor-pointer text-secondary hover:opacity-75 transition-all"
          >
            <IoArrowBack strokeWidth={4} size={24} />
            <p className="text-[28px]/[28px] font-semibold">Order Summary</p>
          </button>
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Plan:</span>
              <PopupMenu
                data={Object.values(SUBSCRIPTION_PLANS_DATA).map((plan) => ({
                  name: plan.idName,
                  icon: <HiOutlineCreditCard />,
                  action: () => setSelectedPlanName(plan.id),
                  active: plan.id === selectedPlanName,
                }))}
                trigger={
                  <span className="font-medium cursor-pointer text-gray-700 flex bg-border/30 border rounded-lg px-3 py-1 border-border items-center gap-2">
                    {SUBSCRIPTION_PLANS_DATA?.[selectedPlanName]?.idName || "Select a plan"}
                    <BsChevronExpand />
                  </span>
                }
              />

            </div>
            {eligibleForTrial && (
              <div className="flex justify-between">
                <span className="text-gray-600">Free Trial:</span>
                <span className="font-medium text-gray-700">
                  {couponData.valid
                    ? `(${couponData.code}) 30 Days Free Trial`
                    : "14 Days Free Trial"}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span className="text-gray-600">
                {eligibleForTrial ? "Trial Period:" : "Subscription Period:"}
              </span>
              <span className="text-gray-700 text-sm flex items-center gap-2">
                {formatDate(new Date())}, {formatYear(new Date())}
                <GoDash />
                {eligibleForTrial ? (
                  <>
                    {formatDate(
                      new Date(Date.now() + (couponData.valid ? 30 : 14) * 24 * 60 * 60 * 1000)
                    )},{" "}
                    {formatYear(
                      new Date(Date.now() + (couponData.valid ? 30 : 14) * 24 * 60 * 60 * 1000)
                    )}
                  </>
                ) : (
                  <>
                    {formatDate(
                      new Date(
                        Date.now() +
                        (SUBSCRIPTION_PLANS_DATA?.[planName]?.type === "monthly"
                          ? 30 * 24 * 60 * 60 * 1000
                          : 365 * 24 * 60 * 60 * 1000)
                      )
                    )},{" "}
                    {formatYear(
                      new Date(
                        Date.now() +
                        (SUBSCRIPTION_PLANS_DATA?.[planName]?.type === "monthly"
                          ? 30 * 24 * 60 * 60 * 1000
                          : 365 * 24 * 60 * 60 * 1000)
                      )
                    )}
                  </>
                )}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Amount:</span>
              <span className="font-medium text-gray-700">
                {eligibleForTrial ? (
                  <>
                    <span className="line-through text-xs mr-1 text-gray-500">
                      ${SUBSCRIPTION_PLANS_DATA?.[selectedPlanName]?.price?.toFixed(2)}
                    </span>
                    $0.00
                  </>
                ) : (
                  <>${SUBSCRIPTION_PLANS_DATA?.[selectedPlanName]?.price?.toFixed(2)}</>
                )}
              </span>
            </div>

            <CustomInput
              label={''}
              placeholder={'Enter Coupon Code'}
              size="small"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              suffix={<Button
                corner="none"
                variant="secondary"
                label="Apply"
                size="medium"
                loading={couponLoading}
                action={() => handleApplyCoupon()}
              />}
            />
            {eligibleForTrial && (
              <div className="w-full">
                <p className="text-sm text-red-500 bg-red-500/10 w-full p-2 rounded">
                  Note: Actual payment will be automatically charged on{' '}
                  {formatDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000))},{' '}
                  {formatYear(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000))} , when free trial ends
                </p>
              </div>
            )}
          </>
        </div>

        <div className="w-full max-w-[600px] p-4 bg-white rounded-lg border border-border">
          {savedCard ? (
            <div className="p-4 border border-gray-300 rounded-md  flex justify-between">
              <div className="flex flex-col items-start gap-2">
                <div className="flex items-center gap-1 text-gray-700">
                  <img src="https://img.icons8.com/color/48/bank-card-back-side.png" alt="" className="w-[30px]" />
                  {savedCard.brand?.toUpperCase()}
                  <div className="flex items-center !text-[8px] h-full">
                    <GoDotFill /> <GoDotFill /><GoDotFill /><GoDotFill />
                  </div>
                  {savedCard.last4}
                </div>
                <p className="text-gray-600 capitalize">Funding Type: {savedCard.funding}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-gray-700">Exp: {savedCard.exp_month}/{savedCard.exp_year}</p>
                <Button
                  variant="secondary"
                  action={handleCardChange}
                  loading={cardChangeLoading}
                  label="Change Card"
                />
              </div>
            </div>
          ) : null}

          {clientSecret && (
            <Elements
              key={clientSecret}
              stripe={stripePromise}
              options={{ clientSecret, appearance: { theme: "stripe" } }}
            >
              <CheckoutForm clientSecret={clientSecret} handleCardSaved={handleCardSaved} />
            </Elements>
          )}

          {savedCard && (
            <Button
              disabled={cardChangeLoading}
              label="Subscribe Now"
              loading={subscribeLoading}
              action={handleSubscribe}
              variant="secondary"
              size="large"
              className="w-full mt-4"
            />
          )}
        </div>
      </div>
    </div>
  );
};





export default Checkout;
