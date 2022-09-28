using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace TodoApi.Migrations
{
    public partial class segments : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Segments",
                columns: table => new
                {
                    Id = table.Column<long>(type: "bigint", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ResourceState = table.Column<long>(type: "bigint", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false),
                    ActivityType = table.Column<string>(type: "text", nullable: false),
                    Distance = table.Column<float>(type: "real", nullable: false),
                    AverageGrade = table.Column<float>(type: "real", nullable: false),
                    MaximumGrade = table.Column<float>(type: "real", nullable: false),
                    ElevationHigh = table.Column<float>(type: "real", nullable: false),
                    ElevationLow = table.Column<float>(type: "real", nullable: false),
                    StartLatlng = table.Column<float[]>(type: "real[]", nullable: false),
                    EndLatlng = table.Column<float[]>(type: "real[]", nullable: false),
                    ClimbCategory = table.Column<long>(type: "bigint", nullable: false),
                    TotalElevationGain = table.Column<float>(type: "real", nullable: false),
                    EffortCount = table.Column<long>(type: "bigint", nullable: false),
                    AthleteCount = table.Column<long>(type: "bigint", nullable: false),
                    Polyline = table.Column<string>(type: "text", nullable: false),
                    Kom = table.Column<string>(type: "text", nullable: false),
                    Qom = table.Column<string>(type: "text", nullable: false),
                    SurfaceType = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Segments", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Segments");
        }
    }
}
