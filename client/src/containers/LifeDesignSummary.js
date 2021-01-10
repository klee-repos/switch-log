import React, { useEffect } from "react";
import { useUserStore } from "../context/UserContext";
import { useObserver } from "mobx-react";
import Insight from "../api/Insight";

import { Magic } from "magic-sdk";
import Loading from "./Loading";
const magic = new Magic(process.env.REACT_APP_MAGIC_API_KEY);

const LifeDesignSummary = () => {
  const userStore = useUserStore();
  const [did, setDid] = React.useState(null);

  useEffect(() => {
    async function logsInit() {
      let generateIdToken = await magic.user.generateIdToken();
      setDid(generateIdToken);
      const insight = new Insight(generateIdToken);
      let summary = await insight.getSummary();
      console.log(summary);
      console.log(summary.health + summary.work + summary.play + summary.love);
      await userStore.setTotalHoursLogged(
        summary.health + summary.work + summary.play + summary.love
      );
      await userStore.setLifeDesignSummary(summary);
      console.log(
        parseFloat(userStore.lifeDesignSummary.health) /
          parseFloat(userStore.totalHoursLogged)
      );
    }
    logsInit();
  }, []);

  return useObserver(() => (
    <>
      {userStore.lifeDesignSummary ? (
        <div className="home-box">
          <table className="summary-table">
            <thead className="message-table-head">
              <tr className="message-table-column">
                <th className="message-table-header">Category</th>
                <th className="message-table-header">Distribution</th>
                <th className="message-table-header">Total (hrs)</th>
              </tr>
            </thead>
            <tbody className="message-table-body">
              <tr className="message-table-card">
                <th className="message-table-cell">Health</th>
                <th className="message-table-cell">
                  {Math.round(
                    (userStore.lifeDesignSummary.health /
                      userStore.totalHoursLogged) *
                      100
                  ) + "%"}
                </th>
                <th className="message-table-cell">
                  {userStore.lifeDesignSummary.health}
                </th>
              </tr>
              <tr className="message-table-card">
                <th className="message-table-cell">Work</th>
                <th className="message-table-cell">
                  {Math.round(
                    (userStore.lifeDesignSummary.work /
                      userStore.totalHoursLogged) *
                      100
                  ) + "%"}
                </th>
                <th className="message-table-cell">
                  {userStore.lifeDesignSummary.work}
                </th>
              </tr>
              <tr className="message-table-card">
                <th className="message-table-cell">Play</th>
                <th className="message-table-cell">
                  {Math.round(
                    (userStore.lifeDesignSummary.play /
                      userStore.totalHoursLogged) *
                      100
                  ) + "%"}
                </th>
                <th className="message-table-cell">
                  {userStore.lifeDesignSummary.play}
                </th>
              </tr>
              <tr className="message-table-card">
                <th className="message-table-cell">Love</th>
                <th className="message-table-cell">
                  {Math.round(
                    (userStore.lifeDesignSummary.love /
                      userStore.totalHoursLogged) *
                      100
                  ) + "%"}
                </th>
                <th className="message-table-cell">
                  {userStore.lifeDesignSummary.love}
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <Loading />
      )}
    </>
  ));
};

export default LifeDesignSummary;
