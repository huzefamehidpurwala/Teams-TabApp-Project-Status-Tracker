import "./css/Card.css";
import React from "react";
import { ConvertDate, propNames, toTitleCase } from "./lib/utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  mergeClasses,
} from "@fluentui/react-components";
import {
  Delete24Regular,
  DragRegular,
  Open16Regular,
} from "@fluentui/react-icons";
import PopUpForm from "./PopUpForm";

const Card = (props) => {
  let statusBg = "";
  let borderBg = "";
  switch (props.Status) {
    case "In Progress":
      statusBg = "in_progress";
      borderBg = "in_progress";
      break;

    case "Not Started":
      statusBg = "not_started";
      borderBg = "not_started";
      break;

    case "Completed":
      statusBg = "completed";
      borderBg = "completed";
      break;

    default:
      break;
  }

  const propHTML = (isDialog) => {
    let temp = [];
    for (const name of propNames) {
      const checkDate = props[name] && new Date(props[name]);
      const checkCondition = isDialog
        ? props[name] && name !== "TaskTitle"
        : props[name] &&
          name !== "TaskTitle" &&
          name !== "Status" &&
          name !== "Comment";
      if (checkCondition) {
        temp.push(
          <div
            className="ag-courses-item_date-box"
            key={`${name}-${props.reactKey}`}
          >
            <span className="ag-courses-item_date">{name}</span>:{" "}
            {checkDate?.toString() === "Invalid Date" || !isNaN(props[name])
              ? props[name]
              : props[name] && ConvertDate(props[name])}
          </div>
        );
      }
    }
    return temp;
  };

  // onDragStart
  // onDragOver
  // onDrop

  return (
    <div
      className="ag-format-container"
      onDragOver={(e) => e.stopPropagation()}
    >
      <div className="ag-courses_box">
        <div
          className={mergeClasses("ag-courses_item", `border-for-${borderBg}`)}
        >
          <div className="ag-courses-item_link" /* onClick={DataPopup} */>
            <div
              className={mergeClasses(
                "ag-courses-item_bg",
                `bg-for-${statusBg}`
              )}
            ></div>
            <div className="ag-courses-item_title">
              {toTitleCase(props.TaskTitle)}
            </div>
            {propHTML(false)}
            <div className="card-btn">
              <div className="primary-card-btn">
                <Dialog>
                  <DialogTrigger disableButtonEnhancement>
                    <div className="details-btn">
                      <Button appearance="primary" icon={<Open16Regular />}>
                        Details
                      </Button>
                    </div>
                  </DialogTrigger>
                  <DialogSurface>
                    <div
                      className={mergeClasses(
                        "ag-courses-item_bg",
                        `bg-for-${statusBg}`
                      )}
                      style={{ height: "170px", width: "170px" }}
                    ></div>
                    <DialogTitle>
                      <div className="ag-courses-item_title">
                        {toTitleCase(props.TaskTitle)}
                      </div>
                    </DialogTitle>
                    <DialogContent>{propHTML(true)}</DialogContent>
                    <DialogActions>
                      <div className="card-btn">
                        <DialogTrigger disableButtonEnhancement>
                          <Button appearance="secondary">Close</Button>
                        </DialogTrigger>
                        <PopUpForm
                          typeOfPopUp="Edit Task"
                          handleSubmit={props.taskEdit}
                          // taskId={props.id}
                          {...props}
                        />
                      </div>
                    </DialogActions>
                  </DialogSurface>
                </Dialog>
                <div className="drag-btn">
                  <Button
                    className="cursor-drag-btn"
                    appearance="primary"
                    icon={<DragRegular />}
                    // style={{ "cursor:hover": "grab !important" }}
                    draggable={true}
                    onDragStart={(e) => {
                      // console.log("Dropped Drag started", props.id, e);
                      e.dataTransfer.setData("taskId", props.id);
                      e.dataTransfer.setData("taskStatus", props.Status);
                    }}
                  >
                    Drag
                  </Button>
                </div>
              </div>
              <div className="delete-btn">
                <Button
                  appearance="secondary"
                  icon={<Delete24Regular />}
                  onClick={(e) => {
                    props.taskDelete(props.id);
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
