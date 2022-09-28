using System.Net.Http.Headers;
using TodoApi.Models.db;
using TodoApi.Models.stravaApi;

namespace TodoApi.Services
{
  public interface IStravaService
  {
    Task<StravaOAuthResponseDTO> GetTokens(string code);
    Task<ActivitySummaryResponse> GetActivity(long id, int athleteId);
  }
  public class StravaService : IStravaService
  {
    private readonly IConfiguration Configuration;
    private IUserService UserService;


    public StravaService(IConfiguration configuration, IUserService userService)
    {
      Configuration = configuration;
      UserService = userService;
    }

    public async Task<StravaOAuthResponseDTO> GetTokens(string code)
    {

      string clientId = Configuration["StravaConfig:clientId"];
      string clientSecret = Configuration["StravaConfig:clientSecret"];


      var pairs = new List<KeyValuePair<string, string>>();
      pairs.Add(new KeyValuePair<string, string>("code", code));
      pairs.Add(new KeyValuePair<string, string>("client_id", clientId));
      pairs.Add(new KeyValuePair<string, string>("client_secret", clientSecret));
      pairs.Add(new KeyValuePair<string, string>("grant_type", "authorization_code"));

      var content = new FormUrlEncodedContent(pairs);

      var client = new HttpClient();

      client.DefaultRequestHeaders.Accept.Clear();
      var response = await client.PostAsync("https://www.strava.com/api/v3/oauth/token", content);
      if (response.IsSuccessStatusCode)
      {
        StravaOAuthResponse? result = await response.Content.ReadFromJsonAsync<StravaOAuthResponse>();
        if (result == null)
        {
          throw new Exception("Cannot read strava oauth response");
        }
        var dtoResult = new StravaOAuthResponseDTO(result);
        return dtoResult;
      }

      throw new Exception(response.StatusCode.ToString());
    }

    public async Task<ActivitySummaryResponse> GetActivity(long activityId, int athleteId)
    {

      var user = UserService.GetById(athleteId);

      if (user == null)
      {
        throw new Exception($"User with id {athleteId} not found");
      }

      var accessToken = await checkAccessTokenAsync(user);

      var client = new HttpClient();
      client.DefaultRequestHeaders.Authorization =
          new AuthenticationHeaderValue("Bearer", accessToken);

      var response = await client.GetAsync($"https://www.strava.com/api/v3/activities/{activityId}");
      if (response.IsSuccessStatusCode)
      {
        try
        {
          ActivitySummaryResponse? result = await response.Content.ReadFromJsonAsync<ActivitySummaryResponse>();
          if (result == null)
          {
            throw new Exception("Invalid Activity response");
          }

          return result;

        }
        catch (Exception e)
        {
          Console.WriteLine(e);
          throw new Exception("Bad model!");
        }


      }
      else
      {

        throw new Exception("Get Activity Failed");

      }


    }


    private async Task<string> checkAccessTokenAsync(StravaUser user)
    {

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
        StravaTokenRefreshResponse? result = await response.Content.ReadFromJsonAsync<StravaTokenRefreshResponse>();
        if (result == null) throw new Exception("Cannot read strava refresh response");

        user.AccessToken = result.AccessToken;
        user.RefreshToken = result.RefreshToken;
        user.ExpiresAt = result.ExpiresAt;

        await UserService.Update(user);

        return user.AccessToken;
      }

      throw new Exception(response.StatusCode.ToString());

    }

  }


}
