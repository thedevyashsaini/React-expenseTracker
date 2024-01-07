// eslint-disable-next-line
import Chart from "chart.js/auto";
import { CategoryScale } from "chart.js";
import { Line } from "react-chartjs-2";

const LineChart = (props) => {
  const data = {
    labels: Object.keys(props.dataPoints),
    datasets: [
      {
        label: props.lable,
        data: Object.values(props.dataPoints),
        borderColor: "#a892ee",
        backgroundColor: "#40005d",
      },
    ],
  };
  return (
    <Line
      data={data}
      options={{
        plugins: {
          title: {
            display: true,
            text: props.label,
          },
          legend: {
            display: false,
          },
        },
      }}
    />
  );
};

export default LineChart;
