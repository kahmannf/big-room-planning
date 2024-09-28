using System;
using System.Collections.Generic;
using System.Linq;

namespace BigRoomPlanningBoardBackend.Hubs
{
    public class BRPFullData
    {
        public List<Squad> Squads { get; set; }

        public List<SquadBoard> SquadBoards { get; set; }

        public List<Ticket> Tickets { get; set; }

        public List<QuarterYear> QuarterYears { get; set; }

        public List<Dependency> Dependencies { get; set; }
        public List<DependencyBoard> DependencyBoards { get; set; }

        public int LastEventId { get; set; }

        public static BRPFullData FromContext(BigRoomPlanningContext bigRoomPlanningContext) => new()
        {
            LastEventId = bigRoomPlanningContext.Events.Max(x => x.EventId),
            Squads = [.. bigRoomPlanningContext.Squads],
            SquadBoards = [.. bigRoomPlanningContext.SquadBoards],
            Tickets = [.. bigRoomPlanningContext.Tickets],
            QuarterYears = [.. bigRoomPlanningContext.QuarterYears],
            Dependencies = [.. bigRoomPlanningContext.Dependencies],
            DependencyBoards = [.. bigRoomPlanningContext.DependencyBoards]
        };
    }
}
