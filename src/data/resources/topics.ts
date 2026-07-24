import openAiLogo from "../../assets/resources/openai-logo.png";
import pandasLogo from "../../assets/resources/pandas-logo.png";
import pythonLogo from "../../assets/resources/python-logo.png";
import sqlLogo from "../../assets/resources/sql-logo.png";
import type { Topic } from "./types";

export const topics: Topic[] = [
  {
    slug: "python-fundamentals",
    title: "Python Fundamentals",
    status: "available",
    sortOrder: 1,
    icon: "🐍",
    iconAsset: pythonLogo,
    shortDescription:
      "Variables, data types, loops, collections, file I/O, and Pandas basics—companion materials for the Python Fundamentals playlist.",
    cardMetaText: "7 lessons available",
    overviewDescription:
      "Follow this 7-video beginner playlist from first syntax to real data work: variables and data types, conditional logic, for and while loops, lists vs. sets vs. tuples, dictionaries, file I/O, and converting a dictionary into a Pandas DataFrame. Each video pairs with cheat sheets and guided notes below so you can review quickly and practice as you go.",
    playlistUrl:
      "https://www.youtube.com/playlist?list=PL8QLO4tKii7dur8re1EY98lzJdhtX3lRW",
    formats: ["cheat-sheets", "guided-notes"],
    lessonCount: 7,
  },
  {
    slug: "pandas-fundamentals-crash-course",
    title: "Pandas Fundamentals Crash Course",
    status: "partial",
    sortOrder: 2,
    icon: "Pandas",
    iconAsset: pandasLogo,
    shortDescription:
      "Start by loading and exploring DataFrames in Pandas. Eight more lessons are coming.",
    overviewDescription:
      "Begin this Pandas crash course by loading files into your local Python program and exploring DataFrames for further analysis. Download the cheat sheets or work through the guided notes, then check back as eight more lessons are revealed.",
    playlistUrl:
      "https://youtube.com/playlist?list=PLAzeSxOXvt7s&si=FZPUui-pO5K5HL-T",
    formats: ["cheat-sheets", "guided-notes"],
    lessonCount: 10,
    availableLessonCount: 2,
    mysteryLessonCount: 8,
    comingSoonHeading: "Eight lessons are coming",
    comingSoonDescription:
      "Lessons 1 and 2 are available now. The remaining eight topics will stay under wraps until each new lesson is ready to be revealed.",
    formatIntroCopy:
      "Both supplemental formats are available for Lessons 1 and 2 - pick the one that fits how you learn best.",
    formatTeaserCopy:
      "8 lessons coming · New topics will be revealed as they’re published.",
  },
  {
    slug: "sql-fundamentals",
    title: "SQL Foundations",
    status: "partial",
    sortOrder: 4,
    iconAsset: sqlLogo,
    icon: "🗄️",
    shortDescription:
      "Start with SQL joins now. Guided notes and more SQL topics are still in progress.",
    overviewDescription:
      "Build practical SQL confidence one topic at a time. The SQL Joins cheat sheet is available now, with guided notes and additional SQL topics coming later.",
    playlistUrl:
      "https://youtube.com/playlist?list=PL8QLO4tKii7cYqWLhzVDfLYmWTXa7DcLt&si=uzMKMYdT07diJmIm",
    formats: ["cheat-sheets", "guided-notes"],
    lessonCount: 1,
    availableResourceCount: 1,
    comingSoonHeading: "More SQL topics are coming",
    comingSoonDescription:
      "Upcoming resources will cover SELECT statements, WHERE filters, GROUP BY, aggregate functions, subqueries, and window functions.",
    formatIntroCopy:
      "Start with the format that is published now, and see what is planned next.",
    formatComingSoonCopy: {
      "guided-notes":
        "Step-by-step SQL joins notes are planned, but not published yet.",
    },
  },
  {
    slug: "ai-with-python-for-beginners",
    title: "AI with Python for Beginners",
    status: "available",
    sortOrder: 3,
    icon: "AI",
    iconAsset: openAiLogo,
    shortDescription:
      "Beginner-friendly companion resources for learning how to call AI models from Python, protect API keys, and build practical prompt-powered projects.",
    cardMetaText: "1 lesson available · More coming",
    overviewDescription:
      "Beginner-friendly resources to help you make your first AI API calls in Python. Learn the foundations - from setting up your project and protecting API keys to writing better prompts and building simple AI-powered tools.",
    playlistUrl:
      "https://youtube.com/playlist?list=PLP4xe81nw01Q&si=W_nv2x2onRxYphhn",
    formats: ["cheat-sheets", "guided-notes"],
    lessonCount: 1,
  },
];
