using System.Text.Json.Serialization;

namespace WebFormBuilder.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum HtmlInputType
{
	Text,
	Email,
	Password,
	Combobox,
	Tel,
	Url,
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
