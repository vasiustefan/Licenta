import { Link } from "react-router-dom";
import "../CSS/Eroare.scss"; // Import the stylesheet for styling

export const Eroare = () => {
  return (
    <div className="error-container">
      <div className="error-content">
        <h1>404</h1>
        <p>Oops! The page you are looking for does not exist.</p>
        <Link to="/" className="home-link">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};
