using System.ComponentModel.DataAnnotations;

namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class EditTicketEvent : Event
    {
        public int TicketId { get; set; }

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

            var item = bigRoomPlanningContext.Tickets.Find(TicketId);

            if(item == null)
            {
                return false;
            }

            item.SquadId = SquadId;
            item.PlannedPeriodId = PlannedPeriodId;
            item.SprintId = SprintId;
            item.Title = Title;

            return true;
        }
    }
}
