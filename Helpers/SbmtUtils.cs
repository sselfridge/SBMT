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
  }
}
