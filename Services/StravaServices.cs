using System.Threading.Tasks;
using System.Net.Http.Headers;
using System.Text.Json;
using TodoApi.Models;

namespace TodoApi.Services
{
  public class StravaServices
  {
    private static readonly HttpClient client = new HttpClient();

    public static async Task<StravaOAuthResponseDTO> GetTokens(string code)
    {
      client.DefaultRequestHeaders.Accept.Clear();
      //client.DefaultRequestHeaders.Accept.Add(
      //    new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json"));
      //client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");


      var pairs = new List<KeyValuePair<string, string>>();
      pairs.Add(new KeyValuePair<string, string>("code", code));
      pairs.Add(new KeyValuePair<string, string>("client_id", ""));
      pairs.Add(new KeyValuePair<string, string>("client_secret", ""));
      pairs.Add(new KeyValuePair<string, string>("grant_type", "authorization_code"));


      var content = new FormUrlEncodedContent(pairs);

      var response = await client.PostAsync("https://www.strava.com/api/v3/oauth/token", content);
      if (response.IsSuccessStatusCode)
      {
#pragma warning disable CS8600 // Converting null literal or possible null value to non-nullable type.
        StravaOAuthResponse result = await response.Content.ReadFromJsonAsync<StravaOAuthResponse>();
        var dtoResult = new StravaOAuthResponseDTO(result);
        return dtoResult;
      }

      throw new Exception(response.StatusCode.ToString());
    }

  }


}
