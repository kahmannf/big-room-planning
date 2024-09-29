using System.Linq;
using System.Xml.Linq;

namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class EditSquadEvent : Event
    {
        public string Name { get; set; }
        public int SquadId { get; set; }

        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            var item = bigRoomPlanningContext.Squads.Find(SquadId);

            if (item == null)
            {
                return false;
            }

            item.Name = Name;

            return true;
        }
    }
}
