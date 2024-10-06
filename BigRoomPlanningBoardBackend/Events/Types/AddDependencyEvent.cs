using System.Linq;

namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class AddDependencyEvent : Event
    {
        /// <summary>
        /// Will be filled after the event is processed
        /// </summary>
        public int? DependencyId { get; set; }

        /// <summary>
        /// Ticket that depends on the other ticket. This Ticket must be planned after the other Ticket
        /// </summary>
        public int DependantTicketId { get; set; }

        /// <summary>
        /// Ticket that the other Ticket depends on. This Ticket must be planed first.
        /// </summary>
        public int DependencyTicketId { get; set; }

        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            var existing = bigRoomPlanningContext.Dependencies.FirstOrDefault(x =>
                x.DependantTicketId == DependantTicketId
                && x.DependencyTicketId == DependencyId
            );

            if (existing != null)
            {
                return false;
            }

            var dependency = new Dependency
            {
                DependencyTicketId = DependencyTicketId,
                DependantTicketId = DependantTicketId
            };

            bigRoomPlanningContext.Dependencies.Add(dependency);
            bigRoomPlanningContext.SaveChanges();

            DependencyId = dependency.DependencyId;

            return true;
        }
    }
}
