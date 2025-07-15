using TodoApi.Models.stravaApi;

namespace TodoApi.Models.db
{
  public class StravaClub
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public string ProfileMedium { get; set; }
    public string Url { get; set; }
    public ICollection<StravaUser> StravaUsers { get; set; }

    public StravaClub(int id, string name, string profileMedium, string url)
    {
      Id = id;
      Name = name;
      ProfileMedium = profileMedium;
      Url = url ?? $"{id}";
      StravaUsers = new List<StravaUser>();
    }

    public StravaClub(StravaClubResponse res)
    {
      Id = res.Id;
      Name = res.Name;
      ProfileMedium = res.ProfileMedium;
      Url = res.Url ?? $"{res.Id}";
      StravaUsers = new List<StravaUser>();
    }
  }
}
