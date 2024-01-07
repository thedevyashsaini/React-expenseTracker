import "./ExpenseOverlay.css";

const ExpenseOverlay = (props) => {
  const onDeleteClick = (event) => {
    props.onDeleteClick(event.target.id, event.target.getAttribute("year"));
  };

  return (
    <div class="expense-item__overlay">
      <i
        class="fa-solid fa-trash"
        year={props.year}
        aria-hidden="true"
        id={props.id}
        onClick={onDeleteClick}
      ></i>
    </div>
  );
};

export default ExpenseOverlay;
