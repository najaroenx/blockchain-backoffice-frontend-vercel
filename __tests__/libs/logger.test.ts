import logger from "@/libs/logger";
import { transports } from "winston";

describe("logger utility", () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    // Spy on console to capture logs
    consoleSpy = jest.spyOn(transports.Console.prototype, "log").mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe("Logger configuration", () => {
    it("should be defined", () => {
      expect(logger).toBeDefined();
    });

    it("should have default level set to info", () => {
      expect(logger.level).toBe("info");
    });

    it("should have at least one transport configured", () => {
      expect(logger.transports.length).toBeGreaterThan(0);
    });

    it("should have Console transport", () => {
      const hasConsoleTransport = logger.transports.some(
        (transport) => transport instanceof transports.Console
      );
      expect(hasConsoleTransport).toBe(true);
    });
  });

  describe("Logging methods", () => {
    it("should have info method", () => {
      expect(typeof logger.info).toBe("function");
    });

    it("should have error method", () => {
      expect(typeof logger.error).toBe("function");
    });

    it("should have warn method", () => {
      expect(typeof logger.warn).toBe("function");
    });

    it("should have debug method", () => {
      expect(typeof logger.debug).toBe("function");
    });
  });

  describe("Log level behavior", () => {
    it("should allow changing log level", () => {
      logger.level = "debug";
      expect(logger.level).toBe("debug");
      
      // Reset to default
      logger.level = "info";
      expect(logger.level).toBe("info");
    });

    it("should have valid log level", () => {
      const validLevels = ["error", "warn", "info", "http", "verbose", "debug", "silly"];
      expect(validLevels).toContain(logger.level);
    });
  });

  describe("Format configuration", () => {
    it("should have format configured", () => {
      expect(logger.format).toBeDefined();
    });
  });

  describe("Logger instance", () => {
    it("should be a singleton", () => {
      const logger2 = require("@/libs/logger").default;
      expect(logger).toBe(logger2);
    });

    it("should support method chaining", () => {
      const result = logger.info("test");
      expect(result).toBe(logger);
    });
  });

  describe("Edge cases", () => {
    it("should handle empty log message", () => {
      expect(() => logger.info("")).not.toThrow();
    });

    it("should handle very long log message", () => {
      const longMessage = "test ".repeat(1000);
      expect(() => logger.info(longMessage)).not.toThrow();
    });

    it("should handle special characters", () => {
      expect(() => logger.info("Special chars: @#$%^&*()")).not.toThrow();
    });

    it("should handle unicode characters", () => {
      expect(() => logger.info("Unicode: สวัสดี 你好 🎉")).not.toThrow();
    });

    it("should handle object logging", () => {
      expect(() => logger.info("User data:", { id: 1, name: "test" })).not.toThrow();
    });

    it("should handle error object logging", () => {
      const error = new Error("Test error");
      expect(() => logger.error("Error occurred:", error)).not.toThrow();
    });
  });

  describe("Multiple log calls", () => {
    it("should handle multiple consecutive logs", () => {
      expect(() => {
        logger.info("Log 1");
        logger.info("Log 2");
        logger.info("Log 3");
      }).not.toThrow();
    });

    it("should handle different log levels", () => {
      expect(() => {
        logger.info("Info message");
        logger.warn("Warning message");
        logger.error("Error message");
      }).not.toThrow();
    });
  });
});
