import { useContext, useState } from "react";
import { TeamsFxContext } from "./Context";
import "./css/Tab.css";
import {
  Button,
  DialogSurface,
  Text,
  mergeClasses,
} from "@fluentui/react-components";
import {
  deleteListAPI,
  patchListAPI,
  postListAPI,
  propNames,
  queryListAPI,
  reqPropNames,
} from "./lib/utils";
import { useData } from "@microsoft/teamsfx-react";
import { createPortal } from "react-dom";
import Card from "./Card";
import PopUpForm from "./PopUpForm";
import SmallPopUp from "./SmallPopUp";

function Modal(props) {
  if (props.location) {
    return createPortal(
      props.children,
      document.getElementById(props.location)
    );
  } else {
    return;
  }
}

export default function Tab() {
  const { themeString } = useContext(TeamsFxContext);
  const [needConsent, setNeedConsent] = useState(false);
  /* const { codePath } = {
    codePath: `api/${getFunctionName}/index.js`,
    // docsUrl: "https://aka.ms/teamsfx-azure-functions",
    ...props,
  }; */
  const teamsUserCredential = useContext(TeamsFxContext).teamsUserCredential;
  const [pageLoading, setPageLoading] = useState(false);
  const [alertUser, setAlertUser] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [deleteTaskId, setDeleteTaskId] = useState("");

  // GET data method
  const { loading, data, error, reload } = useData(async () => {
    if (!teamsUserCredential) {
      throw new Error("TeamsFx SDK is not initialized.");
    }
    if (needConsent) {
      await teamsUserCredential.login(/* ["User.Read", ""] */);
      setNeedConsent(false);
    }
    try {
      const functionRes = await queryListAPI(teamsUserCredential);
      // console.log("Huzefa", functionRes, "huzefa");
      // setNeedConsent(false);
      return functionRes;
    } catch (error) {
      if (error.message.includes("The application may not be authorized.")) {
        setNeedConsent(true);
      }
    }
  });
  // console.log(getData);

  const changeInitialCss = (e) => {
    e.target.style.opacity = "0.4";
    e.target.style.backgroundColor =
      themeString === "default"
        ? "#DEDEDE"
        : themeString === "dark"
        ? "#3D3D3D"
        : "#3D3D3D";
  };

  const backToInitialCss = (e) => {
    e.target.style.opacity = "1";
    e.target.style.backgroundColor = "inherit";
  };

  const handleOnDragOver = (e) => {
    e.preventDefault();
    // e.target.style.opacity = "0.4";
  };

  const handleOnDragEnter = (e) => {
    e.preventDefault();

    const taskStatus = e.dataTransfer.getData("taskStatus");
    // console.log("i am in the same 1", e.target.id);
    // console.log("i am in the same 2", taskStatus);
    // console.log("i am in the same", e.target.id === taskStatus);
    if (e.target.id === taskStatus) return;

    changeInitialCss(e);
    // console.log("Drag Over", e);
  };

  const handleOnDragLeave = (e) => {
    e.preventDefault();

    // const taskStatus = e.dataTransfer.getData("taskStatus");
    // if (e.target.id === taskStatus) return;

    backToInitialCss(e);
    // console.log("Drag Over", e);
  };

  const handleOnDrop = async (e) => {
    e.preventDefault();
    backToInitialCss(e);
    const taskId = e.dataTransfer.getData("taskId");
    const taskStatus = e.dataTransfer.getData("taskStatus");
    // console.log("Dropped success", e.target.id);
    // console.log("Dropped success", taskStatus);

    if (e.target.id === taskStatus) return;

    // logic here
    setPageLoading(true);
    const something = await patchListAPI(teamsUserCredential, {
      taskId,
      taskStatus: { Status: e.target.id },
    });
    // console.log("success for jamali", something);
    something === 200 ? reload() : console.error("failed update", something);
    setPageLoading(false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();

    for (const field of e.target) {
      console.log("outside", field.id, "====", field.value);
      if (reqPropNames.includes(field.id)) {
        console.log("inside", field.id, "====", field.value);
        if (!field.value) {
          // alert the user
          setAlertUser(true);
          setAlertTitle("You missed some Important Fields to be filled!");
          // console.error("any field empty");
          return;
        }
      }
    }

    setPageLoading(true);
    let dataForPost = {};
    for (const field of e.target) {
      // console.log(field.id, field.value);
      // console.log(propNames.includes(field.id));

      if (propNames.includes(field.id)) {
        if (field.id !== "Start" && field.id !== "End") {
          dataForPost = { ...dataForPost, [field.id]: field.value };
        } else {
          const dateObj = new Date(field.value);
          dataForPost = { ...dataForPost, [field.id]: dateObj };
        }
      }
    }

    for (const name of reqPropNames) {
      if (reqPropNames.includes(name)) {
      }
    }
    // console.log("submit success", dataForPost);
    const something = await postListAPI(teamsUserCredential, dataForPost);
    // console.log("success for jamali", something);
    something === 200 ? reload() : console.error("failed update", something);
    setPageLoading(false);
  };

  const handleTaskEdit = async (e, taskId) => {
    e.preventDefault();

    for (const field of e.target) {
      console.log("outside", field.id, "====", field.value);
      if (reqPropNames.includes(field.id)) {
        console.log("inside", field.id, "====", field.value);
        if (!field.value) {
          // alert the user
          setAlertUser(true);
          setAlertTitle("You missed some Important Fields to be filled!");
          // console.error("any field empty");
          return;
        }
      }
    }

    setPageLoading(true);
    let dataForPatch = {};
    for (const field of e.target) {
      // console.log(field.id, field.value);
      // console.log(propNames.includes(field.id));

      if (propNames.includes(field.id)) {
        if (field.id !== "Start" && field.id !== "End") {
          dataForPatch = { ...dataForPatch, [field.id]: field.value };
        } else {
          const dateObj = new Date(field.value);
          dataForPatch = { ...dataForPatch, [field.id]: dateObj };
        }
      }
    }

    // console.log("submit success", taskId, dataForPatch);
    const something = await patchListAPI(teamsUserCredential, {
      taskId,
      taskStatus: dataForPatch,
    });
    // console.log("success for jamali", something);
    something === 200 ? reload() : console.error("failed update", something);
    setPageLoading(false);
  };

  const handleTaskDelete = async (taskId) => {
    // console.log({ taskId });

    setPageLoading(true);
    const something = await deleteListAPI(teamsUserCredential, { taskId });
    // console.log("success for jamali", something);
    something === 200 ? reload() : console.error("failed update", something);
    setDeleteTaskId("");
    setAlertUser(false);
    setPageLoading(false);
  };

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
      {error || needConsent ? (
        <DialogSurface>
          <div className="error">
            <Text size={800}>Fetching Data Failed</Text>
            <br />
            <br />
            <Button appearance="primary" disabled={loading} onClick={reload}>
              Authorize and call Azure Function
            </Button>
          </div>
        </DialogSurface>
      ) : (
        <>
          <SmallPopUp
            className="loading"
            msg={
              loading
                ? "Fetching Data..."
                : pageLoading
                ? "Updating Data..."
                : ""
            }
            open={pageLoading || loading}
            spinner={true}
            modalType="alert"
          />

          <SmallPopUp
            // className="loading"
            // msg="Fetching Data..."
            open={alertUser}
            spinner={false}
            deleteTaskId={deleteTaskId}
            onOpenChange={(e, data) => setAlertUser(data.open)}
            title={alertTitle}
            modalType="alert"
            taskDelete={handleTaskDelete}
          />

          <div className="heading">
            <Text size={900}>Projects Tracker</Text>
          </div>

          <PopUpForm
            typeOfPopUp="New Task"
            handleSubmit={handleAddTask}
            btnClass="add-task-btn"
          />

          <div className="flex-container">
            <div
              className="flex-item"
              id="Not Started"
              droppable="true"
              onDragEnter={handleOnDragEnter}
              onDragLeave={handleOnDragLeave}
              onDragOver={handleOnDragOver}
              onDrop={handleOnDrop}
            >
              <div className="not-started">
                <Text size={700}>Not Started</Text>
              </div>
            </div>

            <div
              className="flex-item"
              id="In Progress"
              droppable="true"
              onDragEnter={handleOnDragEnter}
              onDragLeave={handleOnDragLeave}
              onDragOver={handleOnDragOver}
              onDrop={handleOnDrop}
            >
              <div className="in-progress">
                <Text size={700}>In Progress</Text>
              </div>
            </div>

            <div
              className="flex-item"
              id="Completed"
              droppable="true"
              onDragEnter={handleOnDragEnter}
              onDragLeave={handleOnDragLeave}
              onDragOver={handleOnDragOver}
              onDrop={handleOnDrop}
            >
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
                    <Card
                      {...row.fields}
                      reactKey={index}
                      taskDelete={(taskId) => {
                        setAlertUser(true);
                        setDeleteTaskId(taskId);
                        setAlertTitle("Are you sure to delete the Task?");
                      }}
                      taskEdit={handleTaskEdit}
                    />
                  </Modal>
                );
              })}
            </>
          )}
        </>
      )}
    </div>
  );
}
