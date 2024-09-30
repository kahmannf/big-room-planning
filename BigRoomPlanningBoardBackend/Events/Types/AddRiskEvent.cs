namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class AddRiskEvent : Event
    {
        /// <summary>
        /// This will be filled after the event was processed
        /// </summary>
        public int? RiskId { get; set; }
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

            var risk = new Risk()
            {
                Accepted = Accepted,
                SprintId = SprintId,
                SquadId = SquadId,
                Text = Text
            };

            bigRoomPlanningContext.Add(risk);
            bigRoomPlanningContext.SaveChanges();
            RiskId = risk.RiskId;

            return true;
        }
    }
}
