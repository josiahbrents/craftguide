/* Data for Brewing, Trades, Smelting, Smithing, Food, XP and Portals (Java Edition). Brewing from the Minecraft Wiki, Oct 2026. */
/* id, name, effect, ingredient, made from ('awkward' | 'water' | base potion id), base, extended, [enhanced, label], color, group, what it does */
const POTIONS=[
 ['swiftness','Potion of Swiftness','Speed','Sugar','awkward','3:00','8:00',['1:30','Speed II'],'#33EBFF','good','20% faster, 40% at level II.'],
 ['leaping','Potion of Leaping','Jump Boost','Rabbit\'s Foot','awkward','3:00','8:00',['1:30','Jump Boost II'],'#FDFF84','good','Jump 50% higher, 150% at level II.'],
 ['strength','Potion of Strength','Strength','Blaze Powder','awkward','3:00','8:00',['1:30','Strength II'],'#FFC700','good','+3 melee damage, +6 at level II.'],
 ['healing','Potion of Healing','Instant Health','Glistering Melon Slice','awkward',null,null,['instant','Instant Health II'],'#F82423','good','Heals 2 hearts, 4 at level II. Hurts undead mobs instead.'],
 ['regeneration','Potion of Regeneration','Regeneration','Ghast Tear','awkward','0:45','1:30',['0:22','Regeneration II'],'#CD5CAB','good','Heals half a heart every 2.5 seconds, twice as fast at level II.'],
 ['fire_resistance','Potion of Fire Resistance','Fire Resistance','Magma Cream','awkward','3:00','8:00',null,'#FF9900','good','No damage from fire, lava, magma blocks, campfires or blaze fireballs.'],
 ['water_breathing','Potion of Water Breathing','Water Breathing','Pufferfish','awkward','3:00','8:00',null,'#98DAC0','good','Your air doesn’t run out underwater.'],
 ['night_vision','Potion of Night Vision','Night Vision','Golden Carrot','awkward','3:00','8:00',null,'#C2FF66','good','Everything looks fully lit, even underwater.'],
 ['invisibility','Potion of Invisibility','Invisibility','Fermented Spider Eye','night_vision','3:00','8:00',null,'#F6F6F6','good','You turn invisible. Your armor and held items still show.'],
 ['slow_falling','Potion of Slow Falling','Slow Falling','Phantom Membrane','awkward','1:30','4:00',null,'#F3CFB9','good','You fall slowly and take no fall damage.'],
 ['turtle_master','Potion of the Turtle Master','Slowness IV + Resistance III','Turtle Shell','awkward','0:20','0:40',['0:20','Slowness VI + Resistance IV'],'#8E7A64','mixed','Take 60% less damage but move 60% slower. Level II: 80% less damage, 90% slower.'],
 ['poison','Potion of Poison','Poison','Spider Eye','awkward','0:45','1:30',['0:21','Poison II'],'#87A363','bad','Lose half a heart every 1.25 seconds, down to half a heart. Faster at level II.'],
 ['weakness','Potion of Weakness','Weakness','Fermented Spider Eye','water','1:30','4:00',null,'#484D48','bad','−4 melee damage. Throw a splash one at a zombie villager, then feed it a golden apple to cure it.'],
 ['harming','Potion of Harming','Instant Damage','Fermented Spider Eye','healing',null,null,['instant','Instant Damage II'],'#A9656A','bad','Deals 3 hearts of damage, 6 at level II. Heals undead mobs instead.'],
 ['slowness','Potion of Slowness','Slowness','Fermented Spider Eye','swiftness','1:30','4:00',['0:20','Slowness IV'],'#8BAFE0','bad','15% slower, 60% at level IV.'],
 ['wind_charging','Potion of Wind Charging','Wind Charged','Breeze Rod','awkward','3:00',null,null,'#BDC9FF','bad','Lets out a burst of wind when the drinker dies.'],
 ['weaving','Potion of Weaving','Weaving','Cobweb','awkward','3:00',null,null,'#78695A','bad','Leaves 2–3 cobwebs when the drinker dies, and lets them move faster through cobwebs.'],
 ['oozing','Potion of Oozing','Oozing','Slime Block','awkward','3:00',null,null,'#99FFA3','bad','Spawns two medium slimes when the drinker dies.'],
 ['infestation','Potion of Infestation','Infested','Stone','awkward','3:00',null,null,'#8C9B8C','bad','10% chance to spawn 1–2 silverfish each time the drinker is hit.']
].map(([id,name,effect,ing,from,base,ext,enh,color,group,desc])=>({id,name,effect,ing,from,base,ext,enh,color,group,desc}));
const PBY=Object.fromEntries(POTIONS.map(p=>[p.id,p]));
const ALT_FROM={slowness:'Potion of Leaping works too.',harming:'Potion of Poison works too.'};

/* villager professions (default Java trades) */
const PROFS=[
 ['librarian','Librarian','Lectern',['Paper','Book','Ink Sac','Book and Quill'],['Enchanted Book','Bookshelf','Lantern','Glass','Clock','Compass','Name Tag'],'The only villager that sells enchanted books, including Mending.'],
 ['armorer','Armorer','Blast Furnace',['Coal','Iron Ingot','Lava Bucket','Diamond'],['Iron Helmet','Iron Chestplate','Bell','Shield','Diamond Chestplate'],'Sells iron and chainmail armor, and enchanted diamond armor at higher levels.'],
 ['toolsmith','Toolsmith','Smithing Table',['Coal','Iron Ingot','Flint','Diamond'],['Stone Pickaxe','Bell','Iron Pickaxe','Diamond Pickaxe'],'Sells stone and iron tools, and enchanted diamond tools at higher levels.'],
 ['weaponsmith','Weaponsmith','Grindstone',['Coal','Iron Ingot','Flint','Diamond'],['Iron Axe','Iron Sword','Bell','Diamond Sword','Diamond Axe'],'Sells an enchanted iron sword, and enchanted diamond swords and axes at higher levels.'],
 ['cleric','Cleric','Brewing Stand',['Rotten Flesh','Gold Ingot','Rabbit\'s Foot','Turtle Scute','Glass Bottle','Nether Wart'],['Redstone','Lapis Lazuli','Glowstone','Ender Pearl','Bottle o\' Enchanting'],'A good place to sell rotten flesh and buy ender pearls and experience bottles.'],
 ['farmer','Farmer','Composter',['Wheat','Potato','Carrot','Beetroot','Pumpkin','Melon'],['Bread','Pumpkin Pie','Apple','Cookie','Cake','Suspicious Stew','Golden Carrot','Glistering Melon Slice'],'Easy emeralds from a crop farm. Sells golden carrots, great food for long trips.'],
 ['fisherman','Fisherman','Barrel',['String','Coal','Raw Cod','Raw Salmon','Tropical Fish','Pufferfish','Oak Boat'],['Cooked Cod','Cooked Salmon','Campfire','Fishing Rod','Bucket of Cod'],'Buys fish and boats. Sells an enchanted fishing rod at higher levels.'],
 ['fletcher','Fletcher','Fletching Table',['Stick','String','Feather','Tripwire Hook'],['Arrow','Flint','Bow','Crossbow','Tipped Arrow'],'Buys sticks, an easy emerald source. Sells enchanted bows and crossbows, and tipped arrows.'],
 ['shepherd','Shepherd','Loom',['White Wool','Black Dye','Lime Dye','Light Blue Dye'],['Shears','White Wool','White Carpet','White Bed','White Banner','Painting'],'Buys wool and dyes. Sells colored wool, carpets, beds, banners and paintings.'],
 ['butcher','Butcher','Smoker',['Raw Chicken','Raw Porkchop','Raw Rabbit','Raw Mutton','Raw Beef','Coal','Dried Kelp Block','Sweet Berries'],['Rabbit Stew','Cooked Porkchop','Cooked Chicken'],'Buys raw meat, dried kelp blocks and sweet berries.'],
 ['leatherworker','Leatherworker','Cauldron',['Leather','Flint','Rabbit Hide','Turtle Scute'],['Leather Tunic','Leather Pants','Leather Horse Armor','Saddle'],'Sells dyed leather armor, leather horse armor, and saddles at master level.'],
 ['mason','Mason','Stonecutter',['Clay Ball','Stone','Granite','Andesite','Diorite','Nether Quartz'],['Bricks','Chiseled Stone Bricks','Polished Granite','Terracotta','White Glazed Terracotta','Quartz Pillar'],'Sells building blocks, including every color of terracotta and glazed terracotta.'],
 ['cartographer','Cartographer','Cartography Table',['Paper','Glass Pane','Compass'],['Empty Map','Map','Item Frame','White Banner'],'Sells explorer maps that lead to ocean monuments, woodland mansions and trial chambers.']
].map(([id,name,ws,buys,sells,note])=>({id,name,ws,buys,sells,note}));
const NO_LIBRARIAN=['soul_speed','swift_sneak','wind_burst'];
/* Java: price = 2 + random(0 .. 4+10×level) + 3×level, doubled for treasure, capped at 64, plus one book */
const bookPrice=(id,lv)=>{const t=['mending','frost_walker','binding_curse','vanishing_curse'].includes(id);let lo=2+3*lv,hi=6+13*lv;if(t){lo*=2;hi*=2}return {lo:Math.min(lo,64),hi:Math.min(hi,64),treasure:t}};

/* smelting: input, output, xp per item, where: f = furnace only, b = furnace or blast furnace, s = furnace, smoker or campfire */
const SMELT=[
 ['Raw Iron','Iron Ingot',0.7,'b'],['Iron Ore','Iron Ingot',0.7,'b'],['Deepslate Iron Ore','Iron Ingot',0.7,'b'],
 ['Raw Gold','Gold Ingot',1,'b'],['Gold Ore','Gold Ingot',1,'b'],['Deepslate Gold Ore','Gold Ingot',1,'b'],['Nether Gold Ore','Gold Ingot',1,'b'],
 ['Raw Copper','Copper Ingot',0.7,'b'],['Copper Ore','Copper Ingot',0.7,'b'],['Deepslate Copper Ore','Copper Ingot',0.7,'b'],
 ['Ancient Debris','Netherite Scrap',2,'b'],['Diamond Ore','Diamond',1,'b'],['Deepslate Diamond Ore','Diamond',1,'b'],
 ['Emerald Ore','Emerald',1,'b'],['Deepslate Emerald Ore','Emerald',1,'b'],['Lapis Lazuli Ore','Lapis Lazuli',0.2,'b'],['Deepslate Lapis Lazuli Ore','Lapis Lazuli',0.2,'b'],
 ['Redstone Ore','Redstone',0.3,'b'],['Deepslate Redstone Ore','Redstone',0.3,'b'],['Coal Ore','Coal',0.1,'b'],['Deepslate Coal Ore','Coal',0.1,'b'],
 ['Nether Quartz Ore','Nether Quartz',0.2,'b'],['Iron Sword','Iron Nugget',0.1,'b'],['Golden Sword','Gold Nugget',0.1,'b'],
 ['Raw Beef','Steak',0.35,'s'],['Raw Porkchop','Cooked Porkchop',0.35,'s'],['Raw Chicken','Cooked Chicken',0.35,'s'],['Raw Mutton','Cooked Mutton',0.35,'s'],
 ['Raw Rabbit','Cooked Rabbit',0.35,'s'],['Raw Cod','Cooked Cod',0.35,'s'],['Raw Salmon','Cooked Salmon',0.35,'s'],['Potato','Baked Potato',0.35,'s'],['Kelp','Dried Kelp',0.1,'s'],
 ['Sand','Glass',0.1,'f'],['Red Sand','Glass',0.1,'f'],['Cobblestone','Stone',0.1,'f'],['Stone','Smooth Stone',0.1,'f'],['Cobbled Deepslate','Deepslate',0.1,'f'],
 ['Sandstone','Smooth Sandstone',0.1,'f'],['Red Sandstone','Smooth Red Sandstone',0.1,'f'],['Block of Quartz','Smooth Quartz',0.1,'f'],['Basalt','Smooth Basalt',0.1,'f'],
 ['Stone Bricks','Cracked Stone Bricks',0.1,'f'],['Nether Bricks','Cracked Nether Bricks',0.1,'f'],['Deepslate Bricks','Cracked Deepslate Bricks',0.1,'f'],
 ['Deepslate Tiles','Cracked Deepslate Tiles',0.1,'f'],['Polished Blackstone Bricks','Cracked Polished Blackstone Bricks',0.1,'f'],
 ['Clay Ball','Brick',0.3,'f'],['Clay','Terracotta',0.35,'f'],['White Terracotta','White Glazed Terracotta',0.1,'f'],['Netherrack','Nether Brick',0.1,'f'],
 ['Oak Log','Charcoal',0.15,'f'],['Cactus','Green Dye',1,'f'],['Sea Pickle','Lime Dye',0.1,'f'],['Wet Sponge','Sponge',0.15,'f'],
 ['Chorus Fruit','Popped Chorus Fruit',0.1,'f'],['Resin Clump','Resin Brick',0.3,'f']
];
const SMELT_NOTE={'Iron Sword':'Any iron or chainmail tool, weapon or armor, and iron horse armor.','Golden Sword':'Any golden tool, weapon or armor, and golden horse armor.','Oak Log':'Any log or wood that burns, so not crimson or warped.','White Terracotta':'Every color of terracotta makes its glazed version.'};
/* fuel: item, items smelted per fuel */
const FUELS=[['Lava Bucket',100],['Block of Coal',80],['Dried Kelp Block',20],['Blaze Rod',12],['Coal',8],['Charcoal',8],['Oak Boat',6],['Oak Log',1.5],['Oak Planks',1.5],['Crafting Table',1.5],['Chest',1.5],['Bookshelf',1.5],['Wooden Pickaxe',1],['Oak Slab',0.75],['Stick',0.5],['Oak Sapling',0.5],['Bowl',0.5],['White Wool',0.5],['White Carpet',0.335],['Bamboo',0.25]];

/* smithing */
const TRIMS=[['Coast','Shipwrecks','Cobblestone'],['Dune','Desert pyramids','Sandstone'],['Eye','Strongholds','End Stone'],['Host','Trail ruins','Terracotta'],['Raiser','Trail ruins','Terracotta'],['Rib','Nether fortresses','Netherrack'],['Sentry','Pillager outposts','Cobblestone'],['Shaper','Trail ruins','Terracotta'],['Silence','Ancient cities','Cobbled Deepslate'],['Snout','Bastion remnants','Blackstone'],['Spire','End cities','Purpur Block'],['Tide','Dropped by elder guardians in ocean monuments','Prismarine'],['Vex','Woodland mansions','Cobblestone'],['Ward','Ancient cities','Cobbled Deepslate'],['Wayfinder','Trail ruins','Terracotta'],['Wild','Jungle pyramids','Mossy Cobblestone'],['Bolt','Trial chamber vaults','Block of Copper'],['Flow','Ominous vaults in trial chambers','Breeze Rod']];
const TRIM_MATS=['Iron Ingot','Copper Ingot','Gold Ingot','Lapis Lazuli','Emerald','Diamond','Netherite Ingot','Redstone','Amethyst Shard','Nether Quartz','Resin Brick'];
const NETHERITE_GEAR=['Helmet','Chestplate','Leggings','Boots','Sword','Spear','Axe','Pickaxe','Shovel','Hoe'];

/* food: name, hunger points, saturation, note, bad effect? */
const FOODS=[
 ['Golden Carrot',6,14.4,'The best saturation of any food.'],['Steak',8,12.8,''],['Cooked Porkchop',8,12.8,''],['Rabbit Stew',10,12,'Doesn’t stack.'],
 ['Cooked Mutton',6,9.6,''],['Cooked Salmon',6,9.6,''],['Golden Apple',4,9.6,'Regeneration II for 5 seconds and Absorption for 2 minutes.'],
 ['Enchanted Golden Apple',4,9.6,'Regeneration II, Absorption IV, Resistance and Fire Resistance. Can’t be crafted.'],
 ['Cooked Chicken',6,7.2,''],['Mushroom Stew',6,7.2,'Doesn’t stack.'],['Beetroot Soup',6,7.2,'Doesn’t stack.'],['Suspicious Stew',6,7.2,'Gives an effect that depends on the flower used.'],
 ['Bread',5,6,''],['Baked Potato',5,6,''],['Cooked Cod',5,6,''],['Cooked Rabbit',5,6,''],['Honey Bottle',6,1.2,'Cures poison.'],
 ['Pumpkin Pie',8,4.8,''],['Apple',4,2.4,''],['Chorus Fruit',4,2.4,'Teleports you a short way.'],['Carrot',3,3.6,''],
 ['Raw Beef',3,1.8,''],['Raw Porkchop',3,1.8,''],['Raw Rabbit',3,1.8,''],['Melon Slice',2,1.2,''],['Raw Mutton',2,1.2,''],
 ['Sweet Berries',2,0.4,''],['Glow Berries',2,0.4,''],['Cookie',2,0.4,''],['Cake',2,0.4,'Per slice. A placed cake has 7 slices.'],
 ['Raw Cod',2,0.4,''],['Raw Salmon',2,0.4,''],['Beetroot',1,1.2,''],['Potato',1,0.6,''],['Dried Kelp',1,0.6,'Eaten in half the usual time.'],
 ['Raw Chicken',2,1.2,'30% chance of Hunger.',1],['Spider Eye',2,3.2,'Gives Poison.',1],['Poisonous Potato',2,1.2,'60% chance of Poison.',1],
 ['Rotten Flesh',4,0.8,'80% chance of Hunger.',1],['Tropical Fish',1,0.2,''],['Pufferfish',1,0.2,'Gives Poison, Nausea and Hunger.',1]
].map(([name,h,s,note,bad])=>({name,h,s,note,bad:!!bad}));

/* experience (Java) */
const xpTotal=L=>L<=16?L*L+6*L:L<=31?2.5*L*L-40.5*L+360:4.5*L*L-162.5*L+2220;
const xpNext=L=>L<=15?2*L+7:L<=30?5*L-38:9*L-158;
function xpToLevel(p){let L=0;while(xpTotal(L+1)<=p)L++;return {level:L,into:p-xpTotal(L),need:xpNext(L)}}

/* diamonds in each diamond item, for the netherite calculator */
const DIAMOND_COST={Helmet:5,Chestplate:8,Leggings:7,Boots:4,Sword:2,Spear:1,Axe:3,Pickaxe:3,Shovel:1,Hoe:2};
/* librarian odds: 2/3 chance of a book at novice, enchantment picked from 40, then the level */
const LIB_BOOK_CHANCE=2/3,LIB_POOL=40;
const libOdds=(id,lv)=>LIB_BOOK_CHANCE/LIB_POOL/(lv?EBY[id].max:1);
const rollsFor=(p,q)=>Math.ceil(Math.log(1-q)/Math.log(1-p));
