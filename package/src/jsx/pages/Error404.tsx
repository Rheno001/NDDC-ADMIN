import { Link } from "react-router-dom";

const Error404 = () => {
   return (
      <div className="authincation">
         <div className="container">
            <div className="row h-100 align-items-center justify-content-center">
               <div className="col-lg-6 col-sm-12">
                  <div className="form-input-content error-page">
                     <h1 className="error-text text-primary">404</h1>
                     <h4>The page you were looking for is not found!</h4>
                     <p>You may have mistyped the address or the page may have moved.</p>
                     <Link className="btn btn-primary" to="/dashboard">Back to Home</Link>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
};

export default Error404;
