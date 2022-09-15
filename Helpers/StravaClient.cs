using TodoApi.Models.db;
using TodoApi.Models.stravaApi;

namespace TodoApi.Helpers
{
  public class StravaClient
  {
    private string? AccessToken { get; set; }
    private long AthleteId { get; set; }
    private sbmtContext _dbContext;


    public StravaClient(sbmtContext dbContext)
    {
      AccessToken = null;
      AthleteId = -1;
      _dbContext = dbContext;
    }

    public async Task<bool> Init(HttpContext httpContext)
    {
      StravaUser? user = httpContext.Items["User"] as StravaUser;

      if (user == null)
      {
        throw new Exception("No user context found");
      }

      AccessToken = await checkAccessTokenAsync(user);
      AthleteId = user.AthleteId;

      return true;
    }



    private async Task<string> checkAccessTokenAsync(StravaUser user)
    {
      AthleteId = user.AthleteId;

      var isExpired = isTokenExpired(user.ExpiresAt);
      string accessToken;
      if (isExpired)
      {
        accessToken = await refreshTokenAsync(user);
      }
      else
      {
        accessToken = user.AccessToken;
      }

      return accessToken;
    }


    private bool isTokenExpired(long expiresAt)
    {

      TimeSpan t = DateTime.UtcNow - new DateTime(1970, 1, 1);
      int secondsSinceEpoch = (int)t.TotalSeconds;

      return secondsSinceEpoch + 10 > expiresAt;

    }

    private async Task<string> refreshTokenAsync(StravaUser user)
    {
      IConfiguration configuration = new ConfigurationBuilder()
                            .AddJsonFile("appsettings.json")
                            .Build();

      string clientId = configuration["StravaConfig:clientId"];
      string clientSecret = configuration["StravaConfig:clientSecret"];


      var pairs = new List<KeyValuePair<string, string>>();
      pairs.Add(new KeyValuePair<string, string>("client_id", clientId));
      pairs.Add(new KeyValuePair<string, string>("client_secret", clientSecret));
      pairs.Add(new KeyValuePair<string, string>("grant_type", "refresh_token"));
      pairs.Add(new KeyValuePair<string, string>("refresh_token", user.RefreshToken));

      var content = new FormUrlEncodedContent(pairs);

      var client = new HttpClient();

      client.DefaultRequestHeaders.Accept.Clear();
      var response = await client.PostAsync("https://www.strava.com/oauth/token", content);
      if (response.IsSuccessStatusCode)
      {
        Console.WriteLine("STuff");
        StravaTokenRefreshResponse? result = await response.Content.ReadFromJsonAsync<StravaTokenRefreshResponse>();
        if (result == null)
        {
          throw new Exception("Cannot read strava refresh response");
        }
        user.AccessToken = result.AccessToken;
        user.RefreshToken = result.RefreshToken;
        user.ExpiresAt = result.ExpiresAt;
        _dbContext.Update(user);
        await _dbContext.SaveChangesAsync();
        return user.AccessToken;
      }

      throw new Exception(response.StatusCode.ToString());

    }

  }
}
