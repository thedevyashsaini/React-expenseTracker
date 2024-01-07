import React, { useState } from "react";

import ExpenseItem from "./ExpenseItem";
import ExpensesFilter from "../NewExpense/ExpenseFilter";
import "./Expenses.css";
import Card from "../UI/Card";
import ExpenseChart from "./ExpenseChart";

const Expenses = (props) => {
  const [year, filterYear] = useState(
    Math.max(...Object.keys(props.expenses)) || new Date().getFullYear()
  );

  const filterChangeHandler = (event) => {
    filterYear(+event.target.value);
  };
  if (props.expenses[year]) {
    props.expenses[year] = props.expenses[year].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );
  }
  const onDeleteClick = (id, year) => {
    props.onDeleteClick(id, year);
  };
  return (
    <Card className="expenses">
      <ExpensesFilter
        expenses={props.expenses}
        selectedYear={year}
        onYearChange={filterChangeHandler}
      />
      <ExpenseChart lable="" data={props.expenses[year]} />
      <div className="expenses-cover">
        {props.expenses[year] === undefined ||
        props.expenses[year].length === 0 ? (
          <h2
            className="expenses-list__fallback"
            style={{ color: "#fff", textAlign: "center", fontSize: "x-large" }}
          >
            <b>No expenses found for {year}.</b>
          </h2>
        ) : (
          props.expenses[year].map((expense) => (
            <ExpenseItem
              onDelete={onDeleteClick}
              key={expense.id}
              title={expense.title}
              amount={expense.amount}
              date={new Date(expense.date)}
              id={expense.id}
            />
          ))
        )}
      </div>
    </Card>
  );
};

export default Expenses;
