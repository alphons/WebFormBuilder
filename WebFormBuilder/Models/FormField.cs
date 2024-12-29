using System.Text.Json.Serialization;

namespace WebFormBuilder.Models;



public class FormField
{
	public HtmlInputType? Type { get; set; }
	public string Name { get; set; } = "Name";
	public string? Label { get; set; } // can be "", when null it PascalCases Name
	public string? Placeholder { get; set; }
	public string? Tooltip { get; set; }
	public string? Value { get; set; }
	public List<string>? Options { get; set; }
	public List<string>? Properties { get; set; }
}
