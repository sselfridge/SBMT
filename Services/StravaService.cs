﻿using System.Net.Http.Headers;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.EntityFrameworkCore;
using TodoApi.Helpers;
using TodoApi.Models.db;
using TodoApi.Models.stravaApi;

namespace TodoApi.Services
{
  public interface IStravaService
  {
    Task<StravaOAuthResponseDTO> GetTokens(string code);
    Task<ActivitySummaryResponse> GetActivity(long id, int athleteId);
    Task<ActivitySummaryResponse> GetActivity(long id, HttpClient client);
    Task<List<ActivitySummaryResponse>> GetActivities(int athleteId);
    Task<Segment> GetSegment(long segmentId);
    Task<StravaAthleteProfile> GetProfile(int athleteId);

    //GetInitialProfile - fetch profile information without hitting local DB
    Task<StravaAthleteProfile> GetInitialProfile(string accessToken);
    Task<RecentRideTotals> GetAthleteStats(int athleteId);
    Task<HttpClient> GetClientForUser(int athleteId);
    StravaUser UpdateUserClubs(int athleteId, List<StravaClub> newClubs);
    StravaUser UpdateUserClubs(int athleteId, StravaClubResponse[] newClubs);

    Task<bool> UpdateClubs();

    Task<StravaUser> UpdateUserStats(StravaUser user);

    Task<string> ParseLink(string link);
  }

  public class StravaService : IStravaService
  {
    private readonly IConfiguration Configuration;
    private IUserService UserService;
    private StravaLimitService RateLimits;
    private IServiceScopeFactory _serviceScopeFactory;

    public StravaService(
      IConfiguration configuration,
      IUserService userService,
      StravaLimitService rateLimits,
      IServiceScopeFactory serviceScopeFactory
    )
    {
      Configuration = configuration;
      UserService = userService;
      RateLimits = rateLimits;
      _serviceScopeFactory = serviceScopeFactory;
    }

    public async Task<StravaOAuthResponseDTO> GetTokens(string code)
    {
      string clientId = Configuration["StravaConfig:clientId"];

      string? clientSecret = Environment.GetEnvironmentVariable("STRAVA_SECRET");

      if (string.IsNullOrEmpty(clientSecret))
      {
        throw new ArgumentException("Invalid ENV value for STRAVA_SECRET");
      }

      var pairs = new List<KeyValuePair<string, string>>
      {
        new KeyValuePair<string, string>("code", code),
        new KeyValuePair<string, string>("client_id", clientId),
        new KeyValuePair<string, string>("client_secret", clientSecret),
        new KeyValuePair<string, string>("grant_type", "authorization_code"),
      };

      var content = new FormUrlEncodedContent(pairs);

      var client = new HttpClient();

      client.DefaultRequestHeaders.Accept.Clear();
      var response = await client.PostAsync("https://www.strava.com/api/v3/oauth/token", content);
      var json = await response.Content.ReadAsStringAsync();
      if (response.IsSuccessStatusCode)
      {
        StravaOAuthResponse? result =
          await response.Content.ReadFromJsonAsync<StravaOAuthResponse>();
        if (result == null)
        {
          throw new Exception("Cannot read strava oauth response");
        }
        var dtoResult = new StravaOAuthResponseDTO(result);
        return dtoResult;
      }
      else
      {
        var errorContent = await response.Content.ReadAsStringAsync();
        Console.WriteLine(
          $"Oauth token POST failed with status code {response.StatusCode}. Response: {errorContent}"
        );
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

    public async Task<List<ActivitySummaryResponse>> GetActivities(int athleteId)
    {
      var client = await GetClientForUser(athleteId);

      //TODO grab this from appSettings
      var year = SbmtUtils.getCurrentYear();
      var kickOffDate = SbmtUtils.getKickOffDate(year);
      long kickOffUnix = new DateTimeOffset(kickOffDate).ToUnixTimeSeconds();

      var url =
        $"/athlete/activities"
        + $"?before=1965868100"
        + $"&after={kickOffUnix}"
        + $"&page=1"
        + $"&per_page=200";

      try
      {
        var arrayResult = await GetStrava<ActivitySummaryResponse[]>(client, url);

        return arrayResult.ToList();
      }
      catch (Exception err)
      {
        Console.WriteLine($"Strava Get Failed for athlete:{athleteId}");
        Console.WriteLine(err);

        return new List<ActivitySummaryResponse>();
      }
    }

    public async Task<StravaAthleteProfile> GetProfile(int athleteId)
    {
      var client = await GetClientForUser(athleteId);
      var url = "/athlete";

      var result = await GetStrava<StravaAthleteProfile>(client, url);
      return result;
    }

    /**
      Fetch profile with only accessToken
    */
    public async Task<StravaAthleteProfile> GetInitialProfile(string accessToken)
    {
      var client = new HttpClient();
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
        "Bearer",
        accessToken
      );

      var url = "/athlete";
      var result = await GetStrava<StravaAthleteProfile>(client, url);
      return result;
    }

    public async Task<RecentRideTotals> GetAthleteStats(int athleteId)
    {
      var client = await GetClientForUser(athleteId);
      var url = $"/athletes/{athleteId}/stats";

      var stats = await GetStrava<AthleteStats>(client, url);

      if (stats == null)
        throw new Exception("Invalid stats");

      var result = stats.RecentTotals;
      result.Distance = result.Distance * 0.000621371;
      result.ElevationGain = result.ElevationGain * 3.28084;
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
        Console.WriteLine($"sbmtLog:Access Token Expired for user:{user.AthleteId} Refreshing");
        accessToken = await refreshTokenAsync(user);
      }
      else
      {
        Console.WriteLine($"sbmtLog:Access Token still good for user {user.AthleteId}");
        accessToken = user.AccessToken;
      }

      return accessToken;
    }

    private bool isTokenExpired(long expiresAt)
    {
      TimeSpan t = DateTime.UtcNow - new DateTime(1970, 1, 1);
      int secondsSinceEpoch = (int)t.TotalSeconds;
      //return true;
      return secondsSinceEpoch + 10 > expiresAt;
    }

    private async Task<string> refreshTokenAsync(StravaUser user)
    {
      IConfiguration configuration = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

      string clientId = configuration["StravaConfig:clientId"];
      string? clientSecret = Environment.GetEnvironmentVariable("STRAVA_SECRET");
      if (string.IsNullOrEmpty(clientSecret))
      {
        throw new ArgumentException("Invalid ENV value for STRAVA_SECRET");
      }

      var pairs = new List<KeyValuePair<string, string>>
      {
        new KeyValuePair<string, string>("client_id", clientId),
        new KeyValuePair<string, string>("client_secret", clientSecret),
        new KeyValuePair<string, string>("grant_type", "refresh_token"),
        new KeyValuePair<string, string>("refresh_token", user.RefreshToken),
      };

      var content = new FormUrlEncodedContent(pairs);

      var client = new HttpClient();

      client.DefaultRequestHeaders.Accept.Clear();
      var response = await client.PostAsync("https://www.strava.com/oauth/token", content);
      if (response.IsSuccessStatusCode)
      {
        StravaTokenRefreshResponse? result =
          await response.Content.ReadFromJsonAsync<StravaTokenRefreshResponse>();
        if (result == null)
          throw new Exception("Cannot read strava refresh response");

        user.AccessToken = result.AccessToken;
        user.RefreshToken = result.RefreshToken;
        user.ExpiresAt = result.ExpiresAt;

        await UserService.Update(user);

        return user.AccessToken;
      }
      Console.WriteLine($"sbmtLog:ERROR Token Refresh Failed with status code");
      Console.WriteLine($"sbmtLog:ERROR status code:{response.StatusCode.ToString()}");
      throw new Exception(response.StatusCode.ToString());
    }

    public async Task<HttpClient> GetClientForUser(int athleteId)
    {
      var user = UserService.GetById(athleteId);

      if (user == null)
      {
        throw new Exception($"User with id {athleteId} not found");
      }

      var accessToken = await checkAccessTokenAsync(user);

      var client = new HttpClient();
      client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
        "Bearer",
        accessToken
      );

      return client;
    }

    public StravaUser UpdateUserClubs(int athleteId, StravaClubResponse[] newClubs)
    {
      var clubsList = Array
        .ConvertAll(
          newClubs,
          new Converter<StravaClubResponse, StravaClub>(clubRes => new StravaClub(clubRes))
        )
        .ToList();
      return UpdateUserClubs(athleteId, clubsList);
    }

    public StravaUser UpdateUserClubs(int athleteId, List<StravaClub> newClubs)
    {
      using (var scope = _serviceScopeFactory.CreateScope())
      {
        var context = scope.ServiceProvider.GetRequiredService<sbmtContext>();
        var user = context
          .StravaUsers.Include(x => x.StravaClubs)
          .FirstOrDefault(x => x.AthleteId == athleteId);

        if (user == null)
          throw new Exception("User not found");

        var newDbClubs = new List<StravaClub>();
        foreach (var club in newClubs)
        {
          var existsAlready = context.StravaClubs.Any(c => c.Id == club.Id);
          if (existsAlready == false)
          {
            newDbClubs.Add(club);
          }
        }
        context.StravaClubs.AddRange(newDbClubs);

        foreach (var club in newClubs)
        {
          var currentClubIds = user.StravaClubs.Select(x => x.Id);
          if (currentClubIds.Contains(club.Id) == false)
          {
            user.StravaClubs.Add(club);
          }
        }

        foreach (
          var userClub in user
            .StravaClubs.Where(c => newClubs.Select(x => x.Id).Contains(c.Id) == false)
            .ToList()
        )
        {
          user.StravaClubs.Remove(userClub);
        }
        context.SaveChanges();

        return user;
      }
    }

    public async Task<StravaUser> UpdateUserStats(StravaUser user)
    {
      var stats = await GetAthleteStats(user.AthleteId);
      Console.WriteLine($"Getting Stats for user {user.AthleteId}");
      user.RecentDistance = Math.Floor(stats.Distance / 4);
      user.RecentElevation = Math.Floor(stats.ElevationGain / 4);

      return user;
    }

    public async Task<bool> UpdateClubs()
    {
      var client = await GetClientForUser(1);
      var scope = _serviceScopeFactory.CreateScope();
      var context = scope.ServiceProvider.GetRequiredService<sbmtContext>();

      var clubs = context.StravaClubs.ToList();

      for (var i = 0; i < clubs.Count; i++)
      {
        var club = clubs[i];
        var url = $"/clubs/{club.Id}";

        var result = await GetStravaString(client, url);

        StravaClubResponse? newClub = JsonSerializer.Deserialize<StravaClubResponse>(result);

        if (newClub != null)
        {
          club.ProfileMedium = newClub.ProfileMedium;
          club.Name = newClub.Name;
          club.Url = newClub.Url;
        }
        context.Update(club);
      }

      context.SaveChanges();

      return true;
    }

    public async Task<string> ParseLink(string link)
    {
      var client = new HttpClient();

      string decodedUrl = Uri.UnescapeDataString(link);

      var response = await client.GetAsync(decodedUrl);

      response.EnsureSuccessStatusCode();

      try
      {
        string result = await response.Content.ReadAsStringAsync();

        if (result == null)
        {
          throw new Exception("Invalid response");
        }

        string pattern = @"strava\.com\/activities\/(\d+)";

        // Extract the number using regex
        var match = Regex.Match(result, pattern);

        if (match.Success)
        {
          string activityId = match.Groups[1].Value;

          return activityId;
        }
        else
        {
          Console.WriteLine("No match found.");
        }

        return "";
      }
      catch (Exception e)
      {
        Console.WriteLine(e.Message);
        throw new Exception("Link Parse error");
      }
    }

    /// <summary>
    /// Method <c>GetStrava</c> performs GET operation on StravaAPI
    /// </summary>
    ///
    private async Task<T> GetStrava<T>(HttpClient client, string url)
    {
      Console.WriteLine($"sbmtLog:Making StravaCall:{url}");
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
            Console.WriteLine($"sbmtLog:ERROR GetStrava Invalid Response url:{url}");
            throw new Exception("Invalid response");
          }

          return result;
        }
        catch (Exception e)
        {
          Console.WriteLine($"sbmtLog:ERROR GetStrava Bad Model url:{url}");
          Console.WriteLine(e.Message);

          throw new Exception("Bad model!");
        }
      }
      else
      {
        Console.WriteLine($"Strava Get Failed for url:{url}");
        throw new Exception("Strava Get Failed");
      }
    }

    private async Task<string> GetStravaString(HttpClient client, string url)
    {
      Console.WriteLine($"sbmtLog:Making StravaCall:{url}");

      var response = await client.GetAsync($"https://www.strava.com/api/v3{url}");
      if (response.IsSuccessStatusCode)
      {
        try
        {
          var result = await response.Content.ReadAsStringAsync();
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
            Console.WriteLine($"sbmtLog:ERROR GetStravaString Invalid Response url:{url}");
            throw new Exception("Invalid response");
          }

          return result;
        }
        catch (Exception e)
        {
          Console.WriteLine($"sbmtLog:ERROR GetStravaString Bad Model url:{url}");
          Console.WriteLine(e.Message);
          throw new Exception("Bad model!");
        }
      }
      else
      {
        Console.WriteLine($"StravaString Get Failed for url:{url}");
        throw new Exception("StravaString Get Failed");
      }
    }
  }
}
