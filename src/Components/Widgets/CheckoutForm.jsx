import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authClient } from "../../Services/Axios";
import { useState } from "react";

const CheckoutForm = ({ clientSecret, handleCardSaved, planName, eligibleForTrial }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        setIsProcessing(true);
        try {
            const { error, setupIntent } = await stripe.confirmSetup({
                elements,
                redirect: "if_required",
            });

            if (error) {
                toast.error(`Card setup failed: ${error.message}`);
                return;
            }

            if (setupIntent?.status === "succeeded") {
                const { data } = await authClient.post("/post/set-defualt-payment-method", {
                    paymentMethodId: setupIntent.payment_method,
                });
                if (data.success) {
                    toast.success("Card saved as default!");
                    handleCardSaved(data?.paymentMethod?.card)
                } else {
                    toast.error("Failed to set default card.");
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    if (clientSecret) {
        return (
            <form onSubmit={handleSubmit}>
                <PaymentElement className="mb-6" />
                <button
                    type="submit"
                    disabled={isProcessing || !stripe || !elements}
                    className="w-full py-3 bg-black cursor-pointer text-white text-lg font-semibold rounded-md"
                >
                    {isProcessing ? "Processing Card..." : "Proceed To Pay"}
                </button>
            </form>
        );
    }

    return <p>Loading payment info...</p>;
};

export default CheckoutForm