using System.Linq;

namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class AddSquadEvent : Event
    {
        public string SquadName { get; set; }

        public int? SquadId { get; set; }

        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            if (string.IsNullOrWhiteSpace(SquadName) || bigRoomPlanningContext.Squads.Any(x => x.Name == SquadName))
            {
                return false;
            }



            var squad = new Squad();
            squad.Name = SquadName;
            bigRoomPlanningContext.Add(squad);
            bigRoomPlanningContext.SaveChanges();
            SquadId = squad.SquadId;

            return true;
        }
    }
}
