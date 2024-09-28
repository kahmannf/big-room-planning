using System.Globalization;

namespace BigRoomPlanningBoardBackend
{
    public class ApiSettings
    {
        /// <summary>
        /// Controls at which point the api will respoond with the full data instead of an event lsit
        /// to save processing power on the client
        /// </summary>
        public int MaxEventsPerUpdate { get; set; }

        /// <summary>
        /// Relative or absolute Path to the database file
        /// </summary>
        public string DbPath { get; set; }
    }
}
