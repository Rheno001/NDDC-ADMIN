import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

const AddNewVendor = () => {
  const [file, setFile] = useState<null | File>(null);
  const fileHandler = (e: FormEvent) => {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      setFile(input.files[0]);
    }
  };

  const RemoveFile = () => {
    setFile(null);
  };

  return (
    <>
      <div className="row">
        <div className="col-xl-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Vendor Details</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-xl-12 col-lg-12">
                  <div className="row">
                    <div className="col-xl-6 col-sm-6">
                      <div className="mb-3">
                        <label
                          htmlFor="companyName"
                          className="form-label text-primary"
                        >
                          Company Legal Name<span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="companyName"
                          placeholder="Company Legal Name"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="rcNumber"
                          className="form-label text-primary"
                        >
                          RC Number<span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="rcNumber"
                          placeholder="RC 123456"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="tin"
                          className="form-label text-primary"
                        >
                          TIN<span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="tin"
                          placeholder="Tax Identification Number"
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-primary">
                          Category
                        </label>
                        <select className="form-control default-select">
                          <option value="Goods">Goods</option>
                          <option value="Works">Works</option>
                          <option value="Services">Services</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="businessAddress"
                          className="form-label text-primary"
                        >
                          Business Address
                        </label>
                        <textarea
                          className="form-control"
                          id="businessAddress"
                          rows={4}
                        />
                      </div>
                    </div>
                    <div className="col-xl-6 col-sm-6">
                      <div className="mb-3">
                        <label
                          htmlFor="stateCountry"
                          className="form-label text-primary"
                        >
                          State / Country
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="stateCountry"
                          placeholder="State / Country"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="contactPerson"
                          className="form-label text-primary"
                        >
                          Contact Person Name<span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="contactPerson"
                          placeholder="Full Name"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="contactEmail"
                          className="form-label text-primary"
                        >
                          Contact Email<span className="required">*</span>
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="contactEmail"
                          placeholder="contact@example.com"
                        />
                      </div>
                      <div className="mb-3">
                        <label
                          htmlFor="phoneNumber"
                          className="form-label text-primary"
                        >
                          Phone Number<span className="required">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="phoneNumber"
                          placeholder="+234..."
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label text-primary">
                          Upload Initial Documents (CAC, Tax Clearance, etc.)
                        </label>
                        <div className="d-flex align-items-center">
                          <input
                            type="file"
                            className="form-control form-control-sm"
                            onChange={fileHandler}
                            id="documentUpload"
                            accept=".pdf, .doc, .docx, .png, .jpg, .jpeg"
                          />
                          {file && (
                            <Link
                              to={"#"}
                              className="btn btn-danger light ms-2 btn-sm"
                              onClick={RemoveFile}
                            >
                              Remove
                            </Link>
                          )}
                        </div>
                         {file && <p className="mt-2 mb-0">Selected: {file.name}</p>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              <button className="btn btn-outline-primary me-3">
                Save as Draft
              </button>
              <button className="btn btn-primary" type="button">
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewVendor;
