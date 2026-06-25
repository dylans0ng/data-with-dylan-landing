import type { Topic } from "./types";

export const topics: Topic[] = [
  {
    slug: "python-fundamentals",
    title: "Python Fundamentals",
    status: "available",
    sortOrder: 1,
    icon: "🐍",
    shortDescription:
      "Variables, data types, loops, collections, file I/O, and Pandas basics—companion materials for the Python Fundamentals playlist.",
    overviewDescription:
      "Follow this 7-video beginner playlist from first syntax to real data work: variables and data types, conditional logic, for and while loops, lists vs. sets vs. tuples, dictionaries, file I/O, and converting a dictionary into a Pandas DataFrame. Each video pairs with cheat sheets and guided notes below so you can review quickly and practice as you go.",
    playlistUrl:
      "https://www.youtube.com/playlist?list=PL8QLO4tKii7dur8re1EY98lzJdhtX3lRW",
    formats: ["cheat-sheets", "guided-notes"],
    lessonCount: 7,
  },
  {
    slug: "sql-fundamentals",
    title: "SQL Foundations",
    status: "coming_soon",
    sortOrder: 2,
    icon: "🗄️",
    shortDescription:
      "SELECTs, JOINs, GROUP BY, and the query patterns you'll see in interviews and real projects.",
    overviewDescription:
      "SQL companion resources are on the way. Join the newsletter to be first in line when they launch.",
    formats: ["cheat-sheets"],
    lessonCount: 0,
  },
];
