using System.Threading.Tasks;
using System.Net.Http.Headers;
using System.Text.Json;
using TodoApi.Models;
using Newtonsoft.Json;

namespace TodoApi.Services
{
  public class StravaServices
  {
    private static readonly HttpClient client = new HttpClient();

    public static async Task<StravaOAuthResponseDTO> GetTokens(string code)
    {
      client.DefaultRequestHeaders.Accept.Clear();
      StravaConfig config;
      using (StreamReader r = new StreamReader("config.json"))
      {
        string json = r.ReadToEnd();
    
          StravaConfig? nullableConfig = JsonConvert.DeserializeObject<StravaConfig?>(json);
          if(nullableConfig == null)
        {
          throw new Exception("Cannot read Local config file.");
        }
        config = nullableConfig;
      }



      var pairs = new List<KeyValuePair<string, string>>();
      pairs.Add(new KeyValuePair<string, string>("code", code));
      pairs.Add(new KeyValuePair<string, string>("client_id", config.ClientId));
      pairs.Add(new KeyValuePair<string, string>("client_secret", config.ClientSecret));
      pairs.Add(new KeyValuePair<string, string>("grant_type", "authorization_code"));


      var content = new FormUrlEncodedContent(pairs);

      var response = await client.PostAsync("https://www.strava.com/api/v3/oauth/token", content);
      if (response.IsSuccessStatusCode)
      {
        StravaOAuthResponse? result = await response.Content.ReadFromJsonAsync<StravaOAuthResponse>();
        if(result == null)
        {
          throw new Exception("Cannot read strava oauth response");
        }
        var dtoResult = new StravaOAuthResponseDTO(result);
        return dtoResult;
      }

      throw new Exception(response.StatusCode.ToString());
    }

  }


}
