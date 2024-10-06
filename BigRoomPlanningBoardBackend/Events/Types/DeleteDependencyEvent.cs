namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class DeleteDependencyEvent : Event
    {
        public int DependencyId { get; set; }

        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            var dependency = bigRoomPlanningContext.Dependencies.Find(DependencyId);

            if (dependency == null)
            {
                return false;
            }

            bigRoomPlanningContext.Remove(dependency);
            return true;
        }
    }
}
