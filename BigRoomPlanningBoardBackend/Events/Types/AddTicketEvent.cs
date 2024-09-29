using System.ComponentModel.DataAnnotations;

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
                Title = Title
            };

            bigRoomPlanningContext.Add(ticket);
            bigRoomPlanningContext.SaveChanges();
            TicketId = ticket.TicketId;

            return true;
        }
    }
}
