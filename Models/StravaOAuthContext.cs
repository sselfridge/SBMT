using Microsoft.EntityFrameworkCore;
using System.Diagnostics.CodeAnalysis;

namespace TodoApi.Models
{
  public class StravaOAuthContext : DbContext
  {
    public StravaOAuthContext(DbContextOptions<StravaOAuthContext> options)
        : base(options)
    {
    }

    public DbSet<StravaOAuthResponseDTO> StravaOAuths { get; set; } = null!;
  }
}