const config = {
  initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL,
  clientId: process.env.REACT_APP_CLIENT_ID,
  teamsAppId: process.env.REACT_APP_TEAMS_APP_ID,
  apiEndpoint: process.env.REACT_APP_FUNC_ENDPOINT,
  getApiName: process.env.REACT_APP_GET_FUNC_NAME,
  patchApiName: process.env.REACT_APP_PATCH_FUNC_NAME,
  deleteApiName: process.env.REACT_APP_DELETE_FUNC_NAME,
  postApiName: process.env.REACT_APP_POST_FUNC_NAME,
  notifyApiName: process.env.REACT_APP_NOTIFY_FUNC_NAME,
};

export default config;
