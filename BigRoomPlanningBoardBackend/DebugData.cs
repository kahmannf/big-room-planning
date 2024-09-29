using BigRoomPlanningBoardBackend.Events.Types;
using System;
using System.Collections.Generic;

namespace BigRoomPlanningBoardBackend
{
    public static class DebugData
    {

        public static void Create(BigRoomPlanningContext context)
        {
            context.Add(new AddPlannedPeriodEvent()
            {
                CreatedAt = DateTime.Now,
                RecievedAt = DateTime.Now,
                Name = "Past",
                EndDay = new DateTime(2024, 9, 20),
                StartDay = new DateTime(2024, 7, 1)
            });

            context.Add(new AddPlannedPeriodEvent()
            {
                CreatedAt = DateTime.Now,
                RecievedAt = DateTime.Now,
                Name = "Current",
                EndDay = new DateTime(2024, 12, 27),
                StartDay = new DateTime(2024, 10, 7)
            });

            context.Add(new AddPlannedPeriodEvent()
            {
                CreatedAt = DateTime.Now,
                RecievedAt = DateTime.Now,
                Name = "Future",
                EndDay = new DateTime(2025, 3, 29),
                StartDay = new DateTime(2025, 1, 6)
            });

            List<Tuple<DateTime, DateTime>> targets = [
                Tuple.Create(new DateTime(2024, 7, 1), new DateTime(2024, 9, 13)),
                Tuple.Create(new DateTime(2024, 10, 7), new DateTime(2024, 12, 27)),
                Tuple.Create(new DateTime(2025, 1, 6), new DateTime(2025, 3, 28))
            ];

            var iterationCount = 1;

            foreach (var target in targets)
            {
                var startDate = target.Item1;
                var endDate = target.Item2;

                while (startDate < endDate)
                {
                    context.Add(new AddSprintEvent()
                    {
                        StartsAt = startDate,
                        EndsAt = startDate.AddDays(11),
                        Name = "Iteration " + iterationCount
                    });

                    iterationCount++;
                    startDate = startDate.AddDays(14);
                }
            }
            


            context.SaveChanges();
        }
    }
}
