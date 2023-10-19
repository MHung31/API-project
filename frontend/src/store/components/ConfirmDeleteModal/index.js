import "./ConfirmDelete.css";
import { useModal } from "../../../context/Modal";
import { useDispatch } from "react-redux";

export default ({ type, deleteFunc, id }) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  let message = "";
  if (type === "Spot")
    message = "Are you sure you want to remove this spot from the listings?";
  if (type === "Review")
    message = "Are you sure you want to delete this review?";
  const confirmYesClick = async () => {
    dispatch(deleteFunc(id));
    closeModal();

  };

  return (
    <div className="confirm-delete">
      <h3>Confirm Delete</h3>
      <p>{message} </p>
      <button onClick={confirmYesClick} id="confirm-yes">
        {`Yes (Delete ${type})`}{" "}
      </button>
      <button onClick={closeModal} id="confirm-no">
        {`No (Keep ${type})`}{" "}
      </button>
    </div>
  );
};
