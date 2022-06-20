namespace TodoApi.Models
{
  public class StravaAccess
  {
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }

    public StravaAccess(string accessToken, string refreshToken)
    {
      AccessToken = accessToken;
      RefreshToken = refreshToken;
    }
  }
}
