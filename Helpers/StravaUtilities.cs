﻿using TodoApi.Models.db;
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

      var user = context.StravaUsers.FirstOrDefault(x => x.AthleteId == oauth.AthleteId);

      if (user == null)
      {
        user = new StravaUser(oauth, profile);
        context.Add(user);
      }
      else
      {
        user.Active = false;
        var yearList = user.Years.Split(",").ToList();
        yearList.Add(DateTime.Now.Year.ToString());
        user.Years = string.Join(",", yearList);
        user.Scope = oauth.Scope;
        user.AccessToken = oauth.AccessToken;
        user.RefreshToken = oauth.RefreshToken;
        user.ExpiresAt = oauth.ExpiresAt;
        context.Update(user);
      }
      context.SaveChanges();

      KickOffInitialFetch(serviceScopeFactory, user.AthleteId);

      if (profile.Clubs != null)
      {
        var clubUser = stravaService.UpdateUserClubs(user.AthleteId, profile.Clubs);

        return clubUser;
      }
      else
      {
        return user;

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
            var activities = await stravaService.GetActivities(athleteId);

            Console.WriteLine($"sbmtLog: athleteId:{athleteId} onboarding with {activities.Count} activities");

            var allEfforts = new List<Effort>();
            var client = await stravaService.GetClientForUser(athleteId);


            var tasks = activities.Select(a => stravaService.GetActivity(a.Id, client));
            var result = await Task.WhenAll(tasks);
            foreach (var fullActivity in result)
            {
              var efforts = PullEffortsFromActivity(fullActivity, context);
              if (efforts.Count > 0)
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

           var activity = await stravaService.GetActivity(activityId, athleteId);

           if (activity == null)
           {
             Console.WriteLine($"sbmtLog:  activity {activityId} is null, aborting");
             return;
           }

           IConfiguration configuration = new ConfigurationBuilder()
                           .AddJsonFile("appsettings.json")
                           .Build();

           var kickOffStr = configuration["KickOffDate"];
           var kickOffDate = DateTime.Parse(kickOffStr).ToUniversalTime();
           var endDateStr = configuration["EndingDate"];
           var endDate = DateTime.Parse(endDateStr).ToUniversalTime(); //TODO use this later when I can check the upload didn't break

           DateTime startDate = activity.StartDate;
           DateTime endTime = new DateTime(2024, 9, 5, 8, 0, 0, 0, DateTimeKind.Utc);
           DateTime now = DateTime.UtcNow;
           ;
           if (startDate > endTime)
           {
             Console.WriteLine($"sbmtLog: activity {activityId} is after the cut off date");
             return;
           }


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


             var needToUpdate = false;

             // for each new effort, check where it stands on that segment, if its in the top 10, set rank accordingly.
             // will only show for an athlete if its their fastest time on the segment

             newEfforts.ForEach(newEffort =>
             {
               var top10 = context.Efforts

                  .Where(e => e.SegmentId == newEffort.SegmentId && e.StartDate > kickOffDate)
                  .GroupBy(e => e.AthleteId, e => new { e.ElapsedTime, e.Id }, (baseKey, times) =>
                  new
                  {
                    Key = baseKey, //AthleteId (not used)
                    Time = times.Where(x => x.ElapsedTime == times.Min(x => x.ElapsedTime)).Select(x => x.ElapsedTime).First(),
                    Id = times.Where(x => x.ElapsedTime == times.Min(x => x.ElapsedTime)).Select(x => x.Id).First(),
                  })
                  .OrderBy(x => x.Time)
                  .Take(10)
                  .ToList();

               var index = top10.FindIndex(e => e.Id == newEffort.Id);
               if (index != -1)
               {
                 var dbEffort = context.Efforts.Where(e => e.Id == top10[index].Id).FirstOrDefault();
                 if (dbEffort != null)
                 {
                   dbEffort.Rank = index + 1;
                   context.Update(dbEffort);
                   needToUpdate = true;
                 }
               }
             });

             if (needToUpdate)
             {
               context.SaveChanges();
             }
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

    public static async Task<bool> UpdateAllUserStats(IServiceScopeFactory serviceScopeFactory)
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

            var users = context.StravaUsers.Where(x => x.AthleteId != 1).ToList();

            var userTasks = users.Select(user => stravaService.UpdateUserStats(user))
                                                                              .ToArray();

            var whenAll = Task.WhenAll(userTasks);

            try
            {
              //https://stackoverflow.com/a/61017974/901311
              await whenAll;
            }
            catch
            {
              if (whenAll.IsFaulted) // There is also the possibility of being canceled
              {
                foreach (var ex in whenAll.Exception.InnerExceptions)
                {
                  Console.WriteLine("sbmtLog: Single Stats update failed");
                  Console.WriteLine(ex); // Log each exception
                }
              }
            }

            var results = userTasks
                .Where(t => t.IsCompletedSuccessfully)
                .Select(t => t.Result)
                .ToArray();

            Console.Write("done and done");

            context.StravaUsers.UpdateRange(results);
            context.SaveChanges();

          }
          catch (Exception ex)
          {

            Console.WriteLine("sbmtLog: Entire Stats update failed");
            Console.WriteLine(ex);
          }

        }
      });
#pragma warning restore CS4014 // Because this call is not awaited, execution of the current method continues before the call is completed
      await Task.Delay(1);

      return true;
    }

    public static string TestUtilitiesAccess(IServiceScopeFactory serviceScopeFactory)
    {

      Task.Run(async () =>
      {
        using (var scope = serviceScopeFactory.CreateScope())
        {


          var context = scope.ServiceProvider.GetRequiredService<sbmtContext>();

          var user = context.StravaUsers.FirstOrDefault(x => x.AthleteId == 1075670);

          Console.WriteLine("we made it here");
        }
      });
      return "allo";
    }

  }
}
