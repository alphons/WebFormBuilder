"use strict";

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
		const form = event.target;
		const response = await fetch(form.action,
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
		const response = await fetch(form.change,
		{
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(
			{
				formname: form.id,
				type: type,
				name: name,
				val: val,
				state: state
			})
		});

		if (response.ok)
		{
			const result = await response.json();
			if (result.action)
			{
				const fieldset = document.querySelector('[data-id="' + result.id + '"]');
				if (fieldset)
				{
					if (result.action === "show")
						fieldset.style.display = "flex";
					if (result.action === "hide")
						fieldset.style.display = "";
				}
			}
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

	const form = generateForm("formcontainer", formConfig);

	form.addEventListener('input', handleInputEvent);

	form.addEventListener("submit", submitFormData);

	window.scrollTo({ top: 0, behavior: 'smooth' });
}

// shows navigation buttons of all possible input types
document.addEventListener('DOMContentLoaded', async () =>
{
	const formConfig = await fetchFormConfig('navigation');

	const form = generateForm("navcontainer", formConfig);

	form.addEventListener('click', handleNavigationEvent);

	form.querySelector('input').click();
});
