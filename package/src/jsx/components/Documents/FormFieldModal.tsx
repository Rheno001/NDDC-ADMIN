import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";

interface FormField {
    id?: string;
    fieldLabel: string;
    fieldName: string;
    fieldType: string;
    required: boolean;
    placeholder: string;
    fieldOrder?: number;
}

type FormFieldModalProps = {
    onSave?: (data: FormField) => void;
};

export type FormFieldModalHandle = {
    openModal: (data?: FormField) => void;
};

const FormFieldModal = forwardRef<FormFieldModalHandle, FormFieldModalProps>(
    ({ onSave }, ref) => {
        const [modalBox, setModalBox] = useState<boolean>(false);
        const [isLoading, setIsLoading] = useState<boolean>(false);
        const [isEdit, setIsEdit] = useState<boolean>(false);

        // Form state
        const [id, setId] = useState<string | undefined>(undefined);
        const [fieldLabel, setFieldLabel] = useState("");
        const [fieldName, setFieldName] = useState("");
        const [fieldType, setFieldType] = useState("TEXT");
        const [required, setRequired] = useState(false);
        const [placeholder, setPlaceholder] = useState("");
        const [fieldOrder, setFieldOrder] = useState<number | undefined>(undefined);

        useImperativeHandle(ref, () => ({
            openModal(data?: FormField) {
                if (data) {
                    setIsEdit(true);
                    setId(data.id);
                    setFieldLabel(data.fieldLabel);
                    setFieldName(data.fieldName);
                    setFieldType(data.fieldType);
                    setRequired(data.required);
                    setPlaceholder(data.placeholder);
                    setFieldOrder(data.fieldOrder);
                } else {
                    setIsEdit(false);
                    resetForm();
                }
                setModalBox(true);
            },
        }));

        const resetForm = () => {
            setId(undefined);
            setFieldLabel("");
            setFieldName("");
            setFieldType("TEXT");
            setRequired(false);
            setPlaceholder("");
            setFieldOrder(undefined);
        };

        const handleLabelChange = (val: string) => {
            setFieldLabel(val);
            // Auto-generate name from label if not editing
            if (!isEdit) {
                setFieldName(val.toLowerCase().replace(/[^a-z0-9]/g, '_'));
            }
        };

        const handleSubmit = async (e: React.FormEvent) => {
            e.preventDefault();

            if (!fieldLabel || !fieldName) {
                toast.error("Field Label and Name are required.");
                return;
            }

            setIsLoading(true);

            const payload: FormField = {
                id,
                fieldLabel,
                fieldName,
                fieldType,
                required,
                placeholder,
                fieldOrder: fieldOrder || 0,
            };

            // Simulate API call
            setTimeout(() => {
                toast.success(`Field ${isEdit ? 'updated' : 'added'} successfully!`);
                setModalBox(false);
                if (onSave) {
                    onSave(payload);
                }
                setIsLoading(false);
            }, 500);
        };

        return (
            <Modal
                onHide={() => setModalBox(false)}
                show={modalBox}
                centered
            >
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{isEdit ? 'Edit' : 'Add'} Field</h5>
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
                                    Field Label<span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. Registration Number"
                                    value={fieldLabel}
                                    onChange={(e) => handleLabelChange(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-primary">
                                    Field Name<span className="required">*</span>
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="e.g. registration_number"
                                    value={fieldName}
                                    onChange={(e) => setFieldName(e.target.value)}
                                    required
                                />
                                <small className="text-muted">Unique identifier for the field</small>
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-primary">
                                    Field Type<span className="required">*</span>
                                </label>
                                <select
                                    className="form-control default-select"
                                    value={fieldType}
                                    onChange={(e) => setFieldType(e.target.value)}
                                    required
                                >
                                    <option value="TEXT">TEXT</option>
                                    <option value="NUMBER">NUMBER</option>
                                    <option value="DATE">DATE</option>
                                    <option value="SELECT">SELECT</option>
                                    <option value="FILE_UPLOAD">FILE_UPLOAD</option>
                                    <option value="TEXT_AREA">TEXT_AREA</option>
                                </select>
                            </div>

                            <div className="mb-3">
                                <Form.Check
                                    type="checkbox"
                                    id="fieldRequired"
                                    label="Required"
                                    checked={required}
                                    onChange={(e) => setRequired(e.target.checked)}
                                />
                            </div>

                            <div className="mb-3">
                                <label className="form-label text-primary">
                                    Placeholder
                                </label>
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Enter placeholder text..."
                                    value={placeholder}
                                    onChange={(e) => setPlaceholder(e.target.value)}
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

export default FormFieldModal;
