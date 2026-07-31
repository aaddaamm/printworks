import { Resend } from "resend";

const trackedEvents = new Set([
	"email.sent",
	"email.delivered",
	"email.delivery_delayed",
	"email.failed",
	"email.bounced",
	"email.complained",
	"email.suppressed",
]);

const severity = (type) => {
	if (["email.failed", "email.bounced"].includes(type)) return "error";
	if (["email.delivery_delayed", "email.complained", "email.suppressed"].includes(type)) {
		return "warn";
	}
	return "info";
};

export async function POST(request) {
	const { RESEND_API_KEY, RESEND_WEBHOOK_SECRET } = process.env;
	if (!RESEND_API_KEY || !RESEND_WEBHOOK_SECRET) {
		console.error(
			JSON.stringify({
				service: "quote-email",
				event: "webhook_configuration_error",
			}),
		);
		return new Response("Webhook is not configured.", { status: 503 });
	}

	try {
		const payload = await request.text();
		const resend = new Resend(RESEND_API_KEY);
		const event = await resend.webhooks.verify({
			payload,
			headers: {
				id: request.headers.get("svix-id"),
				timestamp: request.headers.get("svix-timestamp"),
				signature: request.headers.get("svix-signature"),
			},
			webhookSecret: RESEND_WEBHOOK_SECRET,
		});

		if (trackedEvents.has(event.type)) {
			const level = severity(event.type);
			console[level](
				JSON.stringify({
					timestamp: new Date().toISOString(),
					service: "quote-email",
					event: event.type,
					email_id: event.data?.email_id,
				}),
			);
		}

		return Response.json({ received: true });
	} catch {
		console.warn(
			JSON.stringify({ service: "quote-email", event: "invalid_webhook" }),
		);
		return new Response("Invalid webhook.", { status: 400 });
	}
}
