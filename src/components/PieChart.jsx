import { Button, Dropdown, Option } from "@fluentui/react-components";
import HighchartsReact from "highcharts-react-official";
import { useNavigate } from "react-router-dom";
import Highcharts from "highcharts";
import { ArrowLeft24Filled } from "@fluentui/react-icons";
import config from "./lib/config";
import { statusValues, toTitleCase } from "./lib/utils";
import { useState } from "react";
import "./css/Graph.css";
import exporting from "highcharts/modules/exporting";
exporting(Highcharts);

const PieChart = (props) => {
  const navigate = useNavigate();
  const [taskStatusValue, setTaskStatusValue] = useState(statusValues[0]);

  // ChatGPT
  // const getProjectTitles = () => {
  //   const projectTitlesSet = new Set();

  //   config.taskData?.value?.forEach((row) => {
  //     const title = row.fields["Title"];
  //     projectTitlesSet.add(title);
  //   });

  //   // Convert the Set to an array if needed
  //   const projectTitlesArray = Array.from(projectTitlesSet);

  //   // If you want to maintain the original order, you can use an array to deduplicate
  //   // const projectTitlesArray = [...projectTitlesSet];

  //   return projectTitlesArray;
  // };

  const getProjectInfoObj = () => {
    let projectInfoObj = {};
    config.taskData &&
      config.taskData.value?.forEach((row) => {
        const currentProjectTitle = row.fields["Title"];
        const currentStatus = row.fields["Status"];
        const conditionForStatus = statusValues.includes(currentStatus);

        // ! this should be commented to include name of the project that don't have any task
        if (!conditionForStatus) return;

        if (!(currentProjectTitle in projectInfoObj)) {
          // projectInfoObj.push(currentProjectTitle);
          projectInfoObj[currentProjectTitle] = {
            [statusValues[0]]: currentStatus === statusValues[0] ? 1 : 0,
            [statusValues[1]]: currentStatus === statusValues[1] ? 1 : 0,
            [statusValues[2]]: currentStatus === statusValues[2] ? 1 : 0,
          };
          projectInfoObj[currentProjectTitle].total = conditionForStatus
            ? 1
            : 0;
        } else {
          if (conditionForStatus) {
            projectInfoObj[currentProjectTitle][currentStatus]++;
            projectInfoObj[currentProjectTitle].total++;
          }
        }
      });

    // console.log("keseho", Object.keys(projectInfoObj));
    // console.log("keseho", projectInfoObj);
    return projectInfoObj;
  };

  // const getCountingStatusWise = () => {
  //   const projectInfoObj = getProjectInfoObj();
  //   console.log("dekho project", projectInfoObj);

  //   let countingsStatusWise = { total: 0 };
  //   for (const status of statusValues) {
  //     countingsStatusWise[status] = 0;
  //   }
  //   // console.log("created countings", countingsStatusWise);

  //   Object.keys(projectInfoObj)?.forEach((key) => {
  //     countingsStatusWise.total += projectInfoObj[key].total;
  //     for (const status of statusValues) {
  //       countingsStatusWise[status] += projectInfoObj[key][status];
  //     }
  //   });

  //   return countingsStatusWise;
  // };

  const getValForSeriesData = (selectedStatus) => {
    if (!selectedStatus) return;

    const projectInfoObj = getProjectInfoObj();
    // const countingsStatusWise = getCountingStatusWise();

    let data = [];
    Object.keys(projectInfoObj)?.forEach((key) => {
      data.push({
        name: toTitleCase(key),
        y: projectInfoObj[key][selectedStatus],
      });
    });

    return data;
  };

  // const getValForSeries = (selectedStatus) => {
  //   const projectTitles = getProjectTitles();

  //   // let series = [];
  //   // const data = Array.from({ length: projectTitles.length }, () => 0);
  //   // for (const status of statusValues) {
  //   //   /* let data = [];
  //   //   for (const _ of projectTitles) {
  //   //     data.push(0);
  //   //   } */
  //   //   /* projectTitles.forEach((_) => data.push(0));
  //   //   const data = Array.from({ length: projectTitles.length }, () => 0); */
  //   //   series.push({ name: status, data });
  //   // }

  //   // ChatGPT
  //   // const series = statusValues.map((name) => ({
  //   //   name,
  //   //   data: Array(projectTitles.length).fill(0),
  //   // }));
  //   // console.log("Helloods", series);

  //   let series = [{ name: "Tasks", colorByPoint: true, data: [] }];

  //   config.taskData &&
  //     config.taskData.value?.forEach((row) => {
  //       switch (row.fields["Status"]) {
  //         case statusValues[0]:
  //           series[0].data[projectTitles.indexOf(row.fields["Title"])]++;
  //           break;

  //         case statusValues[1]:
  //           series[1].data[projectTitles.indexOf(row.fields["Title"])]++;
  //           break;

  //         case statusValues[2]:
  //           series[2].data[projectTitles.indexOf(row.fields["Title"])]++;
  //           break;

  //         default:
  //           break;
  //       }
  //     });

  //   return series;
  // };

  const options = {
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: "pie",
    },
    title: {
      text: "Project Status",
      align: "left",
    },
    tooltip: {
      pointFormat: "{series.name}: <b>{point.percentage:.1f}%</b>",
    },
    exporting: {
      enabled: true,
    },
    accessibility: {
      point: {
        valueSuffix: "%",
      },
      enabled: false, // to supress the console warning
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "<b>{point.name}</b>: {point.percentage:.1f} %",
        },
      },
    },
    series: [
      {
        name: "Tasks",
        colorByPoint: true,
        data: getValForSeriesData(taskStatusValue),
      },
    ],
  };
  return (
    <div id="PieChart" style={{ height: "100vh", width: "100%" }}>
      {props.isPopUp ? (
        <></>
      ) : (
        <Button onClick={(e) => navigate(-1)} icon={<ArrowLeft24Filled />} />
      )}
      {/* <Button onClick={(e) => window.location.reload()}>Refresh</Button> */}
      <Button
        onClick={(e) =>
          console.log("kyu bhia", getValForSeriesData("Not Started"))
        }
      >
        Console
      </Button>
      <Dropdown
        // id={propNames[5]}
        aria-labelledby="statusDropDown"
        placeholder="Select a status..."
        value={taskStatusValue === "" ? null : taskStatusValue}
        onOptionSelect={(e, data) => setTaskStatusValue(data.optionValue)}
      >
        {statusValues.map((value, index) => (
          <Option key={value} value={value} text={value}>
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
      <HighchartsReact
        containerProps={props.isPopUp ? {} : { style: { height: "96%" } }}
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default PieChart;
