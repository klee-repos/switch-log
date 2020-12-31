import axios from "axios";

class Insight {
  constructor(did) {
    this.did = did;
  }

  async getMessageLog() {
    try {
      let results = await axios({
        method: `post`,
        url: `/insight/get-message-logs`,
        data: {
          did: this.did,
        },
      });
      return results.data;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

export default Insight;