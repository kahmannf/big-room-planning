using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace BigRoomPlanningBoardBackend
{
    public class Ticket
    {
        public int TicketId { get; set; }
        public int SquadId { get; set; }

        /// <summary>
        /// This must be set!
        /// </summary>
        [Required]
        public int PlannedPeriodId { get; set; }

        /// <summary>
        /// If this is null, the Ticket is in the Backlog for the PlannedPeriod
        /// </summary>
        public int? SprintId { get; set; }
    }
}
