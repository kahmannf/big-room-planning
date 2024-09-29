﻿// <auto-generated />
using System;
using BigRoomPlanningBoardBackend;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace BigRoomPlanningBoardBackend.Migrations
{
    [DbContext(typeof(BigRoomPlanningContext))]
    [Migration("20240929032201_RenameAddSquadEventSquadName")]
    partial class RenameAddSquadEventSquadName
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder.HasAnnotation("ProductVersion", "8.0.8");

            modelBuilder.Entity("BigRoomPlanningBoardBackend.Dependency", b =>
                {
                    b.Property<int>("DependencyId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.HasKey("DependencyId");

                    b.ToTable("Dependencies");
                });

            modelBuilder.Entity("BigRoomPlanningBoardBackend.DependencyBoard", b =>
                {
                    b.Property<int>("DependencyBoardId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("PlannedPeriodId")
                        .HasColumnType("INTEGER");

                    b.HasKey("DependencyBoardId");

                    b.ToTable("DependencyBoards");
                });

            modelBuilder.Entity("BigRoomPlanningBoardBackend.Events.Event", b =>
                {
                    b.Property<int>("EventId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("Discriminator")
                        .IsRequired()
                        .HasMaxLength(34)
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsProcessed")
                        .HasColumnType("INTEGER");

                    b.Property<bool>("IsSuccessful")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("ProcessedAt")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("RecievedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("SessionId")
                        .HasColumnType("TEXT");

                    b.HasKey("EventId");

                    b.ToTable("Events");

                    b.HasDiscriminator().HasValue("Event");

                    b.UseTphMappingStrategy();
                });

            modelBuilder.Entity("BigRoomPlanningBoardBackend.PlannedPeriod", b =>
                {
                    b.Property<int>("PlannedPeriodId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime?>("BigRoomPlanningAt")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("EndDay")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("StartDay")
                        .HasColumnType("TEXT");

                    b.HasKey("PlannedPeriodId");

                    b.ToTable("PlannedPeriods");
                });

            modelBuilder.Entity("BigRoomPlanningBoardBackend.Session", b =>
                {
                    b.Property<string>("SessionId")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("TEXT");

                    b.Property<string>("Username")
                        .HasColumnType("TEXT");

                    b.HasKey("SessionId");

                    b.ToTable("Sessions");
                });

            modelBuilder.Entity("BigRoomPlanningBoardBackend.Sprint", b =>
                {
                    b.Property<int>("SprintId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("EndsAt")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("StartsAt")
                        .HasColumnType("TEXT");

                    b.HasKey("SprintId");

                    b.ToTable("Sprints");
                });

            modelBuilder.Entity("BigRoomPlanningBoardBackend.Squad", b =>
                {
                    b.Property<int>("SquadId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.HasKey("SquadId");

                    b.ToTable("Squads");
                });

            modelBuilder.Entity("BigRoomPlanningBoardBackend.SquadBoard", b =>
                {
                    b.Property<int>("SquadBoardId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("PlannedPeriodId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("SquadId")
                        .HasColumnType("INTEGER");

                    b.HasKey("SquadBoardId");

                    b.ToTable("SquadBoards");
                });

            modelBuilder.Entity("BigRoomPlanningBoardBackend.Ticket", b =>
                {
                    b.Property<int>("TicketId")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("PlannedPeriodId")
                        .HasColumnType("INTEGER");

                    b.Property<int?>("SprintId")
                        .HasColumnType("INTEGER");

                    b.Property<int>("SquadId")
                        .HasColumnType("INTEGER");

                    b.HasKey("TicketId");

                    b.ToTable("Tickets");
                });

            modelBuilder.Entity("BigRoomPlanningBoardBackend.Events.Types.AddPlannedPeriodEvent", b =>
                {
                    b.HasBaseType("BigRoomPlanningBoardBackend.Events.Event");

                    b.Property<DateTime?>("BigRoomPlanningAt")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("EndDay")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<int?>("PlannedPeriodId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("StartDay")
                        .HasColumnType("TEXT");

                    b.HasDiscriminator().HasValue("AddPlannedPeriodEvent");
                });

            modelBuilder.Entity("BigRoomPlanningBoardBackend.Events.Types.AddSessionEvent", b =>
                {
                    b.HasBaseType("BigRoomPlanningBoardBackend.Events.Event");

                    b.Property<string>("SessionName")
                        .HasColumnType("TEXT");

                    b.HasDiscriminator().HasValue("AddSessionEvent");
                });

            modelBuilder.Entity("BigRoomPlanningBoardBackend.Events.Types.AddSquadEvent", b =>
                {
                    b.HasBaseType("BigRoomPlanningBoardBackend.Events.Event");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<int?>("SquadId")
                        .HasColumnType("INTEGER");

                    b.ToTable("Events", t =>
                        {
                            t.Property("Name")
                                .HasColumnName("AddSquadEvent_Name");
                        });

                    b.HasDiscriminator().HasValue("AddSquadEvent");
                });

            modelBuilder.Entity("BigRoomPlanningBoardBackend.Events.Types.EditPlannedPeriodEvent", b =>
                {
                    b.HasBaseType("BigRoomPlanningBoardBackend.Events.Event");

                    b.Property<DateTime?>("BigRoomPlanningAt")
                        .HasColumnType("TEXT");

                    b.Property<DateTime>("EndDay")
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<int>("PlannedPeriodId")
                        .HasColumnType("INTEGER");

                    b.Property<DateTime>("StartDay")
                        .HasColumnType("TEXT");

                    b.ToTable("Events", t =>
                        {
                            t.Property("BigRoomPlanningAt")
                                .HasColumnName("EditPlannedPeriodEvent_BigRoomPlanningAt");

                            t.Property("EndDay")
                                .HasColumnName("EditPlannedPeriodEvent_EndDay");

                            t.Property("Name")
                                .HasColumnName("EditPlannedPeriodEvent_Name");

                            t.Property("PlannedPeriodId")
                                .HasColumnName("EditPlannedPeriodEvent_PlannedPeriodId");

                            t.Property("StartDay")
                                .HasColumnName("EditPlannedPeriodEvent_StartDay");
                        });

                    b.HasDiscriminator().HasValue("EditPlannedPeriodEvent");
                });

            modelBuilder.Entity("BigRoomPlanningBoardBackend.Events.Types.EditSquadEvent", b =>
                {
                    b.HasBaseType("BigRoomPlanningBoardBackend.Events.Event");

                    b.Property<string>("Name")
                        .HasColumnType("TEXT");

                    b.Property<int>("SquadId")
                        .HasColumnType("INTEGER");

                    b.ToTable("Events", t =>
                        {
                            t.Property("Name")
                                .HasColumnName("EditSquadEvent_Name");

                            t.Property("SquadId")
                                .HasColumnName("EditSquadEvent_SquadId");
                        });

                    b.HasDiscriminator().HasValue("EditSquadEvent");
                });
#pragma warning restore 612, 618
        }
    }
}
