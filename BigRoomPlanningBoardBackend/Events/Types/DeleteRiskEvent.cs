namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class DeleteRiskEvent : Event
    {
        public int RiskId { get; set; }
        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            var risk = bigRoomPlanningContext.Risks.Find(RiskId);

            if(risk == null)
            {
                return false;
            }

            bigRoomPlanningContext.Remove(risk);

            return true;
        }
    }
}
