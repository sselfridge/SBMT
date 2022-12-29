using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using TodoApi.Helpers;
using TodoApi.Models;
using TodoApi.Models.db;
using TodoApi.Services;

var env1 = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
var env2 = Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT");

var env = env1 ?? env2 ?? "Production";


Console.WriteLine($"sbmtlog: Current ENV1 var is:{env1}------------------");
Console.WriteLine($"sbmtlog: Current ENV2 var is:{env2}------------------");
Console.WriteLine($"sbmtlog: Current ENV var is:{env}------------------");

IConfiguration configuration = new ConfigurationBuilder()
                            .AddJsonFile("appsettings.json")
                            .AddJsonFile($"appsettings.{env}.json")
                            .Build();

var builder = WebApplication.CreateBuilder(args);
builder.WebHost.UseUrls("http://*:5000", "https://*:5001");

// Add services to the container.


builder.Services.AddControllers();

string dbServer = configuration["DbConfig:dbServer"];
string dbPass = configuration["DbConfig:dbPass"];
string dbUser = configuration["DbConfig:dbUser"];
string dbName = configuration["DbConfig:dbName"];
bool includeError = bool.Parse(configuration["DbConfig:includeError"]);
bool enableSensitiveDataLogging = bool.Parse(configuration["DbConfig:enableSensitiveDataLogging"]);


string connectionString = $"" +
  $"Server={dbServer};" +
  $"Database={dbName};" +
  $"Port=5432;" +
  $"User Id={dbUser};" +
  $"Password={dbPass};" +
  $"Ssl Mode=Require;" +
  $"Trust Server Certificate=true;" +
  $"Include Error Detail={includeError};";

builder.Services.AddDbContext<sbmtContext>(opt =>
{
  opt.UseNpgsql(connectionString);
  opt.EnableSensitiveDataLogging(enableSensitiveDataLogging);
}
);


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
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
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
        }
      };
    });

builder.Services.AddAuthorization(options =>
{
  options.AddPolicy("UserIsAdminPolicy", policy =>
    {
      //policy.AuthenticationSchemes.Add(CookieAuthenticationDefaults.AuthenticationScheme);
      policy.Requirements.Add(new UserIsAdminRequirement());
    }
  );
});



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

app.MapControllers();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapFallbackToFile("index.html");

app.Run();
