using System;

namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class AddPlannedPeriodEvent : Event
    {
        /// <summary>
        /// Will be filled when the Event is processed
        /// </summary>
        public int? PlannedPeriodId { get; set; }
        public string Name { get; set; }
        public DateTime StartDay { get; set; }
        public DateTime EndDay { get; set; }
        public DateTime? BigRoomPlanningAt { get; set; }

        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            var item = new PlannedPeriod
            {
                BigRoomPlanningAt = BigRoomPlanningAt,
                EndDay = EndDay,
                Name = Name,
                StartDay = StartDay
            };

            bigRoomPlanningContext.Add(item);
            bigRoomPlanningContext.SaveChanges();

            PlannedPeriodId = item.PlannedPeriodId;

            return true;
        }
    }
}
