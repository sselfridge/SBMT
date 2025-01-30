namespace TodoApi.Helpers
{
  public static class SbmtUtils
  {
    //TODO use this to get kicOff everywhere
    public static DateTime getKickOffDate()
    {
      var kickOffStr = getConfigVal("KickOffDate");

      return DateTime.Parse(kickOffStr).ToUniversalTime();
    }

    public static DateTime getEndingDate()
    {
      var endingStr = getConfigVal("EndingDate");
      return DateTime.Parse(endingStr).ToUniversalTime();
    }

    public static string getConfigVal(string key)
    {
      IConfiguration configuration = new ConfigurationBuilder()
        .AddJsonFile("appsettings.json")
        .Build();

      return configuration[key];
    }

    public static bool ContainsYear(string yearList, string year)
    {
      if (string.IsNullOrWhiteSpace(yearList))
        return false;

      return yearList.Split(',').Select(y => y.Trim()).Contains(year.ToString());
    }

    public static string AddYear(string yearList, string year)
    {
      if (ContainsYear(yearList, year))
        return yearList; // Already exists, return as is

      return string.IsNullOrWhiteSpace(yearList) ? year.ToString() : $"{yearList},{year}";
    }
  }
}
