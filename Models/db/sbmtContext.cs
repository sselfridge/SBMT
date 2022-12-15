using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models.db
{
  public class sbmtContext : DbContext
  {
#pragma warning disable CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
    public sbmtContext(DbContextOptions<sbmtContext> options)
#pragma warning restore CS8618 // Non-nullable field must contain a non-null value when exiting constructor. Consider declaring as nullable.
        : base(options)
    {
    }
    public DbSet<Student> Students { get; set; }
    public DbSet<StravaUser> StravaUsers { get; set; }
    public DbSet<StravaPushNotification> StravaPushNotifications { get; set; }
    public DbSet<Effort> Efforts { get; set; }
    public DbSet<Segment> Segments { get; set; }

  }



}
