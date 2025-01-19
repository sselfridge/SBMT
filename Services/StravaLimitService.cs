namespace TodoApi.Services
{
  public class StravaLimitService
  {
    private static int callCount;

    private static int usage15;
    private static int usageDaily;

    private static int usage15Limit = 600;
    private static int usageDailyLimit = 30000;

    public StravaLimitService()
    {
      callCount = 0;
      usage15Limit = 600;
      usageDailyLimit = 30000;
      usage15 = -1;
      usageDaily = -1;
    }

    public bool UpdateUsage(string usage)
    {
      var usages = usage.Split(',');
      if (usages.Length != 0)
      {
        try
        {
          usage15 = Int32.Parse(usages[0]);
        }
        catch (Exception) { }
        try
        {
          usageDaily = Int32.Parse(usages[1]);
        }
        catch (Exception) { }
      }

      return true;
    }

    public int GetUsage15()
    {
      return usage15;
    }

    public int GetUsageDaily()
    {
      return usageDaily;
    }
  }
}
