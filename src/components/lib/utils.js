import { BearerTokenAuthProvider, createApiClient } from "@microsoft/teamsfx";
import config from "./config";
import * as msTeams from "@microsoft/teams-js";

const getFunctionName = config.getApiName || "getListItems";
const patchFunctionName = config.patchApiName || "patchListItems";
const postFunctionName = config.postApiName || "postListItems";
const deleteFunctionName = config.deleteApiName || "deleteListItems";
const notifyFunctionName = config.notifyApiName || "activityNotification";

export async function sendNotificationAPI(teamsUserCredential, dataForNotify) {
  if (!teamsUserCredential) {
    throw new Error("TeamsFx SDK is not initialized.");
  }
  try {
    const apiBaseUrl = config.apiEndpoint + "/api/";
    // createApiClient(...) creates an Axios instance which uses BearerTokenAuthProvider to inject token to request header
    const apiClient = createApiClient(
      apiBaseUrl,
      new BearerTokenAuthProvider(
        async () => (await teamsUserCredential.getToken("")).token
      )
    );
    const response = await apiClient.post(notifyFunctionName, dataForNotify);
    // console.log(response, "patch Huzefa");
    return parseInt(response.status);
  } catch (err) {
    let funcErrorMsg = "";
    if (err?.response?.status === 404) {
      funcErrorMsg = `There may be a problem with the deployment of Azure Function App, please deploy Azure Function (Run command palette "Teams: Deploy") first before running this App`;
    } else if (err.message === "Network Error") {
      funcErrorMsg =
        "Cannot call Azure Function due to network error, please check your network connection status and ";
      if (err.config.url.indexOf("localhost") >= 0) {
        funcErrorMsg += `make sure to start Azure Function locally (Run "npm run start" command inside api folder from terminal) first before running this App`;
      } else {
        funcErrorMsg += `make sure to provision and deploy Azure Function (Run command palette "Teams: Provision" and "Teams: Deploy") first before running this App`;
      }
    } else {
      funcErrorMsg = err.message;
      if (err.response?.data?.error) {
        funcErrorMsg += ": " + err.response.data.error;
      }
    }
    throw new Error(funcErrorMsg);
  }
}

export async function patchListAPI(teamsUserCredential, dataForPatch) {
  if (!teamsUserCredential) {
    throw new Error("TeamsFx SDK is not initialized.");
  }
  try {
    const apiBaseUrl = config.apiEndpoint + "/api/";
    // createApiClient(...) creates an Axios instance which uses BearerTokenAuthProvider to inject token to request header
    const apiClient = createApiClient(
      apiBaseUrl,
      new BearerTokenAuthProvider(
        async () => (await teamsUserCredential.getToken("")).token
      )
    );
    const response = await apiClient.post(patchFunctionName, dataForPatch);
    // console.log(response, "patch Huzefa");
    return parseInt(response.status);
  } catch (err) {
    let funcErrorMsg = "";
    if (err?.response?.status === 404) {
      funcErrorMsg = `There may be a problem with the deployment of Azure Function App, please deploy Azure Function (Run command palette "Teams: Deploy") first before running this App`;
    } else if (err.message === "Network Error") {
      funcErrorMsg =
        "Cannot call Azure Function due to network error, please check your network connection status and ";
      if (err.config.url.indexOf("localhost") >= 0) {
        funcErrorMsg += `make sure to start Azure Function locally (Run "npm run start" command inside api folder from terminal) first before running this App`;
      } else {
        funcErrorMsg += `make sure to provision and deploy Azure Function (Run command palette "Teams: Provision" and "Teams: Deploy") first before running this App`;
      }
    } else {
      funcErrorMsg = err.message;
      if (err.response?.data?.error) {
        funcErrorMsg += ": " + err.response.data.error;
      }
    }
    throw new Error(funcErrorMsg);
  }
}

export async function deleteListAPI(teamsUserCredential, dataForDelete) {
  if (!teamsUserCredential) {
    throw new Error("TeamsFx SDK is not initialized.");
  }
  try {
    const apiBaseUrl = config.apiEndpoint + "/api/";
    // createApiClient(...) creates an Axios instance which uses BearerTokenAuthProvider to inject token to request header
    const apiClient = createApiClient(
      apiBaseUrl,
      new BearerTokenAuthProvider(
        async () => (await teamsUserCredential.getToken("")).token
      )
    );
    const response = await apiClient.post(deleteFunctionName, dataForDelete);
    // console.log(response, "patch Huzefa");
    return parseInt(response.status);
  } catch (err) {
    let funcErrorMsg = "";
    if (err?.response?.status === 404) {
      funcErrorMsg = `There may be a problem with the deployment of Azure Function App, please deploy Azure Function (Run command palette "Teams: Deploy") first before running this App`;
    } else if (err.message === "Network Error") {
      funcErrorMsg =
        "Cannot call Azure Function due to network error, please check your network connection status and ";
      if (err.config.url.indexOf("localhost") >= 0) {
        funcErrorMsg += `make sure to start Azure Function locally (Run "npm run start" command inside api folder from terminal) first before running this App`;
      } else {
        funcErrorMsg += `make sure to provision and deploy Azure Function (Run command palette "Teams: Provision" and "Teams: Deploy") first before running this App`;
      }
    } else {
      funcErrorMsg = err.message;
      if (err.response?.data?.error) {
        funcErrorMsg += ": " + err.response.data.error;
      }
    }
    throw new Error(funcErrorMsg);
  }
}

export async function postListAPI(teamsUserCredential, dataForPost) {
  if (!teamsUserCredential) {
    throw new Error("TeamsFx SDK is not initialized.");
  }
  try {
    const apiBaseUrl = config.apiEndpoint + "/api/";
    // createApiClient(...) creates an Axios instance which uses BearerTokenAuthProvider to inject token to request header
    const apiClient = createApiClient(
      apiBaseUrl,
      new BearerTokenAuthProvider(
        async () => (await teamsUserCredential.getToken("")).token
      )
    );
    const response = await apiClient.post(postFunctionName, {
      newTask: dataForPost,
    });
    // console.log(response, "patch Huzefa");
    return parseInt(response.status);
  } catch (err) {
    let funcErrorMsg = "";
    if (err?.response?.status === 404) {
      funcErrorMsg = `There may be a problem with the deployment of Azure Function App, please deploy Azure Function (Run command palette "Teams: Deploy") first before running this App`;
    } else if (err.message === "Network Error") {
      funcErrorMsg =
        "Cannot call Azure Function due to network error, please check your network connection status and ";
      if (err.config.url.indexOf("localhost") >= 0) {
        funcErrorMsg += `make sure to start Azure Function locally (Run "npm run start" command inside api folder from terminal) first before running this App`;
      } else {
        funcErrorMsg += `make sure to provision and deploy Azure Function (Run command palette "Teams: Provision" and "Teams: Deploy") first before running this App`;
      }
    } else {
      funcErrorMsg = err.message;
      if (err.response?.data?.error) {
        funcErrorMsg += ": " + err.response.data.error;
      }
    }
    throw new Error(funcErrorMsg);
  }
}

export async function queryListAPI(teamsUserCredential) {
  if (!teamsUserCredential) {
    throw new Error("TeamsFx SDK is not initialized.");
  }
  try {
    const apiBaseUrl = config.apiEndpoint + "/api/";
    // createApiClient(...) creates an Axios instance which uses BearerTokenAuthProvider to inject token to request header
    const apiClient = createApiClient(
      apiBaseUrl,
      new BearerTokenAuthProvider(
        async () => (await teamsUserCredential.getToken("")).token
      )
    );
    const response = await apiClient.get(getFunctionName);
    // console.log(response, "Huzefa");
    config.taskData = response.data.graphClientMessage;
    return response.data;
  } catch (err) {
    let funcErrorMsg = "";
    if (err?.response?.status === 404) {
      funcErrorMsg = `There may be a problem with the deployment of Azure Function App, please deploy Azure Function (Run command palette "Teams: Deploy") first before running this App`;
    } else if (err.message === "Network Error") {
      funcErrorMsg =
        "Cannot call Azure Function due to network error, please check your network connection status and ";
      if (err.config.url.indexOf("localhost") >= 0) {
        funcErrorMsg += `make sure to start Azure Function locally (Run "npm run start" command inside api folder from terminal) first before running this App`;
      } else {
        funcErrorMsg += `make sure to provision and deploy Azure Function (Run command palette "Teams: Provision" and "Teams: Deploy") first before running this App`;
      }
    } else {
      funcErrorMsg = err.message;
      if (err.response?.data?.error) {
        funcErrorMsg += ": " + err.response.data.error;
      }
    }
    throw new Error(funcErrorMsg);
  }
}

/* const dataColumns = [
    "Title",
    "Description",
    "Start",
    "End",
    "Status",
    "Comment",
  ]; */
export const statusValues = ["Not Started", "In Progress", "Completed"];

export const propNames = [
  "Title",
  "TaskTitle",
  "Description",
  "Start",
  "End",
  "Status",
  "Comment",
];

export const reqPropNames = ["Title", "TaskTitle", "Start", "Status"];

export function ConvertDate(str) {
  var date = new Date(str),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  return [day, mnth, date.getFullYear()].join("-");
}

export function toTitleCase(str) {
  // Convert underscores, hyphens, and camelCase to spaces
  str = str
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2");

  // Add a space before a capital letter if it's preceded by a lowercase letter
  str = str.replace(/([a-z])([A-Z])/g, "$1 $2");

  return str.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
}

export function compareObjects(object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (object1[key] !== object2[key]) {
      return false;
    }
  }

  return true;
}

export const redirectUsingDeeplink = (pathName) => {
  // var encodedContext = `{"subEntityId":  ${data}}`;

  const webUrl = `https://teams.microsoft.com/l/entity/${config.teamsAppId}${pathName}`;
  msTeams.executeDeepLink(webUrl);
};
