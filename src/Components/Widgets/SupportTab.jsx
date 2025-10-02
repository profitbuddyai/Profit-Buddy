import React, { useState } from "react";
import { useSelector } from "react-redux";
import CustomInput from "../Controls/CustomInput";
import Button from "../Controls/Button";
import { SUBSCRIPTION_PLANS_DATA } from "../../Enums/Enums";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { submitSupportQuery } from './../../Apis/Support';

const SupportTab = () => {
    const { user } = useSelector((state) => state?.user);
    const navigate = useNavigate();

    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(false);

    // Check plan access
    const hasSupportAccess = user?.currentSubscription?.planName
        ? SUBSCRIPTION_PLANS_DATA[user.currentSubscription.planName]?.quotas?.supportAccess
        : false;

    const validateForm = () => {
        if (!query.trim()) {
            toast.error("Please enter your query");
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm() ||  loading) return;
        try {
            setLoading(true);
            await submitSupportQuery(query)

            toast.success("Your query has been submitted!");
            setQuery("");
        } catch (err) {
            const message = err.response ? err.response.data.message : err.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-4 h-max relative">
            <div className="flex flex-col gap-4 bg-primary border border-border rounded-xl p-4">
                <p className="text-2xl text-secondary/80 font-medium">Support</p>
                {/* {hasSupportAccess && ( */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <CustomInput
                            label="Email"
                            placeholder="e.g. johndoe@email.com"
                            size="large"
                            value={user?.email}
                            onChange={(e) => { }}
                            disabled={true}
                        />

                        <div className="flex flex-col gap-2">
                            <label className="text-base font-medium text-secondary/80">
                                Your Query
                            </label>
                            <textarea
                                rows={5}
                                className="w-full rounded-lg border border-border bg-primary text-lText p-2 focus:outline-none focus:ring-2 focus:ring-secondary/40"
                                placeholder="Describe your issue or question here..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                        </div>

                        <Button
                            corner="small"
                            variant="secondary"
                            label="Submit Query"
                            size="large"
                            loading={loading}
                            disabled={!query.trim()}
                            type="submit"
                        />
                    </form>
                {/* )} */}
            </div>

            {/* {!hasSupportAccess && (
                <div className="absolute inset-0 flex flex-col items-center justify-center h-[400px] border border-border bg-primary/5 backdrop-blur-2xl rounded-xl gap-5">
                    <p className="text-xl capitalize text-secondary/80 text-center font-semibold">
                        Support feature is only available for Business plan users.
                    </p>
                    <Button
                        label="Upgrade Plan"
                        variant="secondary"
                        size="large"
                        action={() => navigate("/plans")}
                    />
                </div>
            )} */}
        </div>
    );
};

export default SupportTab;
