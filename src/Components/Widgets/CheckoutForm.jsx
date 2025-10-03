import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { authClient } from "../../Services/Axios";
import { useState } from "react";
import Button from "../Controls/Button";

const CheckoutForm = ({ clientSecret, handleCardSaved }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);

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
                    // toast.success("Method saved as default!");
                    handleCardSaved(data?.paymentMethod)
                } else {
                    toast.error("Failed to save payment method.");
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
                <PaymentElement className="mb-6" options={{ layout: { type: "tabs" } }} />
                <Button
                    disabled={isProcessing || !stripe || !elements}
                    label={"Subscribe Now"}
                    loading={isProcessing}
                    type="submit"
                    variant="secondary"
                    size="large"
                    className="w-full mt-4"
                />
            </form>
        );
    }

    return <p>Loading payment info...</p>;
};

export default CheckoutForm