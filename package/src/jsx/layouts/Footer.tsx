import { Link } from "react-router-dom";

interface propType {
  changeFooter: string;
}
const Footer = (props: propType) => {
  return (
    <div className={`footer ${props.changeFooter}`}>
      <div className="copyright">
        <p>
          Copyright © Designed &amp; Developed by{" "}
          <Link to="https://tbs-ng.com/" target="_blank" rel="noreferrer">
            Triune Built Tech Solutions
          </Link>{" "}
          {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
};

export default Footer;
