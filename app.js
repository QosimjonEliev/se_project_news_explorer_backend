require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const { errors } = require("celebrate");
const { PORT, DB_ADDRESS } = require("./utils/config");
const userRoutes = require("./routes/users");
const articleRoutes = require("./routes/articles");
const invalidRoute = require("./routes/invalidRoute");
const { limiter } = require("./middlewares/rateLimiter");
const { errorHandler } = require("./middlewares/errorHandler");
const { requestLogger, errorLogger } = require("./middlewares/logger");
const { validateSignIn, validateSignUp } = require("./middlewares/validation");
const { auth } = require("./middlewares/auth");
const { createUser, loginUser } = require("./controllers/users");

const app = express();
mongoose
  .connect(DB_ADDRESS)
  .then(() => console.log("Connection with MongoDB established"));
mongoose.connection.on("error", (err) => console.log(err));

app.use(helmet());
app.use(limiter);
app.use(cors());
app.use(express.json());
app.use(requestLogger);
app.post("/signup", validateSignUp, createUser);
app.post("/signin", validateSignIn, loginUser);
app.use("/users", auth, userRoutes);
app.use("/articles", auth, articleRoutes);
app.use(invalidRoute);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => console.log(`App is listening at Port ${PORT}`));
