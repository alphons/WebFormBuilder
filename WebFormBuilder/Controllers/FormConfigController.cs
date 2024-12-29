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
		string jsonFilePath;

		FileStream stream;

		if (name == "navigation")
		{
			var listNav = new List<FormField>();

			foreach (HtmlInputType type in Enum.GetValues(typeof(HtmlInputType)))
			{
				listNav.Add(new FormField
				{
					Type = HtmlInputType.Button,
					Name= type.ToString().ToLower(),
					Label = string.Empty,
					Value = $"Example {type}"
				});
			}

			listNav.Add(new FormField
			{
				Type = HtmlInputType.Button,
				Name = "formConfigData",
				Label = string.Empty,
				Value = "Complete form"
			});

			listNav.Add(new FormField
			{
				Type = HtmlInputType.Button,
				Name = "navigation",
				Label = string.Empty,
				Value = "This Navigation"
			});

			return Ok(listNav);
		}


		jsonFilePath = Path.Combine(AppContext.BaseDirectory, "Examples", name + ".json");

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

		var list = await JsonSerializer.DeserializeAsync<List<FormField>>(stream) ?? [];

		stream.Dispose();
		
		if(!Enum.TryParse(name, ignoreCase: true, out HtmlInputType typeEnum))
			return NotFound();

		list.RemoveAll(x => x.Type != typeEnum);

		return Ok(list);

	}
}
