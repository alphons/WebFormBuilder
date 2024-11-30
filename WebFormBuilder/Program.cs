var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddMvcCore().WithMultiParameterModelBinding(SanitizeAll: true);

var app = builder.Build();

app.UseDefaultFiles();

app.UseStaticFiles();

app.MapControllers();

app.Run();
