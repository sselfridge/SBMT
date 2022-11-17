using Microsoft.AspNetCore.Authorization;
using TodoApi.Models.db;

namespace TodoApi.Helpers
{
  public class AdminAuthHandler : AuthorizationHandler<UserIsAdminRequirement>
  {

    IHttpContextAccessor _httpContextAccessor;

    public AdminAuthHandler(IHttpContextAccessor httpContextAccessor)
    {
      _httpContextAccessor = httpContextAccessor;
    }

    protected override Task HandleRequirementAsync(
        AuthorizationHandlerContext context, UserIsAdminRequirement requirement)
    {
      HttpContext? httpContext = _httpContextAccessor.HttpContext;

      if (httpContext != null)
      {

        var contextUser = httpContext.Items["User"];

        if (contextUser != null)
        {
          StravaUser user = (StravaUser)contextUser;
          if (user.AthleteId == requirement.AdminAthleteId)
          {
            context.Succeed(requirement);
          }
          else
          {
            context.Fail();
          }

        }
      }




      return Task.CompletedTask;
    }

  }



  public class UserIsAdminRequirement : IAuthorizationRequirement
  {
    public int AdminAthleteId { get; set; }
    public UserIsAdminRequirement()
    {
      AdminAthleteId = 1075670;
    }

  }


}
