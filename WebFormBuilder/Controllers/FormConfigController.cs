using Microsoft.AspNetCore.Mvc;
using DynamicFormApi.Models;

namespace DynamicFormApi.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class FormConfigController : ControllerBase
	{
		[HttpGet]
		public IActionResult GetFormConfig()
		{
			var formConfig = new[]
			{
				new FormField
				{
					Type = "text",
					Name = "username",
					Label = "Username",
					Placeholder = "Enter your username",
					Tooltip = "This will be your unique identifier.",
					Value = "JohnDoe"
				},
				new FormField
				{
					Type = "email",
					Name = "email",
					Label = "Email Address",
					Placeholder = "Enter your email address",
					Tooltip = "We will send important updates to this email.",
					Value = "example@example.com"
				},
				new FormField
				{
					Type = "password",
					Name = "password",
					Label = "Password",
					Placeholder = "Enter a secure password",
					Tooltip = "Use a strong password with at least 8 characters."
				},
				new FormField
				{
					Type = "radio",
					Name = "gender",
					Label = "Gender",
					//Tooltip = "Select your gender.",
					Options = ["Male", "Female", "Other"],
					Value = "Male"
				},
				new FormField
				{
					Type = "checkbox",
					Name = "hobbies",
					Label = "Hobbies",
					//Tooltip = "Select all hobbies that apply to you.",
					Options = ["Sports", "Music", "Reading"],
					Value = "Music,Sports"
				},
				new FormField
				{
					Type = "select",
					Name = "country",
					Label = "Country",
					Tooltip = "Choose the country you currently reside in.",
					Options = ["Netherlands", "Belgium", "Germany"],
					Value = "Netherlands"
				},
				new FormField
				{
					Type = "file",
					Name = "MyFile",
					Label = "Choose a file",
					Placeholder = "Select a file",
					Tooltip = "Try to upload this file."
				},
				new FormField
				{
					Type = "textarea",
					Name = "remark",
					Label = "Remark",
					Tooltip = "Any remarks to be made, do it here."
				},
				new FormField
				{
					Type = "submit",
					Name = "submit",
					Label = "Register"
				}
			};

			return Ok(formConfig);
		}
	}
}
