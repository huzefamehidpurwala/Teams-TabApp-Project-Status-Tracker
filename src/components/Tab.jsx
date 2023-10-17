import { useContext, useState } from "react";
import { TeamsFxContext } from "./Context";
// import config from "./lib/config";
import "./css/Tab.css";
import {
  Button,
  Spinner,
  Text,
  mergeClasses,
} from "@fluentui/react-components";
import { queryListAPI } from "./lib/utils";
import config from "./lib/config";
import { useData } from "@microsoft/teamsfx-react";
import { createPortal } from "react-dom";
import Card from "./Card";

const functionName = config.apiName || "getListItems";

function Modal(props) {
  return createPortal(props.children, document.getElementById(props.location));
}

export default function Tab(props) {
  const { themeString } = useContext(TeamsFxContext);
  const [needConsent, setNeedConsent] = useState(false);
  const { codePath } = {
    codePath: `api/${functionName}/index.js`,
    // docsUrl: "https://aka.ms/teamsfx-azure-functions",
    ...props,
  };
  const teamsUserCredential = useContext(TeamsFxContext).teamsUserCredential;
  const { loading, data, error, reload } = useData(async () => {
    if (!teamsUserCredential) {
      throw new Error("TeamsFx SDK is not initialized.");
    }
    if (needConsent) {
      await teamsUserCredential.login(["User.Read"]);
      setNeedConsent(false);
    }
    try {
      const functionRes = await queryListAPI(teamsUserCredential);
      /* console.log(
        "Huzefa",
        (await teamsUserCredential.getToken("")).token,
        "huzefa"
      ); */
      return functionRes;
    } catch (error) {
      if (error.message.includes("The application may not be authorized.")) {
        setNeedConsent(true);
      }
    }
  });
  // console.log(data);

  return (
    <div
      className={mergeClasses(
        themeString === "default"
          ? "light"
          : themeString === "dark"
          ? "dark"
          : "contrast",
        "container"
      )}
    >
      {loading && (
        <div className="loading">
          <Spinner size="huge" labelPosition="below" label="Fetching Data..." />
        </div>
      )}

      <div className="heading">
        <Text size={900}>Projects</Text>
      </div>

      {error && <div className="error">Fetching Data Failed</div>}

      <div className="flex-container">
        <div className="flex-item" id="Not Started">
          <div className="not-started">
            <Text size={700}>Not Started</Text>
          </div>
        </div>
        <div className="flex-item" id="In Progress">
          <div className="in-progress">
            <Text size={700}>In Progress</Text>
          </div>
        </div>
        <div className="flex-item" id="Completed">
          <div className="completed">
            <Text size={700}>Completed</Text>
          </div>
        </div>
      </div>

      {data && (
        <>
          {data.graphClientMessage.value.map((row, index) => {
            return (
              <Modal location={row.fields.Status}>
                {/* Code for Card */}
                <Card {...row.fields} />
              </Modal>
            );
          })}
        </>
      )}
    </div>
  );
}
