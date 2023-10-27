import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { Button, DialogSurface, Text } from "@fluentui/react-components";
import "./../css/AnalyticsBarChart.css";
import {
  queryListAPI,
  redirectUsingDeeplink,
  statusValues,
  toTitleCase,
} from "../lib/utils";
import { useContext, useState } from "react";
import { TeamsFxContext } from "../Context";
import { useData } from "@microsoft/teamsfx-react";
import SmallPopUp from "../SmallPopUp";
import exporting from "highcharts/modules/exporting";
import { NavLink } from "react-router-dom";
exporting(Highcharts);

const Graph = () => {
  const { themeString } = useContext(TeamsFxContext);
  const teamsUserCredential = useContext(TeamsFxContext).teamsUserCredential;
  const [needConsent, setNeedConsent] = useState(false);

  // GET data method
  const { loading, data, error, reload } = useData(async () => {
    if (!teamsUserCredential) {
      throw new Error("TeamsFx SDK is not initialized.");
    }
    if (needConsent) {
      await teamsUserCredential.login(["User.Read"]); // ["AllSites.Write", "AllSites.Manage", "AllSites.Read"]
      setNeedConsent(false);
    }
    // console.log(data);
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

  const getProjectTitles = () => {
    let projectTitles = {};
    data?.graphClientMessage &&
      data?.graphClientMessage.value?.forEach((row) => {
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
    // console.log(series);

    data?.graphClientMessage &&
      data?.graphClientMessage.value?.forEach((row) => {
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
    navigation: {
      buttonOptions: {
        enabled: true,
      },
    },
    exporting: {
      enabled: true,
    },
    accessibility: {
      enabled: false, // to supress the console warning
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
    <div
      className={
        themeString === "default"
          ? "light"
          : themeString === "dark"
          ? "dark"
          : "contrast"
      }
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
            msg={"Fetching Data..."}
            open={loading}
            spinner={true}
            modalType="alert"
          />

          <Button onClick={(e) => redirectUsingDeeplink("/index")}>
            Task List
          </Button>
          <NavLink to={"/piechart"} className="nav-link">
            <Text size={400}>PieChart</Text>
          </NavLink>
          {/* <Button onClick={(e) => window.location.reload()}>Refresh</Button> */}
          {/* <Button onClick={(e) => console.log(getValForSeries())}>Console</Button> */}
          {data && (
            <HighchartsReact
              containerProps={{ style: { height: "96%" } }}
              highcharts={Highcharts}
              options={options}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Graph;
