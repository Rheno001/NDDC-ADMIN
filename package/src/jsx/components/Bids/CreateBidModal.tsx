import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";

type CreateBidModalProps = {
    onBidCreated?: () => void;
};

export type CreateBidModalHandle = {
    openModal: () => void;
};

const CreateBidModal = forwardRef<CreateBidModalHandle, CreateBidModalProps>(
    ({ onBidCreated }, ref) => {
        const [modalBox, setModalBox] = useState<boolean>(false);
        const [isLoading, setIsLoading] = useState<boolean>(false);

        // Form state
        const [title, setTitle] = useState("");
        const [description, setDescription] = useState("");
        const [category, setCategory] = useState("WORKS");
        const [estimatedBudget, setEstimatedBudget] = useState("");
        const [submissionDeadline, setSubmissionDeadline] = useState("");
        const [department, setDepartment] = useState("");

        useImperativeHandle(ref, () => ({
            openModal() {
                setModalBox(true);
                resetForm();
            },
        }));

        const resetForm = () => {
            setTitle("");
            setDescription("");
            setCategory("WORKS");
            setEstimatedBudget("");
            setSubmissionDeadline("");
            setDepartment("");
        };

        const handleCreateBid = async (e: React.FormEvent) => {
            e.preventDefault();

            // Basic validation
            if (!title || !description || !category || !estimatedBudget || !submissionDeadline || !department) {
                toast.error("Please fill in all required fields.");
                return;
            }

            const budgetNumber = Number(estimatedBudget);
            if (isNaN(budgetNumber) || budgetNumber <= 0) {
                toast.error("Please enter a valid estimated budget.");
                return;
            }

            setIsLoading(true);

            let formattedDeadline = submissionDeadline;
            // Ensure the format is YYYY-MM-DDTHH:mm:ss for SQL compatibility
            if (submissionDeadline && submissionDeadline.split(':').length === 2) {
                formattedDeadline = `${submissionDeadline}:00`;
            }

            const payload = {
                title,
                description,
                category,
                estimatedBudget: budgetNumber,
                submissionDeadline: formattedDeadline,
                department,
                status: "DRAFT",
            };

            console.log("CREATING BID PAYLOAD:", payload);

            try {
                const response = await fetch('/api/v1/bids', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': import.meta.env.VITE_API_KEY || '',
                        'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    console.error("CREATE BID ERROR RESPONSE:", errorData);
                    throw new Error(errorData.message || 'Failed to create bid');
                }

                const createdData = await response.json().catch(() => ({}));
                console.log("BID CREATION SUCCESSFUL. Status:", response.status, "Data:", JSON.stringify(createdData, null, 2));

                toast.success("Bid created successfully!");
                setModalBox(false);
                if (onBidCreated) {
                    onBidCreated();
                }
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : "Please check console";
                console.error("Error creating bid:", error);
                toast.error(`Failed to create bid: ${errorMessage}`);
            } finally {
                setIsLoading(false);
            }
        };

        return (
            <Modal
                onHide={() => setModalBox(false)}
                show={modalBox}
                centered
                size="lg"
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Create New Bid</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setModalBox(false)}
                        ></button>
                    </div>
                    <form onSubmit={handleCreateBid}>
                        <div className="modal-body p-4">
                            <div className="row">
                                {/* Left Column */}
                                <div className="col-xl-6 col-sm-6">
                                    <div className="mb-3">
                                        <label htmlFor="bidTitle" className="form-label text-primary">
                                            Bid Title<span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="bidTitle"
                                            placeholder="e.g. Office Renovation"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="bidCategory" className="form-label text-primary">
                                            Category<span className="required">*</span>
                                        </label>
                                        <select
                                            className="form-control default-select"
                                            id="bidCategory"
                                            value={category}
                                            onChange={(e) => setCategory(e.target.value)}
                                            required
                                        >
                                            <option value="WORKS">WORKS</option>
                                            <option value="GOODS">GOODS</option>
                                            <option value="SERVICES">SERVICES</option>
                                        </select>
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="bidDepartment" className="form-label text-primary">
                                            Department<span className="required">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="bidDepartment"
                                            placeholder="e.g. IT"
                                            value={department}
                                            onChange={(e) => setDepartment(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="col-xl-6 col-sm-6">
                                    <div className="mb-3">
                                        <label htmlFor="bidBudget" className="form-label text-primary">
                                            Estimated Budget (₦)<span className="required">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            id="bidBudget"
                                            placeholder="10000000"
                                            value={estimatedBudget}
                                            onChange={(e) => setEstimatedBudget(e.target.value)}
                                            min="0"
                                            required
                                        />
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="bidDeadline" className="form-label text-primary">
                                            Submission Deadline<span className="required">*</span>
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            id="bidDeadline"
                                            value={submissionDeadline}
                                            onChange={(e) => setSubmissionDeadline(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Full Width */}
                                <div className="col-xl-12">
                                    <div className="mb-3">
                                        <label htmlFor="bidDescription" className="form-label text-primary">
                                            Description<span className="required">*</span>
                                        </label>
                                        <textarea
                                            className="form-control"
                                            id="bidDescription"
                                            rows={4}
                                            placeholder="Detailed description of the bid..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-danger light"
                                onClick={() => setModalBox(false)}
                                disabled={isLoading}
                            >
                                Close
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Creating...
                                    </>
                                ) : (
                                    "Create Bid"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        );
    }
);

export default CreateBidModal;
