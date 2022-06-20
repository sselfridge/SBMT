using System.Threading.Tasks;
using System.Net.Http.Headers;
using System.Text.Json;

namespace TodoApi.Services
{
  public class GetData
  {
    private static readonly HttpClient client = new HttpClient();
    public async void MakeRequest()
    {
      Console.Write("outVal");

      
       await ProcessRepositories();


    }


    private static async Task ProcessRepositories()
    {
      client.DefaultRequestHeaders.Accept.Clear();
      client.DefaultRequestHeaders.Accept.Add(
          new MediaTypeWithQualityHeaderValue("application/vnd.github.v3+json"));
      client.DefaultRequestHeaders.Add("User-Agent", ".NET Foundation Repository Reporter");

      var streamTask = client.GetStreamAsync("https://api.github.com/orgs/dotnet/repos");
      var repositories = await JsonSerializer.DeserializeAsync<List<Repository>>(await streamTask);



      foreach (var repo in repositories)
        Console.WriteLine(repo.name);
      
    }

  }


}
