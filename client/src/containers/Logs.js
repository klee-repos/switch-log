import React, { useEffect } from "react";
import { useUserStore } from "../context/UserContext";
import { useObserver } from "mobx-react";
import Insight from "../api/Insight";

import { Magic } from "magic-sdk";
import Loading from "./Loading";
const magic = new Magic(process.env.REACT_APP_MAGIC_API_KEY);

const Logs = () => {
  const userStore = useUserStore();
  const [did, setDid] = React.useState(null);

  const setMessage = async (e) => {
    await userStore.updateASenderMessage(
      e.target.id.split("-")[1],
      document.getElementById(e.target.id).value
    );
    const insight = new Insight(did);
    insight.updateMessageLogs(userStore.senderMessages);
  };

  useEffect(() => {
    async function logsInit() {
      let generateIdToken = await magic.user.generateIdToken();
      setDid(generateIdToken);
      const insight = new Insight(generateIdToken);
      let messages = await insight.getMessageLog();
      await userStore.setSenderMessages(messages.logs);
    }
    logsInit();
  }, []);

  return useObserver(() => (
    <>
      {userStore.senderMessages.length > 0 ? (
        <div className="logs-container">
          <table className="message-table">
            <thead className="message-table-head">
              <tr className="message-table-column">
                <th className="message-table-header">Message</th>
                <th className="message-table-header">Timestamp</th>
              </tr>
            </thead>
            <tbody className="message-table-body">
              {userStore.senderMessages.map((message, index) => (
                <tr
                  key={"senderMessages-" + index}
                  className="message-table-card"
                >
                  <th className="message-table-cell">
                    <textarea
                      className="message-table-textarea"
                      id={"senderMessages-" + index}
                      key={"senderMessages-" + index}
                      value={message.senderMessage}
                      onChange={setMessage}
                    />
                  </th>
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
