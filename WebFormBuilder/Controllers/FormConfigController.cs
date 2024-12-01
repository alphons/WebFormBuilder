using WebFormBuilder.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace WebFormBuilder.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FormConfigController : ControllerBase
{
	[HttpGet]
	public async Task<IActionResult> GetFormConfig()
	{
		List<FormField>? list = [];

		var jsonFilePath = Path.Combine(AppContext.BaseDirectory, "formConfigData.json");

		if (System.IO.File.Exists(jsonFilePath))
		{
			var jsonData = await System.IO.File.ReadAllTextAsync(jsonFilePath);
			list = JsonSerializer.Deserialize<List<FormField>>(jsonData);
		}

		list ??= FormConfigData.FormFields;

		return Ok(list);
	}
}
