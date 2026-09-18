const PORTRAITS = "../../../../Cards/Baseball/images/portraits/";
const USE_PORTRAITS = false;

const party = [
  { id: "pc1", name: "PC 1", initials: "P1", type: "pc", color: "#496f83" },
  { id: "pc2", name: "PC 2", initials: "P2", type: "pc", color: "#8a4f45" },
  { id: "pc3", name: "PC 3", initials: "P3", type: "pc", color: "#5e7650" },
  { id: "pc4", name: "PC 4", initials: "P4", type: "pc", color: "#826b3f" },
  { id: "pc5", name: "PC 5", initials: "P5", type: "pc", color: "#665987" },
  { id: "pc6", name: "PC 6", initials: "P6", type: "pc", color: "#3f7772" },
  { id: "pc7", name: "PC 7", initials: "P7", type: "pc", color: "#815a70" }
];

const pcPieces = (positions) => party.map((pc, index) => ({
  ...pc,
  x: positions[index][0],
  y: positions[index][1],
  note: "Player character miniature. Replace with the campaign mini in TTS."
}));

const mirrorStrip = (cols, row, idPrefix) => Array.from({ length: cols }, (_, index) => ({
  id: `${idPrefix}${index}`,
  type: "mirror",
  x: index + 1,
  y: row,
  w: 1,
  h: 1,
  label: "M"
}));

const wagonWalls = [
  { id: "north-wall", type: "wall", x: 1, y: 1, w: 12, h: .22 },
  { id: "south-wall", type: "wall", x: 1, y: 6.78, w: 12, h: .22 },
  { id: "west-wall", type: "wall", x: 1, y: 1, w: .22, h: 6 },
  { id: "east-wall", type: "wall", x: 11.78, y: 1, w: .22, h: 6 }
];

const scenes = [
  {
    id: "room1",
    tab: "1. Light Room",
    kind: "Wagon puzzle",
    title: "Cheap Frights",
    boardClass: "wagon",
    cols: 12,
    rows: 7,
    rules: {
      goal: "Identify the one true Pavel reflection and the correct exit mirror.",
      setup: ["Place four active light pieces.", "Place three false Pavel counters at different mirrors.", "Keep the true Pavel token off the board."],
      actions: ["Move normally.", "Cover, extinguish, or create a light.", "Inspect a mirror or follow a reflected figure."],
      solve: ["Leave exactly one mundane lantern active.", "Remove every false Pavel counter.", "Place true Pavel at the exit mirror and move the party there."],
      failure: "Magical or multiple lights create contradictory Pavels. Nothing attacks; the room simply gives no reliable direction."
    },
    manifest: ["12 x 7 square floor mat", "14 mirror wall tiles", "7 PC miniatures", "1 true Pavel reflection token", "3 false Pavel tokens", "1 mundane lantern", "3 removable light tokens"],
    features: [
      ...wagonWalls,
      ...mirrorStrip(10, 1, "r1n"),
      ...mirrorStrip(10, 7, "r1s"),
      { id: "exit", type: "mirror", x: 11, y: 3, w: 1, h: 2, label: "EXIT MIRROR" },
      { id: "start", type: "zone", x: 1.35, y: 2, w: 2, h: 4, label: "ENTRY" }
    ],
    pieces: [
      ...pcPieces([[2,3],[2,4],[3,3],[3,4],[2,5],[3,5],[4,4]]),
      { id: "lantern", name: "Mundane Lantern", initials: "L", type: "light", x: 5, y: 4, note: "The only light that should remain active." },
      { id: "light2", name: "Magical Light", initials: "A", type: "light", x: 4, y: 2, note: "Remove or cover this light." },
      { id: "light3", name: "Wall Candle", initials: "B", type: "light", x: 8, y: 2, note: "Remove or cover this light." },
      { id: "light4", name: "Devil Lamp", initials: "C", type: "light", x: 8, y: 6, note: "Remove or cover this light." },
      { id: "pavelTrue", name: "True Pavel Reflection", initials: "P", type: "npc", image: `${PORTRAITS}PavelRilsky.png`, x: 11, y: 4, visible: false, note: "This token appears only when exactly one mundane lantern remains." },
      { id: "false1", name: "False Pavel", initials: "?", type: "counter", x: 6, y: 1, visible: true, note: "A contradictory image created by excess light." },
      { id: "false2", name: "False Pavel", initials: "?", type: "counter", x: 9, y: 7, visible: true, note: "A contradictory image created by excess light." },
      { id: "false3", name: "False Pavel", initials: "?", type: "counter", x: 4, y: 7, visible: true, note: "A contradictory image created by excess light." }
    ],
    counters: [{ id: "lights", label: "Lights active", max: 4, value: 4 }],
    steps: [
      { actor: "GM setup", title: "Four lights create false directions", instruction: "Place all four light pieces and three false Pavel counters. Every false Pavel points toward a different mirror.", tags: ["Visible information", "No roll"] },
      { actor: "PC 2", title: "Cover the magical light", instruction: "Turn the A light facedown. Remove one false Pavel counter and reduce Lights Active to 3.", tags: ["Manipulate object"], patch: { pieces: { light2: { state: "inactive" }, false1: { visible: false } }, counters: { lights: 3 } } },
      { actor: "PC 4", title: "Extinguish the wall lights", instruction: "Turn B and C facedown. Remove all false Pavel counters. Only the mundane lantern remains.", tags: ["Exactly one light"], patch: { pieces: { light3: { state: "inactive" }, light4: { state: "inactive" }, false2: { visible: false }, false3: { visible: false }, pavelTrue: { visible: true } }, counters: { lights: 1 } } },
      { actor: "Party", title: "Follow the true reflection", instruction: "Move the party toward the exit mirror. Pavel's reflection occupies the correct mirror square and points into Room 2.", tags: ["Puzzle solved"], patch: { pieces: { pc1:{x:9,y:3},pc2:{x:9,y:4},pc3:{x:9,y:5},pc4:{x:8,y:3},pc5:{x:8,y:4},pc6:{x:8,y:5},pc7:{x:10,y:4} } } }
    ]
  },
  {
    id: "room2",
    tab: "2. Knock Room",
    kind: "Wagon puzzle",
    title: "Late Reflections",
    boardClass: "wagon",
    cols: 12,
    rows: 7,
    rules: {
      goal: "Complete three rune circuits by separating real PCs from their one-action-late reflections.",
      setup: ["Place each PC opposite its color-matched reflection.", "Reflection runes I, II, and III are under R1 at C1, R4 at F1, and R7 at I1.", "Matching floor runes I, II, and III are empty at E4, H4, and J4."],
      actions: ["Move one PC to any empty square; its reflection stays in the old column.", "Before that PC acts again, its reflection catches up to the PC's current column.", "A circuit completes only when one color occupies both matching rune labels."],
      solve: ["Move P1 from C4 to floor rune I at E4, leaving R1 on mirror rune I at C1.", "Move P4 from F4 to floor rune II at H4, leaving R4 on mirror rune II at F1.", "Move P7 from I4 to floor rune III at J4, leaving R7 on mirror rune III at I1.", "Do not activate those PCs again until all three circuits are complete."],
      failure: "A wrong PC or reflection can occupy a rune but does not light it. If a circuit's PC acts again, its reflection catches up and that circuit switches off."
    },
    manifest: ["12 x 7 square floor mat", "1 full-width glass barrier", "7 PC miniatures", "7 matching translucent reflection tokens", "3 pairs of matching rune pads", "3 brass knock counters", "1 black fourth-knock counter", "1 inscription strip"],
    features: [
      ...wagonWalls,
      { id: "reflection-band", type: "reflectionBand", x: 2, y: 1, w: 9, h: 1, label: "BEHIND THE GLASS: REFLECTION TOKENS" },
      { id: "glass-barrier", type: "mirror", x: 2, y: 2, w: 9, h: 1, label: "MIRROR WALL" },
      { id: "real-floor", type: "realBand", x: 2, y: 4, w: 9, h: 1, label: "REAL MINIATURES" },
      { id: "mirror-rune-1", type: "rune", x: 3, y: 1, w: 1, h: 1, label: "I" },
      { id: "mirror-rune-2", type: "rune", x: 6, y: 1, w: 1, h: 1, label: "II" },
      { id: "mirror-rune-3", type: "rune", x: 9, y: 1, w: 1, h: 1, label: "III" },
      { id: "floor-rune-1", type: "rune", x: 5, y: 4, w: 1, h: 1, label: "I" },
      { id: "floor-rune-2", type: "rune", x: 8, y: 4, w: 1, h: 1, label: "II" },
      { id: "floor-rune-3", type: "rune", x: 10, y: 4, w: 1, h: 1, label: "III" },
      { id: "knock-mirror", type: "mirror", x: 10, y: 2, w: 2, h: 4, label: "ANSWERING MIRROR" },
      { id: "inscription", type: "zone", x: 3, y: 6, w: 4, h: 1, label: "WARNING HEARD = WAY OPENS / WARNING SILENCED = YOU OPEN", hidden: true }
    ],
    pieces: [
      ...pcPieces([[3,4],[4,5],[5,5],[6,4],[7,5],[8,5],[9,4]]),
      ...party.map((pc, index) => ({
        id: `reflection${index + 1}`,
        name: `${pc.name} Reflection`,
        initials: `R${index + 1}`,
        type: "reflection",
        color: pc.color,
        x: index + 3,
        y: 1,
        note: `The delayed reflection paired with ${pc.name}. It uses the same base-ring color.`
      })),
      { id: "k1", name: "First Knock", initials: "1", type: "object", x: 8, y: 6, visible: false, note: "Place after the first physical knock." },
      { id: "k2", name: "Second Knock", initials: "2", type: "object", x: 9, y: 6, visible: false, note: "Place after the second physical knock." },
      { id: "k3", name: "Third Knock", initials: "3", type: "object", x: 10, y: 6, visible: false, note: "Place after the third physical knock." },
      { id: "k4", name: "Fourth Knock", initials: "4", type: "enemy", x: 10, y: 3, visible: false, note: "This counter is placed by the GM on the far side of the mirror." }
    ],
    counters: [{ id: "knocks", label: "Knocks heard", max: 4, value: 0 }],
    steps: [
      { actor: "GM setup", title: "Three rune pairs wait for matching colors", instruction: "R1, R4, and R7 begin on mirror runes I, II, and III. Their matching floor runes are empty. Other PCs begin off the destination pads.", tags: ["Visible objective", "Starting state"] },
      { actor: "P1", title: "Complete circuit I", instruction: "Move P1 from C4 to E4. R1 remains at C1. The same blue pair now occupies both I runes; place knock counter 1.", tags: ["Movement puzzle", "Circuit I"], patch: { pieces: { pc1:{x:5,y:4},k1:{visible:true} }, counters:{knocks:1} } },
      { actor: "P4", title: "Complete circuit II", instruction: "Move P4 from F4 to H4. R4 remains at F1. The ochre pair occupies both II runes; place knock counter 2.", tags: ["Hold P1 still", "Circuit II"], patch: { pieces: { pc4:{x:8,y:4},k2:{visible:true} }, counters:{knocks:2} } },
      { actor: "P7", title: "Complete circuit III", instruction: "Move P7 from I4 to J4. R7 remains at I1. The rose pair occupies both III runes; place knock counter 3.", tags: ["All circuits lit", "Circuit III"], patch: { pieces: { pc7:{x:10,y:4},k3:{visible:true} }, counters:{knocks:3} } },
      { actor: "GM", title: "The mirror supplies an impossible fourth knock", instruction: "With all three circuits lit, place black counter 4 behind the Answering Mirror. It has no matching PC, reflection, or rune.", tags: ["Puzzle solved", "Threat revealed"], patch: { pieces: { k4:{visible:true} }, counters:{knocks:4} } },
      { actor: "GM", title: "The warning and exit appear", instruction: "Flip the inscription faceup and open the passage to the Honest Mirror. The fourth knock is the Unreflected testing the boundary.", tags: ["Clue delivered", "Room complete"], patch: { features: { inscription:{hidden:false} } } }
    ]
  },
  {
    id: "room3",
    tab: "3. Honest Mirror",
    kind: "Threshold puzzle",
    title: "The Honest Mirror",
    boardClass: "wagon",
    cols: 10,
    rows: 7,
    rules: {
      goal: "Open the Honest Mirror and move the party into the Gloamglass.",
      setup: ["Place the sealed 2 x 4 Honest Mirror.", "Put one mundane lantern and three knock counters in reach.", "Keep Truth and Fear Bruise tokens in the tray."],
      actions: ["Extinguish lights.", "Place the lantern.", "Knock or speak to the unresponsive mirror.", "A character may state only what the fear protects."],
      solve: ["The room is otherwise dark.", "Exactly one mundane lantern is in the Truth Zone.", "The party knocks three times and waits for the fourth.", "At least one PC names a fear and what it protects."],
      failure: "A silent PC may cross holding a speaker's hand but takes one Fear Bruise. A false statement leaves the mirror solid and reveals a clue."
    },
    manifest: ["10 x 7 square floor mat", "1 two-square Honest Mirror", "1 mundane lantern", "3 knock counters", "7 PC miniatures", "7 optional truth/warning tokens", "Fear Bruise tokens"],
    features: [
      { id:"hm", type:"mirror", x:8, y:2, w:2, h:4, label:"HONEST MIRROR" },
      { id:"portal", type:"portal", x:8, y:2, w:2, h:4, label:"GLOAMGLASS", hidden:true },
      { id:"truth-zone", type:"zone", x:5, y:3, w:2, h:2, label:"TRUTH\nZONE" }
    ],
    pieces: [
      ...pcPieces([[2,2],[2,3],[2,4],[2,5],[3,3],[3,4],[3,5]]),
      { id:"lantern", name:"Single Mundane Lantern", initials:"L", type:"light", x:4, y:4, note:"Place this in front of the Honest Mirror." },
      { id:"truth", name:"Fear Has Meaning", initials:"T", type:"object", x:5, y:4, visible:false, note:"Place after a character names a fear and what it protects." },
      { id:"bruise", name:"Fear Bruise", initials:"B", type:"counter", x:3, y:5, visible:false, note:"A silent traveler may enter by holding a speaker's hand and taking this token." }
    ],
    counters: [{ id:"requirements", label:"Keys complete", max:4, value:0 }],
    steps: [
      { actor:"GM setup", title:"Four physical requirements", instruction:"Use four spaces on a key track: darkness, one mundane lantern, three knocks, and a fear linked to what it protects.", tags:["Checklist puzzle"] },
      { actor:"Party", title:"Darkness and one lantern", instruction:"Remove every other light piece. Move the mundane lantern into the Truth Zone. Fill the first two key spaces.", tags:["Keys 1-2"], patch:{ pieces:{lantern:{x:5,y:4}}, counters:{requirements:2} } },
      { actor:"PC 3", title:"Knock and wait", instruction:"Place three knock counters. The GM taps once from behind the Honest Mirror. Fill the third key space.", tags:["Key 3"], patch:{ counters:{requirements:3} } },
      { actor:"PC 3", title:"Place a truth token", instruction:"State a character fear and what it protects, then place T beside the lantern. This is characterization, not a skill check.", tags:["Key 4", "No roll"], patch:{ pieces:{truth:{visible:true}}, counters:{requirements:4}, features:{portal:{hidden:false},hm:{hidden:true}} } },
      { actor:"Party", title:"Cross the mirror", instruction:"Move speaking PCs through freely. A silent PC may pair bases with a speaker and take one Fear Bruise token.", tags:["Threshold open"], patch:{ pieces:{pc1:{x:8,y:3},pc2:{x:8,y:4},pc3:{x:9,y:3},pc4:{x:9,y:4},bruise:{visible:true,x:7,y:5}} } }
    ]
  },
  {
    id: "pain",
    tab: "4. First Visit",
    kind: "Gloamglass memory",
    title: "The First Visit",
    boardClass: "gloam",
    cols: 12,
    rows: 8,
    rules: {
      goal: "Witness why Pavel trusted the Lantern Wraith and what it first took from him.",
      setup: ["Place Pavel with a cut palm inside the memory.", "Place the Lantern Wraith in the mirror and the red flame between them.", "Keep the colored trail and exit hidden."],
      actions: ["Listen to the memory.", "Walk among its figures or touch one to feel its emotion.", "Inspect the cut, lantern, or hot glass for extra detail."],
      solve: ["No answer is required: let the memory play.", "See the Wraith take Pavel's fear of pain, then watch him fail to withdraw from hot glass.", "Reveal the red trail to the next memory."],
      failure: "The party cannot fail this scene. Attacking or dispelling the echo advances the Unreflected clock, but the red trail still appears."
    },
    manifest: ["12 x 8 dark-glass mat", "7 PC miniatures", "Pavel miniature", "Lantern Wraith miniature", "1 red fear flame", "1 hot-glass tile", "1 red trail strip", "4-step Unreflected clock"],
    features: [
      {id:"entry",type:"portal",x:1,y:3,w:1,h:3,label:"ENTRY"},
      {id:"memory",type:"zone",x:5,y:2,w:4,h:5,label:"PAVEL'S FIRST VISIT"},
      {id:"burn",type:"zone",x:10,y:3,w:2,h:3,label:"DANGEROUSLY\nHOT GLASS"},
      {id:"exit",type:"portal",x:12,y:3,w:1,h:3,label:"NEXT" ,hidden:true}
    ],
    pieces: [
      ...pcPieces([[2,3],[2,4],[2,5],[3,3],[3,4],[3,5],[4,4]]),
      {id:"pavel",name:"Memory of Pavel",initials:"P",type:"npc",image:`${PORTRAITS}PavelRilsky.png`,x:6,y:4,note:"He is frightened, hurt, and receptive to the Wraith's apparent kindness."},
      {id:"wraith",name:"Memory of the Lantern Wraith",initials:"LW",type:"enemy",image:`${PORTRAITS}LanternWraith.png`,x:8,y:4,note:"It offers removal as mercy and never raises its voice."},
      {id:"red",name:"Fear of Pain",initials:"R",type:"object",x:7,y:4,visible:false,color:"#bd3c35",glow:"#f05249",note:"The first fear harvested from Pavel."}
    ],
    counters:[{id:"clock",label:"Unreflected",max:4,value:0}],
    steps:[
      {actor:"GM",title:"A memory waits in the dunes",instruction:"Pavel hides a bleeding palm while the Wraith watches from the mirror. The figures do not acknowledge the party.",tags:["Story scene","No puzzle"]},
      {actor:"Memory",title:"The offer",instruction:"The Wraith says, 'Pain has frightened you long enough. Give me the fear before it can hurt you again.' Pavel agrees; place the red flame between them.",tags:["Apparent mercy"],patch:{pieces:{red:{visible:true}}}},
      {actor:"Memory",title:"The consequence",instruction:"Move Pavel to the hot glass. He presses his injured hand against it and does not withdraw as it blisters. The Wraith removed his warning, not his pain.",tags:["Finale clue: red"],patch:{pieces:{pavel:{x:10,y:4},red:{x:9,y:3}}}},
      {actor:"GM",title:"Follow the red trail",instruction:"The memory breaks into red light leading onward. Reveal the next passage; no answer or roll is required.",tags:["Memory complete"],patch:{features:{exit:{hidden:false}}}}
    ]
  },
  {
    id: "loss",
    tab: "5. The Return",
    kind: "Gloamglass memory",
    title: "The Return",
    boardClass: "gloam",
    cols: 12,
    rows: 8,
    rules: {
      goal: "Witness how the Wraith used Pavel's love for Ilona to bring him back.",
      setup: ["Place Ilona and Pavel at the wagon door.", "Place the Wraith and blue flame beyond the door.", "Keep the colored trail and exit hidden."],
      actions: ["Listen to Ilona and Pavel.", "Touch either echo to feel fear, love, guilt, or resolve.", "Inspect the door and hear Pavel's three knocks."],
      solve: ["No answer is required: let the memory play.", "Watch Pavel break his promise and surrender his fear of losing Ilona.", "Reveal the blue trail to the final memory."],
      failure: "The party cannot fail this scene. Attacking or dispelling the echo advances the Unreflected clock, but the blue trail still appears."
    },
    manifest: ["12 x 8 dark-glass mat", "7 PC miniatures", "Pavel miniature", "Ilona miniature", "Lantern Wraith miniature", "1 blue fear flame", "1 wagon-door tile", "1 blue trail strip", "4-step Unreflected clock"],
    features: [
      {id:"door",type:"monolith",x:5,y:2,w:2,h:5,label:"WAGON\nDOOR"},
      {id:"memory",type:"zone",x:8,y:2,w:3,h:5,label:"INSIDE THE HALL"},
      {id:"exit",type:"portal",x:12,y:3,w:1,h:3,label:"NEXT",hidden:true}
    ],
    pieces:[
      ...pcPieces([[2,2],[2,3],[2,4],[2,5],[3,3],[3,4],[3,5]]),
      {id:"ilona",name:"Memory of Ilona",initials:"I",type:"npc",image:`${PORTRAITS}IlonaRilsky.png`,x:4,y:4,note:"She begs Pavel not to enter the wagon again."},
      {id:"pavel",name:"Memory of Pavel",initials:"P",type:"npc",image:`${PORTRAITS}PavelRilsky.png`,x:5,y:4,note:"He promises to stay away, then returns after Ilona leaves."},
      {id:"wraith",name:"Memory of the Lantern Wraith",initials:"LW",type:"enemy",image:`${PORTRAITS}LanternWraith.png`,x:10,y:4,note:"It turns Pavel's fear of abandonment into a reason to surrender attachment."},
      {id:"blue",name:"Fear of Loss",initials:"B",type:"object",x:9,y:4,visible:false,color:"#397fc0",glow:"#5ba7ec",note:"The second fear harvested from Pavel."}
    ],
    counters:[{id:"clock",label:"Unreflected",max:4,value:0}],
    steps:[
      {actor:"GM",title:"Ilona catches Pavel returning",instruction:"Ilona grips Pavel's shoulders and begs him not to enter again. He promises her he will not.",tags:["Story scene","No puzzle"]},
      {actor:"Memory",title:"Three knocks after dark",instruction:"Move Ilona away. Pavel waits, then knocks three times and enters. The Wraith shows him an image of Ilona leaving forever.",tags:["Promise broken"],patch:{pieces:{ilona:{x:2,y:7},pavel:{x:8,y:4}}}},
      {actor:"Memory",title:"The second offer",instruction:"The Wraith says, 'No one can abandon you if their absence means nothing.' Pavel agrees; reveal the blue flame as Ilona's image calls his name.",tags:["Finale clue: blue"],patch:{pieces:{blue:{visible:true}}}},
      {actor:"GM",title:"Follow the blue trail",instruction:"Pavel watches Ilona's reflection vanish without reaching for her. Blue light leads to the last memory; no answer or roll is required.",tags:["Memory complete"],patch:{features:{exit:{hidden:false}}}}
    ]
  },
  {
    id: "shame",
    tab: "6. Final Visit",
    kind: "Gloamglass memory",
    title: "The Cure",
    boardClass: "gloam",
    cols: 12,
    rows: 8,
    rules: {
      goal: "Witness Pavel's final bargain and learn why the Unreflected needs him emptied of fear.",
      setup: ["Place Pavel before the open lantern.", "Place the Wraith opposite him and the Unreflected behind his reflection.", "Keep the white flame and Hall entrance hidden."],
      actions: ["Listen to Pavel confess why he returned.", "Watch the Unreflected anticipate his movements.", "Inspect the lantern or touch Pavel's echo for extra detail."],
      solve: ["No answer is required: let the memory play.", "Watch the Wraith remove Pavel's fear of wrongdoing.", "See the Unreflected align with his emptied reflection and reveal the Hall."],
      failure: "The party cannot fail this scene. Attacking or dispelling the echo advances the Unreflected clock, but the way to Pavel still opens."
    },
    manifest: ["12 x 8 dark-glass mat", "7 PC miniatures", "Pavel miniature", "Lantern Wraith miniature", "Unreflected silhouette", "1 lantern object", "1 white fear flame", "3 colored trail strips", "4-step Unreflected clock"],
    features:[
      {id:"memory",type:"zone",x:5,y:2,w:5,h:5,label:"PAVEL'S FINAL VISIT"},
      {id:"exit",type:"portal",x:12,y:3,w:1,h:3,label:"HALL",hidden:true}
    ],
    pieces:[
      ...pcPieces([[2,2],[2,3],[2,4],[2,5],[3,3],[3,4],[3,5]]),
      {id:"pavel",name:"Memory of Pavel",initials:"P",type:"npc",image:`${PORTRAITS}PavelRilsky.png`,x:6,y:4,note:"He wants relief and no longer understands what each removal has cost him."},
      {id:"lantern",name:"Open Wraith Lantern",initials:"L",type:"light",x:8,y:4,note:"Red and blue already burn inside it."},
      {id:"wraith",name:"Memory of the Lantern Wraith",initials:"LW",type:"enemy",image:`${PORTRAITS}LanternWraith.png`,x:9,y:4,note:"It sincerely mistakes emotional removal for mercy."},
      {id:"unreflected",name:"The Unreflected",initials:"U",type:"enemy",image:`${PORTRAITS}TheUnreflected.png`,x:6,y:6,note:"It moves before Pavel until the final fear is removed, then aligns perfectly."},
      {id:"white",name:"Fear of Wrongdoing",initials:"W",type:"object",x:7,y:4,visible:false,color:"#d9d3c4",glow:"#fffbe8",note:"The final fear harvested from Pavel."}
    ],
    counters:[{id:"clock",label:"Unreflected",max:4,value:0}],
    steps:[
      {actor:"GM",title:"The lantern stands open",instruction:"Pavel faces the Wraith. The Unreflected behind him copies each movement a fraction before he makes it.",tags:["Story scene","No puzzle"]},
      {actor:"Pavel",title:"Why he came back",instruction:"Pavel says, 'Mama cries because I keep coming here. I know I should stop, but I don't want to be afraid again.'",tags:["Pavel understands the harm"]},
      {actor:"Memory",title:"The final removal",instruction:"The Wraith says, 'Then let me take the part that accuses you.' Pavel agrees. Reveal the white flame beside the lantern as it is drawn inside.",tags:["Finale clue: white"],patch:{pieces:{white:{visible:true,x:8,y:3}}}},
      {actor:"GM",title:"The doorway aligns",instruction:"Move the Unreflected directly behind Pavel. Their silhouettes align. Red, blue, and white light reveal the Hall of Unmade Screams and the real Pavel beyond.",tags:["Memory complete","Finale revealed"],patch:{pieces:{unreflected:{x:6,y:5}},features:{exit:{hidden:false}}}}
    ]
  },
  {
    id: "finale",
    tab: "7. Finale",
    kind: "Tactical objective encounter",
    title: "Hall of Unmade Screams",
    boardClass: "cathedral",
    cols: 14,
    rows: 10,
    rules: {
      goal: "Restore Pavel's three fears before three Open Door marks let the Unreflected enter him, then resolve the lantern.",
      setup: ["Place Pavel in his zone and the Unreflected directly behind him.", "Place all three flames on the lantern.", "Set Round to 1, Open Door to 0, and Fears Restored to 0.", "Place six destructible anchor mirrors."],
      actions: ["Free a flame: action and DC 15 Sleight of Hand, Arcana, or Religion; DC 17 Athletics; or accept a Fear Bruise after failure.", "Restore a freed flame: action adjacent to Pavel plus a concrete explanation of what it protects.", "Attack, negotiate with, or evade the Wraith normally."],
      solve: ["Restore red to suppress Searing Warning.", "Restore blue to suppress Isolating Pane.", "Restore white to suppress Curated Terror.", "Extinguish, reform, or claim the lantern after all three are restored."],
      failure: "At initiative 20, add one Open Door mark when restored fears are fewer than the round number. At three marks, restore a fear before the end of the next round or the Unreflected crosses in Pavel."
    },
    manifest:["14 x 10 gridded encounter mat", "7 PC miniatures", "Pavel miniature", "Large Lantern Wraith miniature", "Unreflected silhouette", "1 lantern object", "3 colored fear flames", "6 anchor mirror tiles", "3 Open Door counters", "Fear Bruise tokens", "Round marker"],
    features:[
      {id:"a1",type:"anchor",x:2,y:1,w:1,h:2,label:"A1"},{id:"a2",type:"anchor",x:7,y:1,w:1,h:2,label:"A2"},{id:"a3",type:"anchor",x:12,y:1,w:1,h:2,label:"A3"},
      {id:"a4",type:"anchor",x:2,y:9,w:1,h:2,label:"A4"},{id:"a5",type:"anchor",x:7,y:9,w:1,h:2,label:"A5"},{id:"a6",type:"anchor",x:12,y:9,w:1,h:2,label:"A6"},
      {id:"lantern-zone",type:"zone",x:10,y:4,w:2,h:3,label:"LANTERN"},
      {id:"pavel-zone",type:"zone",x:12,y:4,w:2,h:3,label:"PAVEL"},
      {id:"entry",type:"portal",x:1,y:4,w:1,h:3,label:"ENTRY"}
    ],
    pieces:[
      ...pcPieces([[2,4],[2,5],[2,6],[3,3],[3,4],[3,6],[3,7]]),
      {id:"wraith",name:"Lantern Wraith",initials:"LW",type:"enemy",image:`${PORTRAITS}LanternWraith.png`,x:9,y:5,note:"Large flying boss. It can pass through mirror tiles."},
      {id:"pavel",name:"Pavel",initials:"P",type:"npc",image:`${PORTRAITS}PavelRilsky.png`,x:13,y:5,note:"Three fears must be restored before the Unreflected is expelled."},
      {id:"unreflected",name:"The Unreflected",initials:"U",type:"enemy",image:`${PORTRAITS}TheUnreflected.png`,x:14,y:5,note:"Environmental threat. Do not give it hit points."},
      {id:"lantern",name:"Wraith Lantern",initials:"L",type:"light",x:10,y:5,note:"Each colored fear requires one action to free and one action to restore."},
      {id:"red",name:"Pain Fear",initials:"R",type:"object",x:10,y:4,color:"#bd3c35",glow:"#f05249",note:"Restore to suppress Searing Warning."},
      {id:"blue",name:"Loss Fear",initials:"B",type:"object",x:10,y:5,color:"#397fc0",glow:"#5ba7ec",note:"Restore to suppress Isolating Pane."},
      {id:"white",name:"Conscience Fear",initials:"W",type:"object",x:10,y:6,color:"#d9d3c4",glow:"#fffbe8",note:"Restore to suppress Curated Terror."}
    ],
    counters:[{id:"round",label:"Round",max:4,value:1},{id:"door",label:"Open Door",max:3,value:0},{id:"flames",label:"Fears restored",max:3,value:0,className:"flames"}],
    steps:[
      {actor:"GM setup",title:"Three linked objectives",instruction:"Put the flames on the lantern, Pavel in his zone, and the Unreflected directly behind him. Six mirrors are destructible anchors.",tags:["Initiative begins","Round 1"]},
      {actor:"PC 1",title:"Free the red flame",instruction:"Move adjacent to the lantern. On a successful free-flame action, move R one square out and give it a glow marker.",tags:["Action 1 of 2","DC 15 or cost"],patch:{pieces:{pc1:{x:9,y:4},red:{x:9,y:3,state:"freed"}}}},
      {actor:"PC 2",title:"Return pain to Pavel",instruction:"Carry R adjacent to Pavel and use an action to show that pain protects his body. Put R beneath Pavel's base. Searing Warning switches off.",tags:["Fear restored","Remove 1 Door mark"],patch:{pieces:{pc2:{x:12,y:4},red:{x:13,y:5,state:"restored"}},counters:{flames:1}}},
      {actor:"Initiative 20",title:"Pavel meets the round threshold",instruction:"At the start of Round 2 he has one restored fear, matching the previous round requirement. Add no Open Door mark.",tags:["Round 2","Door remains 0"],patch:{counters:{round:2}}},
      {actor:"PCs 3-4",title:"Free and return the blue flame",instruction:"PC 3 frees B from the lantern. PC 4 carries it to Pavel and identifies the bond protected by fear of loss.",tags:["Two actions","Isolating Pane off"],patch:{pieces:{pc3:{x:9,y:5},pc4:{x:12,y:6},blue:{x:13,y:5,state:"restored"}},counters:{flames:2}}},
      {actor:"PCs 5-6",title:"Free and return the white flame",instruction:"PC 5 opens the final shutter. PC 6 restores Pavel's fear of wrongdoing by naming the boundary it protects.",tags:["Curated Terror off","Unreflected exposed"],patch:{pieces:{pc5:{x:9,y:6},pc6:{x:12,y:5},white:{x:13,y:5,state:"restored"}},counters:{flames:3}}},
      {actor:"PC 7",title:"Resolve the lantern",instruction:"Choose: extinguish it to close the breach, negotiate consent rules to preserve the passage, or claim it and keep the breach portable.",tags:["Ending choice","Unreflected expelled"],patch:{pieces:{pc7:{x:10,y:5},unreflected:{visible:false},wraith:{x:11,y:3}},counters:{round:3,door:0,flames:3}}}
    ]
  }
];

const sceneReferences = {
  pain: [
    { title: "Interior of Shabby Mirror Chamber", src: "reference_images/first-visit-shabby-mirror-chamber.jpg" },
    { title: "Dangerously Hot Glass", src: "reference_images/first-visit-dangerously-hot-glass.jpg" },
    { title: "Wraith Mirror", src: "reference_images/first-visit-wraith-mirror.jpg" }
  ],
  loss: [
    { title: "Wagon Exterior", src: "reference_images/return-wagon-exterior.jpg" },
    { title: "Wagon Door", src: "reference_images/return-wagon-door.jpg" },
    { title: "Impossibly Deep Interior", src: "reference_images/return-impossibly-deep-interior.jpg" },
    { title: "Ilona's Departure", src: "reference_images/return-ilonas-departure.jpg" }
  ],
  shame: [
    { title: "Open Mirror Enclosure", src: "reference_images/cure-open-mirror-enclosure.jpg" },
    { title: "Alignment Mirror", src: "reference_images/cure-alignment-mirror.jpg" },
    { title: "Open Alignment and Hall Entrance", src: "reference_images/cure-open-alignment-and-hall-entrance.jpg" }
  ],
  finale: [
    { title: "Anchor Mirrors", src: "reference_images/unmade-anchor.jpg" },
    { title: "Lantern Area and Terminal Mirror", src: "reference_images/unmade-lantern-area-and-terminal-mirror.jpg" },
    { title: "Open Nave", src: "reference_images/unmade-open-nave.jpg" }
  ]
};

const state = {
  sceneIndex: 0,
  stepIndex: 0,
  selectedPieceId: null,
  manualPositions: {},
  gmOverlay: true
};

const elements = {
  tabs: document.querySelector("#sceneTabs"),
  board: document.querySelector("#board"),
  sceneKind: document.querySelector("#sceneKind"),
  sceneTitle: document.querySelector("#sceneTitle"),
  counters: document.querySelector("#sceneCounters"),
  stepNumber: document.querySelector("#stepNumber"),
  stepActor: document.querySelector("#stepActor"),
  stepTitle: document.querySelector("#stepTitle"),
  stepInstruction: document.querySelector("#stepInstruction"),
  tags: document.querySelector("#mechanicTags"),
  previous: document.querySelector("#previousStep"),
  next: document.querySelector("#nextStep"),
  reset: document.querySelector("#resetScene"),
  inspector: document.querySelector("#pieceInspector"),
  manifest: document.querySelector("#componentManifest"),
  gmOverlay: document.querySelector("#gmOverlay"),
  referencePanel: document.querySelector("#referencePanel"),
  referenceGallery: document.querySelector("#referenceGallery")
  ,rulesTitle: document.querySelector("#rulesTitle")
  ,ruleGoal: document.querySelector("#ruleGoal")
  ,ruleSetup: document.querySelector("#ruleSetup")
  ,ruleActions: document.querySelector("#ruleActions")
  ,ruleSolve: document.querySelector("#ruleSolve")
  ,ruleFailure: document.querySelector("#ruleFailure")
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function resolvedScene() {
  const base = scenes[state.sceneIndex];
  const result = {
    ...base,
    features: clone(base.features),
    pieces: clone(base.pieces),
    counters: clone(base.counters)
  };

  for (let index = 1; index <= state.stepIndex; index += 1) {
    const patch = base.steps[index].patch || {};
    Object.entries(patch.pieces || {}).forEach(([id, changes]) => {
      const piece = result.pieces.find((candidate) => candidate.id === id);
      if (piece) Object.assign(piece, changes);
    });
    Object.entries(patch.features || {}).forEach(([id, changes]) => {
      const feature = result.features.find((candidate) => candidate.id === id);
      if (feature) Object.assign(feature, changes);
    });
    Object.entries(patch.counters || {}).forEach(([id, value]) => {
      const counter = result.counters.find((candidate) => candidate.id === id);
      if (counter) counter.value = value;
    });
  }

  Object.entries(state.manualPositions).forEach(([id, position]) => {
    const piece = result.pieces.find((candidate) => candidate.id === id);
    if (piece) Object.assign(piece, position);
  });
  return result;
}

function renderTabs() {
  elements.tabs.innerHTML = "";
  scenes.forEach((scene, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `scene-tab${index === state.sceneIndex ? " active" : ""}`;
    button.textContent = scene.tab;
    button.addEventListener("click", () => {
      state.sceneIndex = index;
      state.stepIndex = 0;
      state.selectedPieceId = null;
      state.manualPositions = {};
      render();
    });
    elements.tabs.appendChild(button);
  });
}

function renderCoordinates(scene) {
  for (let col = 1; col <= scene.cols; col += 1) {
    const label = document.createElement("span");
    label.className = "coord col";
    label.style.left = `${(col - .5) * 100 / scene.cols}%`;
    label.textContent = String.fromCharCode(64 + col);
    elements.board.appendChild(label);
  }
  for (let row = 1; row <= scene.rows; row += 1) {
    const label = document.createElement("span");
    label.className = "coord row";
    label.style.top = `${(row - .5) * 100 / scene.rows}%`;
    label.textContent = row;
    elements.board.appendChild(label);
  }
}

function renderFeature(feature) {
  const node = document.createElement("div");
  node.className = `feature ${feature.type} ${feature.id}${feature.hidden ? " hidden" : ""}${feature.gmOnly ? " gm-only" : ""}`;
  node.style.setProperty("--x", feature.x);
  node.style.setProperty("--y", feature.y);
  node.style.setProperty("--w", feature.w);
  node.style.setProperty("--h", feature.h);
  node.textContent = feature.label || "";
  elements.board.appendChild(node);
}

function renderPiece(piece, scene) {
  if (piece.visible === false) return;
  const node = document.createElement("button");
  node.type = "button";
  node.className = `piece ${piece.type}${piece.state ? ` ${piece.state}` : ""}${piece.id === state.selectedPieceId ? " selected" : ""}`;
  node.dataset.pieceId = piece.id;
  node.style.setProperty("--x", piece.x);
  node.style.setProperty("--y", piece.y);
  if (piece.color) node.style.background = piece.color;
  if (piece.glow) node.style.setProperty("--glow", piece.glow);
  if (piece.type === "pc") node.style.setProperty("--pc-color", piece.color);
  if (piece.type === "reflection") node.style.setProperty("--reflection-color", piece.color);
  node.setAttribute("aria-label", `${piece.name}, ${coordinate(piece.x, piece.y)}`);

  if (USE_PORTRAITS && piece.image) {
    const image = document.createElement("img");
    image.src = piece.image;
    image.alt = "";
    image.addEventListener("error", () => {
      image.remove();
      const initials = document.createElement("span");
      initials.className = "initials";
      initials.textContent = piece.initials;
      node.prepend(initials);
    }, { once: true });
    node.appendChild(image);
  } else {
    const initials = document.createElement("span");
    initials.className = "initials";
    initials.textContent = piece.initials;
    node.appendChild(initials);
  }
  const label = document.createElement("span");
  label.className = "piece-label";
  label.textContent = piece.name;
  node.appendChild(label);

  node.addEventListener("click", () => {
    state.selectedPieceId = piece.id;
    render();
  });
  node.addEventListener("pointerdown", (event) => startDrag(event, piece, scene, node));
  elements.board.appendChild(node);
}

function startDrag(event, piece, scene, node) {
  event.preventDefault();
  state.selectedPieceId = piece.id;
  node.setPointerCapture(event.pointerId);
  node.classList.add("dragging");

  const move = (moveEvent) => {
    const rect = elements.board.getBoundingClientRect();
    const x = Math.max(1, Math.min(scene.cols, Math.round((moveEvent.clientX - rect.left) / rect.width * scene.cols + .5)));
    const y = Math.max(1, Math.min(scene.rows, Math.round((moveEvent.clientY - rect.top) / rect.height * scene.rows + .5)));
    node.style.setProperty("--x", x);
    node.style.setProperty("--y", y);
  };

  const end = (endEvent) => {
    const rect = elements.board.getBoundingClientRect();
    const x = Math.max(1, Math.min(scene.cols, Math.round((endEvent.clientX - rect.left) / rect.width * scene.cols + .5)));
    const y = Math.max(1, Math.min(scene.rows, Math.round((endEvent.clientY - rect.top) / rect.height * scene.rows + .5)));
    state.manualPositions[piece.id] = { x, y };
    node.releasePointerCapture(endEvent.pointerId);
    render();
  };

  node.addEventListener("pointermove", move);
  node.addEventListener("pointerup", end, { once: true });
  node.addEventListener("pointercancel", end, { once: true });
}

function coordinate(x, y) {
  return `${String.fromCharCode(64 + Math.round(x))}${Math.round(y)}`;
}

function renderCounters(scene) {
  elements.counters.innerHTML = "";
  scene.counters.forEach((counter) => {
    const tracker = document.createElement("div");
    tracker.className = `tracker ${counter.className || ""}`;
    const label = document.createElement("span");
    label.className = "tracker-label";
    label.textContent = `${counter.label}: ${counter.value}`;
    tracker.appendChild(label);
    const pips = document.createElement("span");
    pips.className = "tracker-pips";
    for (let index = 1; index <= counter.max; index += 1) {
      const pip = document.createElement("i");
      if (index <= counter.value) pip.className = "on";
      pips.appendChild(pip);
    }
    tracker.appendChild(pips);
    elements.counters.appendChild(tracker);
  });
}

function renderInspector(scene) {
  const piece = scene.pieces.find((candidate) => candidate.id === state.selectedPieceId && candidate.visible !== false);
  if (!piece) {
    elements.inspector.textContent = "Select a piece on the board.";
    return;
  }
  elements.inspector.innerHTML = "";
  const heading = document.createElement("div");
  heading.className = "inspector-title";
  const name = document.createElement("strong");
  name.textContent = piece.name;
  const coord = document.createElement("span");
  coord.className = "coordinate-badge";
  coord.textContent = coordinate(piece.x, piece.y);
  heading.append(name, coord);
  const note = document.createElement("div");
  note.textContent = piece.note || `${piece.type} piece`;
  elements.inspector.append(heading, note);
}

function renderStep(scene) {
  const step = scene.steps[state.stepIndex];
  elements.stepNumber.textContent = `Step ${state.stepIndex + 1} of ${scene.steps.length}`;
  elements.stepActor.textContent = step.actor;
  elements.stepTitle.textContent = step.title;
  elements.stepInstruction.textContent = step.instruction;
  elements.tags.innerHTML = "";
  step.tags.forEach((tag) => {
    const chip = document.createElement("span");
    chip.textContent = tag;
    elements.tags.appendChild(chip);
  });
  elements.previous.disabled = state.stepIndex === 0;
  elements.next.disabled = state.stepIndex === scene.steps.length - 1;
  elements.next.textContent = state.stepIndex === scene.steps.length - 1 ? "Complete" : "Next";
}

function renderManifest(scene) {
  elements.manifest.innerHTML = "";
  scene.manifest.forEach((item) => {
    const line = document.createElement("li");
    line.textContent = item;
    elements.manifest.appendChild(line);
  });
}

function renderReferences(scene) {
  const references = sceneReferences[scene.id] || [];
  elements.referencePanel.hidden = references.length === 0;
  elements.referenceGallery.replaceChildren(...references.map((reference) => {
    const link = document.createElement("a");
    link.className = "reference-card";
    link.href = reference.src;
    link.target = "_blank";
    link.rel = "noopener";

    const image = document.createElement("img");
    image.src = reference.src;
    image.alt = reference.title;
    const label = document.createElement("span");
    label.textContent = reference.title;
    link.append(image, label);
    return link;
  }));
}

function fillRuleList(element, items) {
  element.innerHTML = "";
  items.forEach((item) => {
    const line = document.createElement("li");
    line.textContent = item;
    element.appendChild(line);
  });
}

function renderRules(scene) {
  elements.rulesTitle.textContent = scene.title;
  elements.ruleGoal.textContent = scene.rules.goal;
  fillRuleList(elements.ruleSetup, scene.rules.setup);
  fillRuleList(elements.ruleActions, scene.rules.actions);
  fillRuleList(elements.ruleSolve, scene.rules.solve);
  elements.ruleFailure.textContent = scene.rules.failure;
}

function render() {
  const scene = resolvedScene();
  document.body.classList.toggle("show-gm", state.gmOverlay);
  renderTabs();
  elements.sceneKind.textContent = scene.kind;
  elements.sceneTitle.textContent = scene.title;
  elements.board.className = `board ${scene.boardClass}`;
  elements.board.style.setProperty("--cols", scene.cols);
  elements.board.style.setProperty("--rows", scene.rows);
  elements.board.innerHTML = "";
  renderCoordinates(scene);
  scene.features.forEach(renderFeature);
  scene.pieces.forEach((piece) => renderPiece(piece, scene));
  renderCounters(scene);
  renderStep(scene);
  renderInspector(scene);
  renderManifest(scene);
  renderReferences(scene);
  renderRules(scene);
}

elements.previous.addEventListener("click", () => {
  if (state.stepIndex > 0) {
    state.stepIndex -= 1;
    state.manualPositions = {};
    render();
  }
});

elements.next.addEventListener("click", () => {
  const scene = scenes[state.sceneIndex];
  if (state.stepIndex < scene.steps.length - 1) {
    state.stepIndex += 1;
    state.manualPositions = {};
    render();
  }
});

elements.reset.addEventListener("click", () => {
  state.stepIndex = 0;
  state.selectedPieceId = null;
  state.manualPositions = {};
  render();
});

elements.gmOverlay.addEventListener("change", (event) => {
  state.gmOverlay = event.target.checked;
  render();
});

render();