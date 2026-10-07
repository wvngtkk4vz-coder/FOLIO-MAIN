// ---------- word banks ----------
const FIRST='Mia,James,Priya,Tomasz,Chloe,Dani,Kofi,Sasha,Liam,Noor,Elena,Marcus,Yuki,Ola,Hannah,Rafael,Imani,Callum,Bea,Jun,Siobhan,Dmitri,Leila,Theo,Maribel,Wren,Aaron,Zainab,Freya,Nico,Gus,Ines,Pablo,Tessa,Hiro,Amara,Declan,Rosa,Kit,Lucas,Anika,Owen,Selin,Jorge,Maeve,Ravi,Esme,Bao,Cleo,Idris,Joss,Petra,Wes,Lottie,Arjun,Fenna,Cormac,Dalia,Ezra,Greta,Hugo,Isla,Jamal,Kara,Lena,Milo,Nadia,Otis,Paloma,Quinn,Remy,Stella,Tariq,Uma,Vince,Winnie,Xavi,Yara,Zeke,Bronwyn,Caleb,Delphine,Emeka,Farah,Gideon,Harriet,Ingrid,Jasper,Keiko,Lorcan,Mina,Niall,Odette,Parisa,Rory,Sunny,Tove,Una,Viktor'.split(',');
const LAST='Okafor,Brennan,Castillo,Novak,Lindqvist,Park,Haddad,Whitlock,Moreau,Tanaka,Bianchi,Adeyemi,Kowalski,Sutherland,Reyes,Iyer,Fitzgerald,Nakamura,Osei,Vasquez,Hartley,Dubois,Zhang,Murphy,Petrov,Santos,Larsen,Abbott,Choi,Fernandes'.split(',');
const LOCS='Manchester, UK|Austin, TX|Lagos, Nigeria|Toronto, Canada|Melbourne, Australia|Dublin, Ireland|Manila, Philippines|Berlin, Germany|São Paulo, Brazil|Chicago, IL|Mumbai, India|Sydney, Australia|Glasgow, Scotland|Seoul, South Korea|Nairobi, Kenya|Mexico City|Cardiff, Wales|Seattle, WA|Leeds, UK|Cape Town, South Africa|Wellington, NZ|Lisbon, Portugal|Atlanta, GA|Vancouver, Canada|Singapore|Brooklyn, NY|Bristol, UK|Warsaw, Poland|Nottingham, UK|Denver, CO|Perth, Australia|Kuala Lumpur|Montreal|Madrid|Portland, OR|Edinburgh|Houston, TX|Accra, Ghana|Oslo|Cork, Ireland'.split('|');
const JOBS='nursing student|line cook|paralegal|high school teacher|warehouse picker|grad student|barista|software tester|librarian|night security guard|freelance illustrator|vet tech|accountant|retired postman|stay-at-home dad|bus driver|dental hygienist|call centre agent|apprentice electrician|marketing intern|pharmacist|bookshop clerk|delivery rider|physio|farm hand'.split('|');
const HOBBIES='bouldering|pottery|gaming|knitting|running|D&D|baking sourdough|thrifting|embroidery|fantasy football|birdwatching|painting minis|journaling|cycling|karaoke|film photography'.split('|');
const PETS='a very fat cat|two rescue dogs|a grumpy rabbit|a parrot that swears|no pets (sadly)|a one-eyed cat|a tortoise called Gerald'.split('|');
const SHOWS='a cooking show|a true-crime podcast|old sitcoms|a sports documentary|anime|a baking competition|the football|a cosy mystery series'.split('|');
const H_ADJ='sleepy,gloomy,feral,tiny,midnight,soft,salty,pale,restless,velvet,clumsy,dusty,electric,quiet,wandering,bitter,lazy,golden'.split(',');
const H_NOUN='reader,pages,bookmark,tea,moth,owl,raven,lantern,ink,margins,spine,cat,paperback,comet,biscuit,candle,shelf,notes,coffee'.split(',');
const H_SUF={lore:['lore','archive','theories','keeper','notes','files','scholar','annotated'],meme:['memes','shitposts','daily','posting','bits'],ship:['shipper','is_canon','stan','simp','lives'],stan:['stan','fan','lives','supremacy','girlie'],default:['reads','fan','books','pages','shelf','lit','tbr','reviews','','']};
const OUTLETS=['The Margin Review','Paperwhite','Quill & Ledger','The Inkwell Gazette','Folio Daily','Shelfward','The Reading Room','Spine Magazine'];
const PUBLISHERS=['Harrowgate Books','Lantern & Vale','Northlight Press','Meridian House','Blackthorn Imprint'];
const AWARDS=['the Golden Quill','the Hollin Prize','the Reader\'s Laurel','the Alder Medal','the Ashbourne Award'];
const FIRST_AU=['Marguerite','Dominic','Teodora','Callan','Imogen','Rashid','Beatrix','Soren','Odalys','Fitz','Lucinda','Anselm'];
const LAST_AU=['Vane','Ashgrove','Okonjo','Thackeray','Lund','Marlowe','Bellweather','Sato','Quill','Hargreave','Delacroix','Finch'];
// slang / tics by age cohort
const TICS={young:['ngl','lowkey','tbh','honestly','literally','genuinely','fr','not gonna lie','okay but','bro','like'],mid:['honestly','genuinely','I mean','look,','frankly','okay so','tbh','actually'],old:['Frankly,','Well,','I must say,','Honestly,','Truthfully,','To be fair,']};
const EMO_SETS={emotional:['😭','💔','😩','🥲','😢'],meme:['💀','😭','🤣','😂'],sup:['❤️','🥹','✨','🫶','🙏'],skep:['🙄','😐','🤨'],lore:['👀','🔍','🧵','📌'],cons:['👁️','🧠','🕵️'],hater:['🙄','🤡','😴'],casual:['😊','📚','☕','😅'],hype:['🔥','😱','🤯','🚨']};
// ---------- archetypes ----------
// w = spawn weight, t = trait baselines (obs=obsession, know=lore knowledge, snark, emo, verb, care=typo carelessness, terse)
const ARCH={
 casual:{w:20,t:{obs:.25,know:.25,snark:.2,emo:.35,verb:.4,care:.4,terse:.3},em:'casual',att:.35},
 lurker:{w:9,t:{obs:.15,know:.2,snark:.3,emo:.2,verb:.1,care:.6,terse:.9},em:'casual',att:.2},
 emotional:{w:11,t:{obs:.6,know:.45,snark:.1,emo:.95,verb:.6,care:.5,terse:.2},em:'emotional',att:.55},
 lore:{w:8,t:{obs:.95,know:.95,snark:.3,emo:.4,verb:.9,care:.2,terse:0},em:'lore',att:.6},
 skeptic:{w:6,t:{obs:.4,know:.5,snark:.7,emo:.2,verb:.6,care:.3,terse:.2},em:'skep',att:-.1},
 hater:{w:4,t:{obs:.5,know:.45,snark:.95,emo:.5,verb:.4,care:.6,terse:.4},em:'hater',att:-.75},
 defender:{w:5,t:{obs:.7,know:.7,snark:.6,emo:.6,verb:.6,care:.3,terse:.1},em:'sup',att:.8},
 conspiracy:{w:3,t:{obs:.9,know:.85,snark:.5,emo:.5,verb:.8,care:.4,terse:.1},em:'cons',att:.1},
 shipper:{w:6,t:{obs:.8,know:.6,snark:.3,emo:.9,verb:.5,care:.5,terse:.2},em:'emotional',att:.6},
 stan:{w:5,t:{obs:.85,know:.6,snark:.3,emo:.8,verb:.4,care:.5,terse:.3},em:'sup',att:.6},
 antistan:{w:3,t:{obs:.7,know:.6,snark:.8,emo:.7,verb:.5,care:.5,terse:.3},em:'hater',att:.1},
 meme:{w:5,t:{obs:.4,know:.5,snark:.9,emo:.4,verb:.3,care:.8,terse:.7},em:'meme',att:.3},
 reviewer:{w:4,t:{obs:.6,know:.8,snark:.4,emo:.15,verb:.95,care:.05,terse:0},em:'casual',att:.1},
 newbie:{w:8,t:{obs:.35,know:.1,snark:.1,emo:.6,verb:.5,care:.5,terse:.3},em:'casual',att:.55},
 veteran:{w:5,t:{obs:.85,know:.9,snark:.3,emo:.5,verb:.7,care:.3,terse:.1},em:'sup',att:.6},
 asker:{w:6,t:{obs:.6,know:.5,snark:.1,emo:.4,verb:.5,care:.4,terse:.3},em:'casual',att:.45},
 solver:{w:3,t:{obs:.9,know:.7,snark:.2,emo:.8,verb:.5,care:.6,terse:.2},em:'hype',att:.5},
 wrong:{w:3,t:{obs:.7,know:.3,snark:.3,emo:.6,verb:.6,care:.7,terse:.2},em:'hype',att:.4},
 chatty:{w:5,t:{obs:.3,know:.3,snark:.3,emo:.5,verb:.8,care:.5,terse:.1},em:'casual',att:.4},
 supporter:{w:6,t:{obs:.5,know:.4,snark:.05,emo:.7,verb:.5,care:.3,terse:.2},em:'sup',att:.7}
};
// intent affinity per archetype (multiplier; default 1)
const AI={
 lore:{theory:3,clue:3,wording:2,loreQ:2,askWhy:2,conspiracy:1.5,critique:1,short:.3,joke:.5,panic:.5,solver:1.5,life:.2},
 casual:{praise:2,life:2,short:2,newbie:1,confused:1.5,joke:1,theory:.3,clue:.3,reviewer:.2,wording:.3},
 emotional:{panic:3,stan:2,praise:2,support:2,distrust:1.5,beg:2,petty:.4,theory:.5,wording:.5},
 skeptic:{critique:3,petty:1,reviewer:2,defend:.2,praise:.3,mixed:2,compare:2,panic:.3},
 hater:{petty:4,critique:2,compare:3,bait:2,mixed:1,praise:.05,hype:.1,support:.1,congrats:.1,panic:.2,favQuote:.1,preorder:.1},
 defender:{defend:5,praise:2,support:2,petty:.1,compare:.2},
 conspiracy:{conspiracy:5,clue:2,wording:3,theory:2,bait:2,distrust:2},
 shipper:{ship:5,panic:1.5,praise:1,stan:1.5},
 stan:{stan:5,panic:2,praise:1.5,antistan:0},
 antistan:{antistan:5,petty:1.5,critique:1,mixed:1,stan:0},
 meme:{joke:6,short:2,praise:.3,theory:.5,critique:.3},
 reviewer:{reviewer:5,critique:3,praise:1.5,compare:2,mixed:1.5,short:.2},
 newbie:{newbie:5,confused:2,praise:1,short:1.5,theory:.2},
 veteran:{veteran:5,recall:2,clue:1.5,praise:1,support:1.5,newbie:0},
 asker:{loreQ:4,askWhy:3,beg:2,confused:1},
 solver:{solver:6,theory:2,clue:1.5},
 wrong:{wrong:6,theory:2,predict:2},
 chatty:{life:5,support:2,short:.5},
 lurker:{short:6,praise:.5},
 supporter:{support:4,praise:2,congrats:3,defend:2,hype:1.5}
};
// intent polarity toward the author/books (-1 negative .. +1 positive)
const POL={panic:0,theory:0,clue:0,bait:-.7,joke:0,wording:0,beg:.2,distrust:-.6,confused:0,praise:1,critique:-.5,petty:-1,defend:.9,loreQ:.2,ship:.4,stan:.6,antistan:-.4,veteran:.6,newbie:.5,reviewer:-.1,solver:.2,wrong:.1,conspiracy:-.2,recall:-.1,life:.1,short:0,congrats:.9,date:.1,delay:-.3,cover:.1,mapR:.1,charArt:.2,symbol:.1,manuscript:.1,desk:.2,note:.2,docR:.2,support:.8,pollR:0,qaQ:.2,rumourR:0,preorder:.8,hype:.7,mixed:-.2,missing:-.2,compare:-.7,askWhy:.1,predict:.1,favQuote:.8,reread:.5,helped:.9};
// scene -> intent multipliers
const SI={
 teaser:{beg:3,hype:3,bait:2.5,theory:2,short:2,date:2,joke:2,distrust:1,missing:.3,solver:1.5},
 threat:{panic:5,theory:4,clue:3,bait:2,joke:2.5,wording:3,beg:3,distrust:2,confused:1.5,stan:2,antistan:1.5,short:2,predict:2,solver:1},
 reveal:{theory:2,clue:3,wording:2,critique:2,praise:2,petty:1,conspiracy:2,solver:2,wrong:1,recall:2,defend:1,short:2,loreQ:1.5,joke:1.5,panic:1.5,compare:.5},
 quote:{favQuote:3,praise:3,wording:2,clue:1.5,stan:1.5,joke:1,short:2,reviewer:1.5,critique:1,newbie:1.5},
 cryptic:{theory:4,wording:4,solver:3,wrong:3,bait:3,joke:3,beg:2,conspiracy:3,clue:3,confused:2,short:3,distrust:1},
 lore:{theory:2,clue:3,loreQ:2.5,wording:2,conspiracy:2,critique:2,askWhy:2,defend:1.5,praise:1.5,reviewer:1,petty:1,short:1.5,recall:2},
 bts:{praise:1.5,life:2.5,support:2,congrats:1.5,joke:2,short:2,askWhy:1,newbie:1,veteran:1,reviewer:.5},
 writing:{congrats:3,hype:2.5,beg:2,date:2,joke:2,short:2,support:1.5,delay:.6,life:1,missing:.3,bait:1},
 cover:{cover:5,praise:2,critique:2,petty:1,joke:1.5,short:2,preorder:2,hype:1.5,date:1,wording:1},
 release:{date:3,preorder:4,hype:3,joke:1.5,praise:1.5,short:2,delay:.8,congrats:2,life:1,petty:1,critique:1},
 delay:{delay:7,petty:3,support:2,bait:2,distrust:2,joke:2,short:2,critique:1.5,beg:1},
 personal:{support:4,life:4,joke:2,short:2,congrats:2,praise:1,mixed:1},
 poll:{pollR:5,joke:2,short:2.5,distrust:1,bait:1,defend:1,theory:1},
 qa:{qaQ:9,loreQ:3,askWhy:2,short:.6,life:1,newbie:1},
 rumour:{rumourR:5,joke:2,bait:2,distrust:2,short:2,panic:2,hype:1.5,theory:1.5},
 plain:{praise:2,short:2,joke:2,life:1.5,hype:1,newbie:1,veteran:1,reviewer:1,petty:1,support:1,reread:1.5}
};
const IMG_USE_INT={map:{mapR:8,theory:2,askWhy:2},character:{charArt:8,stan:2,antistan:1,ship:1.5},symbol:{symbol:8,theory:2.5,solver:2,conspiracy:2},cover:{cover:7,preorder:2},manuscript:{manuscript:8,wording:2.5,clue:2},note:{note:8,wording:2},desk:{desk:8,life:2},doc:{docR:8,theory:2,loreQ:2},cryptic:{wording:3,theory:3,solver:2},teaser:{hype:2,beg:2},personal:{life:3,support:3}};
const SCENE_FOR_TYPE={photo:'plain',teaser:'teaser',character:'plain',quote:'quote',cryptic:'cryptic',lore:'lore',bts:'bts',writing:'writing',cover:'cover',release:'release',personal:'personal',poll:'poll',qa:'qa',rumour:'rumour',delay:'delay',text:'plain'};
// genre name generators
const SYL={
 fantasy:{a:'ae,al,ar,bel,cal,dar,el,fen,gal,hal,is,kor,lor,mar,nor,or,rin,sel,thal,ul,vor,wyn,zar,ced,ys,eld'.split(','),b:'a,an,en,ia,is,or,us,wyn,dric,ra,th,iel,mund,ith'.split(',')},
 scifi:{a:'ka,zen,tor,vex,nyx,ori,syl,qua,dra,ion,hel,mir,tal,rho,ax'.split(','),b:'a,on,ix,us,ara,eth,is,os,ur,en'.split(',')},
 modern:{a:'Ava,Noah,Ruth,Cole,June,Eli,Nora,Jude,Ines,Theo,Lena,Owen,Maya,Silas,Greta'.split(','),b:['']},
 dark:{a:'Mor,Vel,Cor,Mal,Ner,Sar,Ven,Tho,Gra,Ish,Ul'.split(','),b:'ain,wick,thorne,gar,iel,aeth,ek,oth'.split(',')}
};
const PL_A='Black,Hollow,Ash,Silver,Gilded,Salt,Iron,Pale,Weeping,Broken,Old,Drowned,Ember,Thorn,Winter'.split(',');
const PL_B='Cathedral,Coast,Reach,Keep,Marsh,Court,Spire,Harbour,Gate,Vale,Crossing,Archive,Bridge,Orchard,Barrow'.split(',');
const FAC_B='Court,Order,Syndicate,Guild,Covenant,Legion,Choir,Assembly,Company,Concord'.split(',');
const OBJ_B='Crown,Key,Lantern,Ledger,Mirror,Blade,Seal,Compass,Bell,Locket'.split(',');
const MASK=['Masked King','Veiled Oracle','Hollow Prince','Silent Regent','Pale Hand','Nameless Queen','Tallow Saint','Ninth Voice'];
const QUIRKS=['every member of {F} has silver eyes','nobody in {P} will say the old name aloud','{F} always travels in groups of seven','the bells of {P} ring on the wrong hour','no one has ever seen {F} eat','every map of {P} is missing the same corner','the {O} is never mentioned before the Collapse'];
const GENRE_KEY=g=>{g=(g||'').toLowerCase();if(/sci|space|cyber|dyst/.test(g))return 'scifi';if(/rom|contemp|lit|cozy|ya|young/.test(g))return 'modern';if(/horror|thrill|myst|crime|gothic|dark/.test(g))return 'dark';return 'fantasy'};
const EXAMPLE_UNIVERSE={
 author:{name:'Eleanor Vance-Hale',pen:'E. V. Hale',user:'evhale.writes',age:41,genre:'Epic fantasy',style:'Lyrical, slow-burn, heavy on political intrigue and tragic irony',personality:'Dry-humoured, secretive, quietly warm with fans',bio:'Author of The Ashen Crown saga. Tea, rain, unreliable narrators.',career:'Debuted at 29 with a small press. Breakout hit in year four. Hates spoilers more than readers do.',fameLevel:'bestseller',followers:480000,reputation:'respected'},
 book:{title:'The Ashen Crown',genre:'Epic fantasy',desc:'A disgraced archivist uncovers that the dead king\'s crown is still choosing rulers.',characters:'Elias Thorne\nSeraphine Vale\nMara Quill\nCaptain Odric Wend\nThe Masked King\nLady Iselde',protagonist:'Elias Thorne',antagonist:'The Masked King',setting:'The drowned kingdom of Valdrenn, years after the Collapse',factions:'The Silver Court\nThe Order of Embers\nThe Salt Guild',locations:'The Black Cathedral\nHollow Reach\nThe Western Colonies\nAshgate',magic:'Magic costs memory. Every spell erases something the caster loves.',timeline:'Year 0: The Collapse\nYear 31: The Crown is lost\nYear 87: Elias finds the archive door',events:'The Fall of the First Dynasty\nThe Night of Bells\nElias enters the Sealed Chamber',secrets:'The Masked King is Seraphine\'s father\nThe Crown is alive and chooses its wearer',mysteries:'Who wrote the letter in chapter 19\nWhat happened to the Western Colonies',quotes:'Memory is the only crown that cannot be stolen.\nEvery kingdom is built on something it forgot.',rel:'Elias + Seraphine: tragic romance\nMara + Seraphine: sisters by choice\nElias + Odric: mentor and betrayer',ending:'Elias wears the Crown and forgets Seraphine.',future:'The Salt Throne\nA Ledger of Bells'}
};
