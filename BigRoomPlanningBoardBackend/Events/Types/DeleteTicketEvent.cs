using System.Linq;

namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class DeleteTicketEvent : Event
    {
        public int TicketId { get; set; }

        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            var item = bigRoomPlanningContext.Tickets.Find(TicketId);

            if (item == null)
            {
                return false;
            }

            // Cannot delete a Ticket that another Ticket depends on
            if (bigRoomPlanningContext.Dependencies.Any(d => d.DependencyTicketId == TicketId))
            {
                return false;
            }

            // Delete Dependencies, if this ticket was a Dependedant
            var removableDependecies = bigRoomPlanningContext.Dependencies.Where(d => d.DependantTicketId == TicketId).ToArray();
            bigRoomPlanningContext.Dependencies.RemoveRange(removableDependecies);
            bigRoomPlanningContext.Tickets.Remove(item);

            return true;
        }
    }
}
