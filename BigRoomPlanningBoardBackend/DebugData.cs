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
                EndDay = new DateTime(2025, 3, 28),
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
                        CreatedAt = DateTime.Now,
                        RecievedAt = DateTime.Now,
                        StartsAt = startDate,
                        EndsAt = startDate.AddDays(11),
                        Name = "Iteration " + iterationCount
                    });

                    iterationCount++;
                    startDate = startDate.AddDays(14);
                }
            }

            context.Add(new AddSquadEvent()
            {
                CreatedAt = DateTime.Now,
                RecievedAt = DateTime.Now,
                Name = "Mike Shinoda"
            });

            context.Add(new AddSquadEvent()
            {
                CreatedAt = DateTime.Now,
                RecievedAt = DateTime.Now,
                Name = "Emily Armstrong"
            });

            context.Add(new AddSquadEvent()
            {
                CreatedAt = DateTime.Now,
                RecievedAt = DateTime.Now,
                Name = "Brad Delson"
            });

            context.Add(new AddSquadEvent()
            {
                CreatedAt = DateTime.Now,
                RecievedAt = DateTime.Now,
                Name = "Dave „Phoenix“ Farrell"
            });

            context.Add(new AddSquadEvent()
            {
                CreatedAt = DateTime.Now,
                RecievedAt = DateTime.Now,
                Name = "Joe Hahn"
            });

            context.Add(new AddSquadEvent()
            {
                CreatedAt = DateTime.Now,
                RecievedAt = DateTime.Now,
                Name = "Colin Brittain"
            });


            List<string> meteora = [
                "Foreword",
                "Don't Stay",
                "Somewhere I Belong",
                "Lying from You",
                "Hit the Floor",
                "Easier to Run",
                "Faint",
                "Figure.09",
                "Breaking the Habit",
                "From the Inside",
                "Nobody's Listening",
                "Session",
                "Numb"
            ];

            foreach (var song in meteora)
            {
                context.Add(new AddTicketEvent
                {
                    CreatedAt = DateTime.Now,
                    RecievedAt = DateTime.Now,
                    PlannedPeriodId = 3, // Future
                    SquadId = 5, // joe
                    Title = song
                });
            }

            List<string> hybridTheory = [
                "Papercut",
                "One Step Closer",
                "With You",
                "Points of Authority",
                "Crawling",
                "Runaway",
                "By Mywself",
                "In the End",
                "A Place for My Head",
                "Forgotten",
                "Cure for the Itch",
                "Pushing Me Away",
                "Opening",
                "Pts.OF.Athrty",
                "Enth E Nd",
                "[Chali]",
                "Frgt/10",
                "P5hng Mw A*wy",
                "Plc. 4 Mie Haed",
                "X-Ecutioner Style",
                "H1 Vltg3",
                "[Riff Raff]",
                "Wth>You",
                "Ntr\\Mssion",
                "PPR:KUT",
                "Rnw@Y",
                "My<Dsmbr",
                "Stef",
                "By_Myslf",
                "Kyur4 th Ich",
                "1stp  Klosr",
                "Krwlng",
                "Carousel",
                "Technique",
                "Step Up",
                "And One",
                "High Voltage",
                "Part of Me"
            ];

            foreach (var song in hybridTheory)
            {
                context.Add(new AddTicketEvent
                {
                    CreatedAt = DateTime.Now,
                    RecievedAt = DateTime.Now,
                    PlannedPeriodId = 3, // Future
                    SquadId = 1, // mike
                    Title = song
                });
            }


            context.SaveChanges();
        }
    }
}
