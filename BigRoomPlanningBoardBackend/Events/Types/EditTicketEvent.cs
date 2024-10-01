using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class EditTicketEvent : Event
    {
        public int TicketId { get; set; }

        public int SquadId { get; set; }

        public int PlannedPeriodId { get; set; }

        public int? SprintId { get; set; }

        public string Title { get; set; }

        public int ColumnOrder { get; set; }

        public int? PredecessorId { get; set; }

        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            if (string.IsNullOrWhiteSpace(Title))
            {
                return false;
            }

            var squad = bigRoomPlanningContext.Squads.Find(SquadId);
            var plannedPeriod = bigRoomPlanningContext.PlannedPeriods.Find(PlannedPeriodId);
            var sprint = bigRoomPlanningContext.Sprints.Find(SprintId);

            if (squad == null || plannedPeriod == null || sprint == null)
            {
                return false;
            }

            if (PredecessorId.HasValue)
            {
                var predecessor = bigRoomPlanningContext.Tickets.FirstOrDefault(t => 
                    t.TicketId == PredecessorId.Value
                    && t.SquadId == SquadId
                    && t.SprintId == SprintId
                    && t.PlannedPeriodId == PlannedPeriodId
                );

                if (predecessor == null)
                {
                    return false;
                }
            }

            var item = bigRoomPlanningContext.Tickets.Find(TicketId);

            if(item == null)
            {
                return false;
            }

            // If the item is moved between column we have to recalculate the columnh order for items in the old column
            if (
                item.SquadId != SquadId
                || item.SprintId != SprintId
                || item.PlannedPeriodId != PlannedPeriodId
            )
            {
                var oldColumnTickets = bigRoomPlanningContext.Tickets
                    .Where(t =>
                        t.PlannedPeriodId == item.PlannedPeriodId
                        && t.SquadId == item.SquadId
                        && t.SprintId == item.SprintId
                        && t.TicketId != item.TicketId
                    )
                    .OrderBy(x => x.ColumnOrder)
                    .ToArray();

                for (int i = 0; i < oldColumnTickets.Length; i++)
                {
                    oldColumnTickets[i].ColumnOrder = i;

                    if (oldColumnTickets[i].PredecessorId == TicketId)
                    {
                        oldColumnTickets[i].PredecessorId = null;
                    }
                }
            }

            // Here we only adjust the new column (order could technically stay the same between column)
            if (
                item.SquadId != SquadId
                || item.SprintId != SprintId
                || item.PlannedPeriodId != PlannedPeriodId
                || item.ColumnOrder != ColumnOrder
            )
            {
                var newColumnTickets = bigRoomPlanningContext.Tickets
                    .Where(t =>
                        t.PlannedPeriodId == PlannedPeriodId
                        && t.SquadId == SquadId
                        && t.SprintId == SprintId
                    )
                    .OrderBy(x => x.ColumnOrder)
                    .ToArray();

                int actualIndex = 0;
                for(int i = 0; i < newColumnTickets.Length; i++)
                {
                    if (actualIndex == ColumnOrder)
                    {
                        actualIndex++;
                    }

                    newColumnTickets[i].ColumnOrder = actualIndex;
                    actualIndex++;
                }
            }



            item.SquadId = SquadId;
            item.PlannedPeriodId = PlannedPeriodId;
            item.SprintId = SprintId;
            item.Title = Title;
            item.ColumnOrder = ColumnOrder;
            item.PredecessorId = PredecessorId;

            return true;
        }
    }
}
