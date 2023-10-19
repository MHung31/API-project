import { useDispatch } from "react-redux";
import { useModal } from "../../../context/Modal";
import ConfirmDeleteModal from "../ConfirmDeleteModal";
import { deleteReviewThunk } from "../../reviews";
import { useHistory } from "react-router-dom";

export default ({ reviewDetails }) => {
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
  const { review, createdAt } = reviewDetails;
  const { firstName } = reviewDetails.User;
  const date = createdAt.split("-");
  const year = date[0];
  const month = monthList[date[1]];

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
      <button>Update</button>{" "}
      <button onClick={deleteReviewClick}>Delete</button>
    </div>
  );
};
