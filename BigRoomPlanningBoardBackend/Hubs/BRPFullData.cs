using System;
using System.Collections.Generic;
using System.Linq;

namespace BigRoomPlanningBoardBackend.Hubs
{
    /// <summary>
    /// DTO for sending a Snpashot of the current Data to the client.
    /// </summary>
    public class BRPFullData
    {
        public List<Squad> Squads { get; set; }

        public List<Ticket> Tickets { get; set; }

        public List<PlannedPeriod> PlannedPeriods { get; set; }

        public List<Dependency> Dependencies { get; set; }
        public List<DependencyBoard> DependencyBoards { get; set; }

        public List<Sprint> Sprints { get; set; }
        public List<SquadSprintStats> SquadSprintStats { get; set; }

        /// <summary>
        /// This will always be filled to avoid a deadlock if the first response from the server is a full data response (SessionCreated gets voided by that)
        /// </summary>
        public Session OwnSession { get; set; }

        public int LastEventId { get; set; }

        public static BRPFullData FromContext(BigRoomPlanningContext bigRoomPlanningContext, string sessionId) => new()
        {
            LastEventId = bigRoomPlanningContext.Events.Max(x => x.EventId),
            Squads = [.. bigRoomPlanningContext.Squads],
            Tickets = [.. bigRoomPlanningContext.Tickets],
            PlannedPeriods = [.. bigRoomPlanningContext.PlannedPeriods],
            Dependencies = [.. bigRoomPlanningContext.Dependencies],
            DependencyBoards = [.. bigRoomPlanningContext.DependencyBoards],
            Sprints = [.. bigRoomPlanningContext.Sprints],
            SquadSprintStats = [..bigRoomPlanningContext.SquadSprintStats],
            OwnSession = bigRoomPlanningContext.Sessions.Find(sessionId)
        };
    }
}
