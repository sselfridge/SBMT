﻿using System.Net.Http.Headers;
using TodoApi.Models.db;
using TodoApi.Models.stravaApi;

namespace TodoApi.Services
{
  public interface IStravaService
  {
    Task<StravaOAuthResponseDTO> GetTokens(string code);
    Task GetActivity(long id);
  }
  public class StravaService : IStravaService
  {
    private readonly IConfiguration Configuration;


    public StravaService(IConfiguration configuration)
    {
      Configuration = configuration;
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

    public async Task GetActivity(long id)
    {
      var client = new HttpClient();
      client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", "");

      var response = await client.GetAsync("https://www.strava.com/api/v3/segments/813814");
      if (response.IsSuccessStatusCode)
      {
        try
        {
          SegmentResponse? result = await response.Content.ReadFromJsonAsync<SegmentResponse>();
          if (result == null)
          {
            throw new Exception("Cannot read strava oauth response");
          }

          Segment seg = new Segment(result);



        }
        catch (Exception e)
        {

          throw new Exception("Bad model!");
        }





      }



      return;
    }

  }


}
