(() => {
	const form = document.getElementById("quote-form");
	const error = document.getElementById("form-error");
	const success = document.getElementById("form-success");
	const submitButton = form.querySelector("button[type='submit']");
	const defaultButtonText = submitButton.textContent.trim();
	const trackedFields = form.querySelectorAll("input, select, textarea");
	let formStarted = false;

	const track = (name, data = {}) => {
		try {
			window.va("event", { name, data });
		} catch (error) {
			window.logger.warn("analytics_event_failed", { event: name, error });
			// Analytics should never interrupt the quote flow.
		}
	};

	window.logger.info("page_ready", { route: "/quote" });

	const campaign = new URLSearchParams(window.location.search);
	const campaignDetails = [
		["utm_source", "Source"],
		["utm_medium", "Medium"],
		["utm_campaign", "Campaign"],
		["utm_content", "Content"],
		["utm_term", "Term"],
	]
		.map(([key, label]) => {
			const value = campaign.get(key);
			return value ? `${label}: ${value.slice(0, 120)}` : null;
		})
		.filter(Boolean);

	trackedFields.forEach((field) => {
		field.addEventListener(
			"input",
			() => {
				field.removeAttribute("aria-invalid");
				if (!formStarted) {
					formStarted = true;
					track("quote_form_start", { route: "/quote" });
				}
			},
			{ once: true },
		);
	});

	document.querySelectorAll(".js-track-phone").forEach((link) => {
		link.addEventListener("click", () => {
			track("quote_phone_click", { route: "/quote" });
		});
	});

	form.addEventListener("submit", async (event) => {
		event.preventDefault();

		const requiredFields = Array.from(form.querySelectorAll("[required]"));
		const invalidFields = requiredFields.filter((field) => !field.value.trim());

		requiredFields.forEach((field) => {
			field.toggleAttribute("aria-invalid", !field.value.trim());
		});

		if (invalidFields.length > 0) {
			error.textContent = "Please complete the highlighted fields so I can review your request.";
			error.hidden = false;
			invalidFields[0].focus();
			track("quote_form_error", { route: "/quote", reason: "missing_required" });
			window.logger.info("quote_validation_failed", {
				missing_field_count: invalidFields.length,
			});
			return;
		}

		error.hidden = true;
		success.hidden = true;
		const data = new FormData(form);
		const requestId =
			form.dataset.requestId ||
			(globalThis.crypto?.randomUUID?.() ??
				`${Date.now()}-${Math.random().toString(36).slice(2)}`);
		form.dataset.requestId = requestId;

		track("quote_form_submit", {
			route: "/quote",
			project_type: data.get("projectType"),
		});

		submitButton.disabled = true;
		submitButton.textContent = "Sending…";

		try {
			const response = await fetch("/api/quote", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					requestId,
					name: data.get("name"),
					contact: data.get("contact"),
					projectType: data.get("projectType"),
					details: data.get("details"),
					quantity: data.get("quantity"),
					neededBy: data.get("neededBy"),
					companyWebsite: data.get("companyWebsite"),
					campaign: campaignDetails,
				}),
			});

			if (!response.ok) throw new Error(`Quote API returned ${response.status}`);

			window.logger.info("quote_email_accepted", {
				request_id: requestId,
				project_type: data.get("projectType"),
			});
			track("quote_form_success", { route: "/quote" });
			form.reset();
			delete form.dataset.requestId;
			formStarted = false;
			success.textContent =
				"Your request is on its way. I’ll review it and follow up with you soon.";
			success.hidden = false;
			success.focus();
		} catch (submissionError) {
			window.logger.error("quote_email_failed", {
				request_id: requestId,
				error: submissionError,
			});
			track("quote_form_error", { route: "/quote", reason: "send_failed" });
			error.textContent =
				"I couldn’t send your request. Please try again, or call (508) 828-0090.";
			error.hidden = false;
			error.focus();
		} finally {
			submitButton.disabled = false;
			submitButton.textContent = defaultButtonText;
		}
	});
})();
