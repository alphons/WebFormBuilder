using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace WebFormBuilder.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubmitValueController : ControllerBase
{

	public class Input
	{
		public string? formname { get; set; }
		public string? type { get; set; }
		public string? name { get; set; }
		public string? val { get; set; }
		public string? state { get; set; }
	}

	[HttpPost]
	public IActionResult ChangeValue([FromBody] Input input)
	{
		Debug.WriteLine($"formname:{input.formname} name:{input.name} type:{input.type} val:{input.val} state:{input.state}");

		if (input.formname == "ExampleForm" && input.name == "Partner")
		{
			if (input.val == "Ja")
			{
				return Ok(new { action = "show", id = "3" });
			}
			else
			{
				return Ok(new { action = "hide", id = "3" });
			}
		}
		return Ok(true);
	}


}
