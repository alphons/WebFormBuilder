using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using WebFormBuilder.Models;

namespace WebFormBuilder.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class SubmitDataController : ControllerBase
	{

		[HttpPost]
		public IActionResult PostFormData(List<FormData> body)
		{
			// Log or process the received data
			foreach (var data in body)
			{
				Console.WriteLine($"Name: {data.Name}, Type: {data.Type}, Value: {data.Value}");
				Debug.WriteLine($"Name: {data.Name}, Type: {data.Type}, Value: {data.Value}");
			}

			return Ok(new { Message = "Form data successfully received." });
		}
	}
}
