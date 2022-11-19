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
        AuthorizationHandlerContext authContext, UserIsAdminRequirement requirement)
    {
      var cookieUser = authContext.User;

      var isSam = cookieUser.HasClaim("AthleteId", $"{1075670}");

      if (isSam == true)
      {
        authContext.Succeed(requirement);
      }
      else
      {
        HttpContext? httpContext = _httpContextAccessor.HttpContext;
        if (httpContext != null)
        {
          httpContext.Response.StatusCode = 403;
        }
      }

      return Task.CompletedTask;

      // way of working this with old Items["User"] setup
      //HttpContext? httpContext = _httpContextAccessor.HttpContext;
      //if (httpContext != null)
      //{
      //  var contextUser = httpContext.Items["User"];
      //  if (contextUser != null)
      //  {
      //    StravaUser user = (StravaUser)contextUser;
      //    if (user.AthleteId == requirement.AdminAthleteId)
      //    {
      //      context.Succeed(requirement);
      //    }
      //  }
      //}




      //return Task.CompletedTask;
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
