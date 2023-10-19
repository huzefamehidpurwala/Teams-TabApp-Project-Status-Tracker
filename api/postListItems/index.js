/* This code sample provides a starter kit to implement server side logic for your Teams App in JavaScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

// Import polyfills for fetch required by msgraph-sdk-javascript.
require("isomorphic-fetch");
const teamsfxSdk = require("@microsoft/teamsfx");
const { Client } = require("@microsoft/microsoft-graph-client");
const {
  TokenCredentialAuthenticationProvider,
} = require("@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials");
const config = require("../config");

/**
 * This function handles requests from teamsfx client.
 * The HTTP request should contain an SSO token queried from Teams in the header.
 * Before trigger this function, teamsfx binding would process the SSO token and generate teamsfx configuration.
 *
 * This function initializes the teamsfx SDK with the configuration and calls these APIs:
 * - new OnBehalfOfUserCredential(ssoToken, authConfig)  - Construct OnBehalfOfUserCredential instance with the received SSO token and initialized configuration.
 * - getUserInfo() - Get the user's information from the received SSO token.
 *
 * The response contains multiple message blocks constructed into a JSON object, including:
 * - An echo of the request body.
 * - The display name encoded in the SSO token.
 * - Current user's Microsoft 365 profile if the user has consented.
 *
 * @param {Context} context - The Azure Functions context object.
 * @param {HttpRequest} req - The HTTP request.
 * @param {teamsfxContext} { [key: string]: any; } - The context generated by teamsfx binding.
 */
module.exports = async function (context, req, teamsfxContext) {
  context.log("HTTP trigger patchFunction processed a request.");
  // console.log("keseho", context.bindings.req.body);
  // console.log("keseho", context.req.body.taskId);
  // console.log("keseho", context.req.body.taskStatus);

  // Initialize response.
  const res = {
    status: 200,
    body: {},
  };

  // Put an echo into response body.
  res.body.receivedHTTPRequestBody = req.body || "";

  // Prepare access token.
  const ssoToken = teamsfxContext["AccessToken"];
  if (!ssoToken) {
    return {
      status: 400,
      body: {
        error: "No access token was found in request header.",
      },
    };
  }

  // Construct TeamsFx using user identity.
  let credential;
  try {
    const authConfig = {
      authorityHost: config.authorityHost,
      tenantId: config.tenantId,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
    };
    credential = new teamsfxSdk.OnBehalfOfUserCredential(ssoToken, authConfig);
  } catch (e) {
    context.log.error(e);
    return {
      status: 500,
      body: {
        error:
          "Failed to construct OnBehalfOfUserCredential using your ssoToken. " +
          "Ensure your function app is configured with the right Azure AD App registration.",
      },
    };
  }

  // Query user's information from the access token.
  try {
    const currentUser = await credential.getUserInfo();
    if (currentUser && currentUser.displayName) {
      res.body.userInfoMessage = `User display name is ${currentUser.displayName}.`;
    } else {
      res.body.userInfoMessage =
        "No user information was found in access token.";
    }
  } catch (e) {
    context.log.error(e);
    return {
      status: 400,
      body: {
        error: "Access token is invalid.",
      },
    };
  }

  // Create a graph client to access user's Microsoft 365 data after user has consented.
  try {
    // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
    const authProvider = new TokenCredentialAuthenticationProvider(credential, {
      scopes: ["https://graph.microsoft.com/.default"],
    });

    // Initialize Graph client instance with authProvider
    const graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });

    // POST = create
    // console.log("chal bhai", { fields: context.req.body.newTask });
    const profile = await graphClient
      .api(
        `/sites/c5fa4bd2-2e58-4052-a66c-48590bf3ab3d/lists/0c1cde44-dbb4-441d-b169-1b408e68c31a/items`
      )
      .post({ fields: context.req.body.newTask });
    res.body.graphClientMessage = profile;
    // console.log("success", profile);
  } catch (e) {
    context.log.error(e);
    return {
      status: 500,
      body: {
        error:
          "Failed to retrieve user profile from Microsoft Graph. The application may not be authorized.",
      },
    };
  }

  return res;
};
