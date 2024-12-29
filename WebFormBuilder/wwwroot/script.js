async function fetchFormConfig(name)
{
	try
	{
		const response = await fetch('/api/FormConfig?name=' + name);

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
		.replace(/(^\w|[\s-_]+\w)/g, match => match.replace(/[\s-_]/, '')
		.toUpperCase());
}

async function generateForm(formContainer, name, formConfig)
{
	const form = document.createElement("form");
	form.id = name;
	form.addEventListener("submit", submitFormData);

	formConfig.forEach((field) =>
	{
		field.Type = (field.Type ?? "text").toLowerCase();
		field.Label ??= toPascalCase(field.Name);
		const wrapper = document.createElement("div");
		generateField(field, wrapper);
		form.appendChild(wrapper);
	});

	formContainer.replaceChildren();
	formContainer.appendChild(form);
}

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
		case "combobox":
			element = createComboboxField(field);
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


function filterItems(query)
{
	const comboboxList = document.getElementById("combobox-list");
	const items = comboboxList.dataset.items ? JSON.parse(comboboxList.dataset.items) : [];
	return items.filter(item => item.toLowerCase().includes(query.toLowerCase()));
}

function renderList(filteredItems, fieldName)
{
	const comboboxList = document.getElementById("combobox-list");
	comboboxList.innerHTML = '';
	if (filteredItems.length === 0)
	{
		comboboxList.style.display = 'none';
		return;
	}

	const comboboxInput = document.getElementById(fieldName);
	filteredItems.forEach(item =>
	{
		const listItem = document.createElement('div');
		listItem.textContent = item;
		listItem.className = 'combobox-list-item';
		listItem.addEventListener('click', () =>
		{
			comboboxList.style.display = 'none';
			comboboxInput.value = item;
			comboboxInput.dispatchEvent(new Event('input', { bubbles: true }));
		});
		comboboxList.appendChild(listItem);
	});

	comboboxList.style.display = 'block';
}


function createComboboxField(field)
{
	const combobox = document.createElement("div");
	combobox.classList.add("combobox");

	const comboboxInput = document.createElement("input");
	comboboxInput.name = field.Name;
	comboboxInput.id = field.Name;

	const comboboxList = document.createElement("div");
	comboboxList.id = "combobox-list";
	comboboxList.classList.add("combobox-list");
	comboboxList.dataset.items = JSON.stringify(field.Options);

	combobox.appendChild(comboboxInput);
	combobox.appendChild(comboboxList);

	comboboxInput.addEventListener('input', () =>
	{
		const query = comboboxInput.value;
		const filteredItems = filterItems(query);
		renderList(filteredItems, field.Name);
	});

	document.addEventListener('click', event =>
	{
		if (!event.target.closest('.combobox'))
		{
			comboboxList.style.display = 'none';
		}
	});

	return combobox;
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
	if (field.Value && field.Type === "hidden")
		element.value = field.Value;
	element.textContent = field.Label;
	return element;
}

async function handleInputEvent(event)
{
	const inputElement = event.target;
	const type = inputElement.type;
	const name = inputElement.name;
	const val = inputElement.value;
	var state = "";
	if (type === "checkbox")
		state = inputElement.checked ? 'checked' : 'unchecked';

	try
	{
		const response = await fetch('/api/SubmitValue',
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(
			{
				type: type,
				name: name,
				val: val,
				state: state
			})
		});

		if (response.ok)
		{
			const result = await response.json();
			console.log('Success:', result);
		}
		else
		{
			console.error('Error:', response.statusText);
		}
	}
	catch (error)
	{
		console.error("Error submitting form data:", error);
	}
}


async function handleNavigationEvent(event)
{
	event.preventDefault();

	if (!event.target.name)
		return;

	const formConfig = await fetchFormConfig(event.target.name);

	document.getElementById("output").innerHTML = JSON.stringify(formConfig, null, 2);

	const form1 = document.getElementById('form1');

	form1.addEventListener('input', handleInputEvent);

	generateForm(form1, "formDynamic", formConfig);

	window.scrollTo({ top: 0, behavior: 'smooth' });
}


document.addEventListener('DOMContentLoaded', async () =>
{
	const formConfig = await fetchFormConfig('navigation');

	const navigation = document.getElementById('navigation');

	navigation.addEventListener('click', handleNavigationEvent);

	generateForm(navigation, "formNavigation", formConfig);

	navigation.querySelector('input').click();
});
