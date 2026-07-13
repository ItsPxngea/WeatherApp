var builder = WebApplication.CreateBuilder(args);


builder.Services.AddOpenApi();
builder.Services.AddControllers();
builder.Services.AddHttpClient();

//var url = Environment.GetEnvironmentVariable("LOCAL_HOST_API_URL");

var apiKey = Environment.GetEnvironmentVariable("API_KEY");
if (!string.IsNullOrEmpty(apiKey))
{
    builder.Configuration["OpenWeather:ApiKey"] = apiKey;
}

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy=>
    {policy.WithOrigins("https://weather-app-michaeljohnson5143.vercel.app")
        .AllowAnyHeader()
        .AllowAnyMethod();
        });
    /*options.AddPolicy("AllowReact", policy =>
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod());*/

});
var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();

}

app.UseHttpsRedirection();
//app.UseCors("AllowNetlify");
app.UseCors("AllowReact");
app.UseAuthorization();
app.MapControllers();
//app.MapControllers();

app.Run();
