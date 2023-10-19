import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogContent,
  DialogSurface,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  Input,
  Label,
  Option,
  Textarea,
} from "@fluentui/react-components";
import { Add32Filled } from "@fluentui/react-icons";
import React, { useState } from "react";
import { ConvertDate, propNames, statusValues } from "./lib/utils";
import { DatePicker } from "@fluentui/react-datepicker-compat";

const PopUpForm = (props) => {
  const makeItDate = (date) => {
    return date ? new Date(date) : "";
  };

  const [projectTitle, setProjectTitle] = useState(
    props[propNames[0]] ? props[propNames[0]] : ""
  );
  const [taskTitle, setTaskTitle] = useState(
    props[propNames[1]] ? props[propNames[1]] : ""
  );
  const [taskDesc, setTaskDesc] = useState(
    props[propNames[2]] ? props[propNames[2]] : ""
  );
  const [taskStartDate, setTaskStartDate] = useState(
    makeItDate(props[propNames[3]] ? props[propNames[3]] : "")
  );
  const [taskEndDate, setTaskEndDate] = useState(
    makeItDate(props[propNames[4]] ? props[propNames[4]] : "")
  );
  const [taskStatusValue, setTaskStatusValue] = useState(
    props[propNames[5]] ? props[propNames[5]] : ""
  );
  const [taskComment, setTaskComment] = useState(
    props[propNames[6]] ? props[propNames[6]] : ""
  );

  return (
    <Dialog modalType="alert">
      <DialogTrigger disableButtonEnhancement>
        <div
          className={
            props.typeOfPopUp === "New Task"
              ? "add-task-btn-flex"
              : props.typeOfPopUp === "Edit Task"
              ? ""
              : ""
          }
        >
          <Button
            size="large"
            appearance="primary"
            className="add-task-btn"
            icon={<Add32Filled />}
          >
            {props.typeOfPopUp === "New Task"
              ? "Add New Task"
              : props.typeOfPopUp === "Edit Task"
              ? "Edit Task"
              : ""}
          </Button>
        </div>
      </DialogTrigger>
      <DialogSurface aria-describedby={undefined}>
        <form
          onSubmit={
            props.typeOfPopUp === "New Task"
              ? props.handleSubmit
              : props.typeOfPopUp === "Edit Task"
              ? (e) => props.handleSubmit(e, props.id)
              : () => {}
          }
        >
          <DialogBody>
            <DialogTitle>
              {props.typeOfPopUp === "New Task"
                ? "Add New Task"
                : props.typeOfPopUp === "Edit Task"
                ? "Edit Task"
                : ""}
            </DialogTitle>
            <DialogContent className="add-task-form">
              <Label required htmlFor={propNames[0]}>
                {/* {propNames[0]} */}
                Project Title
              </Label>
              <Input
                placeholder="type here..."
                required
                value={projectTitle}
                onChange={(e) => setProjectTitle(e.target.value)}
                type="text"
                id={propNames[0]}
              />
              <Label required htmlFor={propNames[1]}>
                {/* {propNames[1]} */}
                Task Title
              </Label>
              <Input
                placeholder="type here..."
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                type="text"
                id={propNames[1]}
              />
              <Label htmlFor={propNames[2]}>{propNames[2]}</Label>
              <Textarea
                placeholder="type here..."
                id={propNames[2]}
                value={taskDesc}
                onChange={(e) => setTaskDesc(e.target.value)}
              />
              <div className="date-pickers">
                <div className="date-picker">
                  <Label required htmlFor={propNames[3]}>
                    {propNames[3]}
                  </Label>
                  <DatePicker
                    id={propNames[3]}
                    formatDate={ConvertDate}
                    value={taskStartDate}
                    onSelectDate={(date) => {
                      const selectedDateVal = new Date(date);
                      setTaskStartDate(selectedDateVal);
                    }}
                    showGoToToday={true}
                    isMonthPickerVisible={false}
                    required
                    placeholder="Select a date..."
                  />
                </div>
                <div className="date-picker">
                  <Label htmlFor={propNames[4]}>{propNames[4]}</Label>
                  <DatePicker
                    id={propNames[4]}
                    formatDate={ConvertDate}
                    value={taskEndDate}
                    onSelectDate={(date) => {
                      const selectedDateVal = new Date(date);
                      setTaskEndDate(selectedDateVal);
                    }}
                    showGoToToday={true}
                    isMonthPickerVisible={false}
                    placeholder="Select a date..."
                  />
                </div>
              </div>
              <Label required htmlFor={propNames[5]}>
                {propNames[5]}
              </Label>
              <Dropdown
                id={propNames[5]}
                aria-labelledby="statusDropDown"
                placeholder="Select a status..."
                value={taskStatusValue}
                onOptionSelect={(e, data) =>
                  setTaskStatusValue(data.optionValue)
                }
              >
                {statusValues.map((value, index) => (
                  <Option key={value} value={value}>
                    <span
                      className={
                        index === 0
                          ? "not-started"
                          : index === 1
                          ? "in-progress"
                          : "completed"
                      }
                      style={{ width: "150px" }}
                    >
                      {value}
                    </span>
                  </Option>
                ))}
              </Dropdown>
              <Label htmlFor={propNames[6]}>{propNames[6]}</Label>
              <Input
                placeholder="type here..."
                type="text"
                id={propNames[6]}
                value={taskComment}
                onChange={(e) => setTaskComment(e.target.value)}
              />
            </DialogContent>
            <DialogActions>
              <DialogTrigger disableButtonEnhancement>
                <Button appearance="secondary" id="close-add-task-form">
                  Close
                </Button>
              </DialogTrigger>
              <Button
                type="submit"
                appearance="primary"
                id="submit-add-task-form"
              >
                Submit
              </Button>
            </DialogActions>
          </DialogBody>
        </form>
      </DialogSurface>
    </Dialog>
  );
};

export default PopUpForm;
