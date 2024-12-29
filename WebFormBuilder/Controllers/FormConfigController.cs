using WebFormBuilder.Models;
using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace WebFormBuilder.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FormConfigController : ControllerBase
{
	[HttpGet]
	public IActionResult GetFormConfig([FromQuery] string name)
	{
		List<FormField>? list = [];

		var jsonFilePath = Path.Combine(AppContext.BaseDirectory, "Examples", name + ".json");

		if (!System.IO.File.Exists(jsonFilePath))
			return NotFound();

		var stream = new FileStream(jsonFilePath, FileMode.Open, FileAccess.Read, FileShare.Read, bufferSize: 4096, useAsync: true);

		return File(stream, "application/json");
	}
}
