using WebFormBuilder.Models;

namespace WebFormBuilder.Controllers;

public class FormConfigData
{
	public static List<FormField> FormFields =>
	[
		new FormField
		{
			Type =  HtmlInputType.Text,
			Name = "username",
			Label = "Username",
			Placeholder = "Enter your username",
			Tooltip = "This will be your unique identifier.",
			Value = "JohnDoe"
		},
		new FormField
		{
			Type = HtmlInputType.Email,
			Name = "email",
			Label = "Email Address",
			Placeholder = "Enter your email address",
			Tooltip = "We will send important updates to this email.",
			Value = "example@example.com"
		},
		new FormField
		{
			Type = HtmlInputType.Password,
			Name = "password",
			Label = "Password",
			Placeholder = "Enter a secure password",
			Tooltip = "Use a strong password with at least 8 characters.",
			Value = "0ldP@ssW0rd!"
		},
		new FormField
		{
			Type = HtmlInputType.Radio,
			Name = "gender",
			Label = "Gender",
			Tooltip = "Select your gender.",
			Options = new List<string> { "Male", "Female", "Other" },
			Value = "Male"
		},
		new FormField
		{
			Type = HtmlInputType.Checkbox,
			Name = "hobbies",
			Label = "Hobbies",
			Tooltip = "Select all hobbies that apply to you.",
			Options = new List<string> { "Sports", "Music", "Reading" },
			Value = "Music,Sports"
		},
		new FormField
		{
			Type = HtmlInputType.Select,
			Name = "country",
			Label = "Country",
			Tooltip = "Choose the country you currently reside in.",
			Options = new List<string> { "Netherlands", "Belgium", "Germany" },
			Value = "Netherlands"
		},
		new FormField
		{
			Type = HtmlInputType.File,
			Name = "Files",
			Label = "Choose a file",
			Placeholder = "Select a file",
			Tooltip = "Select a file please."
		},
		new FormField
		{
			Type = HtmlInputType.Textarea,
			Name = "remark",
			Label = "Remark",
			Tooltip = "Any remarks to be made, do it here.",
			Value = "1\n2\n"
		},
		new FormField
		{
			Type = HtmlInputType.Number,
			Name = "age",
			Label = "Age",
			Placeholder = "Enter your age",
			Tooltip = "Provide your age in years.",
			Value = "30"
		},
		new FormField
		{
			Type = HtmlInputType.Date,
			Name = "dob",
			Label = "Date of Birth",
			Placeholder = "Select your date of birth",
			Tooltip = "Pick your birthdate from the calendar.",
			Value = "1990-01-01"
		},
		new FormField
		{
			Type = HtmlInputType.Tel,
			Name = "phone",
			Label = "Phone Number",
			Placeholder = "Enter your phone number",
			Tooltip = "Provide your contact number.",
			Value = "123-456-7890"
		},
		new FormField
		{
			Type = HtmlInputType.Url,
			Name = "website",
			Label = "Website",
			Placeholder = "Enter your website",
			Tooltip = "Provide the URL of your website.",
			Value = "https://example.com"
		},
		new FormField
		{
			Type = HtmlInputType.Range,
			Name = "satisfaction",
			Label = "Satisfaction Level",
			Tooltip = "Rate your satisfaction from 1 to 10.",
			Value = "5"
		},
		new FormField
		{
			Type = HtmlInputType.Time,
			Name = "meeting_time",
			Label = "Meeting Time",
			Placeholder = "Select a time",
			Tooltip = "Choose your preferred meeting time.",
			Value = "14:00"
		},
		new FormField
		{
			Type = HtmlInputType.DateTimeLocal,
			Name = "appointment",
			Label = "Appointment Date & Time",
			Tooltip = "Select the date and time for your appointment.",
			Value = "2024-11-30T10:00"
		},
		new FormField
		{
			Type = HtmlInputType.Month,
			Name = "birth_month",
			Label = "Birth Month",
			Tooltip = "Select your birth month.",
			Value = "1990-01"
		},
		new FormField
		{
			Type = HtmlInputType.Week,
			Name = "work_week",
			Label = "Work Week",
			Tooltip = "Select your preferred work week.",
			Value = "2024-W01"
		},
		new FormField
		{
			Type = HtmlInputType.Color,
			Name = "fav_color",
			Label = "Favorite Color",
			Tooltip = "Pick your favorite color.",
			Value = "#ff0000"
		},
		new FormField
		{
			Type = HtmlInputType.Image,
			Name = "submit_image",
			Label = "Submit Image",
			Tooltip = "Click to submit via image button.",
			Value = "/cat.gif"
		},
		new FormField
		{
			Type = HtmlInputType.Reset,
			Name = "reset",
			Label = "Reset Form"
		},
		new FormField
		{
			Type = HtmlInputType.Button,
			Name = "custom_button",
			Label = "Custom Button",
			Tooltip = "Click this button for custom action."
		},
		new FormField
		{
			Type = HtmlInputType.Hidden,
			Name = "hidden_field",
			Value = Guid.NewGuid().ToString()
		},
		new FormField
		{
			Type = HtmlInputType.Submit,
			Name = "submit",
			Label = "Register"
		}
	];
}
