import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { apiFetch } from "../../../utils/api";

interface BidDetailsData {
    id: string;
    tenderReferenceNumber: string;
    title: string;
    description: string;
    category: string;
    department: string;
    estimatedBudget: number;
    submissionDeadline: string;
    status: string;
    prequalificationDocuments?: DocumentType[];
    instructionDocumentUrl?: string;
    instructionDocumentName?: string;
}

interface DocumentType {
    id: string;
    name: string;
}

const BidDetails = () => {
    const { id } = useParams<{ id: string }>();
    const location = useLocation();

    // States
    const [bid, setBid] = useState<BidDetailsData | null>(location.state?.bid || null);
    const [isLoading, setIsLoading] = useState(!location.state?.bid);
    const [docTypes, setDocTypes] = useState<DocumentType[]>([]);

    // Modal States
    const [showDocModal, setShowDocModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showFileModal, setShowFileModal] = useState(false);

    // Temp Selection State for Doc Modal
    const [tempSelectedDocs, setTempSelectedDocs] = useState<string[]>([]);

    // Info Edit State
    const [editInfo, setEditInfo] = useState<Partial<BidDetailsData>>({});

    // File State
    const [instructionFile, setInstructionFile] = useState<File | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const fetchBidDetails = useCallback(async () => {
        if (!location.state?.bid) setIsLoading(true);
        try {
            const response = await apiFetch(`/api/v1/bids/${id}`);
            if (response.ok) {
                const result = await response.json();
                const data = result.data || result;
                setBid(data);
                setTempSelectedDocs(data.prequalificationDocuments?.map((d: any) => d.id) || []);
            } else {
                toast.error("Failed to fetch bid details");
            }
        } catch (error) {
            console.error("Error fetching bid details:", error);
            toast.error("An error occurred while fetching bid details");
        } finally {
            setIsLoading(false);
        }
    }, [id, location.state?.bid]);

    const fetchDocumentTypes = useCallback(async () => {
        try {
            const response = await apiFetch("/api/v1/document-types");
            if (response.ok) {
                const result = await response.json();
                setDocTypes(result.data?.content || result.data || result);
            }
        } catch (error) {
            console.error("Error fetching document types:", error);
        }
    }, []);

    useEffect(() => {
        fetchBidDetails();
        fetchDocumentTypes();
    }, [fetchBidDetails, fetchDocumentTypes]);

    // Handlers
    const handleDocModalShow = () => {
        setTempSelectedDocs(bid?.prequalificationDocuments?.map(d => d.id) || []);
        setShowDocModal(true);
    };

    const handleInfoModalShow = () => {
        if (bid) {
            setEditInfo({
                title: bid.title,
                description: bid.description,
                category: bid.category,
                estimatedBudget: bid.estimatedBudget,
                submissionDeadline: bid.submissionDeadline,
                department: bid.department
            });
        }
        setShowInfoModal(true);
    };

    const handleSaveDocuments = async () => {
        setIsSaving(true);
        try {
            const response = await apiFetch(`/api/v1/bids/${id}/prequalification-documents`, {
                method: "POST",
                body: JSON.stringify({ documentTypeIds: tempSelectedDocs })
            });

            if (response.ok) {
                toast.success("Prequalification documents updated successfully");
                setShowDocModal(false);
                fetchBidDetails();
            } else {
                toast.error("Failed to update documents");
            }
        } catch (error) {
            console.error("Error saving bid documents:", error);
            toast.error("An error occurred while saving documents");
        } finally {
            setIsSaving(false);
        }
    };

    const handleSaveInfo = async () => {
        setIsSaving(true);
        try {
            const response = await apiFetch(`/api/v1/bids/${id}`, {
                method: "PUT",
                body: JSON.stringify(editInfo)
            });

            if (response.ok) {
                toast.success("Bid information updated successfully");
                setShowInfoModal(false);
                fetchBidDetails();
            } else {
                toast.error("Failed to update bid information");
            }
        } catch (error) {
            console.error("Error saving bid info:", error);
            toast.error("An error occurred while saving information");
        } finally {
            setIsSaving(false);
        }
    };

    const handleFileUpload = async () => {
        if (!instructionFile) return;
        setIsSaving(true);
        const formData = new FormData();
        formData.append("file", instructionFile);

        try {
            const response = await apiFetch(`/api/v1/bids/${id}/instruction-document`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                toast.success("Instruction document uploaded successfully");
                setShowFileModal(false);
                setInstructionFile(null);
                fetchBidDetails();
            } else {
                toast.error("Failed to upload instruction document");
            }
        } catch (error) {
            console.error("Error uploading file:", error);
            toast.error("An error occurred during file upload");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading && !bid) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    if (!bid) {
        return <div className="alert alert-danger">Bid not found</div>;
    }

    return (
        <>
            <div className="page-titles">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/bids">Bids</Link></li>
                    <li className="breadcrumb-item active"><Link to="#">Bid Details</Link></li>
                </ol>
            </div>

            <div className="row">
                <div className="col-xl-12">
                    <div className="card">
                        <div className="card-header d-sm-flex d-block border-0 pb-0">
                            <div className="me-auto mb-sm-0 mb-3">
                                <h4 className="card-title mb-1">Bid: <span className="text-primary">{bid.title}</span></h4>
                                <p className="mb-0 fs-13">Ref Number: {bid.tenderReferenceNumber || bid.id}</p>
                            </div>
                            <div className="d-flex align-items-center">
                                <button className="btn btn-primary btn-rounded btn-sm" onClick={handleInfoModalShow}>
                                    <i className="fa fa-edit me-2"></i>Edit General Info
                                </button>
                            </div>
                        </div>
                        <div className="card-body">
                            {/* General Info Row */}
                            <div className="row mb-4">
                                <div className="col-md-3 col-sm-6 mb-3">
                                    <div className="p-3 border rounded text-center h-100 bg-light-soft">
                                        <h6 className="text-primary mb-1">Category</h6>
                                        <span className="badge badge-primary light">{bid.category}</span>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 mb-3">
                                    <div className="p-3 border rounded text-center h-100 bg-light-soft">
                                        <h6 className="text-primary mb-1">Department</h6>
                                        <p className="mb-0 font-w600">{bid.department}</p>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 mb-3">
                                    <div className="p-3 border rounded text-center h-100 bg-light-soft">
                                        <h6 className="text-primary mb-1">Budget</h6>
                                        <p className="mb-0 font-w600 text-success">₦{bid.estimatedBudget?.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="col-md-3 col-sm-6 mb-3">
                                    <div className="p-3 border rounded text-center h-100 bg-light-soft">
                                        <h6 className="text-primary mb-1">Deadline</h6>
                                        <p className="mb-0 font-w600">{new Date(bid.submissionDeadline).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h5 className="text-black font-w600 d-flex align-items-center">
                                    Description
                                </h5>
                                <div className="border p-3 rounded bg-light">
                                    <p className="mb-0 text-muted" style={{ whiteSpace: 'pre-wrap' }}>{bid.description}</p>
                                </div>
                            </div>

                            <hr />

                            {/* Prequalification Documents Section */}
                            <div className="mt-4">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h5 className="text-black font-w600 mb-0">Required Prequalification Documents</h5>
                                    {bid.prequalificationDocuments && bid.prequalificationDocuments.length > 0 ? (
                                        <button className="btn btn-outline-primary btn-xxs shadow-none" onClick={handleDocModalShow}>
                                            <i className="fa fa-edit me-1"></i> Edit
                                        </button>
                                    ) : (
                                        <button className="btn btn-primary btn-rounded btn-xxs" onClick={handleDocModalShow}>
                                            <i className="fa fa-plus me-1"></i> Add
                                        </button>
                                    )}
                                </div>
                                <div className="row">
                                    {bid.prequalificationDocuments && bid.prequalificationDocuments.length > 0 ? (
                                        bid.prequalificationDocuments.map((doc) => (
                                            <div key={doc.id} className="col-md-4 mb-2">
                                                <div className="d-flex align-items-center p-2 border rounded bg-white shadow-sm">
                                                    <div className="icon-box icon-box-sm bg-primary-light me-2 rounded">
                                                        <i className="fa fa-file-text-o text-primary"></i>
                                                    </div>
                                                    <span className="fs-14 fw-semi-bold">{doc.name}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12">
                                            <div className="p-4 border border-dashed rounded text-center bg-light">
                                                <i className="fa fa-folder-open-o fs-30 text-muted mb-2"></i>
                                                <p className="text-muted mb-0">No documents selected for this bid yet.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr className="my-4" />

                            {/* Instruction Document Section */}
                            <div className="mt-4">
                                <div className="d-flex align-items-center justify-content-between mb-3">
                                    <h5 className="text-black font-w600 mb-0">Bid Instruction Document</h5>
                                    {bid.instructionDocumentUrl ? (
                                        <button className="btn btn-outline-primary btn-xxs shadow-none" onClick={() => setShowFileModal(true)}>
                                            <i className="fa fa-refresh me-1"></i> Replace
                                        </button>
                                    ) : (
                                        <button className="btn btn-primary btn-rounded btn-xxs" onClick={() => setShowFileModal(true)}>
                                            <i className="fa fa-upload me-1"></i> Upload
                                        </button>
                                    )}
                                </div>
                                {bid.instructionDocumentUrl ? (
                                    <div className="p-3 border rounded bg-white shadow-sm d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <div className="icon-box bg-success-light me-3 rounded">
                                                <i className="fa fa-file-pdf-o text-success"></i>
                                            </div>
                                            <div>
                                                <h6 className="mb-0">{bid.instructionDocumentName || "Instruction Document"}</h6>
                                                <a href={bid.instructionDocumentUrl} target="_blank" rel="noreferrer" className="fs-12 text-primary">View Current File</a>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 border border-dashed rounded text-center bg-light">
                                        <i className="fa fa-cloud-upload fs-30 text-muted mb-2"></i>
                                        <p className="text-muted mb-0">No instruction document uploaded yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODALS */}

            {/* Doc Selection Modal */}
            <Modal show={showDocModal} onHide={() => setShowDocModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="text-black fw-bold">Select Prequalification Documents</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className="text-muted fs-14 mb-4">Choose the document types that vendors must submit to qualify for this bid.</p>
                    <div className="row g-3" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {docTypes.map(doc => (
                            <div key={doc.id} className="col-md-6">
                                <div className={`p-3 border rounded cursor-pointer d-flex align-items-center ${tempSelectedDocs.includes(doc.id) ? 'border-primary bg-primary-light' : ''}`}
                                    onClick={() => {
                                        setTempSelectedDocs(prev =>
                                            prev.includes(doc.id) ? prev.filter(i => i !== doc.id) : [...prev, doc.id]
                                        );
                                    }}
                                >
                                    <div className="form-check custom-checkbox checkbox-primary mb-0">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            checked={tempSelectedDocs.includes(doc.id)}
                                            readOnly
                                        />
                                        <label className="form-check-label text-black ms-2 mb-0" style={{ cursor: 'pointer' }}>
                                            {doc.name}
                                        </label>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <button className="btn btn-danger light btn-rounded" onClick={() => setShowDocModal(false)}>Cancel</button>
                    <button className="btn btn-primary btn-rounded" onClick={handleSaveDocuments} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Selection"}
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Bid Info Edit Modal */}
            <Modal show={showInfoModal} onHide={() => setShowInfoModal(false)} centered size="lg">
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="text-black fw-bold">Edit Bid Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="row">
                        <div className="col-12 mb-3">
                            <label className="form-label text-primary">Bid Title</label>
                            <input type="text" className="form-control" value={editInfo.title || ''}
                                onChange={(e) => setEditInfo({ ...editInfo, title: e.target.value })} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-primary">Category</label>
                            <select className="form-control default-select" value={editInfo.category}
                                onChange={(e) => setEditInfo({ ...editInfo, category: e.target.value })}>
                                <option value="WORKS">WORKS</option>
                                <option value="GOODS">GOODS</option>
                                <option value="SERVICES">SERVICES</option>
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-primary">Department</label>
                            <input type="text" className="form-control" value={editInfo.department || ''}
                                onChange={(e) => setEditInfo({ ...editInfo, department: e.target.value })} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-primary">Estimated Budget (₦)</label>
                            <input type="number" className="form-control" value={editInfo.estimatedBudget || 0}
                                onChange={(e) => setEditInfo({ ...editInfo, estimatedBudget: Number(e.target.value) })} />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-primary">Submission Deadline</label>
                            <input type="datetime-local" className="form-control"
                                value={editInfo.submissionDeadline ? editInfo.submissionDeadline.slice(0, 16) : ''}
                                onChange={(e) => setEditInfo({ ...editInfo, submissionDeadline: e.target.value })} />
                        </div>
                        <div className="col-12 mb-3">
                            <label className="form-label text-primary">Description</label>
                            <textarea className="form-control" rows={4} value={editInfo.description || ''}
                                onChange={(e) => setEditInfo({ ...editInfo, description: e.target.value })}></textarea>
                        </div>
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <button className="btn btn-danger light btn-rounded" onClick={() => setShowInfoModal(false)}>Cancel</button>
                    <button className="btn btn-primary btn-rounded" onClick={handleSaveInfo} disabled={isSaving}>
                        {isSaving ? "Saving..." : "Submit"}
                    </button>
                </Modal.Footer>
            </Modal>

            {/* File Upload Modal */}
            <Modal show={showFileModal} onHide={() => setShowFileModal(false)} centered>
                <Modal.Header closeButton className="border-0">
                    <Modal.Title className="text-black fw-bold">Upload Instruction Document</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="p-4 border border-dashed rounded text-center bg-light">
                        <label className="d-block cursor-pointer">
                            <i className="fa fa-cloud-upload fs-40 text-primary mb-3"></i>
                            <h6 className="mb-2">Choose file or drag here</h6>
                            <p className="fs-12 text-muted">PDF or DOCX (Max 10MB)</p>
                            <input type="file" className="d-none" onChange={(e) => setInstructionFile(e.target.files ? e.target.files[0] : null)} />
                        </label>
                        {instructionFile && (
                            <div className="mt-3 p-2 bg-white rounded border d-flex align-items-center justify-content-between">
                                <span className="text-primary fs-13 truncate">{instructionFile.name}</span>
                                <i className="fa fa-times text-danger cursor-pointer" onClick={() => setInstructionFile(null)}></i>
                            </div>
                        )}
                    </div>
                </Modal.Body>
                <Modal.Footer className="border-0">
                    <button className="btn btn-danger light btn-rounded" onClick={() => setShowFileModal(false)}>Cancel</button>
                    <button className="btn btn-primary btn-rounded" onClick={handleFileUpload} disabled={!instructionFile || isSaving}>
                        {isSaving ? "Uploading..." : "Upload File"}
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default BidDetails;
