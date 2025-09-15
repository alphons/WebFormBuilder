using System.Text.Json.Serialization;

namespace WebFormBuilder.Models;

public class Form
{
	public string HtmlHeader { get; set; } = string.Empty;
	public string Action { get; set; } = string.Empty;
	public string Change { get; set; } = string.Empty;
	public string Name { get; set; } = string.Empty;
	public List<FieldSet> FieldSets { get; set; } = [];
}


public class FieldSet
{
	public int Id { get; set; }
	public string Legend { get; set; } = string.Empty;
	public List<FormField> FormFields { get; set; } = [];
}

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

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum HtmlInputType
{
	Unknown,
	Text,
	Email,
	Password,
	Combobox,
	Tel,
	Url,
	Link,
	Number,
	Range,
	Euro,
	Date,
	Time,
	DateTimeLocal,
	Month,
	Week,
	Color,
	Textarea,
	Radio,
	Checkbox,
	Select,
	File,
	Image,
	Button,
	Reset,
	Hidden,
	Submit,
}


