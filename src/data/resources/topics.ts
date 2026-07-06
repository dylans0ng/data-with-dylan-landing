import openAiLogo from "../../assets/resources/openai-logo.png";
import pythonLogo from "../../assets/resources/python-logo.png";
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
    sortOrder: 3,
    icon: "🗄️",
    shortDescription:
      "SELECTs, JOINs, GROUP BY, and the query patterns you'll see in interviews and real projects.",
    overviewDescription:
      "SQL companion resources are on the way. Join the newsletter to be first in line when they launch.",
    formats: ["cheat-sheets"],
    lessonCount: 0,
  },
  {
    slug: "ai-with-python-for-beginners",
    title: "AI with Python for Beginners",
    status: "available",
    sortOrder: 2,
    icon: "AI",
    iconAsset: openAiLogo,
    shortDescription:
      "Beginner-friendly companion resources for learning how to call AI models from Python, protect API keys, and build practical prompt-powered projects.",
    overviewDescription:
      "Beginner-friendly resources to help you make your first AI API calls in Python. Learn the foundations - from setting up your project and protecting API keys to writing better prompts and building simple AI-powered tools.",
    playlistUrl:
      "https://youtube.com/playlist?list=PLP4xe81nw01Q&si=W_nv2x2onRxYphhn",
    formats: ["cheat-sheets", "guided-notes"],
    lessonCount: 1,
  },
];
