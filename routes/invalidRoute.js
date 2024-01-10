const router = require("express").Router();
const { NotFoundError } = require("../errors/NotFoundError");
const { INVALID_ROUTER_ERROR_MESSAGE } = require("../utils/constants");

router.use(() => {
  throw new NotFoundError(INVALID_ROUTER_ERROR_MESSAGE);
});

module.exports = router;
