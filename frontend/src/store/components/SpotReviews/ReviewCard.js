import { useDispatch, useSelector } from "react-redux";
import { useModal } from "../../../context/Modal";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { deleteReviewThunk } from "../../reviews";
import { useHistory } from "react-router-dom";

export default ({ reviewDetails }) => {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();
  const { setModalContent } = useModal();
  const dispatch = useDispatch();
  const monthList = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const { review, createdAt, userId } = reviewDetails;
  const { firstName } = reviewDetails.User;
  const date = createdAt.split("-");
  const year = date[0];
  const month = monthList[date[1]];
  const updateReviewClick = () => {
    alert("Feature coming soon!");
  };
  const deleteReviewClick = () => {
    setModalContent(
      <ConfirmDeleteModal
        type="Review"
        deleteFunc={deleteReviewThunk}
        id={reviewDetails.id}
      />
    );
  };
  return (
    <div className="userReview">
      <h4>{firstName}</h4>
      <h5>{`${month} ${year}`}</h5>
      <p>{review}</p>
      <button
        hidden={!sessionUser || sessionUser.id !== userId}
        onClick={updateReviewClick}
      >
        Update
      </button>{" "}
      <button
        hidden={!sessionUser || sessionUser.id !== userId}
        onClick={deleteReviewClick}
      >
        Delete
      </button>
    </div>
  );
};
