using System.Text.Json.Serialization;

namespace WebFormBuilder.Models;



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
