using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using TodoApi.Helpers;
using TodoApi.Models;
using TodoApi.Models.db;
using TodoApi.Services;

IConfiguration configuration = new ConfigurationBuilder()
                            .AddJsonFile("appsettings.json")
                            .Build();

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://*:5000", "https://*:5001");

// Add services to the container.


builder.Services.AddControllers();

string dbPass = configuration["DbConfig:dbPass"];
string dbUser = configuration["DbConfig:dbUser"];
string dbName = configuration["DbConfig:dbName"];

string connectionString = $"" +
  $"Server=sbmt.postgres.database.azure.com;" +
  $"Database={dbName};" +
  $"Port=5432;" +
  $"User Id={dbUser};" +
  $"Password={dbPass};" +
  $"Ssl Mode=Require;" +
  $"Trust Server Certificate=true";

builder.Services.AddDbContext<sbmtContext>(opt => opt.UseNpgsql(connectionString));



builder.Services.AddDbContext<TodoContext>(opt =>
    opt.UseInMemoryDatabase("TodoList"));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IStravaService, StravaService>();
builder.Services.AddSingleton(new StravaLimitService());


builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<IAuthorizationHandler, AdminAuthHandler>();

builder.Services.AddAuthorization(options =>
{
  options.AddPolicy("UserIsAdminPolicy", policy =>
    {
      //policy.AuthenticationSchemes.Add(CookieAuthenticationDefaults.AuthenticationScheme);
      policy.Requirements.Add(new UserIsAdminRequirement());
    }
  );
});

/*
 so getting closer...it works properly, just doesn't fail gracefully..
Think I might need to set up an authentication handler?
but very close...
 
 
 */

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{

  app.UseDeveloperExceptionPage();
  app.UseSwagger();
  app.UseSwaggerUI();
}

//app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseMiddleware<JwtMiddleware>();
app.UseAuthorization();
app.UseMiddleware<ResponseHeaderMiddleware>();

app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
