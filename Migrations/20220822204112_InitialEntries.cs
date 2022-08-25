using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TodoApi.Migrations
{
  public partial class InitialEntries : Migration
  {
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
          name: "Students",
          columns: table => new
          {
            Id = table.Column<Guid>(type: "uuid", nullable: false),
            Name = table.Column<string>(type: "text", nullable: false),
            Age = table.Column<int>(type: "integer", nullable: false)
          },
          constraints: table =>
          {
            table.PrimaryKey("PK_Students", x => x.Id);
          });
    }

    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(
          name: "Students");
    }
  }
}
