import pino from 'pino';

const logLevel = process.env.LOG_LEVEL || 'info';

export const logger = pino({
  level: logLevel,
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'yyyy-mm-dd HH:MM:ss',
      ignore: 'pid,hostname',
    },
  },
});

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, data?: any) {
    logger.info({ context: this.context, ...data }, message);
  }

  error(message: string, error?: any) {
    logger.error({ context: this.context, error }, message);
  }

  warn(message: string, data?: any) {
    logger.warn({ context: this.context, ...data }, message);
  }

  debug(message: string, data?: any) {
    logger.debug({ context: this.context, ...data }, message);
  }

  step(message: string, data?: any) {
    logger.info({ context: this.context, step: true, ...data }, `✓ ${message}`);
  }
}

export default Logger;
