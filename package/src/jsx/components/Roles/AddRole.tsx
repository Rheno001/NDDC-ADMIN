import { useState, useEffect, useCallback, ChangeEvent, FormEvent, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

interface Permission {
    id: string;
    name: string;
    label?: string;
    description: string;
    group?: string[];
}

interface RoleFormData {
    name: string;
    description: string;
    permissionIds: string[];
}

const AddRole = () => {
    const [formData, setFormData] = useState<RoleFormData>({
        name: "",
        description: "",
        permissionIds: [],
    });
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [roleId, setRoleId] = useState<string | null>(null);

    const navigate = useNavigate();
    const location = useLocation();

    const fetchPermissions = useCallback(async () => {
        try {
            const response = await fetch(
                "/api/v1/permissions?page=0&size=1000&groupType=ALL",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": import.meta.env.VITE_API_KEY || "",
                        Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                    },
                }
            );

            if (!response.ok) throw new Error("Failed to fetch permissions");

            const result = await response.json();
            const raw =
                result.data?.content ||
                result.data?.data?.content ||
                result.data?.data ||
                result.data ||
                result;
            setPermissions(Array.isArray(raw) ? raw : []);
        } catch (error) {
            console.error("Error fetching permissions:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to load permissions list.",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
        }
    }, []);

    const fetchRoleDetails = useCallback(async (id: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/v1/roles/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": import.meta.env.VITE_API_KEY || "",
                    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                },
            });

            if (!response.ok) throw new Error("Failed to fetch role details");

            const result = await response.json();
            const role = result.data || result;

            setFormData({
                name: role.name || "",
                description: role.description || "",
                permissionIds: Array.isArray(role.permissions)
                    ? role.permissions.map((p: any) =>
                        String(p.id ?? p._id ?? p)
                    )
                    : [],
            });
        } catch (error) {
            console.error("Error fetching role:", error);
            Swal.fire({
                title: "Error!",
                text: "Failed to load role details for editing.",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPermissions();
        const id = location.state?.roleId;
        if (id) {
            setIsEditMode(true);
            setRoleId(id);
            fetchRoleDetails(id);
        }
    }, [location.state?.roleId, fetchPermissions, fetchRoleDetails]);

    const handleInputChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePermissionToggle = (id: string) => {
        setFormData((prev) => {
            const isSelected = prev.permissionIds.includes(id);
            return {
                ...prev,
                permissionIds: isSelected
                    ? prev.permissionIds.filter((p) => p !== id)
                    : [...prev.permissionIds, id],
            };
        });
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            Swal.fire({
                title: "Required!",
                text: "Role Name is required.",
                icon: "warning",
                confirmButtonColor: "#3085d6",
            });
            return;
        }
        if (formData.permissionIds.length === 0) {
            Swal.fire({
                title: "Required!",
                text: "You must assign at least one permission.",
                icon: "warning",
                confirmButtonColor: "#3085d6",
            });
            return;
        }

        setIsLoading(true);
        try {
            const url = isEditMode
                ? `/api/v1/roles/${roleId}`
                : "/api/v1/roles";
            const method = isEditMode ? "PUT" : "POST";

            // API expects: { name, description, permissions: [id, id...] }
            // IDs are sent as strings (matching RolesPermissions.tsx reference implementation)
            const payload = {
                name: formData.name,
                description: formData.description,
                permissions: formData.permissionIds.map(id => Number(id)),
            };

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": import.meta.env.VITE_API_KEY || "",
                    Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const raw = await response.text();
                let message = "Failed to save role";
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
                text: isEditMode
                    ? "Role updated successfully."
                    : "Role created successfully.",
                icon: "success",
                confirmButtonColor: "#3085d6",
            });
            navigate("/roles");
        } catch (error: any) {
            console.error("Error saving role:", error);
            Swal.fire({
                title: "Error!",
                text: error.message || "Failed to save role.",
                icon: "error",
                confirmButtonColor: "#3085d6",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Group permissions by group[0] field (matching RolesPermissions.tsx)
    const groupedPermissions = useMemo(() => {
        return permissions.reduce((acc: Record<string, Permission[]>, p) => {
            const cat =
                p.group && p.group.length > 0
                    ? p.group[0]
                    : "General Permissions";
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(p);
            return acc;
        }, {});
    }, [permissions]);

    return (
        <div className="row">
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-header border-0 pb-0">
                        <h4 className="heading mb-0">
                            {isEditMode ? "Edit Role" : "Create New Role"}
                        </h4>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-xl-6 col-md-6 mb-3">
                                    <label className="form-label font-w600 text-black">
                                        Role Name
                                        <span className="text-danger ms-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Administrator"
                                        disabled={isLoading}
                                    />
                                </div>
                                <div className="col-xl-6 col-md-6 mb-3">
                                    <label className="form-label font-w600 text-black">
                                        Description
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        placeholder="Brief description of this role"
                                        disabled={isLoading}
                                    />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col-xl-12">
                                    <h5 className="mb-3 font-w600">
                                        Assign Permissions
                                        <span className="ms-2 text-muted fs-6 fw-normal">
                                            ({formData.permissionIds.length} selected)
                                        </span>
                                    </h5>
                                    <div
                                        className="permission-container p-3 border rounded"
                                        style={{ maxHeight: "400px", overflowY: "auto" }}
                                    >
                                        {Object.keys(groupedPermissions).length === 0 ? (
                                            <div className="text-center p-3 text-muted">
                                                No permissions available to assign.
                                            </div>
                                        ) : (
                                            Object.entries(groupedPermissions).map(
                                                ([category, items]) => (
                                                    <div key={category} className="mb-4">
                                                        <h6 className="text-primary font-w600 mb-2 border-bottom pb-1 text-uppercase">
                                                            {category}
                                                        </h6>
                                                        <div className="row">
                                                            {items.map((permission) => (
                                                                <div
                                                                    key={permission.id}
                                                                    className="col-xl-3 col-lg-4 col-md-6 mb-2"
                                                                >
                                                                    <div className="form-check custom-checkbox checkbox-primary">
                                                                        <input
                                                                            type="checkbox"
                                                                            className="form-check-input"
                                                                            id={`perm-${permission.id}`}
                                                                            checked={formData.permissionIds.includes(
                                                                                String(permission.id)
                                                                            )}
                                                                            onChange={() =>
                                                                                handlePermissionToggle(
                                                                                    String(permission.id)
                                                                                )
                                                                            }
                                                                            disabled={isLoading}
                                                                        />
                                                                        <label
                                                                            className="form-check-label ms-2"
                                                                            htmlFor={`perm-${permission.id}`}
                                                                        >
                                                                            <span className="text-black font-w500">
                                                                                {permission.label || permission.name}
                                                                            </span>
                                                                            <small className="d-block text-muted">
                                                                                {permission.description}
                                                                            </small>
                                                                        </label>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-end">
                            <button
                                type="button"
                                className="btn btn-outline-primary me-2"
                                onClick={() => navigate("/roles")}
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
                                    <span
                                        className="spinner-border spinner-border-sm me-2"
                                        role="status"
                                        aria-hidden="true"
                                    ></span>
                                ) : null}
                                {isEditMode ? "Update Role" : "Create Role"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddRole;