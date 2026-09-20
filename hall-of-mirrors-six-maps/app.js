const PORTRAITS = "portraits/";
const USE_PORTRAITS = true;

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
      goal: "Decode the mirror's hidden four-PC sequence using Mastermind feedback.",
      setup: ["Place four ordered stations before the mirror: Crown, Eye, Key, and Flame.", "Place three unnumbered witness circles behind the code row.", "Secret code, west to east: ochre, blue, teal, red (P4, P1, P6, P2)."],
      actions: ["Choose four PCs and place them on Crown, Eye, Key, and Flame in order.", "Place the remaining three PCs on the witness circles, then knock once to submit.", "Read the mirror's black and white shards, rearrange the party, and submit again."],
      solve: ["Each black shard means one chosen PC is on the correct station.", "Each white shard means one chosen PC belongs in the code but stands on the wrong station.", "The shards never reveal which PCs they score.", "Four black shards shift the whole room and all seven PCs into the Gloamglass."],
      failure: "Wrong attempts cause no harm. The mirror clears its shards when any PC leaves a station, allowing another guess."
    },
    manifest: ["10 x 7 square floor mat", "1 two-square Honest Mirror", "7 PC miniatures with colored bases", "4 ordered symbol stations", "3 witness circles", "4 black and 4 white feedback shards", "1 Gloamglass overlay"],
    features: [
      { id:"hm", type:"mirror", x:8, y:2, w:2, h:4, label:"HONEST MIRROR" },
      { id:"prompt", type:"zone", x:3, y:1, w:5, h:1, label:"FOUR BEFORE THE GLASS. THREE BEAR WITNESS. KNOCK TO BE JUDGED." },
      { id:"crown", type:"rune", x:4, y:3, w:1, h:1, label:"CROWN" },
      { id:"eye", type:"rune", x:5, y:3, w:1, h:1, label:"EYE" },
      { id:"key", type:"rune", x:6, y:3, w:1, h:1, label:"KEY" },
      { id:"flame", type:"rune", x:7, y:3, w:1, h:1, label:"FLAME" },
      { id:"witness1", type:"zone", x:4, y:5, w:1, h:1, label:"WITNESS" },
      { id:"witness2", type:"zone", x:5.5, y:5, w:1, h:1, label:"WITNESS" },
      { id:"witness3", type:"zone", x:7, y:5, w:1, h:1, label:"WITNESS" },
      { id:"shift", type:"portal", x:1, y:1, w:10, h:7, label:"THE WHOLE ROOM SHIFTS INTO THE GLOAMGLASS", hidden:true }
    ],
    pieces: [
      ...pcPieces([[2,2],[2,3],[2,4],[2,5],[2,6],[3,3],[3,5]])
    ],
    counters: [
      { id:"exact", label:"Black shards", max:4, value:0 },
      { id:"misplaced", label:"White shards", max:4, value:0 }
    ],
    steps: [
      { actor:"GM setup", title:"Four are judged; three bear witness", instruction:"The Crown, Eye, Key, and Flame stations shine before the mirror. Three dim circles wait behind them. The mirror contains eight empty shard-shaped sockets.", tags:["Mastermind", "Hidden code"] },
      { actor:"Party", title:"First attempt", instruction:"Place P1, P2, P3, and P4 on Crown through Flame; put P5, P6, and P7 on the witness circles. Knock once. The mirror gives 0 black and 3 white shards.", tags:["0 exact", "3 present"], patch:{ pieces:{pc1:{x:4,y:3},pc2:{x:5,y:3},pc3:{x:6,y:3},pc4:{x:7,y:3},pc5:{x:4,y:5},pc6:{x:5.5,y:5},pc7:{x:7,y:5}}, counters:{misplaced:3} } },
      { actor:"Party", title:"Second attempt", instruction:"Try P4, P3, P2, P1. The mirror gives 1 black and 2 white shards: one station is exact, and two other chosen PCs belong elsewhere in the code.", tags:["1 exact", "2 misplaced"], patch:{ pieces:{pc4:{x:4,y:3},pc3:{x:5,y:3},pc2:{x:6,y:3},pc1:{x:7,y:3},pc5:{x:4,y:5},pc6:{x:5.5,y:5},pc7:{x:7,y:5}}, counters:{exact:1,misplaced:2} } },
      { actor:"Party", title:"Third attempt", instruction:"Try P4, P1, P5, P2. The mirror gives 3 black and 0 white. P4, P1, and P2 are fixed; P5 is not the missing third-station PC.", tags:["3 exact", "Eliminate P5"], patch:{ pieces:{pc4:{x:4,y:3},pc1:{x:5,y:3},pc5:{x:6,y:3},pc2:{x:7,y:3},pc3:{x:4,y:5},pc6:{x:5.5,y:5},pc7:{x:7,y:5}}, counters:{exact:3,misplaced:0} } },
      { actor:"Party", title:"Final attempt", instruction:"Only P6 and P7 can fill the Key station. Test P6 with P4, P1, P6, P2. Four black shards confirm the code; three would identify P7 instead.", tags:["Binary test", "4 exact"], patch:{ pieces:{pc4:{x:4,y:3},pc1:{x:5,y:3},pc6:{x:6,y:3},pc2:{x:7,y:3},pc3:{x:4,y:5},pc5:{x:5.5,y:5},pc7:{x:7,y:5}}, counters:{exact:4,misplaced:0} } },
      { actor:"The Honest Mirror", title:"The road moves around them", instruction:"All reflections turn together. Without crossing the glass or taking a step, the party and the room shift into the Gloamglass. Replace this map with The First Visit.", tags:["Automatic transition", "No mirror crossing"], patch:{ features:{shift:{hidden:false},hm:{hidden:true},prompt:{hidden:true}} } }
    ]
  },
  {
    id: "pain",
    tab: "4. Razor Waste",
    kind: "Gloamglass traversal encounter",
    title: "The Razor Waste",
    boardClass: "gloam",
    cols: 14,
    rows: 10,
    rules: {
      goal: "Follow Pavel's burned, bloodied trail across the Waste without surrendering Pain to the Fearless.",
      setup: ["Place the party at ENTRY and two Fearless beyond the central vent.", "Lay the fissure, fire vent, razor field, and Pavel trail tiles as shown.", "Keep one red discarded-Pain token beside the board for each PC."],
      actions: ["Cross a marked hazard with DC 14 Athletics, Acrobatics, or a credible tool or spell.", "On failure, suffer the hazard and remain on the near edge, or shed Pain and complete the crossing.", "Recover your adjacent Pain with an action before a Fearless reaches it."],
      solve: ["Move all PCs through the EXIT arch.", "Fearless move 4 squares toward the nearest discarded fear at initiative 20 and consume it when adjacent.", "Pavel's trail reveals that he still felt every wound but no longer understood pain as a reason to stop."],
      failure: "Normal failure costs: fissure 3d6 slashing and return to the near edge; vent 3d8 fire; razor field 4d6 slashing and stop on its first square. Shedding Pain avoids that cost but leaves the owner's red token behind. A Fearless that consumes it heals, gains a burning touch, and carries the fear until defeated or restrained for extraction."
    },
    manifest: ["14 x 10 black-glass grid", "7 PC miniatures", "2 Fearless miniatures", "1 fissure strip: 1 x 8", "1 fire vent: 2 x 2", "1 razor field: 2 x 7", "6 bloody footprint markers", "7 owner-marked red Pain tokens", "1 exit arch", "3 Missing Fear markers per PC"],
    features: [
      {id:"entry",type:"portal",x:1,y:4,w:1,h:3,label:"ENTRY"},
      {id:"fissure",type:"void",x:4,y:2,w:1,h:7,label:"BLACK FISSURE\nDC 14"},
      {id:"vent",type:"hazard",x:7,y:4,w:2,h:2,label:"FIRE VENT\nDC 14"},
      {id:"razors",type:"hazard",x:10,y:2,w:2,h:7,label:"RAZOR GLASS\nDC 14"},
      {id:"trail1",type:"path",x:2,y:5,w:2,h:1,label:"BLOODY PRINTS"},
      {id:"trail2",type:"path",x:5,y:4,w:2,h:1,label:"BURNED PRINTS"},
      {id:"trail3",type:"path",x:8,y:6,w:2,h:1,label:"NO DETOUR"},
      {id:"exit",type:"portal",x:14,y:4,w:1,h:3,label:"TO THE GALLERY"}
    ],
    pieces: [
      ...pcPieces([[2,4],[2,5],[2,6],[3,3],[3,4],[3,6],[3,7]]),
      {id:"fearless1",name:"Fearless Wanderer",initials:"F1",type:"enemy",image:`${PORTRAITS}FearlessBefore.png`,x:8,y:2,note:"Moves toward discarded fear before attacking anyone."},
      {id:"fearless2",name:"Fearless Wanderer",initials:"F2",type:"enemy",image:`${PORTRAITS}FearlessBefore.png`,x:11,y:9,note:"Walks through razor glass without protecting herself."},
      {id:"red",name:"PC 2's Discarded Pain",initials:"R",type:"object",image:`${PORTRAITS}DiscardedFearPain.png`,x:7,y:5,visible:false,color:"#bd3c35",glow:"#f05249",note:"Small, frightened, alive, and still owned by the character who shed it."}
    ],
    counters:[{id:"across",label:"PCs across",max:7,value:0},{id:"missing",label:"Fears missing",max:3,value:0},{id:"clock",label:"Unreflected",max:4,value:0}],
    steps:[
      {actor:"GM setup",title:"Pavel crossed without turning",instruction:"The trail passes straight through every hazard. Read the wounds in order: cut feet, burned palms, then deeper cuts. Nothing suggests he stopped or chose safer ground.",tags:["Physical evidence","Pain clue"]},
      {actor:"PC 2",title:"The vent catches a character",instruction:"PC 2 fails the fire-vent check and chooses the Gloamglass's rescue. Move PC 2 across the vent, reveal their red Pain at the failed square, and mark one fear missing.",tags:["Shed Pain","Hazard succeeds"],patch:{pieces:{pc2:{x:9,y:5},red:{visible:true}},counters:{missing:1,clock:1}}},
      {actor:"Initiative 20",title:"The Fearless smells warning",instruction:"Move F1 four squares toward the red token. Its calm face breaks into hunger; it ignores every PC not carrying discarded fear.",tags:["Predator priority","Four-square move"],patch:{pieces:{fearless1:{x:8,y:4}}}},
      {actor:"PC 3",title:"Recover the warning",instruction:"PC 3 crosses normally, reaches the red token first, and spends an action returning it to PC 2. Hide the token and clear Missing Pain; pain and panic strike PC 2 at once.",tags:["Fear recovered","Owner restored"],patch:{pieces:{pc3:{x:8,y:5},red:{visible:false}},counters:{missing:0}}},
      {actor:"Party",title:"Reach the far arch",instruction:"Move all seven PCs through the exit. The Fearless do not pursue beyond the arch. The last footprint points toward mirrors full of people calling Pavel's name.",tags:["7 PCs across","Level complete"],patch:{pieces:{pc1:{x:13,y:3},pc2:{x:13,y:4},pc3:{x:13,y:5},pc4:{x:13,y:6},pc5:{x:12,y:3},pc6:{x:12,y:5},pc7:{x:12,y:7}},counters:{across:7}}}
    ]
  },
  {
    id: "loss",
    tab: "5. Severed Bonds",
    kind: "Gloamglass rescue encounter",
    title: "The Gallery of Severed Bonds",
    boardClass: "gloam",
    cols: 14,
    rows: 10,
    rules: {
      goal: "Free Ilona's living reflection and carry her mirror shard out of the gallery.",
      setup: ["Build four mirror islands over the bottomless glass and connect them with three cracked bridges.", "Place Ilona's reflection in the far frame, three other captives in side frames, and one Fearless on the central island.", "Place the Unreflected beneath the middle bridge and keep the blue Loss token ready."],
      actions: ["Cross a cracked bridge with DC 14 Acrobatics, Athletics, or a securing tool or spell.", "Free a captive reflection with an adjacent action; Ilona's frame becomes a carried shard.", "On a failed crossing, fall back and take 3d6 damage, or shed Loss and arrive safely."],
      solve: ["Free Ilona's reflection and bring her shard through the EXIT.", "Ilona reports that Pavel saw her calling and walked past without recognizing the danger of losing her.", "Keep Ilona's shard: it makes Pavel's blue fear recognize him in the finale."],
      failure: "Shed Loss leaves a blue token on the bridge and makes its owner indifferent to separated allies. A Fearless that consumes it can step between mirror frames and will seize Ilona's shard."
    },
    manifest: ["14 x 10 black-glass grid", "4 mirror-island tiles", "3 cracked bridge tiles", "4 freestanding captive mirrors", "7 PC miniatures", "1 Fearless miniature", "1 Unreflected silhouette", "1 removable Ilona reflection shard", "7 owner-marked blue Loss tokens", "1 exit arch"],
    features: [
      {id:"void",type:"void",x:1,y:1,w:14,h:10,label:"BOTTOMLESS REFLECTION"},
      {id:"island1",type:"island",x:1,y:3,w:3,h:5,label:"ENTRY ISLAND"},
      {id:"bridge1",type:"bridge",x:4,y:4,w:2,h:1,label:"CRACKED"},
      {id:"island2",type:"island",x:6,y:2,w:3,h:4,label:"CENTRAL MIRRORS"},
      {id:"bridge2",type:"bridge",x:8,y:6,w:2,h:1,label:"CRACKED"},
      {id:"island3",type:"island",x:10,y:5,w:3,h:4,label:"ILONA'S FRAME"},
      {id:"bridge3",type:"bridge",x:12,y:4,w:2,h:1,label:"CRACKED"},
      {id:"island4",type:"island",x:13,y:2,w:2,h:3,label:"EXIT"},
      {id:"exit",type:"portal",x:14,y:2,w:1,h:3,label:"TO LANTERN ROAD"}
    ],
    pieces:[
      ...pcPieces([[2,3],[2,4],[2,5],[2,6],[3,3],[3,5],[3,7]]),
      {id:"captive1",name:"Captive Reflection",initials:"CR",type:"reflection",image:`${PORTRAITS}CaptiveReflections.png`,x:7,y:2,note:"Its living owner lies catatonic somewhere in Barovia."},
      {id:"captive2",name:"Captive Reflection",initials:"CR",type:"reflection",image:`${PORTRAITS}CaptiveReflections.png`,x:8,y:4,note:"It silently mouths a distant owner's name."},
      {id:"captive3",name:"Captive Reflection",initials:"CR",type:"reflection",image:`${PORTRAITS}CaptiveReflections.png`,x:11,y:8,note:"Its frame shows a different Barovian home behind it."},
      {id:"ilona",name:"Ilona's Captive Reflection",initials:"I",type:"npc",image:`${PORTRAITS}CaptiveReflections.png`,x:11,y:6,note:"She saw Pavel pass and can still call his blue fear home."},
      {id:"fearless1",name:"Fearless Collector",initials:"F",type:"enemy",image:`${PORTRAITS}FearlessBefore.png`,x:7,y:5,note:"If fed Loss, it can step from one mirror frame to another."},
      {id:"unreflected",name:"The Unreflected Below",initials:"U",type:"enemy",image:`${PORTRAITS}UnreflectedMirror.png`,x:9,y:7,note:"It exists only beneath the glass and advances when fear is lost."},
      {id:"blue",name:"PC 5's Discarded Loss",initials:"B",type:"object",image:`${PORTRAITS}DiscardedFearLoss.png`,x:9,y:6,visible:false,color:"#397fc0",glow:"#5ba7ec",note:"Two cold hands almost touching; it crawls after its owner."}
    ],
    counters:[{id:"captives",label:"Captives freed",max:4,value:0},{id:"ilonaSafe",label:"Ilona secured",max:1,value:0},{id:"clock",label:"Unreflected",max:4,value:1}],
    steps:[
      {actor:"Ilona's reflection",title:"She recognizes the rescuers",instruction:"From the far frame Ilona calls Pavel's name. She says he looked directly at her, heard her, and continued after the Wraith without reaching back.",tags:["Live witness","Loss clue"]},
      {actor:"PC 5",title:"The bridge gives way",instruction:"PC 5 fails the middle bridge check and sheds Loss. Move them safely to Ilona's island, reveal their blue token on the bridge, and advance the Unreflected.",tags:["Shed Loss","Separated without concern"],patch:{pieces:{pc5:{x:10,y:6},blue:{visible:true}},counters:{clock:2}}},
      {actor:"Initiative 20",title:"Loss teaches the Fearless to step",instruction:"The Fearless reaches and consumes the blue token. Replace it with the Loss-fed state; it can now move between any two captive mirrors as four squares of movement.",tags:["Blue consumed","Mirror-step"],patch:{pieces:{blue:{visible:false},fearless1:{x:8,y:4,name:"Loss-Fed Fearless",initials:"FL",image:`${PORTRAITS}FearlessLoss.png`,state:"fed-loss"}},counters:{clock:3}}},
      {actor:"Party",title:"Free Ilona's shard",instruction:"Two PCs hold off the Fearless while PC 5 uses an action to lift Ilona's reflection from its frame. Her token now represents a carried mirror shard.",tags:["Objective secured","Finale key"],patch:{pieces:{ilona:{x:10,y:6,state:"freed"}},counters:{captives:1,ilonaSafe:1}}},
      {actor:"Party",title:"Carry the bond forward",instruction:"Move Ilona's shard and the party through the exit. Her voice continues from the carried glass: 'He did not stop because losing me no longer frightened him.'",tags:["Ilona secured","Level complete"],patch:{pieces:{ilona:{x:14,y:3},pc1:{x:13,y:2},pc2:{x:13,y:3},pc3:{x:13,y:4},pc4:{x:14,y:2},pc5:{x:14,y:4},pc6:{x:12,y:3},pc7:{x:12,y:4}}}}
    ]
  },
  {
    id: "shame",
    tab: "6. Lantern Road",
    kind: "Gloamglass pursuit encounter",
    title: "The Lantern Road",
    boardClass: "gloam",
    cols: 14,
    rows: 10,
    rules: {
      goal: "Catch the Lantern Wraith and Pavel without buying speed through deliberate harm.",
      setup: ["Place Pavel and the Wraith ahead beside the Hall portal; set Pursuit Delay to 0.", "Build three road stations: the trapped wanderer, the captive mirror, and the counterweight victim.", "Place one Fearless behind the party and keep white Conscience tokens ready."],
      actions: ["At each station, take the compassionate route with an action and DC 14 ability check, tool, or spell.", "Alternatively, use the printed cruel shortcut automatically without adding Pursuit Delay.", "After a failed compassionate attempt, add one Pursuit Delay and retry, or shed Conscience to succeed immediately."],
      solve: ["Clear all three stations and reach the Hall portal.", "At 0-2 Pursuit Delay, begin the finale at Open Door 0; at 3, begin at Open Door 1.", "Pavel reaches the apparatus alive either way: delay changes the rescue position, not access to the finale."],
      failure: "Shed Conscience leaves a white token and makes its owner treat harmful shortcuts as ordinary. A Fearless that consumes it becomes calculating, operates road mechanisms, and coordinates the others."
    },
    manifest: ["14 x 10 black-glass grid", "7 PC miniatures", "Pavel miniature", "Lantern Wraith miniature", "1 Fearless miniature", "1 Unreflected silhouette", "3 road-station tiles", "1 trapped wanderer", "1 captive reflection", "1 counterweight victim", "7 owner-marked white Conscience tokens", "3 Pursuit Delay counters", "1 Hall portal"],
    features:[
      {id:"road",type:"road",x:1,y:4,w:13,h:3,label:"LANTERN ROAD"},
      {id:"station1",type:"choice",x:4,y:2,w:2,h:6,label:"FREE WANDERER\nOR ABANDON THEM"},
      {id:"station2",type:"choice",x:7,y:2,w:2,h:6,label:"RELEASE MIRROR\nOR SHATTER IT"},
      {id:"station3",type:"choice",x:10,y:2,w:2,h:6,label:"LIFT VICTIM\nOR DROP THEM"},
      {id:"exit",type:"portal",x:14,y:4,w:1,h:3,label:"HALL OF\nUNMADE SCREAMS"}
    ],
    pieces:[
      ...pcPieces([[2,3],[2,4],[2,5],[2,6],[3,3],[3,5],[3,7]]),
      {id:"wanderer",name:"Trapped Wanderer",initials:"V1",type:"npc",x:5,y:6,note:"Freeing them preserves the road; abandoning them lowers the first bridge immediately."},
      {id:"captive",name:"Captive Reflection",initials:"V2",type:"reflection",image:`${PORTRAITS}CaptiveReflections.png`,x:8,y:3,note:"Opening its frame takes time; shattering it creates an instant path."},
      {id:"victim",name:"Counterweight Victim",initials:"V3",type:"npc",x:11,y:7,note:"Lifting them opens the gate; dropping them opens it immediately."},
      {id:"fearless1",name:"Following Fearless",initials:"F",type:"enemy",image:`${PORTRAITS}FearlessBefore.png`,x:1,y:8,note:"White fear turns this pursuer into a planner."},
      {id:"pavel",name:"Pavel",initials:"P",type:"npc",image:`${PORTRAITS}PavelExtraction.png`,x:13,y:5,note:"He follows calmly despite his burned hands and cut feet."},
      {id:"wraith",name:"Lantern Wraith",initials:"LW",type:"enemy",image:`${PORTRAITS}LanternWraith.png`,x:12,y:5,note:"It calls every cruel shortcut efficient, never mandatory."},
      {id:"unreflected",name:"The Unreflected in the Road",initials:"U",type:"enemy",image:`${PORTRAITS}UnreflectedMirror.png`,x:13,y:8,note:"Every road mirror shows it directly behind Pavel."},
      {id:"white",name:"PC 6's Discarded Conscience",initials:"W",type:"object",image:`${PORTRAITS}DiscardedFearConscience.png`,x:10,y:5,visible:false,color:"#d9d3c4",glow:"#fffbe8",note:"A milky shard that watches the harm its owner permits."}
    ],
    counters:[{id:"stations",label:"Stations cleared",max:3,value:0},{id:"delay",label:"Pursuit delay",max:3,value:0},{id:"clock",label:"Unreflected",max:4,value:3}],
    steps:[
      {actor:"GM setup",title:"The Wraith offers efficiency",instruction:"The Wraith leads Pavel toward the Hall. At every station it describes the cruel shortcut in the same patient voice: 'You may save them after you are safe, if there is time.'",tags:["Live pursuit","Three choices"]},
      {actor:"Party",title:"Free the trapped wanderer",instruction:"A PC succeeds at the first compassionate check and frees the wanderer before lowering the bridge. Mark one station cleared; Pursuit Delay remains 0.",tags:["Compassion succeeds","No fear shed"],patch:{pieces:{wanderer:{x:3,y:3,state:"freed"}},counters:{stations:1}}},
      {actor:"PC 6",title:"Fail at the captive mirror",instruction:"PC 6 fails to open the second frame and chooses to shed Conscience. The frame opens immediately; reveal the white token where hesitation was removed.",tags:["Shed Conscience","Automatic success"],patch:{pieces:{captive:{x:7,y:3,state:"freed"},white:{visible:true}},counters:{stations:2,clock:4}}},
      {actor:"Initiative 20",title:"The Fearless learns to plan",instruction:"The pursuer consumes the white token. Replace it with the Conscience-fed state. It releases the final counterweight itself, dropping the victim; its efficient cruelty adds no Pursuit Delay.",tags:["White consumed","Coordinated enemy"],patch:{pieces:{white:{visible:false},fearless1:{x:10,y:6,name:"Conscience-Fed Fearless",initials:"FC",image:`${PORTRAITS}FearlessConscience.png`,state:"fed-conscience"},victim:{x:11,y:9,state:"fallen"}},counters:{stations:3}}},
      {actor:"Party",title:"Enter the Hall one step behind",instruction:"Move the party through the portal as the Wraith places Pavel beneath the extractor. Pursuit Delay is below 3, so start the finale with no Open Door marks. Carry Ilona's shard onto the next map.",tags:["Finale reached","Open Door 0"],patch:{pieces:{pc1:{x:13,y:3},pc2:{x:13,y:4},pc3:{x:13,y:5},pc4:{x:13,y:6},pc5:{x:12,y:3},pc6:{x:12,y:5},pc7:{x:12,y:7},pavel:{x:14,y:5},wraith:{x:14,y:4}}}}
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
      goal: "Free Pavel's three living fears, keep them from the Fearless, and return them before the Unreflected uses him as a doorway.",
      setup: ["Place Pavel beneath the extractor, the Unreflected in every terminal mirror, and the Wraith beside the controls.", "Place red, blue, and white fear on the extractor; place three Fearless in the nave.", "Set Round to 1, Open Door to the Lantern Road result, and Fears Restored to 0. Bring Ilona's shard if rescued."],
      actions: ["Open a shutter: adjacent action and DC 15 Sleight of Hand, Arcana, Religion, or tool; DC 17 Athletics also works.", "Carry or pass a freed fear. At initiative 20 each Fearless moves 4 squares toward the nearest free fear and consumes it when adjacent.", "Return fear with an adjacent action when its recognition condition is physically present. A consumed fear drops if its carrier is defeated, or can be extracted from a restrained carrier with a DC 15 action."],
      solve: ["Pain recognizes Pavel when someone pulls him away from immediate harm.", "Loss recognizes Ilona's drawing, voice, or rescued reflection.", "Conscience recognizes clear evidence of the harm his choices caused Ilona.", "After all three return, extinguish, reform, or claim the extractor and lantern."],
      failure: "At initiative 20, add one Open Door mark when restored fears are fewer than the round number. At three marks, the party has until the end of the next round to restore any fear or the Unreflected crosses through Pavel."
    },
    manifest:["14 x 10 black-glass cathedral grid", "7 PC miniatures", "Pavel extraction miniature", "Large Lantern Wraith miniature", "Unreflected mirror silhouette", "1 fear extractor", "3 Fearless miniatures plus 3 mutation state cards each", "1 red Pain creature", "1 blue Loss creature", "1 white Conscience creature", "1 Ilona reflection shard", "6 terminal mirror pillars", "3 Open Door counters", "1 round marker"],
    features:[
      {id:"a1",type:"mirror",x:2,y:1,w:1,h:2,label:"TERMINAL"},{id:"a2",type:"mirror",x:7,y:1,w:1,h:2,label:"TERMINAL"},{id:"a3",type:"mirror",x:12,y:1,w:1,h:2,label:"TERMINAL"},
      {id:"a4",type:"mirror",x:2,y:9,w:1,h:2,label:"TERMINAL"},{id:"a5",type:"mirror",x:7,y:9,w:1,h:2,label:"TERMINAL"},{id:"a6",type:"mirror",x:12,y:9,w:1,h:2,label:"TERMINAL"},
      {id:"lantern-zone",type:"zone",x:9,y:4,w:3,h:3,label:"FEAR EXTRACTOR"},
      {id:"pavel-zone",type:"zone",x:12,y:4,w:2,h:3,label:"PAVEL"},
      {id:"entry",type:"portal",x:1,y:4,w:1,h:3,label:"ENTRY"}
    ],
    pieces:[
      ...pcPieces([[2,4],[2,5],[2,6],[3,3],[3,4],[3,6],[3,7]]),
      {id:"wraith",name:"Lantern Wraith",initials:"LW",type:"enemy",image:`${PORTRAITS}LanternWraith.png`,x:8,y:5,note:"It can pass through terminal mirrors and operate the extractor from any one of them."},
      {id:"pavel",name:"Pavel Under Extraction",initials:"P",type:"npc",image:`${PORTRAITS}PavelExtraction.png`,x:13,y:5,note:"Pull him from immediate harm, return Ilona to him, and show him what his choices cost."},
      {id:"unreflected",name:"The Unreflected",initials:"U",type:"enemy",image:`${PORTRAITS}UnreflectedMirror.png`,x:14,y:5,note:"A doorway countdown, not a creature with hit points."},
      {id:"lantern",name:"Fear Extractor",initials:"FX",type:"light",image:`${PORTRAITS}FearExtractor.png`,x:10,y:5,note:"Each shutter holds one living piece of Pavel's fear."},
      {id:"fearless1",name:"Fearless Seeker",initials:"F1",type:"enemy",image:`${PORTRAITS}FearlessBefore.png`,x:6,y:3,note:"Moves toward free fear at initiative 20."},
      {id:"fearless2",name:"Fearless Seeker",initials:"F2",type:"enemy",image:`${PORTRAITS}FearlessBefore.png`,x:6,y:5,note:"Consumes fear only when adjacent to it."},
      {id:"fearless3",name:"Fearless Seeker",initials:"F3",type:"enemy",image:`${PORTRAITS}FearlessBefore.png`,x:6,y:7,note:"A consumed fear remains recoverable from this carrier."},
      {id:"ilona",name:"Ilona's Reflection Shard",initials:"I",type:"npc",image:`${PORTRAITS}CaptiveReflections.png`,x:3,y:5,note:"If rescued, her voice makes Pavel's Loss recognize him."},
      {id:"red",name:"Pavel's Pain",initials:"R",type:"object",image:`${PORTRAITS}DiscardedFearPain.png`,x:10,y:4,color:"#bd3c35",glow:"#f05249",note:"Recognition: pull Pavel away from immediate harm."},
      {id:"blue",name:"Pavel's Loss",initials:"B",type:"object",image:`${PORTRAITS}DiscardedFearLoss.png`,x:10,y:5,color:"#397fc0",glow:"#5ba7ec",note:"Recognition: Ilona's drawing, voice, or reflection."},
      {id:"white",name:"Pavel's Conscience",initials:"W",type:"object",image:`${PORTRAITS}DiscardedFearConscience.png`,x:10,y:6,color:"#d9d3c4",glow:"#fffbe8",note:"Recognition: evidence of the harm Pavel's choices caused Ilona."}
    ],
    counters:[{id:"round",label:"Round",max:4,value:1},{id:"door",label:"Open Door",max:3,value:0},{id:"flames",label:"Fears restored",max:3,value:0,className:"flames"}],
    steps:[
      {actor:"GM setup",title:"Three living fears under glass",instruction:"Put each fear on its extractor shutter, Pavel in the restraint zone, Ilona's shard with the party, and three Fearless in the nave. Every terminal mirror shows the Unreflected behind Pavel.",tags:["Initiative begins","Round 1"]},
      {actor:"PC 1",title:"Free Pain",instruction:"PC 1 opens the red shutter and moves Pain into the nave. It recoils from the extractor and whimpers in Pavel's voice; the Fearless immediately turn toward it.",tags:["DC 15 shutter","Living objective"],patch:{pieces:{pc1:{x:9,y:4},red:{x:9,y:3,state:"freed"}}}},
      {actor:"PC 2",title:"Make Pain recognize Pavel",instruction:"PC 2 pulls Pavel out of the burning restraint beam, then presses red into his reflection. The returned warning hits him as pain and panic; put R beneath his base.",tags:["Physical recognition","Fear restored"],patch:{pieces:{pc2:{x:12,y:4},pavel:{x:12,y:5},red:{x:12,y:5,state:"restored"}},counters:{flames:1}}},
      {actor:"Initiative 20",title:"Pavel meets the round threshold",instruction:"At the start of Round 2 he has one restored fear, matching the previous round requirement. Add no Open Door mark.",tags:["Round 2","Door remains 0"],patch:{counters:{round:2}}},
      {actor:"PCs 3-4",title:"Return Loss with Ilona",instruction:"PC 3 frees blue while PC 4 carries Ilona's shard to Pavel. Her reflection says his name; Loss crawls to him and bursts back as grief and desperate attachment.",tags:["Ilona required","Fear restored"],patch:{pieces:{pc3:{x:9,y:5},pc4:{x:12,y:6},ilona:{x:12,y:6},blue:{x:12,y:5,state:"restored"}},counters:{flames:2}}},
      {actor:"PCs 5-6",title:"Return Conscience with consequence",instruction:"PC 5 frees white. PC 6 shows Pavel Ilona's trapped reflection and the wounds he accepted while she searched for him. The watching shard returns as remorse.",tags:["Evidence, not speech puzzle","Fear restored"],patch:{pieces:{pc5:{x:9,y:6},pc6:{x:11,y:5},white:{x:12,y:5,state:"restored"}},counters:{flames:3}}},
      {actor:"PC 7",title:"Resolve the apparatus",instruction:"Choose: destroy it and seal this route, bind it so fear can only be removed with continuing consent, or claim it and accept responsibility for the breach it carries. The restored Pavel expels the Unreflected.",tags:["Ending choice","Unreflected expelled"],patch:{pieces:{pc7:{x:10,y:5},unreflected:{visible:false},wraith:{x:8,y:2}},counters:{round:3,door:0,flames:3}}}
    ]
  }
];

const sceneReferences = {
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