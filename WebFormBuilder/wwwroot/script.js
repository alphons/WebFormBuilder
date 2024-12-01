async function fetchFormConfig()
{
	try
	{
		const response = await fetch('/api/FormConfig');

		if (!response.ok)
			throw new Error(`HTTP error! Status: ${response.status}`);

		const data = await response.json();
		return data;
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

	try
	{
		const response = await fetch('/api/SubmitData',
		{
			method: 'POST',
			body: new FormData(event.target)
		});

		if (response.ok)
		{
			const result = await response.json();
			console.log('Success:', result);
		} else
		{
			console.error('Error:', response.statusText);
		}

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

function toPascalCase(str)
{
	return str
		.replace(/(^\w|[\s-_]+\w)/g, match => match.replace(/[\s-_]/, '').toUpperCase());
}

async function generateForm()
{
	const formConfig = await fetchFormConfig();
	const formContainer = document.getElementById("form-container");

	const form = document.createElement("form");
	form.id = "dynamicForm";
	form.addEventListener("submit", submitFormData);

	formConfig.forEach((field) =>
	{
		field.Type = (field.Type ?? "text").toLowerCase();
		field.Label ??= toPascalCase(field.Name);
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
		case "reset":
			createButton(field, wrapper);
			break;
		case "hidden":
			createHiddenField(field, wrapper);
			break;
		default:
			createInputOrTextareaField(field, wrapper);
			break;
	}
}

function AddProperties(field, element)
{
	if (field.Properties)
	{
		for (const key in field.Properties)
		{
			if (field.Properties.hasOwnProperty(key))
			{
				const [property, value] = field.Properties[key].split(':');

				element[property] = value;
			}
		}
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

		const element = document.createElement("input");
		element.type = field.Type;
		element.name = field.Name;
		element.value = option;
		element.id = inputId;

		if (field.Type === "radio" && field.Value === option)
		{
			element.checked = true;
		}
		else if (field.Type === "checkbox" && field.Value && field.Value.split(",").includes(option))
		{
			element.checked = true;
		}

		AddProperties(field, element);

		const label = document.createElement("label");
		label.htmlFor = inputId;
		label.textContent = option;

		optionWrapper.appendChild(element);
		optionWrapper.appendChild(label);
		group.appendChild(optionWrapper);
	});

	wrapper.appendChild(group);
}

function createSelectField(field, wrapper)
{
	const element = document.createElement("select");
	element.name = field.Name;
	element.id = field.Name;

	field.Options.forEach((option) =>
	{
		const optionElement = document.createElement("option");
		optionElement.value = option;
		optionElement.textContent = option;

		if (field.Value === option)
		{
			optionElement.selected = true;
		}

		element.appendChild(optionElement);
	});

	AddProperties(field, element);

	wrapper.appendChild(element);
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

	if (field.hasOwnProperty('Properties'))
	{
		for (const key in field.Properties)
		{
			if (field.Properties.hasOwnProperty(key))
			{
				const [property, value] = field.Properties[key].split(':');

				element[property] = value;
			}
		}
	}

	if (field.Placeholder)
	{
		element.placeholder = field.Placeholder;
	}

	if (field.Value)
	{
		if (field.Type === "image")
			element.src = field.Value;
		else
			element.value = field.Value;
	}

	AddProperties(field, element);

	wrapper.appendChild(element);
}

function createButton(field, wrapper)
{
	const element = document.createElement("button");
	element.type = field.Type;
	element.name = field.Name;
	element.textContent = field.Label;

	AddProperties(field, element);

	wrapper.appendChild(element);
}

function createHiddenField(field, wrapper)
{
	const element = document.createElement("input");
	element.type = field.Type;
	element.name = field.Name;
	element.value = field.Value;

	AddProperties(field, element);

	wrapper.appendChild(element);
	wrapper.style.display = 'none';
}

generateForm();

