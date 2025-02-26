const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs");

// Ensure the logs directory exists
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Set log file path (can be overridden via environment variable)
const logFilePath = process.env.LOG_FILE_PATH || path.join(logDir, "app.log");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(({ timestamp, level, message, functionName }) =>
      `[${timestamp}] [${level.toUpperCase()}] [${functionName || "N/A"}] - ${message}`
    )
  ),
  transports: [
    new transports.File({ filename: logFilePath }), // Save logs to file
    new transports.Console({ format: format.combine(format.colorize(), format.simple()) }) // Display logs in console
  ],
});

const logWithFunctionName = (level, message, functionName) => {
  logger.log({ level, message, functionName });
};

module.exports = { logger, logWithFunctionName };