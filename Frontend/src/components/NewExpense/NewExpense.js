import React from 'react';

import ExpenseForm from './ExpenseForm';
import './NewExpense.css';

const NewExpense = (props) => {
    const saveExpensedalHandler = enteredExpenseData => {
        const expenseData = {
            ...enteredExpenseData,
            id: +Math.random().toString()
        };
        props.onNewExpenseData(expenseData);
    };

    return (
        <div className='new-expense'>
            <ExpenseForm onSaveExpenseData={saveExpensedalHandler}/>
        </div>
    )
};

export default NewExpense;