using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TodoApi.Migrations
{
  public partial class AddStravaUser : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.AlterColumn<int>(
          name: "Grade",
          table: "Students",
          type: "integer",
          nullable: true,
          oldClrType: typeof(int),
          oldType: "integer");

      migrationBuilder.CreateTable(
          name: "StravaUsers",
          columns: table => new
          {
            AthleteId = table.Column<int>(type: "integer", nullable: false)
                  .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
            Firstname = table.Column<string>(type: "text", nullable: false),
            Lastname = table.Column<string>(type: "text", nullable: false),
            Avatar = table.Column<string>(type: "text", nullable: false)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_StravaUsers", x => x.AthleteId);
          });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(
          name: "StravaUsers");

      migrationBuilder.AlterColumn<int>(
          name: "Grade",
          table: "Students",
          type: "integer",
          nullable: false,
          defaultValue: 0,
          oldClrType: typeof(int),
          oldType: "integer",
          oldNullable: true);
    }
  }
}
