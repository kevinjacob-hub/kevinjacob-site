// ALL the editable text and photo slots live here.
//
// PHOTOS: every photo slot loads an image automatically if a file with the matching name exists in the images/ folder,
// and shows a gradient placeholder if it doesn't. Name files like this (jpg, about 1400px wide is plenty):
//   images/gallery-1.jpg ... gallery-6.jpg       home page gallery (one per entry in T below)
//   images/<place>-1.jpg, images/<place>-2.jpg   the box that opens on a landmark, city or region
//   <place> is the key in quotes below, e.g. home, upper-room, bakery, workshop, ut-tower, dallas, texarkana,
//   seattle, texas, new-york, chicago, washington-dc, portland.
// A caption that starts with "add a" is hidden once a real photo loads. Change captions to describe your photos.
const NAME='Kevin Jacob',HANDLE='kevinjacob';
const EMAIL='Kevin.rohan.jacob@gmail.com',LINKEDIN='https://linkedin.com/in/kevin--jacob',INSTAGRAM='https://www.instagram.com/kevin_nose_all/';
const RESUME='resume.pdf'; // the resume PDF: a path like 'resume.pdf' when self-hosting

// ---- home page gallery: [caption, placeholder hue] ----
const T=[['vase-mode print',20],['sourdough crumb',35],['keycap set',160],['croissant layers',28],['UI sketch',250],['benchy fleet',200]]; // add 'images/your-file.jpg' as a 3rd item to use a specific file

// ---- landing page: typed intro, neofetch-style card, experience, projects, skills ----
const INTRO=['\\[^_^]/ Hey there 👋 I’m Kevin Jacob','A product manager who designs, makes and bakes','Based in Seattle, WA','Welcome to my world'];
const ART=String.raw`    |
    |
 .--'--.
 '-----'
   | |
   | |
   | |
  /   \
 /_____\ `;
const NEOFETCH=[['role','Digital Product Manager, Orders & Fulfillment'],['at','Ferguson Home, since March 2025'],['before','Founder & CTO, Galapagos Labs'],['school','UT Austin: MIS and Mathematics'],['cert','SAFe Agile'],['makes','designs, 3D prints and bakes'],['explores','20 national parks so far'],['hosts','Kevin’s Korner: weekly dinners']];
// experience, newest first. when = start → end
const EXPERIENCE=[
 {when:'2025-03 → now',org:'Ferguson Home',role:'Digital Product Manager, Orders & Fulfillment',pts:[
  'Helped lead the Project44 to MercuryGate migration through UAT, go-live and hypercare: a business case of ~$250K in annual contract savings and better control of ~$8M in annual freight-audit exposure.',
  'Delivered ProShip parcel rate shopping for DC ground volume, with $700K+ in estimated annual savings.',
  'Took ownership of Digital Branch Orders and consolidated separate product and engineering workstreams: ~$500K processed in one month, 1,100+ associates enabled.',
  'Built return BOL tooling, launched online return requests, and am developing advance-credit automation for ~247K annual returns.',
  'Use CSAT and customer-feedback data to find root causes; redesigned backorder communications and modernized transactional emails.']},
 {when:'2024-08 → 2025-03',org:'Ferguson Fire & Fabrication',role:'Operations / Acting Floor Supervisor',pts:[
  'Led daily warehouse, shipping, freight and quality workflows, directing the floor team.',
  'Worked with vendors, customers, shipping and purchasing to keep orders on track: the frontline view of fulfillment problems that informs my product work.']},
 {when:'2021-11 → 2024-08',org:'Galapagos Labs',role:'Founder & CTO',pts:[
  'Built and ran an e-commerce marketplace on the Internet Computer in Rust, leading up to 10 developers; won a $25,000 DFinity grant.',
  'Launched the first self-minting token on the Internet Computer: all 10,000 tokens sold in 40 seconds.']},
 {when:'2019-08 → 2024-05',org:'University of Texas at Austin',role:'Management Information Systems; Mathematics',pts:[
  'HackTX 1st place, Crypto Competition (2021). Published in the Cybernomics Academic Journal (2020).']},
 {when:'2022-05 → 2022-08',org:'Charles Schwab',role:'Project Management Intern, Westlake, TX',pts:[
  'Oversaw TD Ameritrade and Schwab application integration onto new data centers, with on-time VLAN delivery across 7 data centers.']}];
// projects, grouped. note = a dim // comment after the text (delete it once you've filled the entry in)
const PROJECTS=[
 {g:'startup',items:[
  {n:'hatch.market',meta:'Galapagos Labs · 2021–2024 · Rust · Internet Computer',d:'An end-to-end e-commerce marketplace with a launchpad and marketing analytics. I led up to 10 developers, onboarded creators as sellers, and built no-code smart contract tooling around their launches. It won a $25,000 DFinity grant.'},
  {n:'icturtles.com',meta:'Galapagos Labs · 2021–2024 · Internet Computer',d:'The first self-minting token on the Internet Computer. All 10,000 tokens sold in 40 seconds.'}]},
 {g:'at Ferguson Home',items:[
  {n:'MercuryGate migration',meta:'since 2025 · rate shop API, shipping orders, vendor portal, BOL, carrier rating, returns',d:'Helped lead the move from Project44 through UAT, go-live and hypercare, and ran vendor onboarding and exception handling for the new workflows. Added Datadog error visibility so failed imports and BOL creation no longer go undiagnosed.'},
  {n:'Digital Branch Orders',meta:'since 2025 · CRM, order orchestration, branch inventory',d:'Consolidated separate product and engineering workstreams. The foundation includes automated CRM case creation and routing, order splitting, order history and branch inventory visibility. ~$500K processed in one month.'},
  {n:'Returns tooling',meta:'since 2025 · BOL, online returns, advance credit',d:'A return BOL tool with carrier quotes and cheapest-carrier selection, online return requests, and advance-credit automation with guardrails.'}]},
 {g:'at home',items:[
  {n:'3D prints',d:'Things I design, then print.',note:'// add your favorites and photos'},
  {n:'bakes',d:'Cheesecakes, never the same flavor twice, and a bread popup called the Breadspace.',note:'// see bakes/'}]}];
const SKILLS={strengths:['Logistics service performance','Vendor operations & onboarding','Aftersales/returns','Root-cause analysis','Cost optimization','CRM & service tooling','API integration & automation','Data-driven performance management'],
 tools:['Jira','Airtable','Datadog','SQL','Python','VBA','Excel','Figma','APIs','CI/CD','Rust','SAFe Agile (certified)'],languages:'Basic Spanish and Hindi'};
const OFF=['designing','3D printing','baking','drums','soccer','literature','applied mathematics','data analytics','finance','puns','national parks'];
// blog posts, newest first: {date:'2026-11-24',title:'Post title',sum:'one-line summary',url:'optional link'}
const POSTS=[];

// ---- testimony: my faith. baptism testimony (draft) and the statement I read in court. edit the text freely ----
const BAPTISM=[
 {h:`before christ`,p:[
  `Like many of you, I grew up in a church. My parents took me every Sunday, and in high school I even led a bible study group. But in college my priorities shifted. God was no longer the center of my life, and I was caught up chasing success and prestige. During covid I stopped going to church, at first for safety and then out of convenience. By my junior year, all my focus was on my startup, a blockchain infrastructure company. My life revolved around growing it, getting name recognition, and making money. I had made an idol out of success. I knew of God and believed Jesus was Lord, but I was not surrendering to Him, and it showed in my actions, my language, and my goals. I was prideful and on top of the world. I led the largest CS organization on campus, and I loved letting everyone know about my success. I had surrounded myself with the world and become indistinguishable from it.`]},
 {h:`how i met christ`,p:[
  `Then one day everything can be taken from you. Just days before I was set to walk across the stage at my college graduation, a drunk driver struck me while I was walking on the sidewalk. I don’t remember the impact, and maybe that’s a blessing. I do remember waking from a coma days later on a ventilator, with my spine shattered and my skull fractured. My own mother couldn’t recognize me in the hospital, and when I finally saw myself in the mirror, I couldn’t either. But God recognized me. He never lost sight of me.`,
  `I had to relearn how to walk, how to move, how to think clearly. I couldn’t lift weights or box like I used to, and worst of all, I lost my sense of smell. Do you know what it’s like to forget the smell you’ve loved your whole life? For a long time I was angry. I asked God, “Why me? Why did You let this happen?” But slowly I came to see that He was never the reason for my pain. He was the reason I survived it. I believe wholeheartedly that Jesus saved my life that day. In my physical pain, He gave me peace. In my grief, He reminded me I was not alone. When I could not walk, His hand carried me. I had to learn not just to believe in Him but to DEPEND on HIM.`]},
 {h:`after christ`,p:[
  `He healed more than my senses. He healed my heart. He took a man full of pride and pain and made him humble, thankful, and free. I am not the same person I was before the accident. I am better, not because of my strength but because of His grace. God took what the enemy meant for destruction and turned it into a testimony. He replaced my anger with peace and filled my heart with forgiveness, not because others deserved it, but because He showed me I deserve peace.`,
  `Today, I stand here not as someone who survived, but as someone God rescued. He saved my life, and then He gave that life a new purpose. I’ve been blessed to see people come to know Christ because of what He’s done for me. I’ve seen His light shine through my scars.`]}];

const COURT=[
  `Your Honor,`,
  `Thank you for allowing me the opportunity to share my story today. It’s difficult to put into words the full scope of how my life has been altered, but I hope to provide a glimpse of the pain, grief, and determination that have defined my journey since the accident.`,
  `Just days before I was set to walk across the stage and celebrate my college graduation—a milestone I had worked so hard to achieve—my life was irrevocably changed. But instead of celebrating, I was fighting for my life. A drunk driver struck me while I was walking on the sidewalk, shattering my body and leaving me clinging to survival.`,
  `I don’t remember the moment of impact, and maybe that’s a blessing. But I do remember waking up from a coma days later. I was hooked up to machines—a ventilator breathing for me, wires and tubes running everywhere. I was alive, if you could consider that monstrous image living.`,
  `When my mother came to see me in the hospital, she didn’t recognize me. I was so disfigured, so swollen and broken, that even the woman who knows me better than anyone didn’t know who I was. Seeing the look on her face—the horror, the heartbreak—that was almost worse than the physical pain.`,
  `And even now, when I look in the mirror, I don’t recognize myself. My face is uneven, misshapen. It’s not the face I knew, the one I used to see every day before the accident. There were times I avoided mirrors altogether because it’s just too hard to see what’s staring back at me.`,
  `The pain I endured during those early weeks was beyond anything I can describe. The surgeries—on my spine, on my skull—were brutal. I would wake up feeling like my body was on fire, like every nerve was screaming. Each moment stretched into an eternity of pain.`,
  `I had lost not only my independence but so much of what made me me.`,
  `This wasn’t just about surviving the crash. It’s about surviving everything that’s come after—the surgeries, the therapy, the endless moments of grief and frustration. I had to relearn basic skills, like drawing, writing or even holding a utensil. Every movement was a battle, and every day brought new challenges. But I refused to give up. I clung to my faith and to the belief that, with God’s help, I could reclaim my life.`,
  `The physical injuries were devastating. The force of the impact caused permanent damage, including chronic back pain that I still endure every single day. It also took away my ability to do things I once loved—things that brought me joy, stress relief, and a sense of accomplishment. Before the accident, I was an avid boxer. Stepping into the ring was where I felt alive, where I pushed my limits and found strength in myself. I also loved weightlifting, challenging myself to grow stronger with every session. Now, those activities are no longer possible for me, at least not in the way they once were. The loss of that physical outlet has been another layer of grief, another reminder of what was stolen from me that day. But one of the most painful losses was something many people take for granted: my sense of smell.`,
  `As a baker, my sense of smell wasn’t just something I enjoyed—it was a part of who I was. The comforting aroma of freshly baked cake, the warm sweetness of vanilla, the sharp zest of citrus—they were all integral to my craft and my passion. Now, they’re gone. Worse still, I am beginning to forget them.`,
  `I can no longer remember what rain smells like, and that realization broke me in a way I didn’t expect. The memories of those smells are slipping away, leaving me grieving not just the physical loss but the emotional connection I had to my work and to some of the happiest moments of my life. This loss is a constant reminder of what was taken from me, not just in an instant, but every day since.`,
  `And while this accident could have derailed my life completely, I have chosen not to let it. I have chosen to keep moving forward—literally and figuratively—toward the life I know I am meant to live.`,
  `The emotional toll of this has been enormous. I grieve for the person I was before the accident, for the dreams I had, and for the simple joys I will never experience in the same way again. But in the depths of my despair, I have also found strength—a strength I know comes from Jesus Christ.`,
  `I believe wholeheartedly that Jesus saved my life that day. I shouldn’t be standing here right now, but His grace carried me through the accident and has continued to carry me through the long and painful road to recovery. In moments of physical pain, He gave me peace. In moments of grief, He reminded me that I am not alone.`,
  `Still, the pain is constant. The chronic back pain I live with reminds me daily of the collision. The loss of my sense of smell reminds me of what I once had but can never regain. And the emotional scars—the moments of frustration, grief, and even anger—are ones I will carry with me for the rest of my life.`,
  `This year has also taught me some hard lessons. It has shown me that no matter how carefully we plan, life can throw us challenges we never see coming. It has forced me to improvise, adapt, and find strength I didn’t know I had. But perhaps the most important lesson I’ve learned is about forgiveness.`,
  `Forgiveness is not about excusing what happened to me or pretending it didn’t hurt—it did, and it still does. But I’ve learned that forgiving others isn’t about whether they deserve it; it’s about whether I deserve peace. Holding on to anger and resentment only deepens the pain. By choosing to forgive, I free myself to focus on healing, on rebuilding, and on finding the joy and purpose that God still has in store for me.`,
  `That doesn’t mean I don’t want accountability. This accident—and the choices that led to it—should never have happened.`,
  `The defendant made a choice—a reckless, stupid, selfish choice—to drive under the influence. That choice didn’t just harm me. It caused pain and heartache for my family, my sainted mother, my dear friends, and everyone who has supported me through this atrocity.`,
  `But even in the midst of all this pain and grief, I am grateful. I am grateful to the doctors, nurses, and therapists who have helped me regain my independence. I am grateful to my family and friends who have walked this journey with me, never letting me feel alone. And above all, I am grateful to Jesus, who has been my anchor, my strength, and my hope.`];

// ---- EDIT ME: i = lens, o = offset in the lens, sub/pics/html = the text box. pics items: [caption, hue, optional image path] ----
// ---- faith commands: verse (cycles through these, KJV), church (this Sunday invite), invite. Edit freely. ----
const VERSES=[
 {t:'He hath not dealt with us after our sins; nor rewarded us according to our iniquities.',r:'Psalm 103:10'},
 {t:'Therefore if thou bring thy gift to the altar, and there rememberest that thy brother hath ought against thee; Leave there thy gift before the altar, and go thy way; first be reconciled to thy brother, and then come and offer thy gift.',r:'Matthew 5:23-24'},
 {r:'Matthew 18'},
 {t:'Put on therefore, as the elect of God, holy and beloved, bowels of mercies, kindness, humbleness of mind, meekness, longsuffering;',r:'Colossians 3:12'},
 {t:'Confess your faults one to another, and pray one for another, that ye may be healed. The effectual fervent prayer of a righteous man availeth much.',r:'James 5:16'},
 {t:'If we confess our sins, he is faithful and just to forgive us our sins, and to cleanse us from all unrighteousness.',r:'1 John 1:9'},
 {t:'Give ear to my prayer, O God; and hide not thyself from my supplication. Attend unto me, and hear me: I mourn in my complaint, and make a noise;',r:'Psalm 55:1-2',n:'an intentional season of silence, and it is never unnecessarily long'},
 {r:'1 Samuel',n:'silence caused by sin'},
 {t:'Let nothing be done through strife or vainglory; but in lowliness of mind let each esteem other better than themselves. Look not every man on his own things, but every man also on the things of others. Let this mind be in you, which was also in Christ Jesus: Who, being in the form of God, thought it not robbery to be equal with God: But made himself of no reputation, and took upon him the form of a servant, and was made in the likeness of men:',r:'Philippians 2:3-7'},
 {t:'How shall I give thee up, Ephraim? how shall I deliver thee, Israel? how shall I make thee as Admah? how shall I set thee as Zeboim? mine heart is turned within me, my repentings are kindled together.',r:'Hosea 11:8'},
 {t:'And Elijah came unto all the people, and said, How long halt ye between two opinions? if the LORD be God, follow him: but if Baal, then follow him. And the people answered him not a word.',r:'1 Kings 18:21',n:'Elijah soaked the sacrifice and God still set it on fire. Don’t live in two worlds. (1 Kings 18:20-33)'},
 {t:'There shall not any man be able to stand before thee all the days of thy life: as I was with Moses, so I will be with thee: I will not fail thee, nor forsake thee.',r:'Joshua 1:5'},
 {t:'Take no thought for your life, what ye shall eat; neither for the body, what ye shall put on. The life is more than meat, and the body is more than raiment. Consider the ravens: for they neither sow nor reap; which neither have storehouse nor barn; and God feedeth them: how much more are ye better than the fowls? And which of you with taking thought can add to his stature one cubit? If ye then be not able to do that thing which is least, why take ye thought for the rest?',r:'Luke 12:22-26'},
 {t:'And he said unto me, My grace is sufficient for thee: for my strength is made perfect in weakness.',r:'2 Corinthians 12:9',n:'the meaning of grace and the power of weakness (2 Corinthians)'},
 {t:'But I suffer not a woman to teach, nor to usurp authority over the man, but to be in silence.',r:'1 Timothy 2:12'},
 {t:'And he, casting away his garment, rose, and came to Jesus.',r:'Mark 10:50'},
 {t:'Create in me a clean heart, O God; and renew a right spirit within me.',r:'Psalm 51:10'}];
const CHURCH={name:'Seattle Upper Room',when:'Sundays at 10:30 am',where:'2320 1st Ave, Floor 2, Seattle, WA 98121',url:'https://www.seattleupperroom.church',note:'All are welcome. Come as you are, and bring a friend.'};

// Bakes. Cards show a photo automatically when the file exists: images/cheesecake-<number>.jpg (number = the card's position, 1 is the first card).
// Breadspace items use images/breadspace-item-<number>.jpg, and popup photos use images/breadspace-<number>.jpg (up to 8).
const BAKES={
 intro:'I started baking during Covid and fell into cheesecake. I’ve made all kinds of flavors, and I never make the same one twice.',
 cakes:[
  {n:'Cheesecake #1',meta:'flavor · when',d:''},
  {n:'Cheesecake #2',meta:'flavor · when',d:''},
  {n:'Cheesecake #3',meta:'flavor · when',d:''}],
 bs:{n:'The Breadspace',meta:'bread popup · with a friend',
  d:'A bread popup I ran with my friend, selling Asian-inspired baked goods and salt breads.',
  items:[
   {n:'Salt bread',d:''},
   {n:'Asian-inspired bake',d:''}]}};
const Z={
home:{i:'s',o:[0,-14],c:0xe8b04a,ly:10.5,t:'Home',sub:'Seattle, WA · apartment parties and Kevin’s Korner',gal:[{h:'apartment parties',base:'images/party-',n:12,alt:'Apartment party'},{kk:true,h:'Kevin’s Korner'}],html:`<p># hi, i’m <b>${NAME}</b></p><p>I live in Seattle. This is home base: parties at my apartment, and Kevin’s Korner, my weekly dinner or potluck for people from every corner of my life.</p>`},
'upper-room':{i:'s',o:[-4,2],c:0xe9d8b8,ly:7.2,t:'Seattle Upper Room',sub:'Seattle, WA',pics:[['add a photo',250]],html:`<p>This is my church. I’ve found a great community here that builds me up and keeps me spiritually accountable, and I’ve experienced God here.</p><p>Join me ${CHURCH.when.toLowerCase()}.</p><p>${CHURCH.where}</p><p class="d">${CHURCH.url.replace('https://','')} · type church in the terminal</p>`},
'bakery':{i:'s',o:[-15,12],c:0xc98a42,ly:4.5,t:'Bakes',sub:'Seattle, WA · cheesecakes and the Breadspace',pics:[['add a bake photo',35]],gal:[{h:'cheesecakes',base:'images/cheesecake-',n:8,alt:'Cheesecake'},{h:'The Breadspace',base:'images/breadspace-',n:8,alt:'The Breadspace'}],html:`<p>${BAKES.intro}</p><p>${BAKES.bs.d}</p><p class="d">// the full list is in bakes/ on the home page</p>`},
'workshop':{i:'s',o:[0,18],c:0xff7a45,ly:5.5,t:'3D print shelf',sub:'Seattle, WA · hobby',pics:[['add a print photo',20]],html:`<p>Designing things, then printing them so I can hold them.</p><p class="d">// list your favorite prints</p>`},
'ut-tower':{i:'t',o:[-15,23],c:0xbf5700,ly:10,t:'UT Austin Tower',sub:'Austin, TX · UT Austin, 2019 to 2024',pics:[['add a campus photo',25],['add a campus photo',15]],html:`<p>Austin is where I did my undergrad at UT. I started out as a business major at McCombs and later added Math and a CS certificate.</p><p>I made some of the best friends of my life here, like Kevin Li, Pranav, Harsha, Anya, Catherine, Larry, Shree, Bruce and many more, and I reconnected with Nabil.</p><p>My freshman year I joined the Asian Business Student Association and Texas Convergent, UT’s first interdisciplinary entrepreneurship organization, where students build products at the intersection of technology, business and design. I became Vice President of Convergent my senior year.</p><p>When covid hit and all our classes went online, I learned how to bake and cook.</p><p>My junior year, Kevin Li, Harsha, Pranav and I started our startup through the Longhorn Startup Lab class at Capital Factory, and we got our own office space there.</p><p>Right before graduation in 2023 I was hit by a drunk driver and missed walking the stage, but I finally got to walk it in 2024.</p><p class="d"># University of Texas at Austin · Management Information Systems and Mathematics</p><p><span class="u">[win]</span> HackTX 1st place, Crypto Competition (2021)</p><p><span class="u">[pub]</span> Cybernomics Academic Journal (2020)</p><p><span class="a">[new]</span> Started Galapagos Labs in 2021: a marketplace on the Internet Computer and a $25K DFinity grant</p>`},
'dallas':{i:'t',o:[-6,-7],c:0x6a8cff,ly:10.5,t:'Dallas',sub:'Dallas–Fort Worth, TX · TAMS, family and friends',pics:[['add a photo',230],['add a photo',200]],html:`<p>Dallas was the big city when I was growing up, since it was the closest one to Texarkana.</p><p>In 2017 I moved to the Dallas area for the Texas Academy of Mathematics and Science (TAMS), a two-year residential early college program at the University of North Texas where high school juniors and seniors take real university courses. It changed my life. It opened me up to diversity and ideas I had never seen before, and the classes were challenging.</p><p>I made some of the best friends of my life there, like Kevin Du. I helped him get together with his now wife, and I was at their wedding in Dallas in 2025.</p><p>My brother lived in Dallas for four years, for medical school and a year of residency, and I stayed with him for two summers: one just for fun and one for my internship at Charles Schwab. I love going back, especially for things like the State Fair.</p><p class="d"># Charles Schwab, Project Management Intern · summer 2022</p><p>Oversaw TD Ameritrade and Schwab application integration onto new data centers, with on-time VLAN delivery across 7 data centers.</p>`},
'texarkana':{i:'t',o:[21,-15],c:0xd64545,ly:5,t:'Texarkana',sub:'Texarkana, TX/AR · home',pics:[['add a photo',0],['add a photo',20]],html:`<p>Home. Whenever I tell people I’m from Texas, no one ever guesses it’s Texarkana. It’s where I was born and raised, and my parents still live here. The city is half in Texas and half in Arkansas, and it supposedly has the second highest crime rate per capita.</p><p>I went from Morris Elementary to Texas Middle School to Texas High School. I’ve been into robotics since 4th and 5th grade, when I went to state for FIRST Lego League, and in high school I did FIRST Robotics (FRC) and was the safety captain.</p><p>Texarkana is where I learned my southern hospitality and charm, along with some more southern habits like knife throwing, BBQ and grilling.</p>`}
};
const REG={seattle:{t:'Seattle, WA',sub:'where I live now',pics:[['add a skyline photo',200]],html:`<p>Home base. Home, the Upper Room, a bakery and my print shelf are all here.</p><p class="d">// park on a landmark to read more</p>`},'pearl-river-delta':{t:'Pearl River Delta',sub:'China · Hong Kong, Shenzhen, Guangzhou and Macau',pics:[['add a photo',200]],html:`<p>Four cities packed so close that this map zooms in to show them. Park on one to read more.</p><p class="d">// the car turns into a plane outside the US, so you flew here</p>`},texas:{t:'Texas',sub:'where I studied and interned',pics:[['add a photo',25]],html:`<p>UT Austin, the Dallas area and Texarkana are all here.</p><p class="d">// park on a landmark to read more</p>`}};

// ---- map pins: [key, label, kind, lon, lat]. kind: p = national park, t = trail or state park, c = city (opens a box when you park on it) ----
const PINS=[
['arches','Arches','p',-109.57,38.73],['bryce-canyon','Bryce Canyon','p',-112.18,37.59],['death-valley','Death Valley','p',-116.9,36.5],
['gateway-arch','Gateway Arch','p',-90.19,38.62],['grand-canyon','Grand Canyon','p',-112.14,36.06],['hot-springs','Hot Springs','p',-93.05,34.51],
['indiana-dunes','Indiana Dunes','p',-87.05,41.65],['joshua-tree','Joshua Tree','p',-115.9,33.87],['kings-canyon','Kings Canyon','p',-118.55,36.89],
['mammoth-cave','Mammoth Cave','p',-86.1,37.19],['mount-rainier','Mount Rainier','p',-121.75,46.85],['north-cascades','North Cascades','p',-121.2,48.7],
['olympic','Olympic','p',-123.5,47.8],['petrified-forest','Petrified Forest','p',-109.78,34.91],['redwood','Redwood','p',-124,41.3],
['rocky-mountain','Rocky Mountain','p',-105.68,40.34],['sequoia','Sequoia','p',-118.57,36.49],['white-sands','White Sands','p',-106.17,32.78],
['yosemite','Yosemite','p',-119.54,37.85],['zion','Zion','p',-113.03,37.3],
['goosenecks','Goosenecks SP','t',-109.93,37.17],['sahale-arm','Sahale Arm','t',-121.05,48.47],['enchantments','The Enchantments','t',-120.8,47.5],['crystal-lake','Crystal Lake','t',-121.47,46.93],['niagara-falls','Niagara Falls','t',-78.98,43.08],
['new-york','New York City','c',-74,40.71],['chicago','Chicago','c',-87.63,41.88],['washington-dc','Washington DC','c',-77.04,38.9],['portland','Portland','c',-122.68,45.52],['toronto','Toronto','c',-79.38,43.65],
['hong-kong','Hong Kong','c',114.17,22.32],['guangzhou','Guangzhou','c',113.26,23.13],['shenzhen','Shenzhen','c',114.06,22.54],['macau','Macau','c',113.54,22.2],
['new-delhi','New Delhi','c',77.21,28.61],['taj-mahal','Taj Mahal','c',78.04,27.17],['vellore','Vellore','c',79.13,12.92],['dehradun','Dehradun','c',78.03,30.32],['jabalpur','Jabalpur','c',79.99,23.18]];
// ---- EDIT ME: city boxes. pics items: [caption, hue, optional image path] ----
const CITY={
toronto:{t:'Toronto',sub:'Ontario, Canada · Christmas and New Year’s 2025',pics:[['add a photo',200],['add a photo',260]],html:`<p>I spent Christmas and New Year’s of 2025 in Toronto. My cousin lives there, and we stayed at her place with my aunt and uncle from India and my other cousin from the UK. It was my first time seeing my UK cousin in 18 years.</p><p>I got to catch up with family, eat some amazing food, and pick up some Uniqlo clothes for cheap thanks to the CAD to USD exchange rate. Jack Wang also gave me a tour of Toronto.</p>`},
'new-york':{t:'New York City',sub:'New York, NY · senior year spring break',pics:[['add a photo',215],['add a photo',275]],html:`<p>New York was my senior year spring break trip. I went with my roommate Kevin Li, Nabil and Davis, and while we were there we got to meet up with Robyn, Anya and Jibran.</p><p>We also ate at a Michelin star restaurant for the first time, and honestly it was one of the wildest dining experiences I’ve ever had.</p>`},
'chicago':{t:'Chicago',sub:'Chicago, IL · Campus Peeps reunion, St. Patrick’s Day 2026',pics:[['add a photo',150],['add a photo',110]],html:`<p>Chicago was the Campus Peeps reunion in 2026! I went for St. Patrick’s Day and helped paint the town green.</p><p>We watched the river get dyed, ate some fantastic food, and hit the town at night. I even saw the Bean (Robyn) at the Bean!</p>`},
'washington-dc':{t:'Washington, DC',sub:'Washington, DC · International DECA 2018',pics:[['add a photo',210],['add a photo',250]],html:`<p>This was my second time visiting DC. I went for International DECA in 2018 and made finalist in the Entrepreneurship: Start Up event, where I pitched an idea called Censor Net.</p><p>I went with my TAMS cohort, and Arham set us up in a platinum room at the Marriott. At night we explored the city and saw the landmarks.</p>`},
'portland':{t:'Portland',sub:'Portland, OR · day trip from Seattle',pics:[['add a photo',140],['add a photo',90]],html:`<p>Portland is about three hours south of Seattle, which makes it a great day trip, especially to enjoy Oregon being tax free.</p><p>We hit the food pods and went to Powell’s City of Books, the largest independent bookstore in the world, where I got to be really performative. We also had some fantastic desserts with the BOFA gang.</p>`},
'hong-kong':{t:'Hong Kong',sub:'Hong Kong, China · September to October 2026 · my first international BOFA trip',pics:[['add a photo',200],['add a photo',260]],html:`<p>This was my first international BOFA trip, and my first international friend trip ever! We went to China by way of Hong Kong. We landed at 5am, when pretty much everything was closed, and settled into an Airbnb (technically not allowed, but our host Wing was super chill).</p><p>We were there for the Mid-Autumn Festival, but man was it hot! The humidity was extreme, more than even the Onni steam room could have prepared me for. Kevin Li joined us for this one, so he got to meet my BOFA friend group.</p><p>We ate some fantastic food, from dim sum to Chinese BBQ to entire Cantonese meals. We were right next to a 24/7 spa with the best massages, all-you-can-eat snacks and drinks, and a lounge chair to fall asleep in. The karaoke bar and the nights out afterward were insanely fun too, and we made friends with a ton of locals.</p>`},
'guangzhou':{t:'Guangzhou',sub:'Guangdong, China · September to October 2026 · the highlight of the trip',pics:[['add a photo',10],['add a photo',50]],html:`<p>We took the high-speed rail to get here. We got stopped at the border and had to show our AI slop app to get through.</p><p>Guangzhou is the textile capital of southern China, and honestly it was the highlight of the trip. I bought some immaculate drip while I was here.</p><p>We rode China’s longest zipline down Baiyun Mountain! We also tried Chinese KFC, where they had an Oreo chicken sandwich (it tasted about as odd as it sounds), and boba ice cream.</p><p>The hotel was phenomenal too. We got milk teas for about a dollar and food delivered right to our door, plus an awesome complimentary breakfast. The Chinese Uber is called Didi, and it was insanely cheap!</p>`},
'shenzhen':{t:'Shenzhen',sub:'Guangdong, China · September to October 2026 · the Silicon Valley of China',pics:[['add a photo',30],['add a photo',70]],html:`<p>Shenzhen is the Silicon Valley of China! I picked up some AirPods, clothes, and a bunch of cool food while I was here, and the tech market in the Futian district was insane.</p><p>We walked through multiple malls and ate some cool, cheap food while we shopped. We even had drones deliver us food in the park!</p><p>The night scene was cool too. It felt like an outlet mall, but with clubs.</p>`},
'macau':{t:'Macau',sub:'Macau, China · September to October 2026 · the Vegas of China',pics:[['add a photo',350],['add a photo',30]],html:`<p>Macau is the Vegas of China! I got to explore the ruins of St. Paul and the different hotels and casinos.</p><p>I tried a Portuguese steak, which was fantastic. We were here for China’s National Day, the 77th anniversary of the founding of the People’s Republic, and we saw a huge firework show!</p>`},
'new-delhi':{t:'New Delhi',sub:'New Delhi, India · my base in India',pics:[['add a photo',340],['add a photo',20]],html:`<p>New Delhi is where my aunt and uncle live, and it’s my main base of operations whenever I’m in India. They live in Noida, just outside Delhi.</p><p>I always eat good food and spend time with family while I’m here.</p>`},
'taj-mahal':{t:'Taj Mahal',sub:'Agra, Uttar Pradesh, India',pics:[['add a photo',45],['add a photo',210]],html:`<p class="d">// when did you go, and what was it like? tell me and I’ll write it in</p>`},
'vellore':{t:'Vellore',sub:'Tamil Nadu, India (near Chennai) · where my father grew up',pics:[['add a photo',120],['add a photo',160]],html:`<p>Vellore is the jewel of Tamil Nadu, and it’s where my father grew up! It’s proof that South Indian food is the best. My go-tos are appam, with its soft middle and crispy lacy edges, and a crisp dosa.</p><p>Vellore is also home to Christian Medical College, where my parents met. CMC started in 1900 as a one-bed clinic run by Dr. Ida Scudder, an American medical missionary whose parents were medical missionaries in India too. It grew into a 40-bed hospital in 1902, and in 1918 she opened a medical school to train women as doctors, which later opened to men as well. Today it’s one of the best-known medical colleges in India.</p><p>It gets really hot here, but I usually visit in the winter, when it’s around 70°F.</p>`},
'dehradun':{t:'Dehradun',sub:'Uttarakhand, India · where my mother is from',pics:[['add a photo',140],['add a photo',100]],html:`<p>Dehradun is the capital of Uttarakhand, the state my mother is from! The region has breathtaking mountains, hill stations, and buildings scattered all through it.</p><p>The last time I was here, I stayed with my uncle’s in-laws and ate fruit picked straight from the trees while watching monkeys!</p>`},
'jabalpur':{t:'Jabalpur',sub:'Madhya Pradesh, India · my favorite place in India',pics:[['add a photo',300],['add a photo',330]],html:`<p>Jabalpur is my favorite place in India. It’s where my Naani lives, and where my Naana lived too (RIP Naana ❤️). They have a school here called Hillbird School.</p><p>It’s a military city, and it’s where my mom grew up. I’ve spent many summers here, and I’m about to go back for Christmas!</p>`}};

// ---- Kevin's Korner: weekly dinners and potlucks ----
// events, newest first. Photos load by name: images/kk-<n>-1.jpg, kk-<n>-2.jpg ... (up to 8 per night). Missing ones just don't show.
const KK={
 tagline:'Every week I gather people from the different corners of my life and cook for them, or we hold a potluck. Same table, people who would not otherwise meet.',
 corners:['work','church','UT Austin','family','Seattle friends','Texas friends','somewhere else'], // the "corners" shown on the form and the list
 next:{when:'',what:'',where:'Seattle, WA. The address goes to people on the list.'}, // e.g. when:'Thursday, 6:30 PM', what:'Potluck, bring a side'
 email:'Kevin.rohan.jacob@gmail.com',
 // RSVPs are emailed to you through FormSubmit (formsubmit.co), so there is no database. The first RSVP sends you an activation email: click it once.
 // After that, FormSubmit gives you a private ID: swap it in for the address here (https://formsubmit.co/ajax/<your-id>) so your email stays out of the page.
 endpoint:'https://formsubmit.co/ajax/Kevin.rohan.jacob@gmail.com',
 events:[
  {n:1,date:'',title:'KK #1',menu:'',note:''}
 ]};

// ---- puns for the `pun` command ----
const PUNS=[
 'I’d tell you a shipping pun, but it’s still in transit.',
 'I wanted to tell a returns pun, but you’d just send it back.',
 'My 3D printer told a joke. The punchline took 14 hours, but it was layered with meaning.',
 'I used to be a baker, but I couldn’t make enough dough.',
 'Parallel lines have so much in common. It’s a shame they’ll never meet.',
 'A good product manager never says no. They say “not this sprint.”',
 'I was going to make a Death Valley pun, but it was too dry.',
 'Bryce Canyon is full of hoodoos. Hoodoo you think you are?',
 'Why did the spreadsheet go to therapy? Too many unresolved references.',
 'Drummers always get the last laugh. Ba dum tss.',
 'I’m not lost in Zion. I’m just taking the scenic route.',
 'I made a pie chart of my sourdough hobby. It was mostly crust.',
 'Why did the croissant get promoted? It had great layers of experience.',
 'I asked the map where I’d been. It said: pin it down.'];
