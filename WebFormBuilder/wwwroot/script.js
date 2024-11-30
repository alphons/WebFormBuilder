async function fetchFormConfig()
{
	try
	{
		const result = await netproxyasync("/api/FormConfig");
		return result;
	}
	catch (error)
	{
		console.error("Error fetching form configuration:", error);
		return [];
	}
}

async function submitFormData(event)
{
	event.preventDefault();

	const formDataMap = new Map();
	const formElements = $$('form input, form select, form textarea');

	const filteredElements = Array.from(formElements).filter((element) =>
		element.type !== "radio" || element.checked
	);

	filteredElements.forEach((element) =>
	{
		const existingField = formDataMap.get(element.name);

		if (element.type === "checkbox" && element.checked && existingField)
		{
			existingField.Value += `,${element.value}`;
		}
		else if (element.type !== "checkbox" || element.checked)
		{
			formDataMap.set(element.name, {
				Name: element.name,
				Type: element.type,
				Value: existingField ? `${existingField.Value},${element.value}` : element.value
			});
		}
	});

	const formDataArray = Array.from(formDataMap.values());

	try
	{
		const result = await netproxyasync("/api/SubmitData", { body: formDataArray });
		console.log("Form data successfully submitted:", result);
	}
	catch (error)
	{
		console.error("Error submitting form data:", error);
	}
}

function createTooltip(text)
{
	const tooltipWrapper = document.createElement("span");
	tooltipWrapper.className = "tooltip-wrapper";

	const tooltipIcon = document.createElement("span");
	tooltipIcon.className = "tooltip-icon";
	tooltipIcon.textContent = "?";

	const tooltipText = document.createElement("span");
	tooltipText.className = "tooltip-text";
	tooltipText.textContent = text;

	tooltipWrapper.appendChild(tooltipIcon);
	tooltipWrapper.appendChild(tooltipText);

	return tooltipWrapper;
}

async function generateForm()
{
	const formConfig = await fetchFormConfig();
	const formContainer = $id("form-container");

	const form = document.createElement("form");
	form.id = "dynamicForm";
	form.addEventListener("submit", submitFormData);

	formConfig.forEach((field) =>
	{
		const wrapper = document.createElement("div");
		generateField(field, wrapper);
		form.appendChild(wrapper);
	});

	formContainer.appendChild(form);
}

function generateField(field, wrapper)
{
	if (field.Label)
	{
		const label = document.createElement("label");
		label.htmlFor = field.Name;
		label.textContent = field.Label;
		wrapper.appendChild(label);

		if (field.Tooltip)
		{
			const tooltip = createTooltip(field.Tooltip);
			label.appendChild(tooltip);
		}
	}

	switch (field.Type)
	{
		case "radio":
		case "checkbox":
			createOptionField(field, wrapper);
			break;
		case "select":
			createSelectField(field, wrapper);
			break;
		case "submit":
			createSubmitButton(field, wrapper);
			break;
		default:
			createInputOrTextareaField(field, wrapper);
			break;
	}
}

function createOptionField(field, wrapper)
{
	const group = document.createElement("div");
	group.classList.add(field.Type === "radio" ? "radio-group" : "checkbox-group");

	field.Options.forEach((option, index) =>
	{
		const optionWrapper = document.createElement("div");
		const inputId = `${field.Name}_${index}`;

		const input = document.createElement("input");
		input.type = field.Type;
		input.name = field.Name;
		input.value = option;
		input.id = inputId;

		if (field.Type === "radio" && field.Value === option)
		{
			input.checked = true;
		}
		else if (field.Type === "checkbox" && field.Value && field.Value.split(",").includes(option))
		{
			input.checked = true;
		}

		const label = document.createElement("label");
		label.htmlFor = inputId;
		label.textContent = option;

		optionWrapper.appendChild(input);
		optionWrapper.appendChild(label);
		group.appendChild(optionWrapper);
	});

	wrapper.appendChild(group);
}

function createSelectField(field, wrapper)
{
	const select = document.createElement("select");
	select.name = field.Name;
	select.id = field.Name;

	field.Options.forEach((option) =>
	{
		const optionElement = document.createElement("option");
		optionElement.value = option;
		optionElement.textContent = option;

		if (field.Value === option)
		{
			optionElement.selected = true;
		}

		select.appendChild(optionElement);
	});

	wrapper.appendChild(select);
}

function createInputOrTextareaField(field, wrapper)
{
	const element = document.createElement(field.Type === "textarea" ? "textarea" : "input");
	element.name = field.Name;
	element.id = field.Name;

	if (field.Type !== "textarea")
	{
		element.type = field.Type;
	}

	if (field.Placeholder)
	{
		element.placeholder = field.Placeholder;
	}

	if (field.Value)
	{
		element.value = field.Value;
	}

	wrapper.appendChild(element);
}

function createSubmitButton(field, wrapper)
{
	const button = document.createElement("button");
	button.type = "submit";
	button.name = field.Name;
	button.textContent = field.Label;
	wrapper.appendChild(button);
}

onReady(generateForm);
