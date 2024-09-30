using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class AddTicketEvent : Event
    {
        /// <summary>
        /// This will be set after the event is processed
        /// </summary>
        public int? TicketId { get; set; }

        public int SquadId { get; set; }

        public int PlannedPeriodId { get; set; }

        public int? SprintId { get; set; }

        public string Title { get; set; }

        public int ColumnOrder { get; set;  }

        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            if (string.IsNullOrWhiteSpace(Title))
            {
                return false;
            }

            var squad = bigRoomPlanningContext.Squads.Find(SquadId);
            var plannedPeriod = bigRoomPlanningContext.PlannedPeriods.Find(PlannedPeriodId);

            if (squad == null || plannedPeriod == null)
            {
                return false;
            }

            var ticket = new Ticket
            {
                PlannedPeriodId = PlannedPeriodId,
                SprintId = SprintId,
                SquadId = SquadId,
                Title = Title,
                ColumnOrder = ColumnOrder
            };

            bigRoomPlanningContext.Add(ticket);

            // we just assume that tickets will always be added in the backlog
            var relevantTickets = bigRoomPlanningContext.Tickets
                .Where(x => x.SprintId == null && x.PlannedPeriodId == ticket.PlannedPeriodId && x.SquadId == ticket.SquadId)
                .OrderBy(x => x.ColumnOrder)
                .ToList();

            for (int i = 0; i < relevantTickets.Count; i++)
            {
                relevantTickets[i].ColumnOrder = relevantTickets[i].ColumnOrder + 1;
            }


            bigRoomPlanningContext.SaveChanges();
            TicketId = ticket.TicketId;

            return true;
        }
    }
}
