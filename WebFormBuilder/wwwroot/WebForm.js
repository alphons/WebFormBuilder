(function ()
{
	'use strict';

	var FormUrl, ValueUrl;

	async function submitFormData(event)
	{
		event.preventDefault();

		try
		{
			const submitButton = event.target.querySelector('button[type="submit"], input[type="submit"]');
			const data = new FormData(event.target);
			data.append(submitButton.name ? submitButton.name : 'submit', submitButton.value);
			return await netproxyasync(FormUrl, data);
		}
		catch (error)
		{
			console.error("Error submitting form data:", error);
		}
	}

	async function handleInputEvent(event)
	{
		const inputElement = event.target;
		const type = inputElement.type;
		const name = inputElement.name;
		const val = inputElement.value;
		const form = inputElement.closest('form');
		var state = "";
		if (type === "checkbox")
			state = inputElement.checked ? 'checked' : 'unchecked';

		try
		{
			return await netproxyasync(ValueUrl,
				{
					formname: form.id,
					type: type,
					name: name,
					val: val,
					state: state
				});
		}
		catch (error)
		{
			console.error("Error submitting form data:", error);
		}
	}
	window.generateForm = function generateForm(formContainerId, formConfig, submitFormUrl, submitValueUrl)
	{
		const formContainer = document.getElementById(formContainerId)
		const form = document.createElement("form");
		const header = document.createElement("div");
		form.appendChild(header);
		header.outerHTML = formConfig.HtmlHeader ?? "";

		form.id = formConfig.Name;
		if (submitFormUrl)
			FormUrl = submitFormUrl;
		if (submitValueUrl)
			ValueUrl = submitValueUrl;

		form["action"] = formConfig.Action;
		form["change"] = formConfig.Change;

		var index = 0;
		for (let i = 0; i < formConfig.FieldSets.length; i++)
		{
			const fieldsetConfig = formConfig.FieldSets[i];
			const legend = document.createElement("legend");
			const fieldset = document.createElement("fieldset");
			if (i > 0)
				fieldset.setAttribute("hidden", "hidden");
			legend.textContent = fieldsetConfig.Legend ?? `Fieldset ${i + 1}`;
			legend.setAttribute("hidden", "hidden");
			fieldset.appendChild(legend);
			form.appendChild(fieldset);

			fieldsetConfig.FormFields.forEach((field) =>
			{
				field.Name ??= `text${index}`, index++;
				field.Type = (field.Type ?? "text").toLowerCase();
				field.Label ??= toPascalCase(field.Name);
				const wrapper = document.createElement("div");
				generateField(field, wrapper);
				fieldset.appendChild(wrapper);
			});
		}

		formContainer.replaceChildren();
		formContainer.appendChild(form);

		if (ValueUrl)
			form.addEventListener('input', handleInputEvent);

		if (FormUrl)
			form.addEventListener("submit", submitFormData);

		return form;
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

	function generateField(field, wrapper)
	{
		if (field.Type === "form")
			return;
		if (field.Type === "hidden")
		{
			wrapper.style.display = 'none';
		}
		else
		{
			if (field.Label)
			{
				const label = document.createElement("label");
				if (field.Type == "checkbox" || field.Type == "radio")
					label.htmlFor = field.Name + "_0";
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
			case "euro":
				element = createEuroField(field);
				break;
			case "submit":
			case "reset":
			case "link":
				element = createButton(field);
				break;
			default:
				element = createInputField(field);
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
		var el = element;
		if (el.tagName === "DIV")
			el = el.querySelector("input");

		if (!el)
			return;

		if (field.Properties)
		{
			for (const key in field.Properties)
			{
				if (field.Properties.hasOwnProperty(key))
				{
					const [property, value] = splitOnce(field.Properties[key], '=');

					value && (el[property] = value);
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

	function createEuroField(field)
	{
		const eurowrapper = document.createElement("div");
		eurowrapper.classList.add("euro-wrapper");

		const input = document.createElement("input");
		input.name = field.Name;
		input.id = field.Name;
		input.type = "number";

		if (field.Placeholder)
			input.placeholder = field.Placeholder;

		if (field.Value)
			input.value = field.Value;

		eurowrapper.appendChild(input);

		return eurowrapper;
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
		comboboxInput.setAttribute('autocomplete', 'off');

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


	function createInputField(field)
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

	function createButton(field)
	{
		const element = document.createElement("button");
		element.type = field.Type;
		element.name = field.Name;
		element.id = field.Name;
		element.value = field.Value;
		if (field.Value)
		{
			element.textContent = field.Value;
		}
		else
		{
			element.textContent = field.Label;
		}
		if (field.Type === "link")
		{
			element.addEventListener("click", (event) =>
			{
				event.preventDefault();
				const url = field.Properties.find(str => str.startsWith("href="))?.split("=")[1]?.trim();
				if (url) window.location.href = url;
			});
		}
		return element;
	}

})();
