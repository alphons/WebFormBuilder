using System.Text.Json;
using System.Text.Json.Serialization;
using WebFormBuilder.Models;


var fs1 = new FieldSet()
{
	Legend = "Of the fall",
	FormFields = [ new ()
	{
		Name = "Naam"
	},
	new ()
	{
		Name = "Adres"
	}, new ()
	{
		Name = "Woonplaats"
	}]
};
var fs2 = new FieldSet()
{
	Legend = "Of the fall",
	FormFields = [new ()
	{
		Type = HtmlInputType.Radio,
		Name = "Partner"
	}]
};
var fs3 = new FieldSet()
{
	Legend = "Of the fall",
	FormFields = [new ()
	{
		Name = "PartnerNaam"
	}]
};

var form = new Form()
{
	HtmlHeader = "<h1>Dit is een goede header</h1>",

	Action = "/api/SubmitForm",

	Change = "/api/SubmitValue",

	FieldSets = [ fs1, fs2, fs3]
};


var json = JsonSerializer.Serialize(form, new JsonSerializerOptions 
{ 
	WriteIndented = true, 
	DictionaryKeyPolicy = null, 
	PropertyNameCaseInsensitive = true,
	DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingDefault 
});

File.WriteAllText(@"c:\temp\form.json", json);


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
	.AddJsonOptions(options =>
	{
		options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
		options.JsonSerializerOptions.PropertyNamingPolicy = null;
		options.JsonSerializerOptions.DictionaryKeyPolicy = null;
	});

var app = builder.Build();

app.UseDefaultFiles();

app.UseStaticFiles();

app.MapControllers();

app.Run();
