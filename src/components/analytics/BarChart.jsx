import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Button } from "@fluentui/react-components";
import { useNavigate } from "react-router-dom";
import { ArrowLeft24Filled } from "@fluentui/react-icons";
import config from "../lib/config";
import { statusValues, toTitleCase } from "../lib/utils";
// import "./css/Graph.css";
import exporting from "highcharts/modules/exporting";
exporting(Highcharts);

const Graph = (props) => {
  const navigate = useNavigate();

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

  const getProjectTitles = () => {
    let projectTitles = {};
    config.taskData &&
      config.taskData.value?.forEach((row) => {
        if (!(row.fields["Title"] in projectTitles)) {
          // projectTitles.push(row.fields["Title"]);
          projectTitles[row.fields["Title"]] = "";
        }
      });

    // console.log("keseho", Object.keys(projectTitles));
    return Object.keys(projectTitles);
  };

  const getValForSeries = () => {
    const projectTitles = getProjectTitles();

    // let series = [];
    // const data = Array.from({ length: projectTitles.length }, () => 0);
    // for (const status of statusValues) {
    //   /* let data = [];
    //   for (const _ of projectTitles) {
    //     data.push(0);
    //   } */
    //   /* projectTitles.forEach((_) => data.push(0));
    //   const data = Array.from({ length: projectTitles.length }, () => 0); */
    //   series.push({ name: status, data });
    // }
    const series = statusValues.map((name) => ({
      name,
      data: Array(projectTitles.length).fill(0),
    }));
    // console.log("Helloods", series);

    config.taskData &&
      config.taskData.value?.forEach((row) => {
        switch (row.fields["Status"]) {
          case statusValues[0]:
            series[0].data[projectTitles.indexOf(row.fields["Title"])]++;
            break;

          case statusValues[1]:
            series[1].data[projectTitles.indexOf(row.fields["Title"])]++;
            break;

          case statusValues[2]:
            series[2].data[projectTitles.indexOf(row.fields["Title"])]++;
            break;

          default:
            break;
        }
      });

    return series;
  };

  const updateProjectTitles = (arrToUpdate) => {
    return arrToUpdate.map((str) => toTitleCase(str));
  };

  const options = {
    chart: {
      type: "bar",
    },
    title: {
      text: "Project Status",
      // align: "left",
    },
    // subtitle: {
    //   text: '<div style="color: red">Huzefa</div>',
    //   align: "left",
    // },
    // navigation: {
    //   buttonOptions: {
    //     enabled: true,
    //   },
    // },
    exporting: {
      enabled: true,
    },
    xAxis: {
      categories: updateProjectTitles(getProjectTitles()), // ["Africa", "America", "Asia", "Europe", "Oceania"], // ! Project Title here
      title: {
        text: "Project Title",
        // align: "low",
      },
      gridLineWidth: 3, // width of the line that seperates projects data project title wise
      lineWidth: 0.3, // width of the line that is known as axis
    },
    yAxis: {
      min: 0,
      title: {
        text: "Number of Tasks",
        // align: "high",
      },
      labels: {
        overflow: "justify",
      },
      gridLineWidth: 0,
    },
    // the popup shown on mouse-hover
    tooltip: {
      valueSuffix: " tasks",
    },
    accessibility: {
      enabled: false, // to supress the console warning
    },
    plotOptions: {
      bar: {
        borderRadius: "50%",
        dataLabels: {
          enabled: true, // to show the value of data after the bar
        },
        groupPadding: 0.1, // this defines the thickness of bar
      },
    },
    // this is the card shown that helps to understand which color represents the respective data
    legend: {
      layout: "vertical",
      align: "right",
      verticalAlign: "top",
      x: -40,
      y: 80,
      floating: true,
      borderWidth: 1,
      backgroundColor:
        Highcharts.defaultOptions.legend.backgroundColor || "#FFFFFF",
      shadow: true,
    },
    // this is the domain name shown below the chart when enabled
    credits: {
      enabled: false,
    },
    series: getValForSeries(),
  };

  return (
    <div id="Graph" /*  style={{ height: "100vh", width: "100%" }} */>
      {props.isPopUp ? (
        <></>
      ) : (
        <Button onClick={(e) => navigate(-1)} icon={<ArrowLeft24Filled />} />
      )}
      {/* <Button onClick={(e) => window.location.reload()}>Refresh</Button> */}
      {/* <Button onClick={(e) => console.log("kyu bhia", getValForSeries())}>Console</Button> */}
      <HighchartsReact
        containerProps={props.isPopUp ? {} : { style: { height: "96%" } }}
        highcharts={Highcharts}
        options={options}
      />
    </div>
  );
};

export default Graph;
