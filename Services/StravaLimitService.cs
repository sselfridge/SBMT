namespace TodoApi.Services
{

  public class StravaLimitService
  {
    private static int callCount;

    private static int usage15;
    private static int usageDaily;

    private static int usage15Limit = 600;
    private static int usageDailyLimit = 30000;

    private static IEnumerable<string>? temp;

    public StravaLimitService()
    {
      callCount = 0;
      usage15Limit = 600;
      usageDailyLimit = 30000;
      usage15 = -1;
      usageDaily = -1;
    }


    public bool UpdateUsage(IEnumerable<string>? usage)
    {
      temp = usage;
      return true;
    }

    public IEnumerable<string>? GetUsage()
    {
      return temp;
    }


  }
}