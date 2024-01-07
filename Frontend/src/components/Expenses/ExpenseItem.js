import React from 'react';

import './ExpenseItem.css';
import ExpenseDate from './ExpenseDate';
import Card from '../UI/Card';
import ExpenseOverlay from './ExpenseOverlay';

const ExpenseItem = (props) => {

    const onDelete = (id, year) => {
        props.onDelete(id, year);
    };

    return (
        <Card className="expense-item">
            <ExpenseOverlay id={props.id} year={props.date.getFullYear()} onDeleteClick={onDelete}/>
            <ExpenseDate date={props.date} />
            <div className='expense-item__description'>
                <h2>{props.title}</h2>
                <div className='expense-item__price'>₹{props.amount}</div>
            </div>
        </Card>
    );
}

export default ExpenseItem;
