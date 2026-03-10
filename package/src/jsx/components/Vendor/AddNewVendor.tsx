import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
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
  username: string;
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
    username: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // Enforce "RC-" prefix
    if (name === "rcNumber") {
      const formatted = value.toUpperCase().replace(/[^a-zA-Z0-9-]/g, "");
      if (!formatted.startsWith("RC-")) {
        // If user deleted part of the prefix, restore it
        newValue = "RC-" + formatted.replace(/^R?C?-?/, "");
      } else {
        newValue = formatted;
      }
      // If the user completely clears the input, let it be empty so the placeholder shows
      if (value === "") newValue = "";
    }

    // Enforce "TIN-" prefix
    if (name === "tinNumber") {
      const formatted = value.toUpperCase().replace(/[^a-zA-Z0-9-]/g, "");
      if (!formatted.startsWith("TIN-")) {
        newValue = "TIN-" + formatted.replace(/^T?I?N?-?/, "");
      } else {
        newValue = formatted;
      }
      if (value === "") newValue = "";
    }

    setFormData((prev) => ({ ...prev, [name]: newValue }));
    if (errors[name as keyof VendorFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): FormErrors => {
    const e: FormErrors = {};

    // ── Company ──
    if (!formData.companyName.trim()) e.companyName = "Legal Name is required.";

    // RC: must match RC-123456 (RC- followed by 6–7 digits)
    const rcPattern = /^RC-\d{6,7}$/i;
    if (!formData.rcNumber.trim()) {
      e.rcNumber = "RC Number is required.";
    } else if (!rcPattern.test(formData.rcNumber.trim())) {
      e.rcNumber = "Invalid format (e.g., RC-123456).";
    }

    // TIN: TIN- followed by 9 or 12 digits
    const tinPattern = /^TIN-(\d{9}|\d{12})$/i;
    if (!formData.tinNumber.trim()) {
      e.tinNumber = "TIN is required.";
    } else if (!tinPattern.test(formData.tinNumber.trim())) {
      e.tinNumber = "Must be TIN- followed by 9 or 12 digits (e.g. TIN-908776521).";
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

    if (!formData.companyAddress.trim()) e.companyAddress = "Company Address is required.";

    // ── Contact Person ──
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
    }

    if (!formData.contactAddress.trim()) e.contactAddress = "Contact Address is required.";

    // ── Account ──
    if (!formData.username.trim()) e.username = "Username is required.";

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
      // Payload matches the exact shape the backend expects (no password field)
      const payload = {
        companyName: formData.companyName,
        rcNumber: formData.rcNumber,
        tinNumber: formData.tinNumber,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        companyAddress: formData.companyAddress,
        websiteAddress: formData.websiteAddress,
        contactFullName: `${formData.firstName} ${formData.lastName}`,
        contactEmail: formData.contactEmail,
        contactPhoneNumber: formData.contactPhoneNumber,
        contactAddress: formData.contactAddress,
        username: formData.username,
      };

      const response = await fetch('/api/v1/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_KEY || '',
          'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const raw = await response.text(); // read body once
        let message = 'Failed to add vendor';
        try {
          const parsed = JSON.parse(raw);
          message = parsed?.message || parsed?.error || message;
        } catch {
          message = raw || message; // fall back to raw text if not JSON
        }
        throw new Error(message);
      }

      toast.success("Vendor added successfully.");
      navigate('/vendor');
    } catch (error: any) {
      console.error("Error adding vendor:", error);
      toast.error(error.message || "Failed to add vendor");
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
              <h5 className="mb-0">Vendor Details</h5>
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
                      placeholder="RC-1234567" disabled={isLoading} maxLength={10} />
                    {errors.rcNumber && <div className="invalid-feedback">{errors.rcNumber}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="tinNumber" className="form-label text-primary">
                      TIN<span className="required">*</span>
                    </label>
                    <input type="text" className={fc("tinNumber")} id="tinNumber" name="tinNumber"
                      value={formData.tinNumber} onChange={handleInputChange}
                      placeholder="TIN-0123456789" disabled={isLoading} maxLength={16} />
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
                      placeholder="080123456789" disabled={isLoading} />
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
                      Website Address
                    </label>
                    <input type="text" className="form-control" id="websiteAddress" name="websiteAddress"
                      value={formData.websiteAddress} onChange={handleInputChange}
                      placeholder="www.xyzcompany.com" disabled={isLoading} />
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
                      placeholder="080123456789" disabled={isLoading} />
                    {errors.contactPhoneNumber && <div className="invalid-feedback">{errors.contactPhoneNumber}</div>}
                  </div>
                </div>
              </div>

              {/* ── Account ── */}
              <h6 className="text-primary fw-bold mb-3 border-bottom pb-2 mt-2">Account</h6>
              <div className="row">
                <div className="col-xl-6 col-sm-6">
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label text-primary">
                      Username<span className="required">*</span>
                    </label>
                    <input type="text" className={fc("username")} id="username" name="username"
                      value={formData.username} onChange={handleInputChange}
                      placeholder="vendorusername" disabled={isLoading} />
                    {errors.username && <div className="invalid-feedback">{errors.username}</div>}
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer">
              <button type="button" className="btn btn-outline-primary me-3" disabled={isLoading}
                onClick={() => navigate('/vendor')}>
                Cancel
              </button>
              <button className="btn btn-primary" type="submit" disabled={isLoading}>
                {isLoading ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Saving...</>
                ) : "Save Vendor"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddNewVendor;