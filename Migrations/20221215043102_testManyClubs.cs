using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TodoApi.Migrations
{
    public partial class testManyClubs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "StravaClub",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ProfileMedium = table.Column<string>(type: "text", nullable: false),
                    Url = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StravaClub", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "StravaClubStravaUser",
                columns: table => new
                {
                    StravaClubsId = table.Column<int>(type: "integer", nullable: false),
                    StravaUsersAthleteId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StravaClubStravaUser", x => new { x.StravaClubsId, x.StravaUsersAthleteId });
                    table.ForeignKey(
                        name: "FK_StravaClubStravaUser_StravaClub_StravaClubsId",
                        column: x => x.StravaClubsId,
                        principalTable: "StravaClub",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_StravaClubStravaUser_StravaUsers_StravaUsersAthleteId",
                        column: x => x.StravaUsersAthleteId,
                        principalTable: "StravaUsers",
                        principalColumn: "AthleteId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StravaClubStravaUser_StravaUsersAthleteId",
                table: "StravaClubStravaUser",
                column: "StravaUsersAthleteId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StravaClubStravaUser");

            migrationBuilder.DropTable(
                name: "StravaClub");
        }
    }
}
