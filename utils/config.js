const { NODE_ENV = "development" } = process.env;
const { JWT_SECRET = "dev-secret" } = process.env;
const { PORT = 3001 } = process.env;
const DB_ADDRESS =
  process.env.NODE_ENV === "production"
    ? process.env.DB_ADDRESS
    : "mongodb://127.0.0.1:27017/newsapp";

module.exports = { NODE_ENV, JWT_SECRET, PORT, DB_ADDRESS };
