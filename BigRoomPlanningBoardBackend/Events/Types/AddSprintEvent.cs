using System;
using System.Linq;

namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class AddSprintEvent : Event
    {
        /// <summary>
        /// Will be set after the event ist proccessed
        /// </summary>
        public int? SprintId { get; set; }
        public string Name { get; set; }
        public DateTime StartsAt { get; set; }
        public DateTime EndsAt { get; set; }

        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            if(bigRoomPlanningContext.Sprints.Any(x =>
                (StartsAt <= x.StartsAt && EndsAt >= x.StartsAt)
                || (StartsAt <= x.EndsAt && EndsAt >= x.EndsAt)
                || (StartsAt <= x.StartsAt && EndsAt >= x.EndsAt)
            ))
            {
                return false;
            }

            var sprint = new Sprint
            {
                EndsAt = EndsAt,
                StartsAt = StartsAt,
                Name = Name
            };
            bigRoomPlanningContext.Add(sprint);
            bigRoomPlanningContext.SaveChanges();

            SprintId = sprint.SprintId;

            return true;
        }
    }
}
