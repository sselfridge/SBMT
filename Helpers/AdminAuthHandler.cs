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
      AuthorizationHandlerContext authContext,
      UserIsAdminRequirement requirement
    )
    {
      var httpContext = _httpContextAccessor.HttpContext;
      if (httpContext == null)
      {
        return Task.CompletedTask;
      }

      var cookieUser = httpContext.Items["User"] as StravaUser;
      if (cookieUser == null)
      {
        return Task.CompletedTask;
      }
      var adminId = Int32.Parse(SbmtUtils.getConfigVal("StravaConfig:rootAthleteId"));

      var isSam = cookieUser.AthleteId == adminId;
      if (isSam == true)
      {
        authContext.Succeed(requirement);
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
