using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace BigRoomPlanningBoardBackend
{
    [PrimaryKey(nameof(SquadId), nameof(SprintId))]
    public class SquadSprintStats
    {
        public int SquadId { get; set; }
        public int SprintId { get; set; }

        public double Capacity { get; set; }

        public double BackgroundNoise { get; set; }
    }
}
