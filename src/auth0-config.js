export const auth0Config = {
  domain: process.env.REACT_APP_AUTH0_DOMAIN || "franccescopetta.us.auth0.com",
  clientId: process.env.REACT_APP_AUTH0_CLIENT_ID || "h1SYjGM6qWwIZMRTOSI7yjdjEzp3iAkS",
  authorizationParams: {
    redirect_uri: `${window.location.origin}/login`,
    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
    scope: "openid profile email",
  },
};