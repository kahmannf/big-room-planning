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
        /// Describes which DataBase will be used
        /// </summary>
        public DataBaseProvider DataBaseProvider { get; set; }

        /// <summary>
        /// Relative or absolute Path to the database file. If empty the connection string property will be used
        /// </summary>
        public string DbPath { get; set; }

        /// <summary>
        /// Connection string for the configured DataBaseProvider
        /// </summary>
        public string ConnectionString { get; set; }

        /// <summary>
        /// If true, a set of default Data will be created
        /// </summary>
        public bool CreateDebugData { get; set; }
    }
}
