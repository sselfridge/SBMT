namespace TodoApi.Helpers
{
  public static class SbmtUtils
  {
    public static DateTime getKickOffDate(string year)
    {
      var kickOffDateStr = getConfigVal($"YearDates:{year}:KickOffDate");

      return DateTime.Parse(kickOffDateStr).ToUniversalTime();
    }

    public static string getCurrentYear()
    {
      var year = getConfigVal("CurrentYear");
      return year;
    }

    public static DateTime getEndingDate(string year)
    {
      var endingStr = getConfigVal($"YearDates:{year}:EndingDate");
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

    public static int CalcDiff(
      int cookieUserId,
      int userId,
      Dictionary<int, Dictionary<long, int>> effortGroup
    )
    {
      var total = 0;
      try
      {
        var cookieEfforts = effortGroup[cookieUserId];
        var userEfforts = effortGroup[userId];

        foreach (KeyValuePair<long, int> effort in cookieEfforts)
        {
          var segId = effort.Key;
          var userEffort = userEfforts.FirstOrDefault(x => x.Key == segId);
          if (userEffort.Value != 0)
          {
            total = total + (effort.Value - userEffort.Value);
          }
        }
      }
      catch (System.Exception)
      {
        return 0;
      }

      return total;
    }
  }
}
