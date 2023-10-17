import "./css/Card.css";
import React from "react";
import { ConvertDate, propNames } from "./lib/utils";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  mergeClasses,
} from "@fluentui/react-components";
import { Open16Regular } from "@fluentui/react-icons";
// import DataPopup from "./DataPopup";

const Card = (props) => {
  let statusBg = "";
  switch (props.Status) {
    case "In Progress":
      statusBg = "in_progress";
      break;

    case "Not Started":
      statusBg = "not_started";
      break;

    case "Completed":
      statusBg = "completed";
      break;

    default:
      break;
  }

  // console.log("huzefa", props);

  const DataPopup = () => {
    return (
      <>
        {/* <Dialog> */}
        <DialogSurface>
          <DialogBody>
            <DialogTitle>Dialog title</DialogTitle>
            <DialogContent>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
              exercitationem cumque repellendus eaque est dolor eius expedita
              nulla ullam? Tenetur reprehenderit aut voluptatum impedit
              voluptates in natus iure cumque eaque?
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary">Close</Button>
              </DialogTrigger>
              <Button appearance="primary">Do Something</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
        {/* </Dialog> */}
      </>
    );
  };

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
          <div class="ag-courses-item_date-box">
            <span class="ag-courses-item_date">{name}</span>:{" "}
            {checkDate?.toString() === "Invalid Date" || !isNaN(props[name])
              ? props[name]
              : props[name] && ConvertDate(props[name])}
          </div>
        );
      }
    }
    return temp;
  };

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  return (
    <div class="ag-format-container">
      <div class="ag-courses_box">
        <div class="ag-courses_item">
          <div class="ag-courses-item_link" /* onClick={DataPopup} */>
            <div
              class={mergeClasses("ag-courses-item_bg", `bg-for-${statusBg}`)}
            ></div>
            <div class="ag-courses-item_title">
              {toTitleCase(props.TaskTitle)}
            </div>
            {propHTML(false)}
            <div className="details-btn">
              <Dialog>
                <DialogTrigger disableButtonEnhancement>
                  <Button appearance="primary" icon={<Open16Regular />}>
                    Details
                  </Button>
                </DialogTrigger>
                <DialogSurface>
                  <div
                    class={mergeClasses(
                      "ag-courses-item_bg",
                      `bg-for-${statusBg}`
                    )}
                  ></div>
                  <DialogTitle>
                    <div class="ag-courses-item_title">
                      {toTitleCase(props.TaskTitle)}
                    </div>
                  </DialogTitle>
                  <DialogContent>{propHTML(true)}</DialogContent>
                  <DialogActions>
                    <DialogTrigger disableButtonEnhancement>
                      <div className="details-btn">
                        <Button appearance="secondary">Close</Button>
                      </div>
                    </DialogTrigger>
                    {/* <Button appearance="primary">Do Something</Button> */}
                  </DialogActions>
                </DialogSurface>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
