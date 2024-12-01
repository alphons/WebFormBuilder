using Microsoft.AspNetCore.Mvc;

namespace WebFormBuilder.Controllers
{
	[Route("api/[controller]")]
	public class SubmitDataController : ControllerBase
	{
		[HttpPost]
		[Consumes("multipart/form-data")]
		public async Task<IActionResult> UploadForm()
		{
			var form = await HttpContext.Request.ReadFormAsync();

			return Ok(new { Message = "Form data successfully received." });
		}


	}
}
