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

const NoFor = ['hidden', 'reset', 'submit', 'checkbox', 'radio'];
function generateField(field, wrapper)
{
	if (field.Type === "hidden")
	{
		wrapper.style.display = 'none';
	}
	else if (field.Label)
	{
		const label = document.createElement("label");
		if (field.Type == "checkbox" || field.Type == "radio")
			label.htmlFor = field.Name+"_0";
		else
			label.htmlFor = field.Name;
		label.textContent = field.Label;
		wrapper.appendChild(label);

		if (field.Tooltip)
		{
			const tooltip = createTooltip(field.Tooltip);
			label.appendChild(tooltip);
		}
	}

	var element;
	switch (field.Type)
	{
		case "radio":
		case "checkbox":
			element = createOptionField(field);
			break;
		case "select":
			element = createSelectField(field);
			break;
		case "hidden":
		case "submit":
		case "reset":
			element = createButtonOrHidden(field);
			break;
		default:
			element = createInputOrTextareaField(field);
			break;
	}

	AddProperties(field, element);

	wrapper.appendChild(element);
}

function splitOnce(str, delimiter)
{
	const index = str.indexOf(delimiter);
	return index === -1 ? [str] : [str.substring(0, index), str.substring(index + delimiter.length)];
}


function AddProperties(field, element)
{
	if (field.Properties)
	{
		for (const key in field.Properties)
		{
			if (field.Properties.hasOwnProperty(key))
			{
				const [property, value] = splitOnce(field.Properties[key], '=');

				value && (element[property] = value);
			}
		}
	}
}

function createOptionField(field)
{
	const element = document.createElement("div");
	element.classList.add(field.Type === "radio" ? "radio-group" : "checkbox-group");

	field.Options.forEach((option, index) =>
	{
		const optionWrapper = document.createElement("div");
		const inputId = `${field.Name}_${index}`;

		const optelement = document.createElement("input");
		optelement.type = field.Type;
		optelement.name = field.Name;
		optelement.value = option;
		optelement.id = inputId;

		if (field.Type === "radio" && field.Value === option)
		{
			optelement.checked = true;
		}
		else if (field.Type === "checkbox" && field.Value && field.Value.split(",").includes(option))
		{
			optelement.checked = true;
		}

		const label = document.createElement("label");
		label.htmlFor = inputId;
		label.textContent = option;

		optionWrapper.appendChild(optelement);
		optionWrapper.appendChild(label);
		element.appendChild(optionWrapper);
	});
	return element;
}

function createSelectField(field)
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
	return element;
}

function createInputOrTextareaField(field)
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
		if (field.Type === "image")
			element.src = field.Value;
		else
			element.value = field.Value;
	}
	return element;
}

function createButtonOrHidden(field)
{
	const element = document.createElement(field.Type === "hidden" ? "input" : "button");
	element.type = field.Type;
	element.name = field.Name;
	element.id = field.Name;
	element.textContent = field.Label;
	return element;
}


generateForm();

