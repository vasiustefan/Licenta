import { BsPhone, BsEnvelope, BsSend } from "react-icons/bs";
import logo from "../images/logo.png";
import husqvarna from "../images/husqvarna.png";
import honda from "../images/honda.png";
import redbull from "../images/redbull.jpg";

import "../CSS/Footer.scss";

export const Footer = () => {
  return (
    <div className="footer pt-2 pb-5 px-3">
      <div className="footer__wrapper row">
        <div className=" col-12  p-3 mb-3 border-bottom  border-light">
          <div className="row align-items-center">
            <div className="col-6">
              <img className="img-footer " src={logo} alt="logo" />
            </div>
            <div className="col-6">
              <div className="row align-items-center justify-content-end">
                <div className="col-4 footer-icon">
                  <img
                    className="img-footer "
                    src={husqvarna}
                    alt="logo-husqvarna"
                  />
                </div>
                <div className="col-4 footer-icon">
                  <img className="img-footer " src={honda} alt="logo-honda" />
                </div>
                <div className="col-4 footer-icon">
                  <img
                    className="img-footer "
                    src={redbull}
                    alt="logo-redbull"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" col-12">
          <div className="row">
            <div className="col-12 col-xl-4 mb-3 mb-xl-0">
              <h3>Fii la curent cu ultimele stiri!</h3>
              <p>Nu vrei sa le ratezi!</p>
              <form
                action=""
                className="d-flex flex-row align-items-center newsletter-form"
              >
                <i>
                  <BsEnvelope color="violet" size="1.8rem" />
                </i>
                <input
                  type="e-mail"
                  placeholder="Adresa de e-mail"
                  name="newsletter"
                  className="mx-2 newsletter-input"
                  required
                ></input>
                <button type="submit" className="newsletter-btn">
                  <BsSend color="violet" size="1.2rem" />
                </button>
              </form>
            </div>
            <div className="col-12 col-xl-8">
              <div className="row">
                <div className=" col-12 col-sm-6 col-lg-3">
                  <h3>General</h3>
                  <ul>
                    <li>Pagina principala</li>
                    <li>Ture disponibile</li>
                    <li>Contacteaza-ne</li>
                  </ul>
                </div>
                <div className=" col-12 col-sm-6 col-lg-3">
                  <h3>Legal</h3>
                  <ul>
                    <li>Termeni si conditii</li>
                    <li>Politica de confidentialitate</li>
                    <li>Politici cookie</li>
                  </ul>
                </div>
                <div className=" col-12 col-sm-6 col-lg-3">
                  <h3>Link-uri utile</h3>
                  <ul>
                    <li>
                      <a target="_blank" href="https://distanta.ro">
                        distanta.ro
                      </a>
                    </li>
                    <li>
                      <a target="_blank" href="https://github.com/vasiustefan">
                        vasiustefan.ro
                      </a>
                    </li>
                  </ul>
                </div>
                <div className=" col-12 col-sm-6 col-lg-3">
                  <p>
                    <BsPhone color="violet" size="1.2rem" />
                    <a href="tel:0746383404" className="ms-1">
                      0746383404
                    </a>
                  </p>
                  <p className="">
                    <BsEnvelope color="orange" size="1.2rem" />
                    <a href="mailto:gr8_stefan@yahoo.com" className="ms-1">
                      gr8_stefan@yahoo.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
