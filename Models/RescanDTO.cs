namespace TodoApi.Models.db
{
  public class RescanDTO
  {
    public int SbmtEfforts { get; set; }

    public int NewEfforts { get; set; }

    public RescanDTO()
    {
      SbmtEfforts = 0;
      NewEfforts = 0;
    }

    public RescanDTO(int sbmtEfforts, int newEfforts)
    {
      SbmtEfforts = sbmtEfforts;
      NewEfforts = newEfforts;
    }
  }
}
