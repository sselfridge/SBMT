namespace TodoApi.Services
{
  public class StravaLimitService
  {
    private static int callCount;

    private static int usage15;
    private static int usageDaily;

    private static int usage15Limit = 300;
    private static int usageDailyLimit = 3000;

    public StravaLimitService()
    {
      callCount = 0;
      usage15Limit = 300;
      usageDailyLimit = 3000;
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
        catch (Exception err)
        {
          Console.WriteLine($"Error parsing Usage[0]");
          Console.Write(err);
        }
        try
        {
          usageDaily = Int32.Parse(usages[1]);
        }
        catch (Exception err)
        {
          Console.WriteLine($"Error parsing Usage[0]");
          Console.Write(err);
        }
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
