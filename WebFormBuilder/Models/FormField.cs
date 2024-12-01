using System.Text.Json.Serialization;

namespace DynamicFormApi.Models
{
	public enum HtmlInputType
	{
		Text,
		Password,
		Email,
		Checkbox,
		Radio,
		File,
		Submit,
		Select,
		Textarea,

		Tel,
		Url,
		Number,
		Range,
		Date,
		Time,
		DateTimeLocal,
		Month,
		Week,
		Color,
		Image,
		Reset,
		Button,
		Hidden,
	}

	public class FormField
	{
		[JsonConverter(typeof(JsonStringEnumConverter))]
		public HtmlInputType Type { get; set; }
		public string Name { get; set; } = "Name";
		public string Label { get; set; } = "Label";
		public string? Placeholder { get; set; }
		public string? Tooltip { get; set; }
		public string? Value { get; set; }
		public List<string>? Options { get; set; }
	}
}
