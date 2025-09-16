using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace WebFormBuilder.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubmitFormController : ControllerBase
{
	[HttpPost]
	[Consumes("multipart/form-data")]
	public async Task<IActionResult> UploadForm()
	{
		var form = await HttpContext.Request.ReadFormAsync();

		if (form == null)
			return BadRequest("Thats not a good reqest.");

		foreach(var key in form.Keys)
		{
			Debug.WriteLine($"{key}:{form[key]}");
		}
		foreach (var file in form.Files)
		{
			Debug.WriteLine($"{file.Name} {file.FileName} {file.Length} bytes");
		}

		return Ok(new { Message = "Form data successfully received." });
	}


}
