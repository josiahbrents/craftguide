//DATA-START
const RECIPES=[],TAGS={};
const tag=(n,m)=>{TAGS[n]=m;return n};
const LAY={1:[4],2:[3,4],3:[3,4,5],4:[0,1,3,4]};
function sh(out,n,pat,key,cat,note){
  const rows=pat.split('/'),h=rows.length,w=rows[0].length;
  rows.forEach(r=>{if(r.length!==w)throw new Error('ragged '+out)});
  const ox=(3-w)>>1,oy=(3-h)>>1,grid=Array(9).fill(null);
  rows.forEach((r,y)=>[...r].forEach((ch,x)=>{if(ch==='.')return;const it=key[ch];if(!it)throw new Error('key '+ch+' '+out);grid[(y+oy)*3+x+ox]=it}));
  RECIPES.push({out,n,type:'shaped',grid,w,h,cat,note});
}
function sl(out,n,items,cat,note){
  const grid=Array(9).fill(null),slots=LAY[items.length]||items.map((_,i)=>i);
  if(items.length>9)throw new Error('too many '+out);
  items.forEach((it,i)=>{grid[slots[i]]=it});
  RECIPES.push({out,n,type:'shapeless',grid,cnt:items.length,cat,note});
}
const PL='Planks (any)',ST='Stick',CB='Stone Crafting Materials',II='Iron Ingot',GI='Gold Ingot',WS='Wooden Slabs (any)',CC='Coal or Charcoal',RS='Redstone';

/* ---------- wood families ---------- */
const WOODS=['Oak','Spruce','Birch','Jungle','Acacia','Dark Oak','Mangrove','Cherry','Pale Oak','Crimson','Warped'];
const PLANKS=[],WSLABS=[],LOGS=[];
function woodSet(w,P,sLog,noBoat){
  sh(w+' Slab',6,'PPP',{P},'building');
  sh(w+' Stairs',4,'P../PP./PPP',{P},'building');
  sh(w+' Fence',3,'PSP/PSP',{P,S:ST},'building');
  sh(w+' Fence Gate',1,'SPS/SPS',{P,S:ST},'building');
  sh(w+' Door',3,'PP/PP/PP',{P},'redstone');
  sh(w+' Trapdoor',2,'PPP/PPP',{P},'redstone');
  sl(w+' Button',1,[P],'redstone');
  sh(w+' Pressure Plate',1,'PP',{P},'redstone');
  sh(w+' Sign',3,'PPP/PPP/.S.',{P,S:ST},'decor');
  sh(w+' Hanging Sign',6,'C.C/SSS/SSS',{C:'Chain',S:sLog},'decor');
  if(!noBoat){sh(w+' Boat',1,'P.P/PPP',{P},'transport');sl(w+' Boat with Chest',1,[w+' Boat','Chest'],'transport')}
}
WOODS.forEach(w=>{
  const nether=/Crimson|Warped/.test(w);
  const log=w+(nether?' Stem':' Log'),wood=w+(nether?' Hyphae':' Wood');
  const sLog='Stripped '+log,sWood='Stripped '+wood;
  const lt=w+(nether?' Stems':' Logs')+' (any)';
  const P=w+' Planks';
  tag(lt,[log,sLog,wood,sWood]);
  PLANKS.push(P);WSLABS.push(w+' Slab');LOGS.push(log,sLog,wood,sWood);
  sl(P,4,[lt],'building','Any of the four log or wood variants of this tree works.');
  sh(wood,3,'LL/LL',{L:log},'building');
  sh(sWood,3,'LL/LL',{L:sLog},'building');
  woodSet(w,P,sLog,nether);
});
/* bamboo */
sh('Block of Bamboo',1,'BBB/BBB/BBB',{B:'Bamboo'},'building');
sl('Bamboo Planks',2,['Block of Bamboo'],'building','A Stripped Block of Bamboo works too.');
sh('Bamboo Mosaic',1,'S/S',{S:'Bamboo Slab'},'building');
sh('Bamboo Mosaic Slab',6,'MMM',{M:'Bamboo Mosaic'},'building');
sh('Bamboo Mosaic Stairs',4,'M../MM./MMM',{M:'Bamboo Mosaic'},'building');
woodSet('Bamboo','Bamboo Planks','Stripped Block of Bamboo',true);
sh('Bamboo Raft',1,'P.P/PPP',{P:'Bamboo Planks'},'transport');
sl('Bamboo Raft with Chest',1,['Bamboo Raft','Chest'],'transport');
PLANKS.push('Bamboo Planks');WSLABS.push('Bamboo Slab','Bamboo Mosaic Slab');
tag(PL,PLANKS);tag(WS,WSLABS);tag('Logs (any)',LOGS);
sh(ST,4,'P/P',{P:PL},'materials');
sh(ST,1,'B/B',{B:'Bamboo'},'materials');

/* ---------- tags ---------- */
const COLORS=['White','Light Gray','Gray','Black','Brown','Red','Orange','Yellow','Lime','Green','Cyan','Light Blue','Blue','Purple','Magenta','Pink'];
tag('Wool (any)',COLORS.map(c=>c+' Wool'));
tag('Dye (any)',COLORS.map(c=>c+' Dye'));
tag(CB,['Cobblestone','Blackstone','Cobbled Deepslate']);
tag(CC,['Coal','Charcoal']);
tag('Sand (any)',['Sand','Red Sand']);
tag('Soul Soil or Soul Sand',['Soul Soil','Soul Sand']);
tag('Brick or Pottery Sherd',['Brick','Angler Pottery Sherd','Archer Pottery Sherd','Prize Pottery Sherd','Skull Pottery Sherd']);
tag('Vine or Moss Block',['Vine','Moss Block']);
tag('Red or Brown Mushroom',['Red Mushroom','Brown Mushroom']);
tag('Small Flower (any)',['Dandelion','Poppy','Blue Orchid','Allium','Azure Bluet','Red Tulip','Orange Tulip','White Tulip','Pink Tulip','Oxeye Daisy','Cornflower','Lily of the Valley','Torchflower']);

/* ---------- dyes & colored blocks ---------- */
COLORS.forEach(c=>{
  const dye=c+' Dye',wool=c+' Wool';
  if(c==='White')sh(wool,1,'SS/SS',{S:'String'},'decor');else sl(wool,1,['Wool (any)',dye],'decor','Dyes any existing wool.');
  sh(c+' Carpet',3,'WW',{W:wool},'decor');
  sh(c+' Bed',1,'WWW/PPP',{W:wool,P:PL},'decor');
  sh(c+' Banner',1,'WWW/WWW/.S.',{W:wool,S:ST},'decor');
  sl(c+' Concrete Powder',8,[dye,'Sand','Sand','Sand','Sand','Gravel','Gravel','Gravel','Gravel'],'building');
  sh(c+' Stained Glass',8,'GGG/GDG/GGG',{G:'Glass',D:dye},'building');
  sh(c+' Stained Glass Pane',16,'GGG/GGG',{G:c+' Stained Glass'},'building');
  sh(c+' Terracotta',8,'TTT/TDT/TTT',{T:'Terracotta',D:dye},'building');
  sl(c+' Candle',1,['Candle',dye],'decor');
  sl(c+' Shulker Box',1,['Shulker Box',dye],'utility');
});
[['Red Dye',1,'Poppy'],['Red Dye',1,'Red Tulip'],['Red Dye',2,'Rose Bush'],['Red Dye',1,'Beetroot'],
 ['Orange Dye',1,'Orange Tulip'],['Yellow Dye',1,'Dandelion'],['Yellow Dye',2,'Sunflower'],
 ['Light Blue Dye',1,'Blue Orchid'],['Blue Dye',1,'Cornflower'],['Blue Dye',1,'Lapis Lazuli'],
 ['Magenta Dye',1,'Allium'],['Magenta Dye',2,'Lilac'],['Pink Dye',1,'Pink Tulip'],['Pink Dye',2,'Peony'],
 ['Brown Dye',1,'Cocoa Beans'],['Black Dye',1,'Ink Sac'],['Black Dye',1,'Wither Rose'],
 ['White Dye',1,'Bone Meal'],['White Dye',1,'Lily of the Valley'],
 ['Light Gray Dye',1,'Azure Bluet'],['Light Gray Dye',1,'Oxeye Daisy'],['Light Gray Dye',1,'White Tulip']
].forEach(([o,n,i])=>sl(o,n,[i],'materials'));
sl('Orange Dye',2,['Red Dye','Yellow Dye'],'materials');
sl('Lime Dye',2,['Green Dye','White Dye'],'materials');
sl('Cyan Dye',2,['Blue Dye','Green Dye'],'materials');
sl('Light Blue Dye',2,['Blue Dye','White Dye'],'materials');
sl('Purple Dye',2,['Blue Dye','Red Dye'],'materials');
sl('Magenta Dye',2,['Purple Dye','Pink Dye'],'materials');
sl('Pink Dye',2,['Red Dye','White Dye'],'materials');
sl('Gray Dye',2,['Black Dye','White Dye'],'materials');
sl('Light Gray Dye',2,['Gray Dye','White Dye'],'materials');
sl('Light Gray Dye',3,['Black Dye','White Dye','White Dye'],'materials');

/* ---------- tools & armor ---------- */
[['Wooden',PL],['Stone',CB],['Iron',II],['Golden',GI],['Diamond','Diamond'],['Copper','Copper Ingot']].forEach(([m,i])=>{
  const k={M:i,S:ST};
  sh(m+' Pickaxe',1,'MMM/.S./.S.',k,'tools');
  sh(m+' Axe',1,'MM./MS./.S.',k,'tools','The pattern can be mirrored.');
  sh(m+' Shovel',1,'M/S/S',k,'tools');
  sh(m+' Hoe',1,'MM./.S./.S.',k,'tools','The pattern can be mirrored.');
  sh(m+' Sword',1,'M/M/S',k,'tools');
  sh(m+' Spear',1,'..M/.S./S..',k,'tools');
});
[['Leather','Leather',['Cap','Tunic','Pants','Boots']],['Iron',II],['Golden',GI],['Diamond','Diamond'],['Copper','Copper Ingot']].forEach(([m,i,names])=>{
  const n=names||['Helmet','Chestplate','Leggings','Boots'],k={M:i};
  sh(m+' '+n[0],1,'MMM/M.M',k,'tools');
  sh(m+' '+n[1],1,'M.M/MMM/MMM',k,'tools');
  sh(m+' '+n[2],1,'MMM/M.M/M.M',k,'tools');
  sh(m+' '+n[3],1,'M.M/M.M',k,'tools');
});
sh('Turtle Shell',1,'SSS/S.S',{S:'Scute'},'tools');
sh('Shield',1,'PIP/PPP/.P.',{P:PL,I:II},'tools');
sh('Bow',1,'.ST/S.T/.ST',{S:ST,T:'String'},'tools');
sh('Crossbow',1,'SIS/TJT/.S.',{S:ST,I:II,T:'String',J:'Tripwire Hook'},'tools');
sh('Arrow',4,'F/S/E',{F:'Flint',S:ST,E:'Feather'},'tools');
sh('Spectral Arrow',2,'.G./GAG/.G.',{G:'Glowstone Dust',A:'Arrow'},'tools');
sh('Fishing Rod',1,'..S/.ST/S.T',{S:ST,T:'String'},'tools');
sh('Carrot on a Stick',1,'F./.C',{F:'Fishing Rod',C:'Carrot'},'tools');
sh('Warped Fungus on a Stick',1,'F./.C',{F:'Fishing Rod',C:'Warped Fungus'},'tools');
sl('Flint and Steel',1,[II,'Flint'],'tools');
sh('Shears',1,'.I/I.',{I:II},'tools');
sh('Brush',1,'F/C/S',{F:'Feather',C:'Copper Ingot',S:ST},'tools');
sh('Spyglass',1,'A/C/C',{A:'Amethyst Shard',C:'Copper Ingot'},'tools');
sh('Compass',1,'.I./IRI/.I.',{I:II,R:RS},'tools');
sh('Clock',1,'.G./GRG/.G.',{G:GI,R:RS},'tools');
sh('Recovery Compass',1,'EEE/ECE/EEE',{E:'Echo Shard',C:'Compass'},'tools');
sh('Empty Map',1,'PPP/PCP/PPP',{P:'Paper',C:'Compass'},'tools');
sh('Bucket',1,'I.I/.I.',{I:II},'tools');
sh('Lead',2,'SS./SL./..S',{S:'String',L:'Slime Ball'},'tools');
sh('Bundle',1,'S/L',{S:'String',L:'Leather'},'tools');
sl('Fire Charge',3,['Blaze Powder',CC,'Gunpowder'],'tools');
sl('Firework Rocket',3,['Paper','Gunpowder'],'tools','Add a second or third gunpowder for longer flight. Add firework stars for explosions.');
sl('Firework Star',1,['Gunpowder','Dye (any)'],'tools','Extra dyes, glowstone, diamonds and other items add colors and effects.');

/* ---------- workstations & utility ---------- */
sh('Crafting Table',1,'PP/PP',{P:PL},'utility');
sh('Chest',1,'PPP/P.P/PPP',{P:PL},'utility');
sl('Trapped Chest',1,['Chest','Tripwire Hook'],'utility');
sh('Barrel',1,'PSP/P.P/PSP',{P:PL,S:WS},'utility');
sh('Furnace',1,'CCC/C.C/CCC',{C:CB},'utility');
sh('Blast Furnace',1,'III/IFI/SSS',{I:II,F:'Furnace',S:'Smooth Stone'},'utility');
sh('Smoker',1,'.L./LFL/.L.',{L:'Logs (any)',F:'Furnace'},'utility');
sh('Campfire',1,'.S./SCS/LLL',{S:ST,C:CC,L:'Logs (any)'},'utility');
sh('Soul Campfire',1,'.S./SCS/LLL',{S:ST,C:'Soul Soil or Soul Sand',L:'Logs (any)'},'utility');
sh('Anvil',1,'BBB/.I./III',{B:'Block of Iron',I:II},'utility');
sh('Grindstone',1,'SLS/P.P',{S:ST,L:'Stone Slab',P:PL},'utility');
sh('Smithing Table',1,'II/PP/PP',{I:II,P:PL},'utility');
sh('Stonecutter',1,'.I./SSS',{I:II,S:'Stone'},'utility');
sh('Loom',1,'SS/PP',{S:'String',P:PL},'utility');
sh('Cartography Table',1,'PP/QQ/QQ',{P:'Paper',Q:PL},'utility');
sh('Fletching Table',1,'FF/PP/PP',{F:'Flint',P:PL},'utility');
sh('Composter',1,'S.S/S.S/SSS',{S:WS},'utility');
sh('Lectern',1,'SSS/.B./.S.',{S:WS,B:'Bookshelf'},'utility');
sh('Enchanting Table',1,'.B./DOD/OOO',{B:'Book',D:'Diamond',O:'Obsidian'},'utility');
sh('Brewing Stand',1,'.B./CCC',{B:'Blaze Rod',C:CB},'utility');
sh('Cauldron',1,'I.I/I.I/III',{I:II},'utility');
sh('Jukebox',1,'PPP/PDP/PPP',{P:PL,D:'Diamond'},'utility');
sh('Note Block',1,'PPP/PRP/PPP',{P:PL,R:RS},'redstone');
sh('Beacon',1,'GGG/GNG/OOO',{G:'Glass',N:'Nether Star',O:'Obsidian'},'utility');
sh('Conduit',1,'NNN/NHN/NNN',{N:'Nautilus Shell',H:'Heart of the Sea'},'utility');
sh('Lodestone',1,'CCC/CNC/CCC',{C:'Chiseled Stone Bricks',N:'Netherite Ingot'},'utility');
sh('Respawn Anchor',1,'OOO/GGG/OOO',{O:'Crying Obsidian',G:'Glowstone'},'utility');
sh('Ender Chest',1,'OOO/OEO/OOO',{O:'Obsidian',E:'Eye of Ender'},'utility');
sh('End Crystal',1,'GGG/GEG/GTG',{G:'Glass',E:'Eye of Ender',T:'Ghast Tear'},'utility');
sh('Crafter',1,'III/ICI/RDR',{I:II,C:'Crafting Table',R:RS,D:'Dropper'},'redstone');
sh('Beehive',1,'PPP/HHH/PPP',{P:PL,H:'Honeycomb'},'utility');
sh('Bookshelf',1,'PPP/BBB/PPP',{P:PL,B:'Book'},'utility');
sh('Chiseled Bookshelf',1,'PPP/SSS/PPP',{P:PL,S:WS},'utility');
sh('Decorated Pot',1,'.B./B.B/.B.',{B:'Brick or Pottery Sherd'},'decor');
sh('Flower Pot',1,'B.B/.B.',{B:'Brick'},'decor');
sh('Ladder',3,'S.S/SSS/S.S',{S:ST},'utility');
sh('Scaffolding',6,'BSB/B.B/B.B',{B:'Bamboo',S:'String'},'utility');
sh('Bowl',4,'P.P/.P.',{P:PL},'utility');
sh('Glass Bottle',3,'G.G/.G.',{G:'Glass'},'utility');
sh('Shulker Box',1,'S/C/S',{S:'Shulker Shell',C:'Chest'},'utility');

/* ---------- lighting & decoration ---------- */
sh('Torch',4,'C/S',{C:CC,S:ST},'decor');
sh('Soul Torch',4,'C/S/D',{C:CC,S:ST,D:'Soul Soil or Soul Sand'},'decor');
sh('Lantern',1,'NNN/NTN/NNN',{N:'Iron Nugget',T:'Torch'},'decor');
sh('Soul Lantern',1,'NNN/NTN/NNN',{N:'Iron Nugget',T:'Soul Torch'},'decor');
sh('Chain',1,'N/I/N',{N:'Iron Nugget',I:II},'decor');
sh('Iron Bars',16,'III/III',{I:II},'building');
sh('Iron Door',3,'II/II/II',{I:II},'redstone');
sh('Iron Trapdoor',1,'II/II',{I:II},'redstone');
sl('Candle',1,['String','Honeycomb'],'decor');
sh('Item Frame',1,'SSS/SLS/SSS',{S:ST,L:'Leather'},'decor');
sl('Glow Item Frame',1,['Item Frame','Glow Ink Sac'],'decor');
sh('Painting',1,'SSS/SWS/SSS',{S:ST,W:'Wool (any)'},'decor');
sh('Armor Stand',1,'SSS/.S./SGS',{S:ST,G:'Smooth Stone Slab'},'decor');
sh('Lightning Rod',1,'C/C/C',{C:'Copper Ingot'},'redstone');
sh('End Rod',4,'R/P',{R:'Blaze Rod',P:'Popped Chorus Fruit'},'decor');
sh('Sea Lantern',1,'SCS/CCC/SCS',{S:'Prismarine Shard',C:'Prismarine Crystals'},'building');
sh('Glowstone',1,'DD/DD',{D:'Glowstone Dust'},'building');
sh("Jack o'Lantern",1,'P/T',{P:'Carved Pumpkin',T:'Torch'},'decor');
sh('Paper',3,'SSS',{S:'Sugar Cane'},'materials');
sl('Book',1,['Paper','Paper','Paper','Leather'],'materials');
sl('Book and Quill',1,['Book','Ink Sac','Feather'],'tools');

/* ---------- redstone & transport ---------- */
sh('Redstone Torch',1,'R/S',{R:RS,S:ST},'redstone');
sh('Repeater',1,'TRT/SSS',{T:'Redstone Torch',R:RS,S:'Stone'},'redstone');
sh('Comparator',1,'.T./TQT/SSS',{T:'Redstone Torch',Q:'Nether Quartz',S:'Stone'},'redstone');
sh('Piston',1,'PPP/CIC/CRC',{P:PL,C:'Cobblestone',I:II,R:RS},'redstone');
sh('Sticky Piston',1,'S/P',{S:'Slime Ball',P:'Piston'},'redstone');
sh('Observer',1,'CCC/RRQ/CCC',{C:'Cobblestone',R:RS,Q:'Nether Quartz'},'redstone');
sh('Dropper',1,'CCC/C.C/CRC',{C:'Cobblestone',R:RS},'redstone');
sh('Dispenser',1,'CCC/CBC/CRC',{C:'Cobblestone',B:'Bow',R:RS},'redstone');
sh('Hopper',1,'I.I/ICI/.I.',{I:II,C:'Chest'},'redstone');
sh('Lever',1,'S/C',{S:ST,C:'Cobblestone'},'redstone');
sh('Tripwire Hook',2,'I/S/P',{I:II,S:ST,P:PL},'redstone');
sl('Stone Button',1,['Stone'],'redstone');
sh('Stone Pressure Plate',1,'SS',{S:'Stone'},'redstone');
sl('Polished Blackstone Button',1,['Polished Blackstone'],'redstone');
sh('Polished Blackstone Pressure Plate',1,'PP',{P:'Polished Blackstone'},'redstone');
sh('Heavy Weighted Pressure Plate',1,'II',{I:II},'redstone');
sh('Light Weighted Pressure Plate',1,'GG',{G:GI},'redstone');
sh('Redstone Lamp',1,'.R./RGR/.R.',{R:RS,G:'Glowstone'},'redstone');
sh('Daylight Detector',1,'GGG/QQQ/WWW',{G:'Glass',Q:'Nether Quartz',W:WS},'redstone');
sh('Target',1,'.R./RHR/.R.',{R:RS,H:'Hay Bale'},'redstone');
sh('TNT',1,'GSG/SGS/GSG',{G:'Gunpowder',S:'Sand (any)'},'redstone');
sh('Rail',16,'I.I/ISI/I.I',{I:II,S:ST},'transport');
sh('Powered Rail',6,'G.G/GSG/GRG',{G:GI,S:ST,R:RS},'transport');
sh('Detector Rail',6,'I.I/IPI/IRI',{I:II,P:'Stone Pressure Plate',R:RS},'transport');
sh('Activator Rail',6,'ISI/IRI/ISI',{I:II,S:ST,R:'Redstone Torch'},'transport');
sh('Minecart',1,'I.I/III',{I:II},'transport');
sl('Minecart with Chest',1,['Minecart','Chest'],'transport');
sl('Minecart with Furnace',1,['Minecart','Furnace'],'transport');
sl('Minecart with Hopper',1,['Minecart','Hopper'],'transport');
sl('Minecart with TNT',1,['Minecart','TNT'],'transport');
sh('Copper Door',3,'CC/CC/CC',{C:'Copper Ingot'},'redstone');
sh('Copper Trapdoor',2,'CC/CC',{C:'Copper Ingot'},'redstone');
sh('Copper Bulb',4,'.C./CBC/.R.',{C:'Block of Copper',B:'Blaze Rod',R:RS},'redstone');

/* ---------- food ---------- */
sh('Bread',1,'WWW',{W:'Wheat'},'food');
sh('Cake',1,'MMM/SES/WWW',{M:'Milk Bucket',S:'Sugar',E:'Egg',W:'Wheat'},'food');
sh('Cookie',8,'WCW',{W:'Wheat',C:'Cocoa Beans'},'food');
sl('Pumpkin Pie',1,['Pumpkin','Sugar','Egg'],'food');
sl('Mushroom Stew',1,['Red Mushroom','Brown Mushroom','Bowl'],'food');
sh('Beetroot Soup',1,'BBB/BBB/.O.',{B:'Beetroot',O:'Bowl'},'food');
sl('Rabbit Stew',1,['Cooked Rabbit','Carrot','Baked Potato','Red or Brown Mushroom','Bowl'],'food');
sl('Suspicious Stew',1,['Red Mushroom','Brown Mushroom','Bowl','Small Flower (any)'],'food','The flower decides the effect.');
sh('Golden Apple',1,'GGG/GAG/GGG',{G:GI,A:'Apple'},'food');
sh('Golden Carrot',1,'NNN/NCN/NNN',{N:'Gold Nugget',C:'Carrot'},'food');
sh('Glistering Melon Slice',1,'NNN/NMN/NNN',{N:'Gold Nugget',M:'Melon Slice'},'materials');
sh('Melon',1,'MMM/MMM/MMM',{M:'Melon Slice'},'food');
sl('Melon Seeds',1,['Melon Slice'],'food');
sl('Pumpkin Seeds',4,['Pumpkin'],'food');
sl('Sugar',1,['Sugar Cane'],'food');
sl('Sugar',3,['Honey Bottle'],'food');
sl('Honey Bottle',4,['Honey Block','Glass Bottle','Glass Bottle','Glass Bottle','Glass Bottle'],'food');
sh('Honey Block',1,'HH/HH',{H:'Honey Bottle'},'building');
sh('Honeycomb Block',1,'HH/HH',{H:'Honeycomb'},'building');

/* ---------- materials & conversions ---------- */
[['Iron Ingot','Block of Iron','Iron Nugget'],['Gold Ingot','Block of Gold','Gold Nugget'],['Copper Ingot','Block of Copper'],
 ['Diamond','Block of Diamond'],['Emerald','Block of Emerald'],['Lapis Lazuli','Block of Lapis Lazuli'],['Redstone','Block of Redstone'],
 ['Coal','Block of Coal'],['Netherite Ingot','Block of Netherite'],['Raw Iron','Block of Raw Iron'],['Raw Copper','Block of Raw Copper'],
 ['Raw Gold','Block of Raw Gold'],['Nether Wart','Nether Wart Block'],['Slime Ball','Slime Block'],['Bone Meal','Bone Block'],
 ['Wheat','Hay Bale'],['Dried Kelp','Dried Kelp Block']
].forEach(([i,b,nug])=>{
  sh(b,1,'III/III/III',{I:i},'materials');
  sl(i,9,[b],'materials');
  if(nug){sl(i,1,Array(9).fill(nug),'materials');sl(nug,9,[i],'materials')}
});
sl('Netherite Ingot',1,['Netherite Scrap','Netherite Scrap','Netherite Scrap','Netherite Scrap',GI,GI,GI,GI],'materials');
sl('Bone Meal',3,['Bone'],'materials');
sl('Blaze Powder',2,['Blaze Rod'],'materials');
sl('Magma Cream',1,['Blaze Powder','Slime Ball'],'materials');
sl('Eye of Ender',1,['Ender Pearl','Blaze Powder'],'materials');
sl('Fermented Spider Eye',1,['Spider Eye','Brown Mushroom','Sugar'],'materials');
sh('Leather',1,'HH/HH',{H:'Rabbit Hide'},'materials');
sh('Amethyst Block',1,'SS/SS',{S:'Amethyst Shard'},'building');
sh('Tinted Glass',2,'.A./AGA/.A.',{A:'Amethyst Shard',G:'Glass'},'building');
sh('Glass Pane',16,'GGG/GGG',{G:'Glass'},'building');
sh('Magma Block',1,'MM/MM',{M:'Magma Cream'},'building');
sh('Snow Block',1,'SS/SS',{S:'Snowball'},'building');
sl('Snow',6,['Snow Block','Snow Block','Snow Block'],'building');
sh('Clay',1,'CC/CC',{C:'Clay Ball'},'building');
sh('Coarse Dirt',4,'DG/GD',{D:'Dirt',G:'Gravel'},'building');
sl('Packed Mud',1,['Mud','Wheat'],'building');

/* ---------- stone family ---------- */
const four=(o,src,n=4)=>sh(o,n,'SS/SS',{S:src},'building');
const two=(o,slab)=>sh(o,1,'S/S',{S:slab},'building');
four('Stone Bricks','Stone');two('Chiseled Stone Bricks','Stone Brick Slab');
sl('Mossy Stone Bricks',1,['Stone Bricks','Vine or Moss Block'],'building');
sl('Mossy Cobblestone',1,['Cobblestone','Vine or Moss Block'],'building');
sl('Andesite',2,['Diorite','Cobblestone'],'building');
sh('Diorite',2,'CQ/QC',{C:'Cobblestone',Q:'Nether Quartz'},'building');
sl('Granite',1,['Diorite','Nether Quartz'],'building');
four('Polished Andesite','Andesite');four('Polished Diorite','Diorite');four('Polished Granite','Granite');
four('Polished Blackstone','Blackstone');four('Polished Blackstone Bricks','Polished Blackstone');two('Chiseled Polished Blackstone','Polished Blackstone Slab');
four('Polished Deepslate','Cobbled Deepslate');four('Deepslate Bricks','Polished Deepslate');four('Deepslate Tiles','Deepslate Bricks');two('Chiseled Deepslate','Cobbled Deepslate Slab');
four('Polished Tuff','Tuff');four('Tuff Bricks','Polished Tuff');two('Chiseled Tuff','Tuff Slab');two('Chiseled Tuff Bricks','Tuff Brick Slab');
four('End Stone Bricks','End Stone');
four('Bricks','Brick',1);four('Mud Bricks','Packed Mud');
sh('Sandstone',1,'SS/SS',{S:'Sand'},'building');sh('Red Sandstone',1,'SS/SS',{S:'Red Sand'},'building');
four('Cut Sandstone','Sandstone');four('Cut Red Sandstone','Red Sandstone');
two('Chiseled Sandstone','Sandstone Slab');two('Chiseled Red Sandstone','Red Sandstone Slab');
four('Nether Bricks','Nether Brick',1);sh('Red Nether Bricks',1,'WB/BW',{W:'Nether Wart',B:'Nether Brick'},'building');
two('Chiseled Nether Bricks','Nether Brick Slab');
sh('Nether Brick Fence',6,'NBN/NBN',{N:'Nether Bricks',B:'Nether Brick'},'building');
sh('Prismarine',1,'SS/SS',{S:'Prismarine Shard'},'building');
sh('Prismarine Bricks',1,'SSS/SSS/SSS',{S:'Prismarine Shard'},'building');
sh('Dark Prismarine',1,'SSS/SDS/SSS',{S:'Prismarine Shard',D:'Black Dye'},'building');
four('Block of Quartz','Nether Quartz',1);four('Quartz Bricks','Block of Quartz');
sh('Quartz Pillar',2,'Q/Q',{Q:'Block of Quartz'},'building');two('Chiseled Quartz Block','Quartz Slab');
four('Purpur Block','Popped Chorus Fruit');two('Purpur Pillar','Purpur Slab');
sh('Cut Copper',4,'CC/CC',{C:'Block of Copper'},'building');
sh('Copper Grate',4,'.C./C.C/.C.',{C:'Block of Copper'},'building');
two('Chiseled Copper','Cut Copper Slab');
sl('Waxed Block of Copper',1,['Block of Copper','Honeycomb'],'building');
/* slab / stairs / wall: S = stairs, W = wall */
[['Cobblestone','Cobblestone','SW'],['Mossy Cobblestone','Mossy Cobblestone','SW'],['Stone','Stone','S'],['Smooth Stone','Smooth Stone',''],
 ['Stone Bricks','Stone Brick','SW'],['Mossy Stone Bricks','Mossy Stone Brick','SW'],['Andesite','Andesite','SW'],['Diorite','Diorite','SW'],['Granite','Granite','SW'],
 ['Polished Andesite','Polished Andesite','S'],['Polished Diorite','Polished Diorite','S'],['Polished Granite','Polished Granite','S'],
 ['Bricks','Brick','SW'],['Mud Bricks','Mud Brick','SW'],['Sandstone','Sandstone','SW'],['Smooth Sandstone','Smooth Sandstone','S'],['Cut Sandstone','Cut Sandstone',''],
 ['Red Sandstone','Red Sandstone','SW'],['Smooth Red Sandstone','Smooth Red Sandstone','S'],['Cut Red Sandstone','Cut Red Sandstone',''],
 ['Nether Bricks','Nether Brick','SW'],['Red Nether Bricks','Red Nether Brick','SW'],['Prismarine','Prismarine','SW'],['Prismarine Bricks','Prismarine Brick','S'],['Dark Prismarine','Dark Prismarine','S'],
 ['Block of Quartz','Quartz','S'],['Smooth Quartz','Smooth Quartz','S'],['Purpur Block','Purpur','S'],['End Stone Bricks','End Stone Brick','SW'],
 ['Blackstone','Blackstone','SW'],['Polished Blackstone','Polished Blackstone','SW'],['Polished Blackstone Bricks','Polished Blackstone Brick','SW'],
 ['Cobbled Deepslate','Cobbled Deepslate','SW'],['Polished Deepslate','Polished Deepslate','SW'],['Deepslate Bricks','Deepslate Brick','SW'],['Deepslate Tiles','Deepslate Tile','SW'],
 ['Tuff','Tuff','SW'],['Polished Tuff','Polished Tuff','SW'],['Tuff Bricks','Tuff Brick','SW'],['Cut Copper','Cut Copper','S']
].forEach(([b,p,f])=>{
  sh(p+' Slab',6,'MMM',{M:b},'building');
  if(f.includes('S'))sh(p+' Stairs',4,'M../MM./MMM',{M:b},'building');
  if(f.includes('W'))sh(p+' Wall',6,'MMM/MMM',{M:b},'building');
});
//DATA-END
