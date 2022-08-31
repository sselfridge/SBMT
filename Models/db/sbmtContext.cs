using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models.db
{
  public class sbmtContext : DbContext
  {
    public sbmtContext(DbContextOptions<sbmtContext> options)
        : base(options)
    {
    }
    public DbSet<Student> Students { get; set; }
    public DbSet<StravaUser> StravaUsers { get; set; }

    public DbSet<StravaPushNotification> StravaPushNotifications { get; set; }
  }
}
