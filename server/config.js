// for testing purposes, we will use a static secret key.

// const generateSecretKey = () => {
//   const secretKey =
//     Math.random().toString(36).substring(2, 15) +
//     Math.random().toString(36).substring(2, 15);
//   return secretKey;
// };

// uncomment for MONGO_URL for docker
// const MONGO_URL = "mongodb://mongodb:27017/fake_so";
// config for local testing, that is, without docker.
const MONGO_URL = "mongodb://localhost:27017/fake_so";
const CLIENT_URL = "http://localhost:3000";
const port = 8000;
const SECRET_KEY = "rhseigo23e9rgnse9s48nsweguw39g049gn&e";

module.exports = {
  MONGO_URL,
  CLIENT_URL,
  port,
  SECRET_KEY,
};
