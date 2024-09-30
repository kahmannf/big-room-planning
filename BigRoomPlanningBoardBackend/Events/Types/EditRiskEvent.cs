namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class EditRiskEvent : Event
    {
        public int RiskId { get; set; }
        public int SquadId { get; set; }
        public int SprintId { get; set; }

        public string Text { get; set; }

        public string Mitigations { get; set; }

        public bool Accepted { get; set; }

        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            if (string.IsNullOrWhiteSpace(Text))
            {
                return false;
            }

            var squad = bigRoomPlanningContext.Squads.Find(SquadId);
            var sprint = bigRoomPlanningContext.Sprints.Find(SprintId);

            if (squad == null || sprint == null)
            {
                return false;
            }

            var item = bigRoomPlanningContext.Risks.Find(RiskId);

            if (item == null)
            {
                return false;
            }

            item.Accepted = Accepted;
            item.SprintId = SprintId;
            item.SquadId = SquadId;
            item.Text = Text;

            return true;
        }
    }
}
