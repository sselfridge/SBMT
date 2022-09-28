using TodoApi.Models.db;
using TodoApi.Models.stravaApi;

namespace TodoApi.Helpers
{
  public static class StravaUtilities
  {


    public static Effort[] PullEffortsFromActivity(ActivitySummaryResponse activity)
    {
      var roadSegmentIds = new long[] {658277,1290381,637362,881465,631703,3596686,29015105,
                                   618305,1313,1315,5106261,12039079,813814,751029,};

      var gravelSegmentIds = new long[] {746977,
                                        647251,
                                        2622235,
                                        641588 };

      var segmentIds = new long[roadSegmentIds.Length + gravelSegmentIds.Length];
      Array.Copy(roadSegmentIds, segmentIds, roadSegmentIds.Length);
      Array.Copy(gravelSegmentIds, 0, segmentIds, roadSegmentIds.Length, gravelSegmentIds.Length);

      return PullEffortsFromActivity(activity, segmentIds);
    }

    public static Effort[] PullEffortsFromActivity(ActivitySummaryResponse activity, long[] segmentIds)
    {
      var efforts = activity.SegmentEfforts;

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
