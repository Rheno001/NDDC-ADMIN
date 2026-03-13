import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'react-toastify';
import { TanStackTable } from '../Common/TanStackTable';
import FormFieldModal, { FormFieldModalHandle } from './FormFieldModal';

interface FormField {
    id: string;
    fieldLabel: string;
    fieldName: string;
    fieldType: string;
    required: boolean;
    placeholder: string;
    fieldOrder: number;
}

const ManageFields = () => {
    const { id } = useParams<{ id: string }>();
    const modalRef = useRef<FormFieldModalHandle>(null);
    const [docTypeName, setDocTypeName] = useState('...');
    const [data, setData] = useState<FormField[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDocumentInfo = useCallback(async () => {
        try {
            const response = await fetch(`/api/v1/document-types/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VITE_API_KEY || '',
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                }
            });
            if (response.ok) {
                const result = await response.json();
                if (result && result.data) {
                    setDocTypeName(result.data.name || '...');
                }
            }
        } catch (error) {
            console.error('Error fetching document info:', error);
        }
    }, [id]);

    const fetchFields = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/v1/document-types/${id}/fields`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VITE_API_KEY || '',
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch fields');
            }

            const result = await response.json();
            let fetchedFields: FormField[] = [];

            if (result && result.data) {
                fetchedFields = Array.isArray(result.data) ? result.data : (result.data.content || []);
            } else if (Array.isArray(result)) {
                fetchedFields = result;
            }

            setData(fetchedFields.sort((a, b) => a.fieldOrder - b.fieldOrder));
        } catch (error) {
            console.error('Error fetching fields:', error);
            toast.error('Failed to load fields');
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDocumentInfo();
        fetchFields();
    }, [fetchDocumentInfo, fetchFields]);

    const handleAddField = () => {
        modalRef.current?.openModal({
            fieldLabel: '',
            fieldName: '',
            fieldType: 'TEXT',
            required: false,
            placeholder: '',
            fieldOrder: data.length + 1
        });
    };

    const handleEditField = (field: FormField) => {
        modalRef.current?.openModal(field);
    };

    const handleDeleteField = async (fieldId: string) => {
        if (!window.confirm('Are you sure you want to delete this field?')) return;

        try {
            const response = await fetch(`/api/v1/document-types/${id}/fields/${fieldId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VITE_API_KEY || '',
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete field');
            }

            toast.success('Field deleted successfully');
            fetchFields();
        } catch (error) {
            console.error('Error deleting field:', error);
            toast.error('Failed to delete field');
        }
    };

    const handleSaveField = async (field: any) => {
        try {
            const isEdit = !!field.id;
            const url = isEdit
                ? `/api/v1/document-types/${id}/fields/${field.id}`
                : `/api/v1/document-types/${id}/fields`;
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VITE_API_KEY || '',
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(field)
            });

            if (!response.ok) {
                throw new Error(`Failed to ${isEdit ? 'update' : 'add'} field`);
            }

            toast.success(`Field ${isEdit ? 'updated' : 'added'} successfully`);
            fetchFields();
        } catch (error) {
            console.error('Error saving field:', error);
            toast.error('Failed to save field');
        }
    };

    const columns: ColumnDef<FormField, any>[] = [
        {
            header: 'Field Label',
            accessorKey: 'fieldLabel',
            cell: (info) => <span className="text-black font-w600">{info.getValue()}</span>,
        },
        {
            header: 'Field Name',
            accessorKey: 'fieldName',
            cell: (info) => <code className="text-muted">{info.getValue()}</code>,
        },
        {
            header: 'Field Type',
            accessorKey: 'fieldType',
            cell: (info) => <span className="badge badge-info light">{info.getValue()}</span>,
        },
        {
            header: 'Required',
            accessorKey: 'required',
            cell: (info) => (
                <span className={`badge badge-outline-${info.getValue() ? 'success' : 'danger'}`}>
                    {info.getValue() ? 'Yes' : 'No'}
                </span>
            ),
        },
        {
            header: 'Order',
            accessorKey: 'fieldOrder',
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: (info) => (
                <div className="d-flex">
                    <Link
                        to="#"
                        className="btn btn-primary shadow btn-xs sharp me-1"
                        onClick={(e) => { e.preventDefault(); handleEditField(info.row.original); }}
                    >
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <Link
                        to="#"
                        className="btn btn-danger shadow btn-xs sharp"
                        onClick={(e) => { e.preventDefault(); handleDeleteField(info.row.original.id); }}
                    >
                        <i className="fa fa-trash"></i>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <>
            <div className="page-titles">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/documents">Document Types</Link></li>
                    <li className="breadcrumb-item active"><Link to="#">Manage Fields</Link></li>
                </ol>
            </div>
            <div className="card">
                <div className="card-header d-sm-flex d-block border-0 pb-0">
                    <div className="me-auto mb-sm-0 mb-3">
                        <h4 className="card-title mb-1">Document Type: <span className="text-primary">{docTypeName}</span></h4>
                        <p className="mb-0 fs-13">Define dynamic fields for this document type.</p>
                    </div>
                    <Link to="#" className="btn btn-primary btn-rounded" onClick={(e) => { e.preventDefault(); handleAddField(); }}>
                        + Add Field
                    </Link>
                </div>
                <div className="card-body mt-3">
                    <div id="example-fields_wrapper" className="dataTables_wrapper no-footer">
                        {isLoading ? (
                            <div className="text-center p-5">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <TanStackTable data={data} columns={columns} />
                        )}
                    </div>
                </div>
                <FormFieldModal ref={modalRef} onSave={handleSaveField} />
            </div>
        </>
    );
};

export default ManageFields;

