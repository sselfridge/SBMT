namespace TodoApi.Models
{
  public class AppSettingDTO
  {
    public DateTime StatsFetchedAt { get; set; }

    public AppSettingDTO()
    {
      StatsFetchedAt = DateTime.UtcNow;
    }


  }




}
