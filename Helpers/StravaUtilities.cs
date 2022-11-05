using TodoApi.Models.db;
using TodoApi.Models.stravaApi;
using TodoApi.Services;

namespace TodoApi.Helpers
{
  public static class StravaUtilities
  {


    public static List<Effort> PullEffortsFromActivity(ActivitySummaryResponse activity, sbmtContext context)
    {


      var segmentIds = context.Segments.Select(s => s.Id).ToList();

      if (segmentIds == null) return new List<Effort>();

      return PullEffortsFromActivity(activity, segmentIds);
    }

    public static List<Effort> PullEffortsFromActivity(ActivitySummaryResponse activity, List<long> segmentIds)
    {
      var effortArray = activity.SegmentEfforts;

      if (effortArray == null) return new List<Effort>();
      var efforts = effortArray.ToList();


      var segmentEfforts = efforts
        .FindAll(e => segmentIds.Contains(e.Segment.Id))
        .ConvertAll(e => new Effort(e));

      if (segmentEfforts == null) return new List<Effort>();

      return segmentEfforts;
    }

    public static async Task<StravaUser> OnBoardNewUser(
                                                        IServiceScopeFactory serviceScopeFactory,
                                                        OauthStravaUser oauth,
                                                        IStravaService stravaService,
                                                        sbmtContext context)
    {
      var profile = await stravaService.GetInitialProfile(oauth.AccessToken);

      var newUser = new StravaUser(oauth, profile);

      context.Add(newUser);
      context.SaveChanges();

      // get clubs
      // get other stats for user?

      KickOffInitialFetch(serviceScopeFactory, newUser.AthleteId);

      return newUser;
    }

    private static Effort ConvertSummeryEffort(ActivitySumResEffort segEffort)
    {
      return new Effort(segEffort);
    }


    public static void KickOffInitialFetch(IServiceScopeFactory serviceScopeFactory, int athleteId)
    {

#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
      Task.Run(async () =>
      {
        using (var scope = serviceScopeFactory.CreateScope())
        {

          try
          {
            var context = scope.ServiceProvider.GetRequiredService<sbmtContext>();
            var stravaService = scope.ServiceProvider.GetRequiredService<IStravaService>();
            var activities = await stravaService.GetActivities(athleteId, context);

            var allEfforts = new List<Effort>();
            var client = await stravaService.GetClientForUser(athleteId);


            var tasks = activities.Select(a => stravaService.GetActivity(a.Id, client));
            var result = await Task.WhenAll(tasks);
            foreach (var fullActivity in result)
            {
              var efforts = PullEffortsFromActivity(fullActivity, context);
              if (efforts != null)
              {
                allEfforts.AddRange(efforts);
              }
            }

            var newEfforts = new List<Effort>();


            foreach (var effort in allEfforts)
            {
              var effortExists = context.Efforts.Any(e => e.Id == effort.Id);
              if (effortExists == false)
              {
                newEfforts.Add(effort);
              }
            }

            context.AddRange(newEfforts);
            context.SaveChanges();
            await context.SaveChangesAsync();
          }
          catch (Exception)
          {
            Console.WriteLine($"Error fetching data for AthleteId:{athleteId}");
          }


        }
      });
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed


      return;
    }

    public static async Task<bool> ParseNewActivity(IServiceScopeFactory serviceScopeFactory, int athleteId, long activityId)
    {
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
      Task.Run(async () =>
     {
       using (var scope = serviceScopeFactory.CreateScope())
       {
         try
         {


           var context = scope.ServiceProvider.GetRequiredService<sbmtContext>();
           var stravaService = scope.ServiceProvider.GetRequiredService<IStravaService>();

           var activity = await stravaService.GetActivity(activityId, athleteId, context);

           var segmentIds = context.Segments.Select(s => s.Id).ToList();

           var efforts = PullEffortsFromActivity(activity, segmentIds);

           var newEfforts = new List<Effort>();

           foreach (var effort in efforts)
           {
             if (context.Efforts.Any(e => e.Id == effort.Id) == false)
             {
               newEfforts.Add(effort);
             }
           }

           if (newEfforts.Count > 0)
           {
             context.AddRange(newEfforts);
             context.SaveChanges();
           }

         }
         catch (Exception e)
         {

         }

       }

     });
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed

      await Task.Delay(1);

      return true;
    }

  }
}
