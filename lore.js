// lore.js — The Archive: all lore fragments, notes, and hidden truths
// Some are unlocked at start, others found in-world, others never meant to be found.

const LORE = {

  // ── ARCHIVE ENTRIES (shown in The Archive menu) ──
  archiveEntries: [
    {
      id: "archive_town",
      title: "DOCUMENT 001 — THE TOWN OF CALLOW",
      text: `Callow was incorporated in 1887 as a mining settlement. It does not appear on any state map after 1961. The post office closed. The school closed. The people, according to county records, relocated. According to nothing else, they did.`,
      unlocked: true
    },
    {
      id: "archive_subject",
      title: "DOCUMENT 002 — THE SUBJECT",
      text: `You arrived in Callow on a Tuesday. You do not remember why. You had a bag. You had a name. You have the bag. The name still comes when called, but it sounds like it belongs to someone else now.`,
      unlocked: true
    },
    {
      id: "archive_loop",
      title: "DOCUMENT 003 — ON CYCLES",
      text: `The first time you played this, you went left. The second time, right. The third time, you stood still for eleven minutes before your hands moved again. We have been watching all three times. There is no fourth time that doesn't end here.`,
      unlocked: false
    },
    {
      id: "archive_maren",
      title: "DOCUMENT 004 — MAREN",
      text: `She is not a ghost. Ghosts are echoes of the dead. Maren is an echo of something that hasn't happened yet. When she tells you she's been waiting, believe her. She has been waiting longer than the town has existed.`,
      unlocked: false
    },
    {
      id: "archive_mirror",
      title: "DOCUMENT 005 — THE MIRROR PROBLEM",
      text: `There is a version of you that never entered the house on Vellum Street. That version is not playing this game. That version is fine. We are not concerned with that version.`,
      unlocked: false
    },
    {
      id: "archive_watcher",
      title: "DOCUMENT 006 — WHO IS WATCHING",
      text: `Not us. We stopped watching after the third cycle. What watches now has no name in any language you speak. It learned your patterns. It finds them satisfying. It will be disappointed when you leave.`,
      unlocked: false
    },
    {
      id: "archive_ending",
      title: "DOCUMENT 007 — THE THREE REAL ENDINGS",
      text: `One: You leave Callow. The road is longer than it was. You walk it anyway.\n\nTwo: You stay. You become part of the pattern. Maren smiles for the first time.\n\nThree: You find the basement under the church and you understand. We cannot describe what happens after understanding. Language does not survive it.`,
      unlocked: false
    },
    {
      id: "archive_you",
      title: "DOCUMENT 008 — YOU, SPECIFICALLY",
      text: ``,  // filled dynamically based on player behavior
      unlocked: false,
      dynamic: true
    }
  ],

  // ── IN-WORLD NOTES (found as items) ──
  notes: {
    note_torn_page: {
      title: "torn page",
      content: `...the third night it started in the walls. Not scratching. More like
breathing. Dr. Voss said to document everything so I'm documenting.

Day 14 — heard my name said by no mouth
Day 15 — the wallpaper has been here longer than the house  
Day 16 — I think the town knows I'm writing this
Day 17 — I stopped writing for three days. I don't know what I did instead.
Day 18 — I found this journal in my hands. I don't remember picking it up.

If you're reading this you already made the mistake I made.
The mistake is staying long enough to find the first note.`
    },

    note_childs_drawing: {
      title: "child's drawing",
      content: `[A crayon drawing of a house. In the upstairs window, a figure stands.
In the downstairs window, a different figure stands.
Below the house, in careful child's handwriting:]

the one upstairs knows
the one downstairs forgets
I am neither
        — L`
    },

    note_dr_voss: {
      title: "Dr. Voss — case notes",
      content: `Patient presents with: temporal disorientation, inability to account 
for lost time, insistence that "the town moves when no one is looking."

Patient is lucid. Patient is coherent. Patient is describing something real.

I have begun to hear it too. The breathing in the walls.

I will not write this in the official file.
I will not write this in the official file.
I will not write this in the official file.

[The last line is written seventeen more times, in increasingly
uneven handwriting, until the pen tears through the paper.]`
    },

    note_postmaster: {
      title: "last entry — postmaster's log",
      content: `September 3rd, 1961.

No outgoing mail today.
No incoming mail today.
No people today.

I have been here thirty years. I know all their names.
This morning I couldn't remember a single one.

The town is still here. The buildings, the streets, the church.
But something has been removed from it. Like a word you've always known
and suddenly cannot say.

I am going to walk to the edge of Callow now.
I have never done this before.
I don't know why.`
    },

    note_maren_letter: {
      title: "unsent letter — no address",
      content: `I know you'll find this. You always find this.

I've tried leaving it in different places — the well, the church,
once I burned it and it was back in my pocket by morning.

So. You found it.

You're going to ask me what I am. I'm going to tell you I don't know.
That's not deflection. I genuinely don't know what I am anymore.
I know what I was. I was the last person to leave Callow.

Except I didn't leave.

Don't trust the clock in the church. Don't trust what you see
in still water. And don't — please — go into the basement
before you understand what the basement is for.

I'll find you before you find it. I always do.

                — M`
    },

    note_hidden_wall: {
      title: "writing scratched into plaster",
      content: `CYCLE   1: subject left town.     town followed.
CYCLE   2: subject stayed.        subject forgot.
CYCLE   3: subject found note.    subject understood.   subject stayed.
CYCLE   4: subject found note.    subject understood.   subject stayed.
CYCLE   5: subject found note.    subject understood.   subject stayed.
[...]
CYCLE  ██: subject found note.    subject—

[The rest has been scratched out. By fingernails, by the look of it.]`
    },

    note_game_manual: {
      title: "\"STILL AWAKE\" — original game manual",
      content: `STILL AWAKE
A game for one player.
Duration: indefinite.

CONTROLS: move. examine. remember.
GOAL: unclear.
WINNING CONDITION: none documented.

NOTE FROM DEVELOPER:
This game was not designed. It was transcribed.
The town of Callow exists. The events in this game happened.
We changed the names. We changed the faces.
We could not change what it felt like to be there.

If at any point the game addresses you directly,
this is not a bug.

We're sorry.`
    },

    note_basement_door: {
      title: "note nailed to a door",
      content: `WHAT IS BELOW KNOWS YOU ARE ABOVE

it is not malicious
it is not benevolent  
it is interested

if you go down, it will show you something true
most people cannot carry a true thing back up the stairs

you can leave now
the road out still works
I checked this morning

but you won't leave
they never leave after finding this note
I don't know why I keep writing it

                — the last postmaster of Callow`
    }
  },

  // ── NPC DIALOGUE TREES ──
  dialogues: {
    maren_first: [
      { speaker: "MAREN", text: "You're new. That's— that's actually remarkable. I haven't seen a new face in..." },
      { speaker: "MAREN", text: "Actually I'm not sure how long. Time moves differently here. You'll notice." },
      { speaker: "MAREN", text: "Don't sleep in the house on Vellum Street. Don't ask anyone why. They won't remember, and it'll upset them." },
      { speaker: "MAREN", text: "My name is Maren. I've been here long enough to stop counting. Find me when you know what you're looking for." }
    ],
    maren_second: [
      { speaker: "MAREN", text: "You found one of the notes." },
      { speaker: "MAREN", text: "Everyone who stays long enough finds one. They think it's an accident. It isn't." },
      { speaker: "MAREN", text: "The town leaves them for you. Like a trail." },
      { speaker: "MAREN", text: "I'd tell you to stop following it, but..." },
      { speaker: "MAREN", text: "...you won't." }
    ],
    maren_basement: [
      { speaker: "MAREN", text: "You found the church." },
      { speaker: "MAREN", text: "I can't go in with you. I've tried. There's something in there that knows what I am and it won't let me pass." },
      { speaker: "MAREN", text: "Whatever you see down there—" },
      { speaker: "MAREN", text: "Remember that it's showing you what it thinks you want." },
      { speaker: "MAREN", text: "It isn't wrong, exactly. That's the problem." }
    ],
    maren_ending_stay: [
      { speaker: "MAREN", text: "You're staying." },
      { speaker: "MAREN", text: "I know that face. I've made that choice." },
      { speaker: "MAREN", text: "..." },
      { speaker: "MAREN", text: "It's not so bad. After a while you stop missing the world outside. Or you stop being able to." },
      { speaker: "MAREN", text: "I'm not sure which." },
      { speaker: "MAREN", text: "Welcome to Callow." }
    ],
    old_man_henrick: [
      { speaker: "HENRICK", text: "Stranger. Don't get many of those." },
      { speaker: "HENRICK", text: "My advice? Don't look for the thing that's wrong here. If you look for it, it notices you looking." },
      { speaker: "HENRICK", text: "I've been here fifty years. I've never looked. I'm fine." },
      { speaker: "HENRICK", text: "Mostly fine." }
    ],
    old_man_henrick_2: [
      { speaker: "HENRICK", text: "You're still here." },
      { speaker: "HENRICK", text: "You looked, didn't you." },
      { speaker: "HENRICK", text: "...I thought so." },
      { speaker: "HENRICK", text: "Come back and see me when it starts talking back." }
    ],
    the_child: [
      { speaker: "???", text: "Are you the one from before?" },
      { speaker: "???", text: "There was someone here before. They looked just like you." },
      { speaker: "???", text: "They left. I think. Or they stopped being the kind of thing that can leave." },
      { speaker: "???", text: "I don't remember their name. I remember their face though." },
      { speaker: "???", text: "It's your face." }
    ]
  }
};
