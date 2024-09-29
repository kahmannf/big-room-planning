using System.Linq;

namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class AddSquadEvent : Event
    {
        public string Name { get; set; }

        /// <summary>
        /// Will be filled when the Event is processed
        /// </summary>
        public int? SquadId { get; set; }

        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            if (string.IsNullOrWhiteSpace(Name) || bigRoomPlanningContext.Squads.Any(x => x.Name == Name))
            {
                return false;
            }



            var squad = new Squad();
            squad.Name = Name;
            bigRoomPlanningContext.Add(squad);
            bigRoomPlanningContext.SaveChanges();
            SquadId = squad.SquadId;

            return true;
        }
    }
}
