using System;

namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class EditPlannedPeriodEvent : Event
    {
        public int PlannedPeriodId { get; set; }
        public string Name { get; set; }
        public DateTime StartDay { get; set; }
        public DateTime EndDay { get; set; }
        public DateTime? BigRoomPlanningAt { get; set; }

        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            var item = bigRoomPlanningContext.PlannedPeriods.Find(PlannedPeriodId);

            if(item == null)
            {
                return false;
            }

            item.Name = Name;
            item.StartDay = StartDay;
            item.EndDay = EndDay;
            item.BigRoomPlanningAt = BigRoomPlanningAt;

            return true;
        }
    }
}
