import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";

interface DocumentType {
    id?: string;
    name: string;
    description: string;
    category: string;
    requiresExpiration: boolean;
    requiredForBidding: boolean;
}

type DocumentTypeModalProps = {
    onSave?: (data: DocumentType) => void;
};

export type DocumentTypeModalHandle = {
    openModal: (data?: DocumentType) => void;
};

const DocumentTypeModal = forwardRef<DocumentTypeModalHandle, DocumentTypeModalProps>(
    ({ onSave }, ref) => {
        const [modalBox, setModalBox] = useState<boolean>(false);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [isEdit, setIsEdit] = useState<boolean>(false);

        // Form state
        const [id, setId] = useState<string | undefined>(undefined);
        const [name, setName] = useState("");
        const [description, setDescription] = useState("");
        const [category, setCategory] = useState("PREQUALIFICATION");
        const [requiredForBidding, setRequiredForBidding] = useState(false);
        const [requiresExpiration, setRequiresExpiration] = useState(false);

        useImperativeHandle(ref, () => ({
            openModal(data?: DocumentType) {
                if (data) {
                    setIsEdit(true);
                    setId(data.id);
                    setName(data.name);
                    setDescription(data.description);
                    setCategory(data.category || "PREQUALIFICATION");
                    setRequiredForBidding(data.requiredForBidding);
                    setRequiresExpiration(data.requiresExpiration);
                } else {
                    setIsEdit(false);
                    resetForm();
                }
                setModalBox(true);
            },
        }));

        const resetForm = () => {
            setId(undefined);
            setName("");
            setDescription("");
            setCategory("PREQUALIFICATION");
            setRequiredForBidding(false);
            setRequiresExpiration(false);
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            if (!name) {
                toast.error("Document Name is required.");
                return;
            }

            setIsLoading(true);

            const payload: DocumentType = {
                id,
                name,
                description,
                category,
                requiresExpiration,
                requiredForBidding,
            };

            console.log("SAVING DOCUMENT TYPE PAYLOAD:", payload);

            // Simulate API call
            setTimeout(() => {
                toast.success(`Document Type ${isEdit ? 'updated' : 'created'} successfully!`);
                setModalBox(false);
                if (onSave) {
                    onSave(payload);
                }
                setIsLoading(false);
            }, 1000);
        };

        return (
            <Modal
                onHide={() => setModalBox(false)}
                show={modalBox}
                centered
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{isEdit ? 'Edit' : 'Create'} Document Type</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setModalBox(false)}
                        ></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            <div className="mb-3">
                                <label className="form-label text-primary">
                                    Document Name<span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Tax Clearance Certificate"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-primary">
                                    Category<span className="required">*</span>
                                </label>
                                <select
                                    className="form-control default-select"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    required
                                >
                                    <option value="PREQUALIFICATION">PREQUALIFICATION</option>
                                    <option value="TECHNICAL">TECHNICAL</option>
                                    <option value="FINANCIAL">FINANCIAL</option>
                                    <option value="OTHERS">OTHERS</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <Form.Check
                                    type="switch"
                                    id="requiredForBidding"
                                    label="Required for Bidding"
                                    checked={requiredForBidding}
                                    onChange={(e) => setRequiredForBidding(e.target.checked)}
                                />
                            </div>

                            <div className="mb-3">
                                <Form.Check
                                    type="switch"
                                    id="requiresExpiration"
                                    label="Expiration Required"
                                    checked={requiresExpiration}
                                    onChange={(e) => setRequiresExpiration(e.target.checked)}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                type="button"
                                className="btn btn-danger light"
                                onClick={() => setModalBox(false)}
                                disabled={isLoading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                        Saving...
                                    </>
                                ) : (
                                    "Save"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>
        );
    }
);

export default DocumentTypeModal;
