namespace DynamicFormApi.Models
{
	public class FormField
	{
		public string Type { get; set; }
		public string Name { get; set; }
		public string Label { get; set; }
		public string? Placeholder { get; set; }
		public string? Tooltip { get; set; }
		public string? Value { get; set; }
		public string[]? Options { get; set; }
	}
}
