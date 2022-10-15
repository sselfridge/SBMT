using System.Net.Http.Headers;
using TodoApi.Models.db;
using TodoApi.Models.stravaApi;

namespace TodoApi.Services
{
  public interface IStravaService
  {
    Task<StravaOAuthResponseDTO> GetTokens(string code);
    Task<ActivitySummaryResponse> GetActivity(long id, int athleteId);
    Task<ActivitySummaryResponse> GetActivity(long id, HttpClient client);
    Task<List<ActivitySummaryResponse>> GetActivities(int athleteId, sbmtContext context);
    Task<Segment> GetSegment(long segmentId);

    Task<StravaAthleteProfile> GetProfile(int athleteId, sbmtContext context);

    //GetInitialProfile - fetch profile information without hitting local DB
    Task<StravaAthleteProfile> GetInitialProfile(string accessToken);

    Task<HttpClient> GetClientForUser(int athleteId);


  }
  public class StravaService : IStravaService
  {
    private readonly IConfiguration Configuration;
    private IUserService UserService;
    private StravaLimitService RateLimits;
    private sbmtContext? scopeContext;

    public StravaService(IConfiguration configuration, IUserService userService, StravaLimitService rateLimites)
    {
      Configuration = configuration;
      UserService = userService;
      RateLimits = rateLimites;
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
      var client = await GetClientForUser(athleteId);

      return await GetActivity(activityId, client);

    }
    public async Task<ActivitySummaryResponse> GetActivity(long activityId, HttpClient client)
    {

      var url = $"/activities/{activityId}?include_all_efforts=true";
      return await GetStrava<ActivitySummaryResponse>(client, url);

    }



    public async Task<Segment> GetSegment(long segmentId)
    {

      var client = await GetClientForUser(1);

      var url = $"/segments/{segmentId}";
      var segRes = await GetStrava<SegmentResponse>(client, url);

      return new Segment(segRes);


    }

    public async Task<List<ActivitySummaryResponse>> GetActivities(int athleteId, sbmtContext context)
    {

      var client = await GetClientForUser(athleteId, context);

      var url = $"/athlete/activities" +
        $"?before=1665868100" +
         $"&after=1659324897" +
        $"&page=1" +
        $"&per_page=200";

      var arrayResult = await GetStrava<ActivitySummaryResponse[]>(client, url);

      return arrayResult.ToList();

    }

    public async Task<StravaAthleteProfile> GetProfile(int athleteId, sbmtContext context)
    {

      var client = await GetClientForUser(athleteId, context);
      var url = "/athlete";

      var result = await GetStrava<StravaAthleteProfile>(client, url);
      return result;
    }

    public async Task<StravaAthleteProfile> GetInitialProfile(string accessToken)
    {

      var client = new HttpClient();
      client.DefaultRequestHeaders.Authorization =
          new AuthenticationHeaderValue("Bearer", accessToken);

      var url = "/athlete";
      var result = await GetStrava<StravaAthleteProfile>(client, url);
      return result;
    }



    /**
     * Private functions below
     * 
     */
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
      return true;
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


        await UserService.Update(user, scopeContext);



        return user.AccessToken;
      }

      throw new Exception(response.StatusCode.ToString());

    }

    public async Task<HttpClient> GetClientForUser(int athleteId)
    {
      return await GetClientForUser(athleteId, null);
    }
    private async Task<HttpClient> GetClientForUser(int athleteId, sbmtContext? context)
    {
      var user = UserService.GetById(athleteId, context);

      if (user == null)
      {
        throw new Exception($"User with id {athleteId} not found");
      }

      var accessToken = await checkAccessTokenAsync(user);

      var client = new HttpClient();
      client.DefaultRequestHeaders.Authorization =
          new AuthenticationHeaderValue("Bearer", accessToken);

      return client;
    }



    /// <summary>
    /// Method <c>GetStrava</c> performs GET operation on StravaAPI
    /// </summary>
    /// 
    private async Task<T> GetStrava<T>(HttpClient client, string url)
    {
      var response = await client.GetAsync($"https://www.strava.com/api/v3{url}");
      if (response.IsSuccessStatusCode)
      {
        try
        {
          T? result = await response.Content.ReadFromJsonAsync<T>();
          var limit = response.Headers.GetValues("X-RateLimit-Limit");
          var usage = response.Headers.GetValues("X-RateLimit-Usage");

          foreach (string value in usage)
          {
            if (value != null)
            {
              RateLimits.UpdateUsage(value);
            }
          }


          if (result == null)
          {
            throw new Exception("Invalid response");
          }

          return result;

        }
        catch (Exception e)
        {
          throw new Exception("Bad model!");
        }


      }
      else
      {

        throw new Exception("Strava Get Failed");

      }
    }
  }


}
