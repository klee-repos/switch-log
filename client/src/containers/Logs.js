import React, { useEffect } from "react";
import { useUserStore } from "../context/UserContext";
import { useObserver } from "mobx-react";
import Insight from "../api/Insight";

import { Magic } from "magic-sdk";
import Loading from "./Loading";
const magic = new Magic(process.env.REACT_APP_MAGIC_API_KEY);

const Logs = () => {
  const userStore = useUserStore();

  useEffect(() => {
    async function test() {
      let did = await magic.user.generateIdToken();
      const insight = new Insight(did);
      let messages = await insight.getMessageLog();
      console.log(messages);
      await userStore.setSenderMessages(messages.logs);
    }
    test();
  }, []);

  return useObserver(() => (
    <>
      {userStore.senderMessages.length > 0 ? (
        <div className="home-box">
          <table className="message-table">
            <thead className="message-table-head">
              <tr className="message-table-column">
                <th className="message-table-header">Message</th>
                <th className="message-table-header">Timestamp</th>
              </tr>
            </thead>
            <tbody className="message-table-body">
              {userStore.senderMessages.map((message) => (
                <tr key={message.timestamp} className="message-table-card">
                  <th className="message-table-cell">{message.senderMessage}</th>
                  <th className="message-table-cell">{message.timestamp}</th>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <Loading />
      )}
    </>
  ));
};

export default Logs;
