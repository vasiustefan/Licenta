/* eslint-disable react/prop-types */

import { useAppSelector, useAppDispatch } from "../app/hooks";
import { closeModal } from "../features/modalSlice";

import "../CSS/Modal.scss";

export const Modal = ({ children }) => {
  const modal = useAppSelector((state) => state.modal);
  const dispatch = useAppDispatch();

  const handleCloseModal = () => {
    dispatch(closeModal());
  };

  if (!modal.isOpen) return null;

  return (
    <div className="modal-overlay-custom">
      <div className="modal-custom">
        <button
          className="modal-close-button-custom"
          onClick={handleCloseModal}
        >
          &times;
        </button>
        <div className="m-4">{children}</div>
      </div>
    </div>
  );
};
