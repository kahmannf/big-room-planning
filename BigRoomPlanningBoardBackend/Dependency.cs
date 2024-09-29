using System.Collections.Generic;

namespace BigRoomPlanningBoardBackend
{
    public class Dependency
    {
        public int DependencyId { get; set; }

        /// <summary>
        /// Ticket that depends on the other ticket. This Ticket must be planned after the other Ticket
        /// </summary>
        public int DependantTicketId { get; set; }

        /// <summary>
        /// Ticket that the other Ticket depends on. This Ticket must be planed first.
        /// </summary>
        public int DependencyTicketId { get; set; }
    }
}
