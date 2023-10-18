export default ({ reviewDetails }) => {
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

  return (
    <div className="userReview">
      <h4>{firstName}</h4>
      <h5>{`${month} ${year}`}</h5>
      <p>{review}</p>
    </div>
  );
};
