// ---------- comment templates: [a|b] = random alternative, {X} = slot ----------
const T={
panic:[
"no no no. {C}?? what did you do to {C}",
"[I have genuinely been staring at this for ten minutes|been sitting here for a while] trying to work out what 'surprised' means for {C}",
"if {C} dies I'm [done|logging off|actually going to riot|filing a formal complaint]",
"[please|I'm asking nicely|I'm begging you]. not {C}.",
"my heart. {C}. my [HEART|poor heart|entire week]",
"the way I just put my phone face down and walked away from it",
"[this is how it starts|this is exactly how the last {C} thing started]. and I [was fine before this post|still haven't recovered from book {N}]",
"{A} I have a [full day of work|exam|flight] tomorrow and you do this to us",
"nope. closing the app. [reopening it immediately|coming back in an hour]",
"the {P} chapter already broke me once, I can't do it again"],
theory:[
"[ok so|hear me out|okay hear me out|so|theory:] {CLAIM}. [the {P} scene in book {N} only works if that's true|it would explain the whole {P} thing|it explains why {C} never answers when {C2} asks]",
"[I'm calling it now:|calling it:|screenshot this:] {CLAIM}",
"what if {CLAIM} and [we've been reading it wrong this whole time|that's why chapter {ch} feels off]?",
"[unpopular theory|spicy theory|probably nothing but] — {CLAIM}. [the pieces fit|think about {P}|think about what {F} gains]",
"{CLAIM}. [that's it. that's the comment|and I will not be taking questions|no further evidence, just vibes]",
"[everyone's looking at {C2} but|while everyone argues about {C2},] I think {CLAIM}",
"been [turning this over|chewing on this] since book {N}: {CLAIM}. [the timeline supports it|tell me I'm wrong]"],
clue:[
"[remember|don't forget|go back and reread] chapter {ch}? {C} [never actually says|conveniently doesn't mention|avoids looking at] {P}",
"[page {pg} of book {N}|chapter {ch}] already [hinted at this|set this up]. [rereading it now|I just checked]",
"[this lines up with|this is the same thing as] what {F} [did|said] in book {N}. [not a coincidence|I'm not letting this go]",
"chapter {ch} literally [makes me more sure|says it outright if you read it twice|has the answer]",
"the [mural|map|letter|ledger] in chapter {ch} [matches this|already told us]. nobody wants to talk about it though",
"[you mentioned|there's a line about] {O} way back in book {N} and [we all skipped it|nobody followed up on it]"],
bait:[
"[you do this every single time|this is bait|you're doing it on purpose|we know exactly what you're doing], {A}",
"[trolling|bait|a classic|an absolute classic] [from our favourite author|and it worked]. I'm [obviously|of course] [spiralling|refreshing every five minutes]",
"[three teasers in a row|another teaser|another cryptic post] and still no [release date|chapter|actual information]",
"[I refuse to be baited|you can't keep doing this to us|this is psychological warfare]. [anyway what does it mean|...what does it mean]",
"[the 'something is coming' era again|the cryptic post era again]. [we've been here before|and last time it was {ago}]",
"{A} posts one sentence and [the whole fandom|everyone] [loses their minds|spends a week analysing it]. [iconic|genius marketing|rude]"],
joke:[
"[bro|man|ok but|me:] really [saw|met|released] [an ancient god|a literal kingdom-ending prophecy] and said 'yeah I'll deal with that later' [💀|]",
"me: I'm fine. {A}: *posts about {C}* me: [sobbing|screaming|in the group chat at 3am]",
"{C} walking into {P} [for the third time|again|with zero plan] like it's a [shopping trip|gym|group project]",
"[{C} having a normal day|{C2} minding their own business|{F} being {F}]: [{A} has entered the chat|chapter {ch}]",
"[the {P} tourism board|{F} HR department|{C}'s therapist] [watching this|reading this] like [hm|oh no|billable hours]",
"[nobody:|literally no one:|reader at page {pg}:] {C}: [I have a plan|trust me]",
"[POV|pov:] you're {C2} and [{C} just said 'trust me'|you already know how this ends]",
"if {A} says 'no spoilers' one more time I'm [naming my cat {C}|getting {C} tattooed|starting a podcast]"],
wording:[
"the word '{W}' is doing [a lot of heavy lifting|so much work] here",
"{A} said '{W}' not '{W2}' and I [refuse to believe that was accidental|am not recovering from that]",
"[notice|you wrote|the phrasing is] '{W}'. [not '{W2}'. {W}.|that's a choice.]",
"'{W}' — [interesting|ok|hm] [word|choice of word|verb]. [{C} would say the same thing|I'm writing this down]",
"[reading too much into it but|I know I'm overanalysing but] '{W}' [feels deliberate|is exactly what {C} said in book {N}]"],
beg:[
"[please|pls|I'm begging] just tell us if {C} [is okay|survives|is alive|is the one]",
"can you at least [confirm|tell us] whether this is about book {N} [or|and not] {B2}",
"[one hint|just a tiny hint|a single word], {A}. [yes or no|I won't tell anyone|I'll leave you alone]",
"[give us something|throw us a bone]. {C}. {P}. [anything|a name]",
"is {C} going to be okay [yes/no|y/n]? [I can take it|asking for my blood pressure]"],
distrust:[
"[I don't trust you anymore|I trust nothing you say now|you lost my trust at book {N}] [after what you did to {C}|after the {P} chapter]",
"[the last time you said|you said] [nothing bad would happen to {C}|{C} was safe|it was a gentle chapter]. [I remember|I believe nothing]",
"every time {A} says 'don't worry' [a character dies|someone loses a hand|{P} burns]",
"[this reads like|that's the tone you used before] chapter {ch}. [I'm bracing|I'm not falling for it]"],
confused:[
"[wait|ok wait|sorry] [I'm only on|I just started] [book {N}|chapter {ch}]. who is {C}?",
"[spoilers?? I'm still on|please tell me this isn't a spoiler, I'm only on] [book {N}|chapter {ch}]",
"[I understood about 30% of this comment section|what are people talking about] and I've read [two books|the first one|half of book {N}]",
"[is this about {C}|who's {C2}|is {P} the place from the start]? [genuinely lost|asking for a friend|I need a recap]"],
praise:[
"the way you [wrote|handled|built] {C} in the {P} [chapter|scene|sequence] [is|was] [still|genuinely] living in my head [rent free|weeks later]",
"[I still think about|I've re-read] the {P} [scene|chapter|passage] [more than I should|at least four times]. {C} never felt more [human|real|alive]",
"[the restraint|the patience|the pacing] in book {N}. [you let {C} be quiet for a hundred pages and it paid off|nobody else writes grief like this]",
"[the {F} politics|the council scenes|the {P} worldbuilding]: [it works because|it lands because|it only holds up because] {C} [is allowed to be wrong|actually has something to lose]",
"[it's the small things|small thing but]: the [detail|line] about {O}. [I noticed it on the second read and gasped|that's the writing]",
"I [finished|reread] {B} on a [train|bus|night shift|lunch break] and [missed my stop|forgot to eat]. [{C}'s arc|the ending|that last chapter] did that"],
critique:[
"I don't hate the [ending|reveal|twist], but [it undermines|it cuts against] [the first two books|what {C} wanted all along] because [the original mystery depended on the opposite reading|the {P} setup promised something else]",
"[the middle of|the second half of] book {N} [drags|loses focus|repeats itself]. [the {P} detour could have been fifty pages shorter|I'd have cut one of the {F} subplots]",
"[{C}'s motivation|the {F} plot|the timeline] [doesn't hold up|has a hole in it]: [if {C} knew about {P}, why wait|how does the Collapse date work]",
"love the prose, [but|though] [you keep reaching for the same image|every reveal is a letter|everyone speaks in aphorisms]",
"[the world is deep but the plot is thin|great ideas, uneven delivery]. [I'd give book {N} a 3.5|book {N} is the weak link]"],
petty:[
"[700|800|900|1000] pages for THAT [ending|payoff]. I'm [sick|furious|tired]",
"[honestly|ngl] [one of the most overrated|so overrated] [authors|series] [I've read|out there]",
"[still can't believe I finished|why did I finish|wasted a month on] {B}. [never again|the {P} chapters alone]",
"[so many pages|so much worldbuilding] and [no one has a personality|nothing happens until the last 60 pages]",
"{C} [fans|stans] are [exhausting|the worst]. [also the book is too long|and the book is way too long]",
"a [grocery list|phone book|dictionary] [with a plot|of invented names]. [good luck|no thanks]"],
defend:[
"[imagine|some of you] [reading|read] {pg} pages and [somehow missing|completely missing] the [entire point|whole point of {C}]",
"the [discourse|take] about [{B} being too long|the ending being 'bad'] is [hilarious|wild] to me. [it's slow on purpose|it is paced like grief]",
"[you can dislike the ending but|say you wanted a different book, don't say] it's [lazy|badly written]. [the set-up is on every page|{C}'s arc demands it]",
"if you think {C} is [a mistake|badly written|pointless] you [didn't read|weren't paying attention to] [book {N}|the {P} chapter]",
"[the amount of people|people really] [reviewing|judging] a [{pg}-page|seven-book] series off [one chapter|a tweet] [is insane|is something]"],
loreQ:[
"[wait|quick question:|genuine question:] [have you ever|did you ever] [confirmed|explained] whether {CLAIM}?",
"[is it true that|so is it actually true that|can we get a yes or no on whether] {CLAIM}?",
"[I need to know|I can't stop thinking about it|serious lore question]: {CLAIM}?",
"[someone|anyone] please [settle this|help]: does {CLAIM}? [we've been arguing for days|my friend says no]",
"[you never actually said|nobody ever confirmed] whether {CLAIM}. [was that intentional|asking nicely]"],
ship:[
"[I don't care what anyone says|no one can convince me|you can't change my mind], {C} and {C2} [are absolutely in love|are endgame|were always going to be this]",
"{C} and {C2} [in {P}|in the {P} scene|at the end of book {N}] — [that look|that pause|that single line]. [case closed|I rest my case]",
"[the {C}/{C2} slow burn|the {C} and {C2} thing] is [the only reason I kept going|better than most romance novels|criminally underwritten]",
"[if|when] {C} and {C2} [don't end up together|get separated again] I'm [writing a strongly worded letter|moving to {P}]",
"[no because|ok but] {C} [remembers|keeps] {C2}'s [name|scarf|handwriting] and tell me that's not [love|devotion]"],
stan:[
"[I've read the whole series [three|twice|four] times and I'm still here|still here] exclusively for {C}",
"{C} [is|has always been] [the reason I read these|the only character who matters|the series]. [the rest is optional|everyone else is a side quest]",
"[I only care about|my entire personality is] {C}. [please keep them alive|please let them be happy|please give them a POV chapter]",
"[every|each] time {C} [appears|walks into a scene|says anything] I [sit up straighter|forget the plot]",
"[book {N} was just|the {P} chapters were just] [waiting rooms|filler] until {C} showed up again"],
antistan:[
"{C} has been [ruining everyone's lives|making everything worse|causing every single problem] for [four|three|five] books",
"[unpopular opinion|hot take]: {C} is [overrated|insufferable|the worst thing about this series]. [change my mind|fight me]",
"[why does the plot|why does everyone] [bend over backwards for|forgive] {C}? [genuinely asking|I'm tired]",
"[every scene with|every time I see] {C} I [skim|put the book down|sigh out loud]"],
veteran:[
"I've been here since [book one|the first book|before the {B} cover], [seeing people discover this world now is insane|and watching this fandom grow is surreal|and I miss when it was twelve of us in a forum thread]",
"[I remember when|back when] nobody knew what {F} was. [now there are|now we have] [edits|rankings|timelines] [everywhere|about it]",
"[been reading since|day-one reader since] [the first print run|release week]. [still not over|I still have my first copy] [{P}|{C}'s first scene]",
"[long-time readers will remember|the old guard knows] [the {P} thread|the first theory wars]. [we were so wrong|we were so young]"],
newbie:[
"[Okay|ok] I'm [{pg} pages in|a few chapters in|on chapter {ch}] and I already know [I'm about to become insufferable about this|this is going to wreck me]",
"[I started|just started|picked up] {B} [last week|this month|on a whim] and now [I can't read anything else|I'm behind on sleep|I'm lurking in every thread]",
"[new here|brand new reader|late to this]. [where do I start|should I read the rest in order|please don't spoil {C}]",
"[found you through|saw] a [reel|friend's rec|TikTok] about {C}. [is it worth reading|I'm about to buy all of them]"],
reviewer:[
"[Structurally|Pacing-wise|Prose-wise|Thematically], [this is probably|this might be] your [weakest|strongest|most uneven] [ending|middle act|opening], but the [character work|worldbuilding|dialogue] [is incredible|carries it|is unmatched]",
"[Rating|Score]: [4|3.5|4.5]/5. The [{P} sequence|{C} arc|{F} politics] [earns|doesn't earn] its [payoff|length]. [Prose is|The prose remains] [exquisite|dense|precise]",
"[Compared to|Next to] {AU}, [your plotting is looser but your characters are warmer|you take bigger swings and miss more often|the worldbuilding is richer and the pace slower]",
"[A re-read changes the reading of {C} entirely|On a second pass, {C}'s first scene reads like a confession]. [That's rare|That's craft]"],
solver:[
"I KNOW WHO {M} IS. [it's {C}|it's {C2}|it's been {C} the whole time]",
"[SOLVED IT|I solved it|everyone relax]: {CLAIM}. [thread incoming|receipts in my next post]",
"[I think I finally cracked it|I stayed up all night]: {CLAIM}. [don't @ me|if I'm right I want a signed copy]"],
wrong:[
"I have a theory and I'm 100% certain: {CLAIM}. [no I won't explain|you'll see|it's obvious]",
"[trust me|call it fate|mark my words]: {CLAIM}. [the signs are everywhere|{O} is the key]",
"[nobody believes me but|everyone laughs but] {CLAIM}. [wait and see|I'll be insufferable when I'm right]"],
conspiracy:[
"nobody is talking about the fact that [you used the exact same phrase|{A} used the same sentence|the word '{W}' appears] [three books apart|in book 1 and book {N}|on page {pg} and again on page {pg2}]",
"[everyone thinks it's about {C}|you all keep looking at {C2}]. [it's about {O}|look at the dates instead|check the calendar in chapter {ch}]",
"[this is the third post this month|every post since {ago}] that [mentions|hints at] {P}. [that's not random|not a coincidence|I have a spreadsheet]",
"[the numbers|the dates|the order of the chapters] [aren't random|spell something|match the {F} timeline]. [I made a doc|I'll post a diagram]"],
recall:[
"{RECALL}"],
life:[
"[reading this on my lunch break at work|reading this on the bus|reading this at 2am] [and trying not to react|and failing to be normal]",
"[unrelated|random thought] but [my {pet}|my flatmate|my mum] [asked what I was smiling at|keeps asking who {C} is]",
"[just got home from|finally done with] [a double shift|a 12 hour shift|my exam]. [seeing this is the best part of my day|I needed this]",
"[it's raining here and|it's {T} here and] I'm [rereading|about to reread] {B}. [perfect timing|good vibes]",
"{job} life: [no time to read|reading in ten minute bursts]. [{B} is my reward|it's the only thing keeping me going]"],
short:[
"[no|nooo|oh no|hm|huh|wait|bruh|mmm|what|hold on|okay|oh|ohhh]",
"{C}?[?|??|...]",
"[wait|hold on|huh]... [{C}|{P}|{F}]",
"[ok|okay] but [why|how|when]",
"[the {P}|{P}|{F}|{C}] [again|?|...]",
"[not {C}|oh {C}|{C} 😭|{C} 💀]",
"[so many questions|too many questions|I have questions]",
"[sure|ok|fine|alright|noted]",
"[ah|oh|ooh] [so that's what it was|okay|I see]"],
congrats:[
"[chapter {ch}|that many chapters|all those words] [done|finished]! [and still|and somehow] [{C} isn't safe|{P} hasn't burned|we haven't seen {F} yet]",
"[so proud|congrats|well done] on [finishing|getting through] chapter {ch}. [take the rest of the day|go eat something|drink some water]",
"[congrats|congratulations]! [now back to|I'm guessing] the [{C} chapters|{P} chapters|the hard part]. [no pressure|take your time]",
"[the editing pass|chapter {ch}] [sounds painful|sounds like it nearly broke you]. [we can wait|we'll be here]"],
date:[
"[so is it|will it be] out [before|after] [christmas|summer|the new year|my birthday]? I need a date to plan around",
"[release date|the date]. [THE DATE|just the date]. [{A}.|please.]",
"[any chance of|is there a rough] [a month|a season|a quarter] for [book {N}|{B2}]? [I'll take a vague one|even a season is fine]",
"[is this before or after|will this land before] [the new year|the next convention|the holidays]?"],
delay:[
"[delayed again|another delay|pushed back again]? [I understand but|ok but|fine, but] I've [waited|been waiting] [{yrs} years|forever|since book {N}]",
"[delays are fine|take the time you need|quality over speed]. [just tell us|just say so] [honestly|early]",
"[this is the third delay|again?]. [{A}|come on]. [I have a countdown on my fridge|my preorder is older than my dog]",
"[sad but understandable|ok but tell us what's holding it up]. [the {P} chapters?|is it the ending?]"],
cover:[
"the [cover|spine|lettering|foil] [is|looks] [gorgeous|a bit generic|too busy|so much better than the last one] [and|but] [the {O} detail|the colour palette|the font] [is perfect|feels off|is a clue]",
"[is that|that looks like] [the {O}|{P}|{F}'s symbol] [on the cover|in the corner]? [it can't be a coincidence|I have so many questions]",
"[cover thoughts|honest cover opinion]: [love the palette|too much gold|spine is the star]. [the title treatment|the illustration] [works|doesn't work for me]",
"[will there be|is there] [a hardcover|a special edition|sprayed edges]? [asking for my shelf|my wallet is ready]"],
mapR:[
"the [western coast|northern border|eastern islands|river] [doesn't line up with|is bigger than|is in the wrong place compared to] [what you described in book {N}|the {P} chapters]",
"[wait|hold on] where is {P}? [I can't find it|is it the unlabelled one|is that the island in the corner]",
"[a map|finally a map]! [{P} is so close to {F}'s territory|I always imagined {P} further north|this explains the travel times in book {N}]",
"[why is|there's a blank space where] {P} [is|should be]. [what was there|what are you hiding]"],
charArt:[
"[this is exactly how I imagined|this is NOT how I pictured|I did not expect] {C}. [the eyes|the hands|the scar|the coat] [are perfect|threw me|match chapter {ch}]",
"{C}'s [expression|posture|clothes|crown] [matches|contradicts] [the {P} scene|what you wrote in book {N}]. [on purpose|is that a clue]",
"[the colour of the|that detail on the|the] [cloak|ring|sleeve] — [that's {F}'s|that's from {P}|that's new]. [I have thoughts|do I have thoughts]",
"[so that's what {C} looks like|{C} finally has a face]. [I'm going to have to reread everything|my headcanon is dead]"],
symbol:[
"[I zoomed in|just zoomed in|trying to match] [400%|way too much]. [that's {F}'s mark|the symbol matches the {P} mural|it looks like the one on page {pg}]",
"[is that|that's] [the same symbol|the same shape] [as|from] [{P}|{F}'s banner|the {O}]? [if so then {CLAIM}|I'm sitting down]",
"[running this through|someone check] [every symbol in the series|the {F} sigils]. [{W}|{O}]... [something|nothing] [fits|matches]",
"[three of the lines|the third line] [point to|are the same as] [the {P} door|the broken seal]. [this is a map|this is a signature|this is a warning]"],
manuscript:[
"[is that|are those] [a crossed-out line|a deleted scene|margin notes|a bracketed name] [near the top|by the corner|on the left]? [what does it say|can we get a closer look]",
"[the handwriting|the red pen|the strike-through] [is killing me|says everything about {C}'s chapter]. [what did you cut|how much did you cut]",
"[page {pg}|chapter {ch}]? [is this from {B2}|is this the {P} chapter]? [I can read half of it|I'm squinting]",
"[you cut|did you delete] [{C}'s line|a whole paragraph] [didn't you|here]. [we noticed|I can see the ghost of it]"],
note:[
"[is that your handwriting|the handwriting is [gorgeous|chaos]]. [what does the second line say|can you read it out]",
"[a handwritten note|scribbles] about [{C}|{P}|{F}]. [I will be studying this|framing this in my head]",
"[the crossed-out|the underlined] [word|name] is [{C2}|{O}|{P}]. [or I'm imagining it|am I right]"],
desk:[
"[that mug|that lamp|that notebook|your cat|the pile of paper] [is stealing the show|lives in my head now|tells me everything]",
"[why does your desk look|your desk is] [exactly like I imagined|a lot tidier than I expected|like a crime scene]. [this explains book {N}|respect]",
"[what's the tea|is that tea|what are you drinking] [in the mug|there]? [asking for my own writing routine|research]",
"[the sticky notes|the corkboard|the stack] [on the left|behind you]... [are those names|is that a timeline|I can see {C}]"],
docR:[
"[is that|are those] [the timeline|the family tree|the faction chart]?? [I need to zoom in|screenshotting this]",
"[worldbuilding doc|actual planning docs]! [seeing how it all connects|seeing {F} next to {P}] [is wild|makes me feel less lost]",
"[{F}|{P}|{C}] is [listed|crossed out|circled] [near the bottom|in red]. [what does that mean|why's it in red]"],
support:[
"[get some rest|take care of yourself|please eat something]. [the books can wait|we'll be here]",
"[hope you're|I hope you're] [doing okay|feeling better|having a good day]. [no rush on anything|the writing will keep]",
"[sending good vibes|sending you tea]. [you've been writing a lot|you deserve a break|take the weekend]",
"[that sounds|that does sound] [hard|exhausting|lovely]. [thanks for sharing|appreciate you telling us]"],
pollR:[
"[voted|I voted] [YES|NO|the second one|the first one]. [no regrets|I will defend this]",
"[you can't make us choose|how is this even a question|this poll is a trap]",
"[both|neither|all of them]. [is that an option|I demand a recount]",
"[the results are going to be [chaos|so split]|someone check the poll, it's [nonsense|wild]]"],
qaQ:[
"[do you outline|are you a plotter or a pantser|how far ahead do you plan]? [or do the characters surprise you|how many books ahead is it]",
"[will {C} ever get a POV chapter|is {C} going to return|are we going to see {P} again]?",
"[which character was hardest to write|who is your favourite to write|who do you regret writing]? [{C}|please say {C2}]",
"[is the narrator reliable|is the narrator lying|was the narrator ever wrong]?",
"[how do you keep track of {F}|what's your writing routine|how do you plan seven books]? [I can't even plan a weekend|asking as an aspiring writer]",
"[did you intentionally name|was it deliberate that you named] [{C} and {C2}|two characters] [so similarly|so alike]?",
"[what happened to {P}|how many kingdoms existed before the Collapse|who wrote the letter in chapter {ch}]?",
"[what would you tell a writer on their first draft|how do you write endings|how do you handle bad reviews]?"],
rumourR:[
"[I heard this too|a friend at a bookshop said the same|someone in a group chat said this too]. [no source though|take it with salt]",
"[this is fake|this can't be real|I hope this is true]. [{A} would have said something|{A} hasn't confirmed|wait for an official post]",
"[source?|who is this account|where did you get this from]. [I've seen this exact claim before|nothing in book {N} backs it]",
"[if this is true then {CLAIM}|if so, {C} is in trouble|if true, that changes {P}]"],
preorder:[
"[preordered|already preordered|ordered two copies]. [hardcover|signed edition|paperback], [obviously|no question]",
"[hardcover or paperback|is there a special edition|will there be an audiobook]? [who's narrating|asking for my commute]",
"[the price|the page count|the shipping date] [hurts|is fine|is better than expected]. [still buying|my wallet has opinions]",
"[cleared my schedule for|set a reminder for] release day. [bookshop first|library hold placed|midnight launch?]"],
hype:[
"[the countdown starts now|clearing my schedule|calendar blocked]. [{C} better be okay|{P} better be ready]",
"[finally|at last]. [I've been waiting|waiting since book {N}] [to see|for] [{C}|{P}|{F}]",
"[I'm so ready|ready and terrified]. [book {N} left me|the last one left me] [unwell|a mess|speechless]",
"[the hype is real|hype levels critical|I physically can't wait]. [{ago} I thought this would never come|{yrs} years of this]"],
mixed:[
"[I don't really like your takes online|you can be a bit much on here|I find your posts smug] but [the books|{B}] [are genuinely good|are great|are something else]",
"[separate the author from the art|not a fan of you personally]. [but|still] [{C}|{P}|book {N}] [is a masterpiece|has stayed with me]",
"[mixed feelings|torn]: [love the series, slightly tired of the posting|love the world, not sure about the author]"],
missing:[
"[where have you been|has anyone heard from {A}|are you alive]? [it's been|nothing for] [weeks|a month|ages]",
"[we noticed you vanished|the silence is loud]. [no posts since|no updates since] [{ago}|spring|the last announcement]",
"[hello?|are you still writing?|is the series still happening?] [we're getting worried|the fandom is getting restless]"],
compare:[
"[honestly|tbh] {AU} does [politics|pacing|endings|grief] [better|way better]. [you rush the {P} arc|you over-explain {F}]",
"[if you like this, read|better than this: read] {AU}. [tighter plotting|actual consequences]",
"[this is {AU} for people who|it's like {AU} but] [need more adjectives|are scared of endings]. [not a compliment|take that how you want]"],
askWhy:[
"[why|how come] {QK}? [is it plot-relevant|there has to be a reason|was it a continuity thing]",
"[genuinely curious|serious question]: why {QK}? [did you plan that|what's the reason]",
"[I've been wondering since book {N}|small thing that's been bothering me]: why {QK}? [explain|please]"],
predict:[
"[prediction|my prediction|bet]: [{C} won't survive|{C} turns on {C2}|{P} burns|{F} wins]. [screenshot this|come back to this in book {N}]",
"[I predicted|last time I guessed] {C} would [betray|survive|die] and I was [wrong|half right|so wrong]. [this time I'm sure|new theory loading]",
"[calling it|predictions thread]: [by the end of book {N}|before the finale] [{CLAIM}|{C} reveals the truth]. [remind me later|let me be right]"],
favQuote:[
"[this line|this one]: '{BQ}' [lives in my head|is on my wall|sits in my notes app]",
"'{BQ}' — [I read this at 1am and had to sit down|my favourite thing you've written|I use that as a bio quote]",
"[you can say what you want about the pacing but|nobody writes a sentence like] '{BQ}' [is perfect|stays with you]"],
reread:[
"[reread|re-read] {B} for the [third|fourth|second] time and [noticed|found] a [detail|line] about {O} [I'd never seen|I'd completely missed]",
"[currently rereading|halfway through a reread of] book {N}. [it's different when you know|{C}'s first scene hits harder now]",
"[it's the reread that kills you|rereading is a trap]. [{C}'s dialogue in chapter {ch}|the {P} chapters] [read completely differently|are devastating when you know]"],
helped:[
"[your books got me through|{B} got me through] [a really rough year|chemo|a move|a breakup|a long winter]. [thank you|just wanted to say that]",
"[this series was the only thing|{C} was the only thing] that [made me smile|kept me reading] [during exams|when I couldn't focus on anything else]"]
};
// ---------- reply templates (thread replies). {@} = parent's handle, {pq} = a short quote of the parent ----------
const TR={
agree:[
"{@} [exactly|this|yes|this is the take|yep|same]. [and nobody mentions|especially after|don't forget] {C} in chapter {ch}",
"{@} [I was about to say this|I've been saying this for weeks|you put it better than I did]",
"{@} [seconding this|co-signed|100%]. [it's the {P} scene for me|the {P} chapter proves it]",
"[this|literally this]. {@} [gets it|understands the series]"],
disagree:[
"{@} [respectfully no|no.|I'd push back on that|that's not what happened]. {C} [literally|actually|explicitly] [says otherwise in chapter {ch}|does the opposite in the {P} scene]",
"{@} [you're misreading|I think you're misreading] [the {P} scene|chapter {ch}|{C}]. [reread it|go back to book {N}]",
"{@} [that doesn't hold up|that doesn't explain] [{C}|the {P} timeline|why {F} did it]",
"[hard disagree|nah|absolutely not]. {@} [that's a stretch|you're overthinking it|you're underthinking it]"],
joke:[
"{@} [lol|💀|bro|ok that's funny|this made me laugh in a quiet room]",
"{@} [I'm screaming|stop it|I physically can't]",
"{@} [put this on a shirt|pinning this in my brain|I'm stealing this]",
"[the way|how] {@} [just|really] [said that|went there]"],
counter:[
"{@} [nah|I think|more likely] [it's {C2}|it's {F}|it was always {C2}]. [{P} is the proof|check book {N}]",
"{@} [what if instead|counter-theory:] {CLAIM}?",
"{@} [interesting but|ok but] [what about {O}|what about {P}|that ignores {C2}]"],
pedant:[
"{@} [small thing|minor correction|pedant alert]: it was [chapter {ch}|{P}|{C2}] not [chapter {ch2}|{P2}|{C}]",
"{@} [it's|iirc it's] [book {N}|chapter {ch}], not [book {N2}|chapter {ch2}]. [I could be wrong|checking]"],
escalate:[
"{@} [did you even read book {N}|you people are exhausting|ok and you're wrong]",
"{@} [stop|just stop]. [the series is clearly about {C}|you've missed it twice now]",
"{@} [you can't be serious|are you actually serious]. [this is why nobody takes this section seriously|read the book]"],
support:[
"{@} [hey that's not fair|ignore them|don't let them get to you], [I thought the same|you're not wrong]",
"{@} [honestly same|same. it hit me hard too|same here]. [{C} wrecked me|chapter {ch} wrecked me]",
"{@} [I've been there|I get it]. [it's okay|it's a lot]"],
misread:[
"{@} wait [are you saying|so you're saying] {C} is {C2}'s [brother|mother|clone|ghost]?? [I thought that was|that's not what I read]",
"{@} [so {C} is dead?|ok so {C} dies?|wait, who died]. [I'm so lost|I missed something]"],
ask:[
"{@} [wait|where does it say that|source?]. [what chapter|which page|which book]?",
"{@} [what do you mean by|can you explain] '{pq}'? [genuinely asking|I might be missing something]",
"{@} [how did you get to that from|why would that follow from] {P}?"],
quote:[
"'{pq}' [is such a wild thing to say about {C}|ok but source?|bold claim from someone who skipped chapter {ch}]",
"“{pq}” — [respectfully|I need this on record|noted]. {@}"],
change:[
"{@} [ok that's actually a good point|huh. I hadn't thought of that|fair]. [I take it back|retracting my earlier comment|ok you've changed my mind a bit]",
"{@} [damn|hm]. [I was ready to argue|that's annoyingly convincing]. [rereading chapter {ch} now|going to check]"],
authorpop:[
"{@} [THE AUTHOR REPLIED|they replied|omg|{A} is here] [I'm shaking|I'm not okay|screenshot taken]",
"[ok|so] {A} [replied to|noticed] {@} and now I [feel things|have even more questions]",
"[of course you'd say that|that's exactly what someone hiding something would say|{A} dodging the question again]. [noted|I see you]",
"[wait|hold on] {A} is [reading these|actually here]? [hi|hello|I love {C}]"]
};

const ELAB=["the {P} chapters make so much more sense now","I reread chapter {ch} last night and it's all there","{C} never says it outright but the evidence is everywhere","that's what I've been saying since book {N}","{F} had the most to gain, if you think about it","the timing in chapter {ch} is too neat to be an accident","it's the {O} detail for me, it keeps coming back","and nobody wants to talk about what {C} did in the {P} scene","I know I'm probably overthinking it","book {N} set all of this up if you look closely","that's my whole take, I'll see myself out","and yes, I realise I sound unhinged"];
