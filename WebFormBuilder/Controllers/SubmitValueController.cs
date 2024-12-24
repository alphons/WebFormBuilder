using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace WebFormBuilder.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubmitValueController : ControllerBase
{

	public class Input
	{
		public string? type { get; set; }
		public string? name { get; set; }
		public string? val { get; set; }
		public string? state { get; set; }
	}

	[HttpPost]
	//[Consumes("multipart/form-data")]
	public IActionResult ChangeValue([FromBody] Input input)
	{
		Debug.WriteLine($"name:{input.name} type:{input.type} val:{input.val} state:{input.state}");
		return Ok(true);
	}


}
