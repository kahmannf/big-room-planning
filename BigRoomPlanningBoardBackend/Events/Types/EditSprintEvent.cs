using System;

namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class EditSprintEvent : Event
    {
        public int SprintId { get; set; }
        public string Name { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }


        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            var item = bigRoomPlanningContext.Sprints.Find(SprintId);

            if (item == null)
            {
                return false;
            }

            item.Name = Name;
            item.StartsAt = StartsAt;
            item.EndsAt = EndsAt;

            return true;
        }
    }
}
