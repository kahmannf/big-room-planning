namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class AddOrUpdateSquadSprintStatsEvent : Event
    {
        public int SquadId { get; set; }
        public int SprintId { get; set; }
        public double Capacity { get; set; }
        public double BackgroundNoise { get; set; }

        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            if (Capacity < 0 || BackgroundNoise < 0)
            {
                return false;
            }

            var squad = bigRoomPlanningContext.Squads.Find(SquadId);
            var sprint = bigRoomPlanningContext.Sprints.Find(SprintId);

            if (squad == null || sprint == null)
            {
                return false;
            }

            var existing = bigRoomPlanningContext.SquadSprintStats.Find(SquadId, SprintId);

            if (existing == null)
            {
                existing = new SquadSprintStats
                {
                    SquadId = SquadId,
                    SprintId = SprintId,
                    BackgroundNoise = BackgroundNoise,
                    Capacity = Capacity
                };

                bigRoomPlanningContext.Add(existing);
            }
            else
            {
                existing.BackgroundNoise = BackgroundNoise;
                existing.Capacity = Capacity;
            }

            return true;
        }
    }
}
