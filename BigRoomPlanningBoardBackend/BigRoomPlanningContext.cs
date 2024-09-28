using BigRoomPlanningBoardBackend.Events;
using BigRoomPlanningBoardBackend.Events.Types;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;

namespace BigRoomPlanningBoardBackend
{
    public class BigRoomPlanningContext : DbContext
    {
        public DbSet<Squad> Squads { get; set; }
        public DbSet<SquadBoard> SquadBoards { get; set; }
        public DbSet<QuarterYear> QuarterYears { get; set; }
        public DbSet<Dependency> Dependencies { get; set; }
        public DbSet<DependencyBoard> DependencyBoards { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Session> Sessions { get; set; }


        public DbSet<Event> Events { get; set; }

        #region Event Types

        public DbSet<AddSessionEvent> AddSessionEvents { get; set; }
        public DbSet<AddSquadEvent> AddSquadEvents { get; set; }


        #endregion


        public string DbPath { get; }

        public BigRoomPlanningContext(IOptions<ApiSettings> apiSettingsOptions)
        {
            DbPath = apiSettingsOptions.Value.DbPath;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
            => options.UseSqlite($"Data Source={DbPath}");
    }
}
