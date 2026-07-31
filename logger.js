(() => {
	"use strict";

	const MAX_ENTRIES = 100;
	const REDACTED = "[redacted]";
	const sensitiveKey = /contact|email|name|phone|details|message|token|password|secret/i;
	const history = [];
	const debugEnabled =
		["localhost", "127.0.0.1"].includes(window.location.hostname) ||
		new URLSearchParams(window.location.search).has("debug");

	const sanitize = (value, key = "", seen = new WeakSet()) => {
		if (sensitiveKey.test(key)) return REDACTED;
		if (value instanceof Error) {
			return { name: value.name, message: value.message, stack: value.stack };
		}
		if (!value || typeof value !== "object") return value;
		if (seen.has(value)) return "[circular]";

		seen.add(value);
		if (Array.isArray(value)) {
			return value.map((item) => sanitize(item, "", seen));
		}

		return Object.fromEntries(
			Object.entries(value).map(([entryKey, entryValue]) => [
				entryKey,
				sanitize(entryValue, entryKey, seen),
			]),
		);
	};

	const write = (level, event, context = {}) => {
		const entry = Object.freeze({
			timestamp: new Date().toISOString(),
			level,
			event,
			context: sanitize(context),
		});

		history.push(entry);
		if (history.length > MAX_ENTRIES) history.shift();

		if (debugEnabled || level === "warn" || level === "error") {
			const method = console[level] || console.log;
			method(`[Robinson PrintWorks] ${event}`, entry);
		}

		return entry;
	};

	window.logger = Object.freeze({
		debug: (event, context) => write("debug", event, context),
		info: (event, context) => write("info", event, context),
		warn: (event, context) => write("warn", event, context),
		error: (event, context) => write("error", event, context),
		getHistory: () => [...history],
	});

	window.addEventListener("error", (event) => {
		window.logger.error("uncaught_error", {
			message: event.message,
			filename: event.filename,
			line: event.lineno,
			column: event.colno,
			error: event.error,
		});
	});

	window.addEventListener("unhandledrejection", (event) => {
		window.logger.error("unhandled_rejection", { reason: event.reason });
	});
})();
