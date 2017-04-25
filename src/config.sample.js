export default {
  // Server run details
  server: {
    host: "localhost",
    port: 8080,
  },

  // Swagger documentation details
  documentation: {
    info: {
      "title": "API Documentation",
      "version": "0.0.1",
    },
    securityDefinitions: {
      "jwt": {
        "type": "apiKey",
        "name": "Authorization",
        "in": "header"
      }
    },
    "swaggerUI": process.env.NODE_ENV !== "production",
    "documentationPage": process.env.NODE_ENV !== "production",
  },
  jwt: {
    secret: "TrU5Tr183",
  }
};