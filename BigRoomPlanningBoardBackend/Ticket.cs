using System.Collections.Generic;

namespace BigRoomPlanningBoardBackend
{
    public class Ticket
    {
        public int TicketId { get; set; }
        public int SquadId { get; set; }
        public int SquardBoardId { get; set; }

        public List<int> RequirementIds { get; set; }

        public List<int> TargetIds { get; set; }
    }
}
