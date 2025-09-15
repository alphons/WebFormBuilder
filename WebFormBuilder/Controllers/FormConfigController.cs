using Microsoft.AspNetCore.Mvc;
using System.Text.Json;
using WebFormBuilder.Models;

namespace WebFormBuilder.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FormConfigController : ControllerBase
{
	[HttpGet]
	public async Task<IActionResult> GetFormConfig([FromQuery] string name)
	{
		if (name == "navigation")
		{
			List<FormField> formFields = [];

			foreach (HtmlInputType type in Enum.GetValues(typeof(HtmlInputType)))
			{
				if (type == HtmlInputType.Unknown)
					continue;

				// for every type, make a button
				formFields.Add(new FormField
				{
					Type = HtmlInputType.Button,
					Name = type.ToString().ToLower(),
					Label = string.Empty,
					Value = $"Example {type}"
				});
			}

			formFields.Add(new FormField
			{
				Type = HtmlInputType.Button,
				Name = "exampleform",
				Label = string.Empty,
				Value = "Form Example"
			});

			// button to select formConfigData example
			formFields.Add(new FormField
			{
				Type = HtmlInputType.Button,
				Name = "formConfigData",
				Label = string.Empty,
				Value = "All of the above"
			});

			// example the navigation on the left
			formFields.Add(new FormField
			{
				Type = HtmlInputType.Button,
				Name = "navigation",
				Label = string.Empty,
				Value = "This Navigation"
			});

			// make a form with these buttons
			var form1 = new Form()
			{
				Name = "Form1",
				HtmlHeader = "<h3>Example</h3>",
				Action = "/api/SubmitData",
				Change = "/api/SubmitValue",
				FieldSets = [new FieldSet() 
				{ 
					Id = 0, 
					Legend = "Of the fall", 
					FormFields = formFields 
				}]
			};

			return Ok(form1);
		}

		var jsonFilePath = Path.Combine(AppContext.BaseDirectory, "Examples", name + ".json");

		FileStream stream;

		if (System.IO.File.Exists(jsonFilePath))
		{
			// do not use 'using' here, it is read async!
			stream = new FileStream(jsonFilePath, FileMode.Open, FileAccess.Read, FileShare.Read, bufferSize: 4096, useAsync: true);

			return File(stream, "application/json");
		}

		jsonFilePath = Path.Combine(AppContext.BaseDirectory, "Examples", "formConfigData.json");

		if (!System.IO.File.Exists(jsonFilePath))
			return NotFound();

		stream = new FileStream(jsonFilePath, FileMode.Open, FileAccess.Read, FileShare.Read, bufferSize: 4096, useAsync: true);

		var form2 = await JsonSerializer.DeserializeAsync<Form>(stream) ?? new();

		stream.Dispose();

		if (!Enum.TryParse(name, ignoreCase: true, out HtmlInputType typeEnum))
			return NotFound();

		form2.FieldSets[0].FormFields.RemoveAll(x => x.Type != typeEnum);

		return Ok(form2);

	}
}
