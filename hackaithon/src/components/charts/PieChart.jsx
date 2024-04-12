import Chart from "react-apexcharts";

const PieChart = (props) => {
  const { series, options } = props;

  return (
    <Chart
      options={options}
      type="pie"
      width="120%"
      height="120%"
      series={series}
    />
  );
};

export default PieChart;
