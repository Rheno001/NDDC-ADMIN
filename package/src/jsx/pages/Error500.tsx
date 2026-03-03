import { Link } from "react-router-dom";

const Error500 = () => {
   return (
      <div className="authincation">
         <div className="container">
            <div className="row h-100 align-items-center justify-content-center">
               <div className="col-lg-6 col-sm-12">
                  <div className="form-input-content error-page">
                     <h1 className="error-text text-primary">500</h1>
                     <h4>Internal Server Error</h4>
                     <p>You do not have permission to view this resource</p>
                     <Link className="btn btn-primary" to="/dashboard">Back to Home</Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Error500;
