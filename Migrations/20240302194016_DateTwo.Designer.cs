﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;
using TodoApi.Models.db;

#nullable disable

namespace TodoApi.Migrations
{
    [DbContext(typeof(sbmtContext))]
    [Migration("20240302194016_DateTwo")]
    partial class DateTwo
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            NpgsqlModelBuilderExtensions.UseIdentityByDefaultColumns(modelBuilder);

            modelBuilder.Entity("StravaClubStravaUser", b =>
                {
                    b.Property<int>("StravaClubsId")
                        .HasColumnType("integer");

                    b.Property<int>("StravaUsersAthleteId")
                        .HasColumnType("integer");

                    b.HasKey("StravaClubsId", "StravaUsersAthleteId");

                    b.HasIndex("StravaUsersAthleteId");

                    b.ToTable("StravaClubStravaUser");
                });

            modelBuilder.Entity("TodoApi.Models.db.Effort", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<long>("ActivityId")
                        .HasColumnType("bigint");

                    b.Property<int>("AthleteId")
                        .HasColumnType("integer");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("timestamp with time zone");

                    b.Property<int>("ElapsedTime")
                        .HasColumnType("integer");

                    b.Property<int>("MovingTime")
                        .HasColumnType("integer");

                    b.Property<int>("PrRank")
                        .HasColumnType("integer");

                    b.Property<int>("Rank")
                        .HasColumnType("integer");

                    b.Property<long>("SegmentId")
                        .HasColumnType("bigint");

                    b.Property<DateTime>("StartAt")
                        .HasColumnType("timestamp with time zone");

                    b.HasKey("Id");

                    b.ToTable("Efforts");
                });

            modelBuilder.Entity("TodoApi.Models.db.Feedback", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("text");

                    b.Property<int>("AthleteId")
                        .HasColumnType("integer");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Feedback");
                });

            modelBuilder.Entity("TodoApi.Models.db.Segment", b =>
                {
                    b.Property<long>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("bigint");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<long>("Id"));

                    b.Property<string>("ActivityType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<long>("AthleteCount")
                        .HasColumnType("bigint");

                    b.Property<float>("AverageGrade")
                        .HasColumnType("real");

                    b.Property<long>("ClimbCategory")
                        .HasColumnType("bigint");

                    b.Property<float>("Distance")
                        .HasColumnType("real");

                    b.Property<long>("EffortCount")
                        .HasColumnType("bigint");

                    b.Property<float>("ElevationHigh")
                        .HasColumnType("real");

                    b.Property<float>("ElevationLow")
                        .HasColumnType("real");

                    b.Property<float[]>("EndLatlng")
                        .IsRequired()
                        .HasColumnType("real[]");

                    b.Property<string>("Kom")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<float>("MaximumGrade")
                        .HasColumnType("real");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Polyline")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Qom")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<long>("ResourceState")
                        .HasColumnType("bigint");

                    b.Property<float[]>("StartLatlng")
                        .IsRequired()
                        .HasColumnType("real[]");

                    b.Property<string>("SurfaceType")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<float>("TotalElevationGain")
                        .HasColumnType("real");

                    b.HasKey("Id");

                    b.ToTable("Segments");
                });

            modelBuilder.Entity("TodoApi.Models.db.StravaClub", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("Id"));

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("ProfileMedium")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Url")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("StravaClubs");
                });

            modelBuilder.Entity("TodoApi.Models.db.StravaPushNotification", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<string>("AspectType")
                        .HasColumnType("text");

                    b.Property<long>("EventTime")
                        .HasColumnType("bigint");

                    b.Property<long>("ObjectId")
                        .HasColumnType("bigint");

                    b.Property<string>("ObjectType")
                        .HasColumnType("text");

                    b.Property<int>("OwnerId")
                        .HasColumnType("integer");

                    b.Property<long>("SubscriptionId")
                        .HasColumnType("bigint");

                    b.Property<string>("Updates")
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("StravaPushNotifications");
                });

            modelBuilder.Entity("TodoApi.Models.db.StravaUser", b =>
                {
                    b.Property<int>("AthleteId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("integer");

                    NpgsqlPropertyBuilderExtensions.UseIdentityByDefaultColumn(b.Property<int>("AthleteId"));

                    b.Property<string>("AccessToken")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<int>("Age")
                        .HasColumnType("integer");

                    b.Property<string>("Avatar")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Category")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<long>("ExpiresAt")
                        .HasColumnType("bigint");

                    b.Property<string>("Firstname")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<DateTime>("JoinDate")
                        .HasColumnType("timestamp with time zone");

                    b.Property<string>("Lastname")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<double>("RecentDistance")
                        .HasColumnType("double precision");

                    b.Property<double>("RecentElevation")
                        .HasColumnType("double precision");

                    b.Property<string>("RefreshToken")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("SavedFilters")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Scope")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<string>("Sex")
                        .IsRequired()
                        .HasColumnType("text");

                    b.Property<double>("Weight")
                        .HasColumnType("double precision");

                    b.HasKey("AthleteId");

                    b.HasIndex("AthleteId")
                        .IsUnique();

                    b.ToTable("StravaUsers");
                });

            modelBuilder.Entity("TodoApi.Models.db.Student", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uuid");

                    b.Property<int>("Age")
                        .HasColumnType("integer");

                    b.Property<int?>("Grade")
                        .HasColumnType("integer");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("text");

                    b.HasKey("Id");

                    b.ToTable("Students");
                });

            modelBuilder.Entity("StravaClubStravaUser", b =>
                {
                    b.HasOne("TodoApi.Models.db.StravaClub", null)
                        .WithMany()
                        .HasForeignKey("StravaClubsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TodoApi.Models.db.StravaUser", null)
                        .WithMany()
                        .HasForeignKey("StravaUsersAthleteId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();
                });
#pragma warning restore 612, 618
        }
    }
}