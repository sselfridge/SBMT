using TodoApi.Models.db;
using TodoApi.Models.stravaApi;
using TodoApi.Services;

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

      if (efforts == null) return new Effort[0];


      var segmentEfforts = Array.FindAll(efforts, e =>
      {
        var result = Array.Find(segmentIds, s => s == e.Segment.Id);
        return result != 0;
      });


      Effort[] allEfforts = Array.ConvertAll(segmentEfforts, new Converter<ActivitySumResEffort, Effort>(ConvertSummeryEffort));


      return allEfforts;
    }

    public static async Task<StravaUser> OnBoardNewUser(IServiceScopeFactory serviceScopeFactory, OauthStravaUser oauth, IUserService userService, IStravaService stravaService, sbmtContext context)
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


    public static async Task<bool> KickOffInitialFetch(IServiceScopeFactory serviceScopeFactory, int athleteId)
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
              var efforts = PullEffortsFromActivity(fullActivity);
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
            Console.WriteLine("ALLO 70544507");
            var newStudent = new Student();
            newStudent.Name = "WAIT FOR ME!!!!";
            newStudent.Age = activities.Count;
            newStudent.Grade = 10;

            context.Students.Add(newStudent);
            await context.SaveChangesAsync();
          }
          catch (Exception e)
          {

            throw;
          }


          Console.WriteLine("WAIT Saved!");
        }
      });
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed


      return true;
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

           var segmentIds = context.Segments.ToList().Select(s => s.Id).ToArray();

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
