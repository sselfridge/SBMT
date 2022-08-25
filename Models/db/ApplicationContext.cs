using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models.db
{
  public class ApplicationContext : DbContext
  {
    public ApplicationContext(DbContextOptions<ApplicationContext> options)
        : base(options)
    {
    }
    public DbSet<Student> Students { get; set; }
    public DbSet<StravaUser> StravaUsers { get; set; }
  }
}
