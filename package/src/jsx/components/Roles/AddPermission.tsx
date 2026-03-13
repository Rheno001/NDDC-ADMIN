import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

interface PermissionFormData {
    name: string;
    label: string;
    description: string;
}

const AddPermission = () => {
    const [formData, setFormData] = useState<PermissionFormData>({
        name: "",
        label: "",
        description: "",
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.label.trim()) {
            Swal.fire({
                title: "Required!",
                text: "Name and Label are required.",
                icon: "warning",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        setIsLoading(true);
        try {
            const payload = {
                name: formData.name.trim(),
                label: formData.label.trim(),
                description: formData.description.trim(),
            };

            const response = await fetch("/api/v1/permissions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": import.meta.env.VITE_API_KEY || "",
                    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const raw = await response.text();
                console.error("Submission failed status:", response.status);
                console.error("Submission failed body:", raw);
                let message = "Failed to create permission";
                try {
                    const parsed = JSON.parse(raw);
                    message = parsed?.message || parsed?.error || message;
                } catch {
                    message = raw || message;
                }
                throw new Error(message);
            }

            Swal.fire({
                title: "Success!",
                text: "Permission created successfully.",
                icon: "success",
                confirmButtonColor: "#3085d6",
            });
            navigate("/permissions");
        } catch (error: any) {
            console.error("Error creating permission:", error);
            Swal.fire({
                title: "Error!",
                text: error.message || "Failed to create permission.",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="row">
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-header border-0 pb-0">
                        <h4 className="heading mb-0">Create New Permission</h4>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-xl-6 col-md-6 mb-3">
                                    <label className="form-label font-w600 text-black">Permission Name (System Name)<span className="text-danger ms-1">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. VENDOR_CREATE"
                                        disabled={isLoading}
                                    />
                                    <small className="text-muted">This is the unique identifier used by the system.</small>
                                </div>
                                <div className="col-xl-6 col-md-6 mb-3">
                                    <label className="form-label font-w600 text-black">Display Label<span className="text-danger ms-1">*</span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="label"
                                        value={formData.label}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Create Vendor"
                                        disabled={isLoading}
                                    />
                                    <small className="text-muted">Human-readable name shown in UI.</small>
                                </div>
                                <div className="col-xl-12 mb-3">
                                    <label className="form-label font-w600 text-black">Description</label>
                                    <textarea
                                        className="form-control"
                                        rows={3}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Describe what this permission allows..."
                                        disabled={isLoading}
                                    ></textarea>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-outline-primary me-2"
                                onClick={() => navigate("/permissions")}
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
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                ) : null}
                                Create Permission
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddPermission;
