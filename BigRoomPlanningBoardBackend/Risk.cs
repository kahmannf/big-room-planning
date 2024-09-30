namespace BigRoomPlanningBoardBackend
{
    public class Risk
    {
        public int RiskId { get; set; }
        public int SquadId { get; set; }
        public int SprintId { get; set; }

        public string Text { get; set; }

        public bool Accepted { get; set; }
    }
}
