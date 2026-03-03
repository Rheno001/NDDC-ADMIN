import { FormEvent, forwardRef, useImperativeHandle, useState } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";

type BasicModalProps = object;

type BasicModalHandle = {
  openModal: () => void;
};

const BasicModal = forwardRef<BasicModalHandle, BasicModalProps>((_, ref) => {
  const [modalBox, setModalBox] = useState<boolean>(false);
  const [file, setFile] = useState<null | File>(null);

  useImperativeHandle(ref, () => ({
    openModal() {
      setModalBox(true);
    },
  }));

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
      <Modal 
        onHide={() => setModalBox(false)} 
        show={modalBox} 
        centered
        size="lg" // Make the modal larger to accommodate the form
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLabel">
              Add New Vendor
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setModalBox(false)}
            ></button>
          </div>
          <div className="modal-body p-4">
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
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-danger light"
              onClick={() => setModalBox(false)}
            >
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={() => setModalBox(false)}>
              Save changes
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
});

export default BasicModal;
