using System;
using System.Collections.Generic;

namespace BigRoomPlanningBoardBackend
{
    public class QuarterYear
    {
        public int QuarterYearId { get; set; }
        public DateTime StartDay { get; set; }
        public DateTime EndDay { get; set; }

        /// <summary>
        /// Day an time of the Big Room Planning for this quarter
        /// </summary>
        public DateTime BigRoomPlanningAt { get; set; }
    }
}
