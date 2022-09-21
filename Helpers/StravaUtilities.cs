using TodoApi.Models.db;
using TodoApi.Models.stravaApi;

namespace TodoApi.Helpers
{
  public static class StravaUtilities
  {

    public static Effort[] PullEffortsFromActivity(ActivitySummaryResponse activity, long[] segmentIds)
    {
      Console.WriteLine("Pause");
      var efforts = activity.SegmentEfforts;
      var listEfforts = efforts.ToList();


      var segmentEfforts = Array.FindAll(efforts, e =>
      {
        var result = Array.Find(segmentIds, s => s == e.Segment.Id);
        return result != 0;
      });


      Effort[] allEfforts = Array.ConvertAll(segmentEfforts, new Converter<ActivitySumResEffort, Effort>(ConvertSummeryEffort));


      return allEfforts;
    }


    private static Effort ConvertSummeryEffort(ActivitySumResEffort segEffort)
    {
      return new Effort(segEffort);
    }
  }
}
