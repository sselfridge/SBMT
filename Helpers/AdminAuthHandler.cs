using Microsoft.AspNetCore.Authorization;

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
      var cookieUser = authContext.User;

      var isSam = cookieUser.HasClaim("AthleteId", $"{1075670}");

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
