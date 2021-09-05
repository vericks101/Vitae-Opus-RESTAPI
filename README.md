# Vitae-Opus-RESTAPI
A repository to represent the server back end for Vitae Opus, a flexible platform for hosting and managing your experiences.

Check out the front-end website repository: https://github.com/vericks101/Vitae-Opus-Web

## Local Setup and Configuration
Ensure `node_modules` is available else the application will fail to run. If needed, run `npm install` to pull the needed dependencies.

You will also need to provide a `.env` file with the following configuration parameters provided:
```
DB_CONNECT
TOKEN_SECRET
EMAIL_ADDRESS
EMAIL_CLIENT_ID
EMAIL_CLIENT_SECRET
EMAIL_REFRESH_TOKEN
EMAIL_ACCESS_TOKEN
```

Once the above is followed, run `npm start` to locally start up the server application.
