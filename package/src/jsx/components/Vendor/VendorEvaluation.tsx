import { useParams, Link } from "react-router-dom";

const VendorEvaluation = () => {
    const { id } = useParams<{ id: string }>();

    return (
        <div className="row">
            <div className="col-xl-12">
                <div className="page-title flex-wrap">
                    <div className="mb-md-0 mb-3">
                        <h2 className="heading">Vendor Evaluation</h2>
                    </div>
                    <Link to="/vendors" className="btn btn-primary light">
                        Back to Vendors
                    </Link>
                </div>
            </div>
            <div className="col-xl-12">
                <div className="card">
                    <div className="card-header">
                        <h4 className="card-title">Evaluation Reports - {id?.slice(-6).toUpperCase()}</h4>
                    </div>
                    <div className="card-body">
                        <div className="text-center p-5">
                            <i className="fa-solid fa-chart-line fs-80 text-primary mb-4"></i>
                            <h3>No Evaluation Reports Yet</h3>
                            <p className="text-muted">Detailed performance metrics and evaluation scoring will appear here once the admin completes an assessment for this vendor.</p>
                            <div className="mt-4">
                                <button className="btn btn-primary">Initiate Evaluation</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorEvaluation;
