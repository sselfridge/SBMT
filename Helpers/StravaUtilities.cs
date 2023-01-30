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

      KickOffInitialFetch(serviceScopeFactory, newUser.AthleteId);

      if (profile.Clubs != null)
      {
        var user = context.StravaUsers.First(x => x.AthleteId == newUser.AthleteId);
        user = stravaService.UpdateUserClubs(user, profile.Clubs, context);
        context.Update(user);
        await context.SaveChangesAsync();
        return user;
      }
      else
      {
        return newUser;

      }
      // get other stats for user?
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

            Console.WriteLine($"sbmtLog: athleteId:{athleteId} onboarding with {activities.Count} activities");

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
            Console.WriteLine($"sbmtLog: athleteId:{athleteId} onboarding with {allEfforts.Count} total efforts");


            foreach (var effort in allEfforts)
            {
              var effortExists = context.Efforts.Any(e => e.Id == effort.Id);
              if (effortExists == false)
              {
                newEfforts.Add(effort);
              }
            }
            Console.WriteLine($"sbmtLog: athleteId:{athleteId} onboarding with {newEfforts.Count} newEfforts");

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

    public static async Task<bool> ParseNewActivity(IServiceScopeFactory serviceScopeFactory, int athleteId, long activityId, int delayAmount)
    {
#pragma warning disable CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
      Task.Run(async () =>
     {
       await Task.Delay(delayAmount);

       using (var scope = serviceScopeFactory.CreateScope())
       {
         try
         {
           Console.WriteLine($"sbmtLog: parsing new activity {activityId} for athlete:{athleteId}");

           var context = scope.ServiceProvider.GetRequiredService<sbmtContext>();
           var stravaService = scope.ServiceProvider.GetRequiredService<IStravaService>();

           ActivitySummaryResponse activity = await stravaService.GetActivity(activityId, athleteId, context);

           if (activity.SegmentEfforts == null)
           {
             Console.WriteLine($"sbmtLog:  activity {activityId} has no efforts on it (efforts were null)");
             return;
           }

           Console.WriteLine($"sbmtLog:  activity {activityId} has {activity.SegmentEfforts.Length} efforts on it Delay was:{delayAmount}");

           if (activity.SegmentEfforts.Length == 0 && delayAmount == 0)
           {
             var delayTime = 300000;
             var timeInMin = delayTime / 1000 / 60;
             Console.WriteLine($"sbmtLog: Retrying {activityId} in {timeInMin} minutes");
             ParseNewActivity(serviceScopeFactory, athleteId, activityId, delayTime);
           }

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
           Console.WriteLine($"sbmtLog:ERROR parsing activity {activityId} for athlete:{athleteId} ");
           Console.WriteLine(e.Message);

         }

       }

     });
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed

      await Task.Delay(1);

      return true;
    }

  }
}
