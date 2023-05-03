function errorHandler(err, req, res, next) {
  if (err.message === "UnauthorizedError") {
    return res.status(401).json({ message: "The user is unauthorized" });
  } else if (err.message === "ValidationError") {
    return res.status(401).json({ message: err });
  }
  return res.status(500).json({ message: "Internal server errorsss" });
}
module.exports = errorHandler;
