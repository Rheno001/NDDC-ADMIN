import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";

interface VendorFormData {
  companyName: string;
  rcNumber: string;
  tinNumber: string;
  email: string;
  phoneNumber: string;
  companyAddress: string;
  websiteAddress: string;
  firstName: string;
  lastName: string;
  contactEmail: string;
  contactPhoneNumber: string;
  contactAddress: string;
}

type FormErrors = Partial<Record<keyof VendorFormData, string>>;

const AddNewVendor = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<VendorFormData>({
    companyName: "",
    rcNumber: "",
    tinNumber: "",
    email: "",
    phoneNumber: "",
    companyAddress: "",
    websiteAddress: "",
    firstName: "",
    lastName: "",
    contactEmail: "",
    contactPhoneNumber: "",
    contactAddress: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const location = useLocation();
  const vendorId = location.state?.vendorId;

  useEffect(() => {
    if (vendorId) {
      setIsEditMode(true);
      const fetchVendor = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`/api/v1/vendors/${vendorId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "x-api-key": import.meta.env.VITE_API_KEY || "",
              Authorization: `Bearer ${sessionStorage.getItem("accessToken")}`,
            },
          });

          if (!response.ok) throw new Error("Failed to fetch vendor data");
          const res = await response.json();
          const v = res.data || res;
          const vc = v.vendorContact || {};

          setFormData({
            companyName: v.companyName || "",
            rcNumber: v.rcNumber || "",
            tinNumber: v.tinNumber || "",
            email: v.email || "",
            phoneNumber: v.phoneNumber || "",
            companyAddress: v.companyAddress || "",
            websiteAddress: v.websiteAddress || "",
            firstName: vc.firstName || "",
            lastName: vc.lastName || "",
            contactEmail: vc.email || "",
            contactPhoneNumber: vc.phoneNumber || "",
            contactAddress: vc.address || "",
          });
        } catch (error) {
          console.error("Error fetching vendor:", error);
          toast.error("Failed to load vendor data for editing.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchVendor();
    }
  }, [vendorId]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // Enforce "RC-" prefix
    if (name === "rcNumber") {
      if (value === "") {
        newValue = "";
      } else {
        const stripped = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        const digits = stripped.replace(/^R?C?/, "");
        newValue = "RC-" + digits.replace(/^-?/, "");
        // Keep raw if it already starts correctly
        if (value.toUpperCase().startsWith("RC-")) {
          newValue = "RC-" + value.slice(3).replace(/[^0-9]/g, "");
        }
      }
    }

    // Enforce "TIN-" prefix
    if (name === "tinNumber") {
      if (value === "") {
        newValue = "";
      } else if (value.toUpperCase().startsWith("TIN-")) {
        newValue = "TIN-" + value.slice(4).replace(/[^0-9]/g, "");
      } else {
        newValue = "TIN-" + value.replace(/[^0-9]/g, "");
      }
    }

    // Auto-format Nigerian phone numbers to international format
    if (name === "phoneNumber" || name === "contactPhoneNumber") {
      const digits = newValue.replace(/\D/g, "");
      if (digits.startsWith("0") && digits.length === 11) {
        newValue = "+234" + digits.slice(1);
      } else if (digits.startsWith("234") && digits.length === 13) {
        newValue = "+" + digits;
      }
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name as keyof VendorFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};

    if (!formData.companyName.trim()) e.companyName = "Legal Name is required.";

    // RC: RC- followed by digits (6–9 digits to be flexible)
    const rcPattern = /^RC-\d{6,9}$/i;
    if (!formData.rcNumber.trim()) {
      e.rcNumber = "RC Number is required.";
    } else if (!rcPattern.test(formData.rcNumber.trim())) {
      e.rcNumber = "Invalid format. Must be RC- followed by 6–9 digits (e.g. RC-1457809).";
    }

    // TIN: TIN- followed by 9–13 digits (flexible to match real-world values)
    const tinPattern = /^TIN-\d{9,13}$/i;
    if (!formData.tinNumber.trim()) {
      e.tinNumber = "TIN is required.";
    } else if (!tinPattern.test(formData.tinNumber.trim())) {
      e.tinNumber = "Must be TIN- followed by 9–13 digits (e.g. TIN-908776521).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      e.email = "Corporate Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      e.email = "Enter a valid email address.";
    }

    const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;
    if (!formData.phoneNumber.trim()) {
      e.phoneNumber = "Phone is required.";
    } else if (!phoneRegex.test(formData.phoneNumber)) {
      e.phoneNumber = "Enter a valid phone number (e.g. +2348012345678).";
    }

    // Warn if not in international format
    if (formData.phoneNumber && !formData.phoneNumber.startsWith("+")) {
      e.phoneNumber = "Phone must be in international format (e.g. +2348012345678).";
    }

    if (!formData.companyAddress.trim()) e.companyAddress = "Company Address is required.";
    if (!formData.websiteAddress.trim()) e.websiteAddress = "Website Address is required.";

    if (!formData.firstName.trim()) e.firstName = "First Name is required.";
    if (!formData.lastName.trim()) e.lastName = "Last Name is required.";

    if (!formData.contactEmail.trim()) {
      e.contactEmail = "Contact Email is required.";
    } else if (!emailRegex.test(formData.contactEmail)) {
      e.contactEmail = "Enter a valid contact email address.";
    }

    if (!formData.contactPhoneNumber.trim()) {
      e.contactPhoneNumber = "Contact Phone is required.";
    } else if (!phoneRegex.test(formData.contactPhoneNumber)) {
      e.contactPhoneNumber = "Enter a valid phone number (e.g. +2348098765432).";
    } else if (!formData.contactPhoneNumber.startsWith("+")) {
      e.contactPhoneNumber = "Phone must be in international format (e.g. +2348098765432).";
    }

    if (!formData.contactAddress.trim()) e.contactAddress = "Contact Address is required.";

    return e;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fix the errors in the form before submitting.");
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        companyName: formData.companyName,
        rcNumber: formData.rcNumber,
        tinNumber: formData.tinNumber,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        companyAddress: formData.companyAddress,
        websiteAddress: formData.websiteAddress,
        vendorContact: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.contactEmail,
          phoneNumber: formData.contactPhoneNumber,
          address: formData.contactAddress,
        },
        username: formData.email,
      };

      const token = sessionStorage.getItem("accessToken");
      const url = isEditMode ? `/api/v1/vendors/${vendorId}` : "/api/v1/vendors";
      const method = isEditMode ? "PUT" : "POST";

      // Debug: log exactly what is being sent to diagnose 500 errors
      console.log("=== VENDOR SUBMIT ===");
      console.log("URL:", url, "| Method:", method);
      console.log("Payload:", JSON.stringify(payload, null, 2));
      console.log("Auth token present:", !!token);
      console.log("API key present:", !!import.meta.env.VITE_API_KEY);

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "x-api-key": import.meta.env.VITE_API_KEY || "",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const raw = await response.text();
        console.log("=== SERVER ERROR BODY ===", raw);
        let message = isEditMode ? "Failed to update vendor" : "Failed to add vendor";
        try {
          const parsed = JSON.parse(raw);
          message =
            parsed?.message ||
            parsed?.error ||
            (parsed?.errors ? JSON.stringify(parsed.errors) : null) ||
            message;
        } catch {
          message = raw || message;
        }
        throw new Error(message);
      }

      toast.success(isEditMode ? "Vendor updated successfully." : "Vendor added successfully.");
      navigate("/vendors");
    } catch (error: any) {
      console.error("Error saving vendor:", error);
      toast.error(error.message || "Failed to save vendor");
    } finally {
      setIsLoading(false);
    }
  };

  const fc = (field: keyof VendorFormData) =>
    `form-control${errors[field] ? " is-invalid" : ""}`;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">{isEditMode ? "Edit Vendor Details" : "Vendor Details"}</h5>
            </div>
            <div className="card-body">
              {/* ── Company Information ── */}
              <h6 className="text-primary fw-bold mb-3 border-bottom pb-2">Company Information</h6>
              <div className="row">
                <div className="col-xl-6 col-sm-6">
                  <div className="mb-3">
                    <label htmlFor="companyName" className="form-label text-primary">
                      Company Legal Name<span className="required">*</span>
                    </label>
                    <input type="text" className={fc("companyName")} id="companyName" name="companyName"
                      value={formData.companyName} onChange={handleInputChange}
                      placeholder="XYZ Company Limited" disabled={isLoading} />
                    {errors.companyName && <div className="invalid-feedback">{errors.companyName}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="rcNumber" className="form-label text-primary">
                      RC / CAC Number<span className="required">*</span>
                    </label>
                    <input type="text" className={fc("rcNumber")} id="rcNumber" name="rcNumber"
                      value={formData.rcNumber} onChange={handleInputChange}
                      placeholder="RC-1457809" disabled={isLoading} maxLength={12} />
                    {errors.rcNumber && <div className="invalid-feedback">{errors.rcNumber}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="tinNumber" className="form-label text-primary">
                      TIN<span className="required">*</span>
                    </label>
                    <input type="text" className={fc("tinNumber")} id="tinNumber" name="tinNumber"
                      value={formData.tinNumber} onChange={handleInputChange}
                      placeholder="TIN-908776521" disabled={isLoading} maxLength={17} />
                    {errors.tinNumber && <div className="invalid-feedback">{errors.tinNumber}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label text-primary">
                      Company Email<span className="required">*</span>
                    </label>
                    <input type="email" className={fc("email")} id="email" name="email"
                      value={formData.email} onChange={handleInputChange}
                      placeholder="info@xyzcompany.com" disabled={isLoading} />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="col-xl-6 col-sm-6">
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label text-primary">
                      Company Phone<span className="required">*</span>
                    </label>
                    <input type="text" className={fc("phoneNumber")} id="phoneNumber" name="phoneNumber"
                      value={formData.phoneNumber} onChange={handleInputChange}
                      placeholder="+2348012345678" disabled={isLoading} />
                    {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="companyAddress" className="form-label text-primary">
                      Company Address<span className="required">*</span>
                    </label>
                    <textarea className={fc("companyAddress")} id="companyAddress" name="companyAddress"
                      value={formData.companyAddress} onChange={handleInputChange}
                      placeholder="123 Main Street, City" rows={3} disabled={isLoading} />
                    {errors.companyAddress && <div className="invalid-feedback">{errors.companyAddress}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="websiteAddress" className="form-label text-primary">
                      Website Address<span className="required">*</span>
                    </label>
                    <input type="text" className={fc("websiteAddress")} id="websiteAddress" name="websiteAddress"
                      value={formData.websiteAddress} onChange={handleInputChange}
                      placeholder="https://www.xyzcompany.com" disabled={isLoading} />
                    {errors.websiteAddress && <div className="invalid-feedback">{errors.websiteAddress}</div>}
                  </div>
                </div>
              </div>

              {/* ── Contact Person ── */}
              <h6 className="text-primary fw-bold mb-3 border-bottom pb-2 mt-2">Contact Person Details</h6>
              <div className="row">
                <div className="col-xl-6 col-sm-6">
                  <div className="mb-3">
                    <label htmlFor="firstName" className="form-label text-primary">
                      First Name<span className="required">*</span>
                    </label>
                    <input type="text" className={fc("firstName")} id="firstName" name="firstName"
                      value={formData.firstName} onChange={handleInputChange}
                      placeholder="John" disabled={isLoading} />
                    {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contactEmail" className="form-label text-primary">
                      Contact Email<span className="required">*</span>
                    </label>
                    <input type="email" className={fc("contactEmail")} id="contactEmail" name="contactEmail"
                      value={formData.contactEmail} onChange={handleInputChange}
                      placeholder="johndoe@example.com" disabled={isLoading} />
                    {errors.contactEmail && <div className="invalid-feedback">{errors.contactEmail}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contactAddress" className="form-label text-primary">
                      Contact Address<span className="required">*</span>
                    </label>
                    <textarea className={fc("contactAddress")} id="contactAddress" name="contactAddress"
                      value={formData.contactAddress} onChange={handleInputChange}
                      placeholder="123 Main Street, City" rows={3} disabled={isLoading} />
                    {errors.contactAddress && <div className="invalid-feedback">{errors.contactAddress}</div>}
                  </div>
                </div>

                <div className="col-xl-6 col-sm-6">
                  <div className="mb-3">
                    <label htmlFor="lastName" className="form-label text-primary">
                      Last Name<span className="required">*</span>
                    </label>
                    <input type="text" className={fc("lastName")} id="lastName" name="lastName"
                      value={formData.lastName} onChange={handleInputChange}
                      placeholder="Doe" disabled={isLoading} />
                    {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="contactPhoneNumber" className="form-label text-primary">
                      Contact Phone<span className="required">*</span>
                    </label>
                    <input type="text" className={fc("contactPhoneNumber")} id="contactPhoneNumber" name="contactPhoneNumber"
                      value={formData.contactPhoneNumber} onChange={handleInputChange}
                      placeholder="+2348098765432" disabled={isLoading} />
                    {errors.contactPhoneNumber && <div className="invalid-feedback">{errors.contactPhoneNumber}</div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <button type="button" className="btn btn-outline-primary me-3" disabled={isLoading}
                onClick={() => navigate("/vendors")}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    {isEditMode ? "Updating..." : "Saving..."}</>
                ) : (isEditMode ? "Update Vendor" : "Save Vendor")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddNewVendor;