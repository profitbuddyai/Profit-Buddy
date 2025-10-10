"use client";
import { useEffect, useState } from "react";
import { AiOutlineFileText } from "react-icons/ai";
import { CgSpinner } from "react-icons/cg";
import { toast } from "react-toastify";
import { getInvoices } from "../../Apis/Subscription";
import { formatDate, formatTime, formatYear } from "../../Utils/GraphUtils";
import { CiFileOn } from "react-icons/ci";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";

const BillingTab = () => {
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleGetInvoices = async () => {
        try {
            setLoading(true);
            const responce = await getInvoices()
            setInvoices(responce.invoices || []);
        } catch (err) {
            console.error("Error fetching invoices:", err);
            const message = err.response ? err.response.data.message : err.message;
            toast.error(message)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleGetInvoices();
    }, []);

    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-1 gap-4 h-max">
            <div className="flex flex-col gap-4 bg-primary border border-border rounded-xl p-4">
                <p className="text-2xl text-secondary/80 font-medium">Billing History</p>

                {loading ? (
                    <div className="flex items-center justify-center py-10">
                        <CgSpinner className="w-8 h-8 text-accent animate-spin" />
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="text-center py-8 text-lText">
                        No invoices found yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-border text-lText">
                                    <th className="text-left py-3 px-4 font-medium">Invoice ID</th>
                                    <th className="text-left py-3 px-4 font-medium">Amount</th>
                                    <th className="text-left py-3 px-4 font-medium">Currency</th>
                                    <th className="text-left py-3 px-4 font-medium">Status</th>
                                    <th className="text-left py-3 px-4 font-medium">Date</th>
                                    <th className="text-center py-3 px-4 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv) => (
                                    <tr
                                        key={inv.id}
                                        className="border-b border-border hover:bg-lBackground/50 transition-colors"
                                    >
                                        <td className="py-3 px-4 text-secondary/80">{inv.id}</td>
                                        <td className="py-3 px-4 text-lText">
                                            ${inv.amount?.toFixed(2)}
                                        </td>
                                        <td className="py-3 px-4 uppercase text-lText">
                                            {inv.currency}
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`px-3 py-1 text-sm rounded-lg capitalize ${inv.status === "paid"
                                                    ? "bg-accent/10 text-accent"
                                                    : inv.status === "open"
                                                        ? "bg-yellow-500/20 text-yellow-500"
                                                        : "bg-red-500/20 text-red-500"
                                                    }`}
                                            >
                                                {inv.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-lText">
                                            {formatDate(inv.createdAt)}, {formatYear(inv?.createdAt)}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            {inv.hostedInvoiceUrl ? (
                                                <a
                                                    href={inv.hostedInvoiceUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-accent hover:text-accent/70 transition-colors inline-flex items-center gap-1"
                                                >
                                                    <LiaFileInvoiceDollarSolid className="w-4 h-4" /> Invoice
                                                </a>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillingTab;
