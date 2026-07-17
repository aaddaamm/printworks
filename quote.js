(() => {
	const form = document.getElementById("quote-form");
	const error = document.getElementById("form-error");
	const trackedFields = form.querySelectorAll("input, select, textarea");
	let formStarted = false;

	const track = (name, data = {}) => {
		try {
			window.va("event", { name, data });
		} catch {
			// Analytics should never interrupt the quote flow.
		}
	};

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

	form.addEventListener("submit", (event) => {
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
			return;
		}

		error.hidden = true;
		const data = new FormData(form);
		const subject = `3D Printing Quote — ${data.get("projectType")}`;
		const lines = [
			"Hi Adam,",
			"",
			"I'd like a quote for this project:",
			"",
			`Name: ${data.get("name")}`,
			`Reply to: ${data.get("contact")}`,
			`Project type: ${data.get("projectType")}`,
			`Quantity: ${data.get("quantity") || "Not specified"}`,
			`Needed by: ${data.get("neededBy") || "Flexible"}`,
			"",
			"Project details:",
			data.get("details"),
			"",
			"I will attach any photos or files to this email.",
		];

		if (campaignDetails.length > 0) {
			lines.push("", "Campaign reference:", ...campaignDetails);
		}

		track("quote_email_intent", {
			route: "/quote",
			project_type: data.get("projectType"),
		});

		window.location.href = `mailto:adam@adamrobinson.tech?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
	});
})();
