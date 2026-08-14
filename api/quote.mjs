import { Resend } from "resend";

const text = (value, maximum) =>
	typeof value === "string" ? value.trim().slice(0, maximum) : "";

const log = (level, event, context = {}) => {
	console[level](
		JSON.stringify({
			timestamp: new Date().toISOString(),
			service: "quote-email",
			event,
			...context,
		}),
	);
};

const json = (body, status = 200) =>
	Response.json(body, {
		status,
		headers: { "Cache-Control": "no-store" },
	});

export async function POST(request) {
	const requestOrigin = request.headers.get("origin");
	if (requestOrigin && requestOrigin !== new URL(request.url).origin) {
		log("warn", "request_rejected", { reason: "origin_mismatch" });
		return json({ error: "Request origin is not allowed." }, 403);
	}

	if (!request.headers.get("content-type")?.includes("application/json")) {
		return json({ error: "Expected a JSON request." }, 415);
	}

	let body;
	try {
		body = await request.json();
	} catch {
		return json({ error: "The request could not be read." }, 400);
	}

	const requestId = text(body.requestId, 100);
	const contact = text(body.contact, 160);
	const details = text(body.details, 1500);
	const campaign = Array.isArray(body.campaign)
		? body.campaign.slice(0, 5).map((item) => text(item, 140)).filter(Boolean)
		: [];

	if (text(body.companyWebsite, 200)) {
		log("warn", "request_rejected", { request_id: requestId, reason: "honeypot" });
		return json({ ok: true });
	}

	if (!requestId || !contact || !details) {
		log("warn", "request_rejected", { request_id: requestId, reason: "validation" });
		return json({ error: "Please add your contact details and a short note, then try again." }, 400);
	}

	const { RESEND_API_KEY, QUOTE_FROM_EMAIL, QUOTE_TO_EMAIL } = process.env;
	if (!RESEND_API_KEY || !QUOTE_FROM_EMAIL) {
		log("error", "configuration_error", {
			request_id: requestId,
			missing_api_key: !RESEND_API_KEY,
			missing_from_email: !QUOTE_FROM_EMAIL,
		});
		return json({ error: "Email service is temporarily unavailable." }, 503);
	}

	const lines = [
		"New project inquiry from Robinson PrintWorks",
		"",
		`Reply to: ${contact}`,
		"",
		"What they need help with:",
		details,
	];

	if (campaign.length) lines.push("", "Campaign reference:", ...campaign);

	const replyTo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)
		? contact
		: undefined;

	try {
		const resend = new Resend(RESEND_API_KEY);
		const { data, error } = await resend.emails.send(
			{
				from: QUOTE_FROM_EMAIL,
				to: [QUOTE_TO_EMAIL || "adam@adamrobinson.tech"],
				replyTo,
				subject: "3D Printing Inquiry",
				text: lines.join("\n"),
			},
			{ idempotencyKey: `quote/${requestId}` },
		);

		if (error) {
			log("error", "email_rejected", {
				request_id: requestId,
				error_name: error.name,
				status_code: error.statusCode,
			});
			return json({ error: "The quote email could not be sent." }, 502);
		}

		log("info", "email_accepted", {
			request_id: requestId,
			email_id: data.id,
		});
		return json({ ok: true, id: data.id });
	} catch (error) {
		log("error", "email_request_failed", {
			request_id: requestId,
			error_name: error instanceof Error ? error.name : "UnknownError",
		});
		return json({ error: "The quote email could not be sent." }, 502);
	}
}

export function GET() {
	return json({ error: "Method not allowed." }, 405);
}
