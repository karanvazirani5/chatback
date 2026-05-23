import type { MasterAnalysis } from "./types";

// Believable Claude-memory-style export. Persona: Sarah, 28, PM at a fintech
// startup in NYC. The SAMPLE_ANALYSIS below is what Chatback would return for
// this input — handtuned to be uncomfortably specific.
export const SAMPLE_RAW_TEXT = `[2024-01-08] - Sarah, 28, PM at Lattice (fintech startup in NYC). New Year reflection: feels like I'm "not building anything that lasts."
[2024-01-15] - First time asking whether to leave PM for engineering. Worried I'm playing dress-up as the technical PM.
[2024-02-03] - MBA question again — leaning no. "Wrong shape for me." Third time having this conversation.
[2024-03-04] - Started drafting Slack message to Devon (skip-level) about his weekly status pings killing flow. Have not sent it.
[2024-03-15] - Started Substack called Receipts — newsletter about consumer fintech. First post: "What Apple Pay's rev share tells you about the next 5 years."
[2024-04-02] - Drafted resignation email. Did not send. Talked self out of it.
[2024-04-22] - Receipts post #2 published. About neobanks.
[2024-05-10] - Receipts post #3 published. About BNPL. Eight comments — best post yet.
[2024-05-18] - MBA question again. Same conclusion.
[2024-06-05] - Started bouldering at Brooklyn Boulders. Going 2-3x per week.
[2024-07-22] - Asked about how to manage up to Devon. Drafted second version of the Slack. Did not send.
[2024-08-14] - Receipts post #4 in drafts: about Apple Pay rev share. Has not been published.
[2024-09-01] - Started Spanish on Duolingo. Goal: B1 by next year.
[2024-09-12] - First conversation about a16z Scout program. What do they actually do? Could I apply?
[2024-10-30] - Stopped opening Duolingo. Spanish abandoned.
[2024-11-14] - Last Duolingo session. Done.
[2024-12-19] - Started Forks — notes app for restaurant recs. Built first prototype in a weekend.
[2025-01-05] - Forks MVP shipped to TestFlight (private build).
[2025-01-18] - Forks: 5 friends invited to TestFlight. Stuck on onboarding screen.
[2025-02-08] - a16z Scout: started drafting the application. Has not submitted.
[2025-02-22] - Substack — keeps drafting Apple Pay post. Has been "almost ready" since August.
[2025-03-03] - Tried to write essay good enough to get quoted by another writer. Abandoned at 600 words.
[2025-03-19] - Devon's status pings hit a new high. Drafted third Slack message. Did not send.
[2025-03-30] - Bouldering: V4 first time. Eight months in.
[2025-04-14] - Forks: App Store screenshots are blocking. Has been for 3 months.
[2025-04-29] - Asked about PM-to-engineering pivot for 21st time. Still has not opened LeetCode.
[2025-05-05] - a16z Scout application: re-edited the same three answers. Still has not submitted.
[2025-05-12] - Forks: TestFlight reviewers waiting. Build is done.
`;

export const SAMPLE_ANALYSIS: MasterAnalysis = {
  themes: [
    {
      theme: "Should I leave PM for a more technical role?",
      count: 23,
      description:
        "Variations of 'should I learn to code seriously / become a PM-engineer / switch tracks' all year. Has not opened a LeetCode tab.",
    },
    {
      theme: "Managing up to Devon (skip-level)",
      count: 17,
      description:
        "Drafted Slack message about his weekly status pings three separate times. Never sent any of them.",
    },
    {
      theme: "Shipping Forks (restaurant notes app)",
      count: 14,
      description:
        "TestFlight build is done. Stuck on App Store screenshots for 4 months. Five friends still waiting on invites.",
    },
    {
      theme: "Substack frequency anxiety",
      count: 11,
      description:
        "Drafted 6 posts for Receipts, published 3. The Apple Pay rev share post has been 'almost ready' since August.",
    },
    {
      theme: "a16z Scout application",
      count: 9,
      description:
        "Asked what scouts do, how deal sourcing works, whether you 'count.' Application is drafted. Not submitted.",
    },
  ],
  open_loops: [
    {
      question: "Apply to the a16z Scout program?",
      first_seen: "2024-09-12",
      times_asked: 9,
      notes: "Application is drafted. Re-edited the same three answers in May. Never submitted.",
    },
    {
      question: "Tell Devon his weekly status pings are killing flow?",
      first_seen: "2024-03-04",
      times_asked: 8,
      notes: "Wrote three versions of the Slack. Sent none.",
    },
    {
      question: "Ship Forks to the TestFlight reviewers?",
      first_seen: "2024-12-19",
      times_asked: 6,
      notes: "Build is done. Screenshots have been the blocker for 4 months.",
    },
    {
      question: "Restart Spanish or admit it's dead?",
      first_seen: "2024-10-30",
      times_asked: 4,
      notes: "Hasn't opened Duolingo since November 14.",
    },
    {
      question: "Do an MBA?",
      first_seen: "2024-01-08",
      times_asked: 7,
      notes: "Re-litigated three times in the past year. Always lands on no.",
    },
  ],
  decisions_made: [
    {
      topic: "MBA",
      evidence: "Asked in Feb, May, October — each time ended with 'wrong shape for me'.",
      verdict: "Not doing it. Stop relitigating.",
    },
    {
      topic: "Staying at Lattice through EOY",
      evidence: "Drafted a resignation email in April. Talked yourself out of it the next day.",
      verdict: "Staying. The pivot is personal, not a job change.",
    },
    {
      topic: "Bouldering as the exercise routine",
      evidence: "Consistent for 8 months — the only routine you actually stuck with.",
      verdict: "Decided. Stop pretending you'll start running again.",
    },
  ],
  this_week:
    "Hit publish on Receipts post #4 — the Apple Pay rev share piece that's been in drafts since August. Don't open it to edit. Just publish.",
  unfinished: [
    {
      name: "Forks (restaurant notes app)",
      mentions: 14,
      recommendation: "ship_small",
      why: "Build is done. Ship to the 5 TestFlight friends with whatever screenshots you have today.",
    },
    {
      name: "Receipts (consumer fintech Substack)",
      mentions: 11,
      recommendation: "revive",
      why: "Three drafts already written. One published post unsticks the whole thing.",
    },
    {
      name: "Spanish on Duolingo",
      mentions: 5,
      recommendation: "kill",
      why: "You haven't opened it in 6 months. Stop carrying the guilt.",
    },
    {
      name: "a16z Scout application",
      mentions: 9,
      recommendation: "ship_small",
      why: "Submit the application as-is this weekend. You've been editing the same three answers for 4 months.",
    },
    {
      name: "PM-career-pivot blog post",
      mentions: 6,
      recommendation: "kill",
      why: "You don't actually want to publish this. Delete the draft.",
    },
  ],
  viral_modes: {
    roast:
      "You've asked Claude about leaving PM for engineering 23 times this year and still haven't opened a single LeetCode tab. You're not a closet engineer. You're a PM who likes the idea of being one.",
    wrapped: {
      archetype: "The Drafter",
      tagline: "23 questions. 5 drafts. 1 MVP stuck on screenshots.",
      numbers: [
        { value: "23", label: "engineering-pivot questions" },
        { value: "3", label: "Slack drafts to Devon, 0 sent" },
        { value: "5", label: "Substack posts started" },
        { value: "3", label: "Substack posts published" },
        { value: "1", label: "MVP built (Forks)" },
        { value: "0", label: "LeetCode tabs opened" },
      ],
      personality: {
        founder_brain: 64,
        overthinker: 88,
        looper: 91,
        decisiveness: 35,
        ship_rate: 22,
        habit_graveyard: 78,
        self_doubt: 72,
        optimism: 51,
      },
      superlatives: [
        {
          label: "Longest open loop",
          value: "Devon Slack about status pings — 14 months drafted, 0 sent",
        },
        {
          label: "Most consistent habit",
          value:
            "Bouldering at Brooklyn Boulders — 11 months, 3x a week, V4 first time at 8 months",
        },
        {
          label: "Most-revisited question",
          value: "Should I leave PM for engineering? — asked 23 times",
        },
      ],
    },
    graveyard: [
      { idea: "Spanish lessons", verdict: "dead" },
      { idea: "Marathon training", verdict: "dead" },
      { idea: "PM-pivot blog post", verdict: "distraction" },
      { idea: "Receipts Substack", verdict: "revive" },
      { idea: "Forks (notes app)", verdict: "revive" },
    ],
    forgot_wanted:
      "In March you said you wanted to write one essay good enough to get quoted. You haven't tried since.",
    future_letter:
      "From November-you: Forks shipped to 23 people, three actually use it daily. You finally sent Devon the message — he was fine, you were the problem. The Scout application got rejected, and you cared less than you thought you would.",
    founder_scan:
      "Archetype: The Drafter. More unfinished documents than finished decisions. The bottleneck isn't ideas — it's hitting publish.",
  },
};
