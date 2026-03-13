import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ColumnDef } from '@tanstack/react-table';
import { toast } from 'react-toastify';
import { TanStackTable } from '../Common/TanStackTable';
import DocumentTypeModal, { DocumentTypeModalHandle } from './DocumentTypeModal';

interface DocumentType {
    id: string;
    name: string;
    description: string;
    category: string;
    requiredForBidding: boolean;
    requiresExpiration: boolean;
    createdDate?: string;
}

const Documents = () => {
    const modalRef = useRef<DocumentTypeModalHandle>(null);
    const [data, setData] = useState<DocumentType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchDocumentTypes = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/v1/document-types', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VITE_API_KEY || '',
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch document types');
            }

            const result = await response.json();

            let fetchedData: DocumentType[] = [];
            if (result && result.data) {
                fetchedData = Array.isArray(result.data) ? result.data : (result.data.content || []);
            } else if (Array.isArray(result)) {
                fetchedData = result;
            }

            setData(fetchedData);
        } catch (error) {
            console.error('Error fetching document types:', error);
            toast.error('Failed to load document types');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchDocumentTypes();
    }, [fetchDocumentTypes]);

    const handleCreate = () => {
        modalRef.current?.openModal();
    };

    const handleEdit = (doc: DocumentType) => {
        modalRef.current?.openModal(doc);
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this document type?')) return;

        try {
            const response = await fetch(`/api/v1/document-types/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VITE_API_KEY || '',
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete document type');
            }

            toast.success('Document type deleted successfully');
            fetchDocumentTypes();
        } catch (error) {
            console.error('Error deleting document type:', error);
            toast.error('Failed to delete document type');
        }
    };

    const handleSave = async (doc: any) => {
        try {
            const isEdit = !!doc.id;
            const url = isEdit ? `/api/v1/document-types/${doc.id}` : '/api/v1/document-types';
            const method = isEdit ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': import.meta.env.VITE_API_KEY || '',
                    'Authorization': `Bearer ${sessionStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(doc)
            });

            if (!response.ok) {
                throw new Error(`Failed to ${isEdit ? 'update' : 'create'} document type`);
            }

            toast.success(`Document type ${isEdit ? 'updated' : 'created'} successfully`);
            fetchDocumentTypes();
        } catch (error) {
            console.error('Error saving document type:', error);
            toast.error('Failed to save document type');
        }
    };

    const columns: ColumnDef<DocumentType, any>[] = [
        {
            header: 'Document Name',
            accessorKey: 'name',
            cell: (info) => <span className="text-black font-w600">{info.getValue()}</span>,
        },
        {
            header: 'Category',
            accessorKey: 'category',
            cell: (info) => <span className="badge badge-info light">{info.getValue()}</span>,
        },
        {
            header: 'Required for Bidding',
            accessorKey: 'requiredForBidding',
            cell: (info) => (
                <span className={`badge badge-outline-${info.getValue() ? 'success' : 'danger'}`}>
                    {info.getValue() ? 'Yes' : 'No'}
                </span>
            ),
        },
        {
            header: 'Expiration Required',
            accessorKey: 'requiresExpiration',
            cell: (info) => (
                <span className={`badge badge-outline-${info.getValue() ? 'primary' : 'secondary'}`}>
                    {info.getValue() ? 'Yes' : 'No'}
                </span>
            ),
        },
        {
            header: 'Actions',
            id: 'actions',
            cell: (info) => (
                <div className="d-flex">
                    <Link
                        to="#"
                        className="btn btn-primary shadow btn-xs sharp me-1"
                        onClick={(e) => { e.preventDefault(); handleEdit(info.row.original); }}
                    >
                        <i className="fa fa-pencil"></i>
                    </Link>
                    <Link
                        to="#"
                        className="btn btn-danger shadow btn-xs sharp me-1"
                        onClick={(e) => { e.preventDefault(); handleDelete(info.row.original.id); }}
                    >
                        <i className="fa fa-trash"></i>
                    </Link>
                    <Link
                        to={`/documents/manage-fields/${info.row.original.id}`}
                        className="btn btn-info shadow btn-xs sharp"
                    >
                        <i className="fa fa-list"></i>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <div className="card">
            <div className="card-header d-sm-flex d-block border-0 pb-0">
                <div className="me-auto mb-sm-0 mb-3">
                    <h4 className="card-title mb-1">Document Types</h4>
                </div>
                <Link to="#" className="btn btn-primary btn-rounded" onClick={(e) => { e.preventDefault(); handleCreate(); }}>
                    + Create Document Type
                </Link>
            </div>
            <div className="card-body">
                <div id="example-documents_wrapper" className="dataTables_wrapper no-footer">
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
            <DocumentTypeModal ref={modalRef} onSave={handleSave} />
        </div>
    );
};

export default Documents;
