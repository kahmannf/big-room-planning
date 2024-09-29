using System;
using System.Linq;

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
            if (bigRoomPlanningContext.PlannedPeriods.Any(x =>
                (StartDay <= x.StartDay && EndDay >= x.StartDay)
                || (StartDay <= x.EndDay && EndDay >= x.EndDay)
                || (StartDay <= x.StartDay && EndDay >= x.EndDay)
                || (StartDay >= x.StartDay && EndDay <= x.EndDay)
            ))
            {
                return false;
            }


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
