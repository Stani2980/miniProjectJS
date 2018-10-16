const DEV_DB_URI = "mongodb://<username>:<Password>@ds111072.mlab.com:11072/miniproject";
const TEST_DB_URI = "mongodb://<username>:<Password>@ds225543.mlab.com:25543/miniprojecttest";
const MOCHA_TEST_TIMEOUT = 5000;
const API_CALL_URL = "http://localhost:3000/api/";

module.exports = {
  DEV_DB_URI,
  TEST_DB_URI,
  MOCHA_TEST_TIMEOUT,
  API_CALL_URL,
}