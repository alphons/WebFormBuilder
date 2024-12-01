var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
	.AddJsonOptions(options =>
	{
		options.JsonSerializerOptions.PropertyNamingPolicy = null;
		options.JsonSerializerOptions.DictionaryKeyPolicy = null;
	});

var app = builder.Build();

app.UseDefaultFiles();

app.UseStaticFiles();

app.MapControllers();

app.Run();
