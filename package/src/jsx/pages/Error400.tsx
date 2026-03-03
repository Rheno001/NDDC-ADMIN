import { Link } from "react-router-dom";

const Error400 = () => {
   return (
      <div className="authincation">
         <div className="container">
            <div className="row h-100 align-items-center justify-content-center">
               <div className="col-lg-6 col-sm-12">
                  <div className="form-input-content error-page">
                     <h1 className="error-text text-primary">400</h1>
                     <h4>Bad Request</h4>
                     <p>Sorry, we are under maintenance!</p>
                     <Link className="btn btn-primary" to="/dashboard">Back to Home</Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Error400;
