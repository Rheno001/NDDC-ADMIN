import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "react-bootstrap";

interface BidData {
    id: string;
    tenderReferenceNumber: string;
    title: string;
    description?: string;
    category?: string;
    department?: string;
    estimatedBudget?: number;
    submissionDeadline: string;
    status: string;
}

interface ViewBidModalProps {
    bid?: BidData;
}

export interface ViewBidModalHandle {
    show: () => void;
    hide: () => void;
}

const ViewBidModal = forwardRef<ViewBidModalHandle, ViewBidModalProps>(({ bid }, ref) => {
    const [showModal, setShowModal] = useState(false);

    useImperativeHandle(ref, () => ({
        show: () => setShowModal(true),
        hide: () => setShowModal(false)
    }));

    if (!bid) return null;

    return (
        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">Tender Ref: {bid.tenderReferenceNumber || bid.id}</h5>
                    <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
                <div className="modal-body p-4">
                    <div className="row mb-4">
                        <div className="col-12">
                            <h4 className="text-primary mb-1">{bid.title}</h4>
                            <span className={`badge badge-pill badge-outline-primary mb-3`}>{bid.status}</span>
                        </div>
                    </div>

                    <div className="row mb-3">
                        <div className="col-md-6 mb-3">
                            <label className="form-label font-w600 text-black">Category</label>
                            <p className="mb-0 text-muted">{bid.category || 'N/A'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label font-w600 text-black">Department</label>
                            <p className="mb-0 text-muted">{bid.department || 'N/A'}</p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label font-w600 text-black">Estimated Budget (₦)</label>
                            <p className="mb-0 text-muted">
                                {bid.estimatedBudget ? `₦${bid.estimatedBudget.toLocaleString()}` : "N/A"}
                            </p>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label font-w600 text-black">Submission Deadline</label>
                            <p className="mb-0 text-muted">
                                {bid.submissionDeadline ? new Date(bid.submissionDeadline).toLocaleString() : 'N/A'}
                            </p>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-12">
                            <label className="form-label font-w600 text-black">Description</label>
                            <div className="border p-3 rounded bg-light">
                                <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>
                                    {bid.description || 'No description provided.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="button" className="btn btn-danger light" onClick={() => setShowModal(false)}>
                        Close
                    </button>
                </div>
            </div>
        </Modal>
    );
});

export default ViewBidModal;
