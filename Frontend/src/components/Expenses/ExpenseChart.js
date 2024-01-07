import LineChart from "../UI/LineChart";

const ExpenseChart = (props) => {
    const dataPoints = {
        January: 0,
        February: 0,
        March: 0,
        April: 0,
        May: 0,
        June: 0,
        July: 0,
        August: 0,
        September: 0,
        October: 0,
        November: 0,
        December: 0,
    }
    for (let i = 0; i < props.data.length; i++) {
        let month = new Date(props.data[i].date);
        month = month.toLocaleString('en-US', {month: 'long'});
        if (dataPoints[month] === undefined) {
            dataPoints[month] = 0;
        }
        dataPoints[month] += props.data[i].amount;
    }
    return <LineChart dataPoints={dataPoints} lable={props.lable}/>
};

export default ExpenseChart;