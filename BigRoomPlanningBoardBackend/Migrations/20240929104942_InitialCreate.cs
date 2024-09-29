using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace BigRoomPlanningBoardBackend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Dependencies",
                columns: table => new
                {
                    DependencyId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    DependantTicketId = table.Column<int>(type: "INTEGER", nullable: false),
                    DependencyTicketId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dependencies", x => x.DependencyId);
                });

            migrationBuilder.CreateTable(
                name: "DependencyBoards",
                columns: table => new
                {
                    DependencyBoardId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    PlannedPeriodId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DependencyBoards", x => x.DependencyBoardId);
                });

            migrationBuilder.CreateTable(
                name: "Events",
                columns: table => new
                {
                    EventId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SessionId = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    RecievedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    ProcessedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    IsProcessed = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsSuccessful = table.Column<bool>(type: "INTEGER", nullable: false),
                    Discriminator = table.Column<string>(type: "TEXT", maxLength: 34, nullable: false),
                    PlannedPeriodId = table.Column<int>(type: "INTEGER", nullable: true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    StartDay = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EndDay = table.Column<DateTime>(type: "TEXT", nullable: true),
                    BigRoomPlanningAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    SessionName = table.Column<string>(type: "TEXT", nullable: true),
                    SprintId = table.Column<int>(type: "INTEGER", nullable: true),
                    AddSprintEvent_Name = table.Column<string>(type: "TEXT", nullable: true),
                    StartsAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EndsAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    AddSquadEvent_Name = table.Column<string>(type: "TEXT", nullable: true),
                    SquadId = table.Column<int>(type: "INTEGER", nullable: true),
                    TicketId = table.Column<int>(type: "INTEGER", nullable: true),
                    AddTicketEvent_SquadId = table.Column<int>(type: "INTEGER", nullable: true),
                    AddTicketEvent_PlannedPeriodId = table.Column<int>(type: "INTEGER", nullable: true),
                    AddTicketEvent_SprintId = table.Column<int>(type: "INTEGER", nullable: true),
                    Title = table.Column<string>(type: "TEXT", nullable: true),
                    DeleteTicketEvent_TicketId = table.Column<int>(type: "INTEGER", nullable: true),
                    EditPlannedPeriodEvent_PlannedPeriodId = table.Column<int>(type: "INTEGER", nullable: true),
                    EditPlannedPeriodEvent_Name = table.Column<string>(type: "TEXT", nullable: true),
                    EditPlannedPeriodEvent_StartDay = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EditPlannedPeriodEvent_EndDay = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EditPlannedPeriodEvent_BigRoomPlanningAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EditSprintEvent_SprintId = table.Column<int>(type: "INTEGER", nullable: true),
                    EditSprintEvent_Name = table.Column<string>(type: "TEXT", nullable: true),
                    EditSprintEvent_StartsAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EditSprintEvent_EndsAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    EditSquadEvent_Name = table.Column<string>(type: "TEXT", nullable: true),
                    EditSquadEvent_SquadId = table.Column<int>(type: "INTEGER", nullable: true),
                    EditTicketEvent_TicketId = table.Column<int>(type: "INTEGER", nullable: true),
                    EditTicketEvent_SquadId = table.Column<int>(type: "INTEGER", nullable: true),
                    EditTicketEvent_PlannedPeriodId = table.Column<int>(type: "INTEGER", nullable: true),
                    EditTicketEvent_SprintId = table.Column<int>(type: "INTEGER", nullable: true),
                    EditTicketEvent_Title = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Events", x => x.EventId);
                });

            migrationBuilder.CreateTable(
                name: "PlannedPeriods",
                columns: table => new
                {
                    PlannedPeriodId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    StartDay = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndDay = table.Column<DateTime>(type: "TEXT", nullable: false),
                    BigRoomPlanningAt = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlannedPeriods", x => x.PlannedPeriodId);
                });

            migrationBuilder.CreateTable(
                name: "Sessions",
                columns: table => new
                {
                    SessionId = table.Column<string>(type: "TEXT", nullable: false),
                    Username = table.Column<string>(type: "TEXT", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sessions", x => x.SessionId);
                });

            migrationBuilder.CreateTable(
                name: "Sprints",
                columns: table => new
                {
                    SprintId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true),
                    StartsAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EndsAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Sprints", x => x.SprintId);
                });

            migrationBuilder.CreateTable(
                name: "SquadBoards",
                columns: table => new
                {
                    SquadBoardId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SquadId = table.Column<int>(type: "INTEGER", nullable: false),
                    PlannedPeriodId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SquadBoards", x => x.SquadBoardId);
                });

            migrationBuilder.CreateTable(
                name: "Squads",
                columns: table => new
                {
                    SquadId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Name = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Squads", x => x.SquadId);
                });

            migrationBuilder.CreateTable(
                name: "Tickets",
                columns: table => new
                {
                    TicketId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    SquadId = table.Column<int>(type: "INTEGER", nullable: false),
                    PlannedPeriodId = table.Column<int>(type: "INTEGER", nullable: false),
                    SprintId = table.Column<int>(type: "INTEGER", nullable: true),
                    Title = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Tickets", x => x.TicketId);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Dependencies");

            migrationBuilder.DropTable(
                name: "DependencyBoards");

            migrationBuilder.DropTable(
                name: "Events");

            migrationBuilder.DropTable(
                name: "PlannedPeriods");

            migrationBuilder.DropTable(
                name: "Sessions");

            migrationBuilder.DropTable(
                name: "Sprints");

            migrationBuilder.DropTable(
                name: "SquadBoards");

            migrationBuilder.DropTable(
                name: "Squads");

            migrationBuilder.DropTable(
                name: "Tickets");
        }
    }
}
