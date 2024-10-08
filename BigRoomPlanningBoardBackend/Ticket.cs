﻿using System.Collections.Generic;
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
        public int PlannedPeriodId { get; set; }

        /// <summary>
        /// If this is null, the Ticket is in the Backlog for the PlannedPeriod
        /// </summary>
        public int? SprintId { get; set; }

        /// <summary>
        /// Position in the column its currently in
        /// </summary>
        public int ColumnOrder { get; set; }

        public string Title { get; set; }

        public int? PredecessorId { get; set; }
    }
}
