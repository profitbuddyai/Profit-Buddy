import { useEffect, useState } from 'react';
import Modal from '../UI/Modal';
import Button from './../Controls/Button';
import { LuMailPlus } from "react-icons/lu";
import CustomInput from '../Controls/CustomInput';
import { MdOutlineMail } from 'react-icons/md';
import { inviteUser, getInvitedUsers, deleteInvite } from './../../Apis/Admin/AddUser';
import { toast } from 'react-toastify';
import { AiOutlineDelete } from "react-icons/ai";

const AdminAddUser = () => {
    const [open, setOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [invitedUsers, setInvitedUsers] = useState([]);

    // ✅ Fetch Invited Users
    useEffect(() => {
        const fetchInvites = async () => {
            try {
                setFetching(true);
                const res = await getInvitedUsers();
                setInvitedUsers(res?.invitations || []);
            } catch (err) {
                toast.error(err.response?.data?.message || "Failed to fetch invited users");
            } finally {
                setFetching(false);
            }
        };
        fetchInvites();
    }, []);

    // ✅ Handle Invite User
    const handleInvite = async () => {
        try {
            if (!email.trim()) {
                setError('Please enter an email address.');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setError('Please enter a valid email address.');
                return;
            }

            setError('');
            setLoading(true);
            const response = await inviteUser({ email });
            toast.success(response?.message);
            setOpen(false);
            setEmail('');

            // 🧩 Add new invite to top
            setInvitedUsers((prev) => [
                {
                    _id: Date.now().toString(),
                    email,
                    status: 'pending',
                    createdAt: new Date(),
                },
                ...prev,
            ]);
        } catch (err) {
            const message = err.response ? err.response.data.message : err.message;
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteInvite = async (inviteId) => {
        if (!inviteId) {
            return toast.error("Invalid coupon ID");
        }

        try {
            setDeleteLoading(true)
            const response = await deleteInvite(inviteId);

            toast.success(response?.message || "Coupon deleted successfully!");

            setInvitedUsers((prev) => prev.filter(invite => invite._id !== inviteId));

        } catch (err) {
            const message = err.response ? err.response.data.message : err.message;
            toast.error(message);
        } finally {
            setDeleteLoading(false)
        }
    };


    return (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 h-max">
            {/* Invite Modal Section */}
            <div className="flex flex-col gap-4 bg-primary border border-border rounded-xl p-4">
                <div className="flex items-end justify-between">
                    <p className="text-2xl text-secondary/80 font-medium">Add User</p>
                </div>

                <div className="flex items-center flex-col justify-center py-6 gap-4 text-lText">
                    Invite your team members to access the workspace.
                    <Button
                        label="Add User Now"
                        variant="secondary"
                        size="medium"
                        icon={<LuMailPlus />}
                        action={() => setOpen(true)}
                    />
                </div>
            </div>

            {/* List of Invited Users */}
            <div className="flex flex-col gap-4 bg-primary border border-border rounded-xl p-4 w-full">
                <p className="text-2xl text-secondary/80 font-medium">
                    Invited Users
                </p>

                {fetching ? (
                    <p className="text-lText text-sm">Loading invitations...</p>
                ) : invitedUsers.length > 0 ? (
                    <div className="flex flex-col gap-2 w-full max-h-[280px] overflow-y-auto customScroll pr-3">
                        {invitedUsers.map((invite) => (
                            <div
                                key={invite._id}
                                className="flex justify-between items-center border border-border rounded-lg p-2 bg-secondary/5"
                            >
                                <div className="flex flex-col">
                                    <span className="text-base font-medium text-secondary">
                                        {invite.email}
                                    </span>
                                    <span className="text-sm text-lText">
                                        {invite.status === 'accepted' ? `Accepted At: ${new Date(invite.acceptedAt).toLocaleDateString()}` : `Sent At: ${new Date(invite.createdAt).toLocaleDateString()}`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`text-sm font-medium px-4 py-1 rounded-full ${invite.status === 'accepted'
                                            ? 'bg-green-500/20 text-green-500'
                                            : invite.status === 'pending'
                                                ? 'bg-yellow-500/20 text-yellow-500'
                                                : 'bg-red-500/20 text-red-500'
                                            }`}
                                    >
                                        {invite.status.charAt(0).toUpperCase() + invite.status.slice(1)}
                                    </span>
                                    <Button icn={<AiOutlineDelete />} disabled={deleteLoading} action={() => handleDeleteInvite(invite?._id)} label='Remove' variant='danger' />
                                    {/* <AiOutlineDelete className="text-lText hover:text-red-500 cursor-pointer" /> */}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-lText text-sm">No invited users yet.</p>
                )}
            </div>

            {/* Invite Modal */}
            <Modal
                isOpen={open}
                setIsOpen={setOpen}
                label="Add User"
                subText="Invite your team member by entering their email below. They’ll receive an invitation to join your workspace — no extra subscription required."
                actions={
                    <>
                        <Button
                            label="Cancel"
                            variant="outline"
                            size="medium"
                            action={() => setOpen(false)}
                        />
                        <Button
                            label="Send Invitation"
                            variant="secondary"
                            loading={loading}
                            size="medium"
                            icon={<LuMailPlus strokeWidth={2.2} />}
                            action={handleInvite}
                        />
                    </>
                }
            >
                <CustomInput
                    prefix={<MdOutlineMail className="mx-3 text-lg" />}
                    placeholder="e.g. abc@example.com"
                    label="Enter User Email"
                    name="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError('');
                    }}
                    error={error}
                />
            </Modal>
        </div>
    );
};

export default AdminAddUser;
