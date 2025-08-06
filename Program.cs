using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using TodoApi.Helpers;
using TodoApi.Models.db;
using TodoApi.Services;

var env1 = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
Console.WriteLine($"env1: {env1}");
var env = env1 ?? "Production";

Console.WriteLine($"sbmtLog: Current ENV var is:{env}------------------");

IConfiguration configuration = new ConfigurationBuilder()
  .AddJsonFile("appsettings.json")
  .AddJsonFile($"appsettings.{env}.json")
  .Build();

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://*:5000");

// Add services to the container.

//https://gavilan.blog/2021/05/19/fixing-the-error-a-possible-object-cycle-was-detected-in-different-versions-of-asp-net-core/
builder
  .Services.AddControllers()
  .AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

string? dbServer = Environment.GetEnvironmentVariable("DB_SERVER");
string? dbPort = Environment.GetEnvironmentVariable("DB_PORT");
string? dbPass = Environment.GetEnvironmentVariable("DB_PASS");
string? dbUser = Environment.GetEnvironmentVariable("DB_USER");
string? dbName = Environment.GetEnvironmentVariable("DB_NAME");
string dbSsl = configuration["DbConfig:sslMode"];

bool includeError = bool.Parse(configuration["DbConfig:includeError"]);
bool enableSensitiveDataLogging = bool.Parse(configuration["DbConfig:enableSensitiveDataLogging"]);

if (string.IsNullOrEmpty(dbServer))
{
  throw new Exception("Invalid ENV value for: dbServer");
}
if (string.IsNullOrEmpty(dbPort))
{
  throw new Exception("Invalid ENV value for: dbPort");
}
if (string.IsNullOrEmpty(dbPass))
{
  throw new Exception("Invalid ENV value for: dbPass");
}
if (string.IsNullOrEmpty(dbUser))
{
  throw new Exception("Invalid ENV value for: dbUser");
}
if (string.IsNullOrEmpty(dbName))
{
  throw new Exception("Invalid ENV value for: dbName");
}

string connectionString =
  $""
  + $"Server={dbServer};"
  + $"Database={dbName};"
  + $"Port={dbPort};"
  + $"User Id={dbUser};"
  + $"Password={dbPass};"
  + $"Ssl Mode={dbSsl};"
  + $"Trust Server Certificate=true;"
  + $"Include Error Detail={includeError};";

string connectionStringSafe =
  $""
  + $"Server={dbServer};"
  + $"Database={dbName};"
  + $"Port={dbPort};"
  + $"User Id={dbUser};"
  + $"Password=XXXXXXXXX;"
  + $"Ssl Mode={dbSsl};"
  + $"Trust Server Certificate=true;"
  + $"Include Error Detail={includeError};";

Console.WriteLine($"{connectionStringSafe}");

builder.Services.AddDbContext<sbmtContext>(opt =>
{
  opt.UseNpgsql(
    connectionString,
    psqlOpt => psqlOpt.EnableRetryOnFailure() //this buys 90 seconds of startup without the DB
  );
  opt.EnableSensitiveDataLogging(enableSensitiveDataLogging);
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IStravaService, StravaService>();
builder.Services.AddSingleton(new StravaLimitService());

builder.Services.AddHttpContextAccessor();
builder.Services.AddSingleton<IAuthorizationHandler, AdminAuthHandler>();
builder
  .Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
  .AddCookie(options =>
  {
    //options.ExpireTimeSpan = TimeSpan.FromMinutes(20);
    options.SlidingExpiration = true;
    options.Cookie.Name = configuration["CookieName"];
    options.Events = new CookieAuthenticationEvents()
    {
      OnRedirectToLogin = (ctx) =>
      {
        if (ctx.Request.Path.StartsWithSegments("/api") && ctx.Response.StatusCode == 200)
        {
          ctx.Response.StatusCode = 401;
        }

        return Task.CompletedTask;
      },
      OnRedirectToAccessDenied = (ctx) =>
      {
        if (ctx.Request.Path.StartsWithSegments("/api") && ctx.Response.StatusCode == 200)
        {
          ctx.Response.StatusCode = 403;
        }

        return Task.CompletedTask;
      },
    };
  });

builder.Services.AddAuthorization(options =>
{
  options.AddPolicy(
    "UserIsAdminPolicy",
    policy =>
    {
      //policy.AuthenticationSchemes.Add(CookieAuthenticationDefaults.AuthenticationScheme);
      policy.Requirements.Add(new UserIsAdminRequirement());
    }
  );
});

builder.Services.AddHostedService<TimedHostedService>();

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

app.UseAuthentication();
app.UseMiddleware<JwtMiddleware>();
app.UseAuthorization();
app.UseMiddleware<ResponseHeaderMiddleware>();

app.Use(
  async (context, next) =>
  {
    var request = context.Request;
    var fullUrl = $"{request.Scheme}://{request.Host}{request.Path}{request.QueryString}";
    Console.WriteLine($"{fullUrl}");

    await next();
  }
);

app.MapControllers();

app.MapControllerRoute(name: "default", pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
