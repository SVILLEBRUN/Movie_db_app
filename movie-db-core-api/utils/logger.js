const { createLogger, format, transports } = require('winston');
const { combine, timestamp, printf, errors, colorize } = format;

// Format des logs
const customFormat = printf(({ level, message, timestamp, stack }) => {
  return `${timestamp} [${level}] : ${stack || message}`;
});

// Création du logger
const logger = createLogger({
  level: 'info', // Niveau de log minimum (info, warn, error, etc.)
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }), // Affiche les stack traces si l'erreur est loggée
    customFormat
  ),
  transports: [
    new transports.Console({
      format: combine(
        colorize(), // Colorisation des logs pour une meilleure lisibilité en console
        customFormat
      )
    }),
    // new transports.File({ filename: 'logs/app.log' }) // Enregistrement dans un fichier
  ]
});

module.exports = logger;