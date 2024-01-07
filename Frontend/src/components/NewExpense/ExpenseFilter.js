import React from 'react';

import './ExpenseFilter.css';

const ExpensesFilter = (props) => {
  return (
    <div className='expenses-filter'>
      <div className='expenses-filter__control'>
        <label>Filter by year</label>
        <select value={props.selectedYear} onChange={props.onYearChange}>
          {Object.keys(props.expenses).map((year, key) => (<option key={key} value={year}>{year}</option>))}
        </select>
      </div>
    </div>
  );
};

export default ExpensesFilter;