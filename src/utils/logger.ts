// Logger utility para frontend
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
}

class Logger {
  private isDev: boolean;
  private logs: LogEntry[] = [];

  constructor() {
    this.isDev = import.meta.env.DEV;
  }

  private formatTime(): string {
    return new Date().toISOString();
  }

  private createLog(level: LogLevel, message: string, data?: any): LogEntry {
    return {
      level,
      message,
      timestamp: this.formatTime(),
      data
    };
  }

  private output(level: LogLevel, message: string, data?: any) {
    const log = this.createLog(level, message, data);
    this.logs.push(log);

    // Solo mostrar en desarrollo
    if (this.isDev) {
      const style = this.getStyle(level);
      if (data) {
        console.log(`%c[${level.toUpperCase()}]`, style, message, data);
      } else {
        console.log(`%c[${level.toUpperCase()}]`, style, message);
      }
    }

    // En producción, enviar errores al servidor (opcional)
    if (level === 'error' && !this.isDev) {
      this.sendToServer(log);
    }
  }

  private getStyle(level: LogLevel): string {
    const styles = {
      debug: 'color: #999; font-size: 12px;',
      info: 'color: #0066cc; font-weight: bold;',
      warn: 'color: #ff6600; font-weight: bold;',
      error: 'color: #cc0000; font-weight: bold; background: #ffe6e6;'
    };
    return styles[level];
  }

  private sendToServer(log: LogEntry) {
    // Implementar si se requiere tracking de errores en producción
    // Por ejemplo, enviar a Sentry o servicio similar
  }

  debug(message: string, data?: any) {
    this.output('debug', message, data);
  }

  info(message: string, data?: any) {
    this.output('info', message, data);
  }

  warn(message: string, data?: any) {
    this.output('warn', message, data);
  }

  error(message: string, data?: any) {
    this.output('error', message, data);
  }

  // Obtener logs para debugging
  getLogs(): LogEntry[] {
    return this.logs;
  }

  // Limpiar logs
  clear() {
    this.logs = [];
  }

  // Exportar logs para descarga
  export(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export default new Logger();
