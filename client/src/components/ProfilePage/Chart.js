import { BarChart } from "@mui/x-charts/BarChart";

export default function Chart({ questionsCount, answersCount, commentsCount }) {
  return (
    <BarChart
      margin={{ left: 100 }}
      colors={["#1976d2"]}
      series={[
        {
          data: [questionsCount, answersCount, commentsCount],
        },
      ]}
      yAxis={[
        { scaleType: "band", data: ["#Questions", "#Answers", "#Comments"] },
      ]}
      height={200}
      width={400}
      layout="horizontal"
      bottomAxis={null}
    />
  );
}
