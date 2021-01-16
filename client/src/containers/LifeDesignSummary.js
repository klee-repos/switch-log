import React, { useEffect } from "react";
import { useUserStore } from "../context/UserContext";
import { useObserver } from "mobx-react";
import Insight from "../api/Insight";

import { Bar, Doughnut } from "react-chartjs-2";

import { Magic } from "magic-sdk";
import Loading from "./Loading";
const magic = new Magic(process.env.REACT_APP_MAGIC_API_KEY);

const LifeDesignSummary = () => {
  const userStore = useUserStore();
  const [did, setDid] = React.useState(null);
  const [chartData, setChartData] = React.useState({
    labels: ["Health", "Work", "Play", "Love"],
    datasets: [
      {
        label: "Distribution",
        data: [0, 0, 0, 0],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    async function logsInit() {
      let generateIdToken = await magic.user.generateIdToken();
      setDid(generateIdToken);
      const insight = new Insight(generateIdToken);
      let summary = await insight.getSummary();
      await userStore.setTotalHoursLogged(
        summary.health + summary.work + summary.play + summary.love
      );
      await userStore.setLifeDesignSummary(summary);
      setChartData({
        ...chartData,
        datasets: [
          {
            label: "Life Design Summary",
            data: [
              userStore.lifeDesignSummary.health.toFixed(2),
              userStore.lifeDesignSummary.work.toFixed(2),
              userStore.lifeDesignSummary.play.toFixed(2),
              userStore.lifeDesignSummary.love.toFixed(2),
            ],
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(255, 206, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
            ],
            borderWidth: 1,
          },
        ],
      });
    }
    logsInit();
  }, []);

  return useObserver(() => (
    <>
      {userStore.lifeDesignSummary ? (
        <div className="chart-box">
          <Doughnut data={chartData} />
        </div>
      ) : (
        <Loading />
      )}
    </>
  ));
};

export default LifeDesignSummary;
