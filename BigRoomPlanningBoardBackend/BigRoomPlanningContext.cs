using BigRoomPlanningBoardBackend.Events;
using BigRoomPlanningBoardBackend.Events.Types;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using MongoDB.Driver.Core.Configuration;
using MongoDB.Driver;
using System;

namespace BigRoomPlanningBoardBackend
{
    public class BigRoomPlanningContext : DbContext
    {
        private readonly IOptions<ApiSettings> apiSettingsOptions;

        public DbSet<Squad> Squads { get; set; }
        public DbSet<SquadBoard> SquadBoards { get; set; }
        public DbSet<PlannedPeriod> PlannedPeriods { get; set; }
        public DbSet<Dependency> Dependencies { get; set; }
        public DbSet<DependencyBoard> DependencyBoards { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Session> Sessions { get; set; }
        public DbSet<Sprint> Sprints { get; set; }


        public DbSet<Event> Events { get; set; }

        #region Event Types

        public DbSet<AddSessionEvent> AddSessionEvents { get; set; }
        public DbSet<AddSquadEvent> AddSquadEvents { get; set; }


        #endregion



        public BigRoomPlanningContext(IOptions<ApiSettings> apiSettingsOptions)
        {
            this.apiSettingsOptions = apiSettingsOptions;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder options)
        {
            switch (apiSettingsOptions.Value.DataBaseProvider)
            {
                case DataBaseProvider.Sqlite:
                    if (!string.IsNullOrWhiteSpace(apiSettingsOptions.Value.DbPath))
                    {
                        options.UseSqlite($"Data Source={apiSettingsOptions.Value.DbPath}");
                    }
                    else
                    {
                        options.UseSqlite(apiSettingsOptions.Value.ConnectionString);
                    }
                    break;
                case DataBaseProvider.MongoDB:
                    var client = new MongoClient(apiSettingsOptions.Value.ConnectionString);
                    var databaseName = MongoUrl.Create(apiSettingsOptions.Value.ConnectionString).DatabaseName;

                    options.UseMongoDB(client, databaseName);
                    break;
                case DataBaseProvider.Postgress:
                    options.UseNpgsql(apiSettingsOptions.Value.ConnectionString);
                    break;
                default:
                    throw new Exception("Unknown DataBaseProvider: " +  apiSettingsOptions.Value.DbPath);
            }
        }
    }
}
