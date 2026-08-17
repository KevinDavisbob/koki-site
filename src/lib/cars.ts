import type { Locale } from "@/i18n/routing";

export type CarTopic = {
  key: string;
  title: string;
  icon: string;
  paragraphs: string[];
  points: string[];
};

export type CarTerm = {
  term: string;
  definition: string;
};

export type CarsContent = {
  intro: string;
  topics: CarTopic[];
  terms: CarTerm[];
};

const zh: CarsContent = {
  intro:
    "一个汽车爱好者的笔记：从发动机原理到变速箱结构，从驱动形式到新能源技术，讲清楚「车为什么会动、为什么会好开」。",
  topics: [
    {
      key: "engine",
      title: "发动机：四冲程原理",
      icon: "🔥",
      paragraphs: [
        "汽油发动机的工作循环由四个冲程组成：**进气**——活塞下行，进气门打开，混合气被吸入气缸；**压缩**——两个气门都关闭，活塞上行，混合气被压缩到原体积的 1/8~1/12；**做功**——火花塞点火，混合气爆燃，巨大的压力把活塞猛推下去，这是唯一「出力」的冲程；**排气**——排气门打开，活塞上行，废气被推出气缸。",
        "曲轴把活塞的上下直线运动转化为旋转运动：四个冲程对应曲轴转两圈（720°）。多缸发动机（常见 4 缸）各缸错开做功，让动力输出更平顺——所以你感觉到的「怠速震动」其实和气缸数量、排布方式直接相关。",
        "性能上记住三个关键词：**排量**（气缸总容积，基础动力指标）、**压缩比**（压缩程度，影响效率与燃油标号要求）、**升功率**（每升排量榨出的马力，体现技术水平）。",
      ],
      points: [
        "四冲程 = 进气 → 压缩 → 做功 → 排气，曲轴转两圈完成一次循环",
        "做功冲程是唯一产生动力的环节，其余三个靠飞轮惯性带动",
        "涡轮增压 = 用废气驱动涡轮，把更多空气压进气缸，小排量压出大马力",
      ],
    },
    {
      key: "gearbox",
      title: "变速箱：MT / AT / CVT / DCT",
      icon: "⚙️",
      paragraphs: [
        "发动机只在约 1000~6500 转区间高效工作，而车速从 0 到 200 km/h 变化巨大，变速箱负责把发动机转速「翻译」成合适的车轮转速——**齿轮比越低（高档位），同样的发动机转速下车轮转得越快**。",
        "**MT 手动**：结构简单可靠、传动直接、有驾驶乐趣，但要踩离合换挡。**AT 液力自动**：靠液力变矩器传递动力，平顺耐用，是成熟之选。**CVT 无级变速**：没有固定挡位，用钢带和锥轮连续改变传动比，极平顺省油，但大扭矩下钢带会打滑、缺乏换挡激情。**DCT 双离合**：两套离合器分别管奇数挡和偶数挡，换挡速度极快，运动感强，低速蠕行时偶有顿挫。",
        "选车建议：家用求稳选 AT 或 CVT，想要运动感选湿式 DCT，纯粹追求驾驶乐趣才选 MT。记住「湿式双离合 > 干式双离合」——湿式的离合器泡在油里散热更好、寿命更长。",
      ],
      points: [
        "传动比 = 发动机转速 ÷ 车轮转速，挡位越高传动比越低",
        "CVT 最平顺省油、AT 最均衡耐用、DCT 换挡最快、MT 最纯粹",
        "家用避坑口诀：干式双离合慎重，CVT 别长期暴力地板油",
      ],
    },
    {
      key: "drivetrain",
      title: "驱动形式：前驱 / 后驱 / 四驱",
      icon: "🛞",
      paragraphs: [
        "**前驱（FF）**：发动机横置在前轴上方，直接驱动前轮。结构紧凑、成本低、后排地板平整，是绝大多数家用车的选择。缺点是急加速时重心后移，前轮抓地力下降，容易「推头」（转向不足）。",
        "**后驱（FR）**：发动机纵置，动力通过传动轴传给后轮。前后配重更均衡，加速时重心后移正好压在后轮上，抓地力不降反升，因此高性能车和漂移爱好者偏爱后驱。缺点是结构复杂成本高、传动轴侵占后排空间、冰雪路面易甩尾。",
        "**四驱（AWD/4WD）**：四个轮子都能出力。全时四驱随时分配动力；适时四驱平时前驱、打滑时自动接通后桥，是城市 SUV 的主流方案。四驱提升的是加速抓地力和湿滑路面稳定性，**但既不能缩短刹车距离，也不能替代雪地胎**——这是最常见的误解。",
      ],
      points: [
        "前驱：经济实用、易推头；后驱：配重好、有乐趣、冰雪路面要小心",
        "适时四驱 ≠ 越野四驱：城市 SUV 的四驱主要应对雨雪，不是拿来爬石头",
        "刹车距离与驱动形式无关，安全靠轮胎和速度",
      ],
    },
    {
      key: "turbo",
      title: "涡轮增压 vs 自然吸气",
      icon: "🌀",
      paragraphs: [
        "**自然吸气（NA）**：发动机靠活塞下行产生的负压把空气「吸」进来。进气量受限于气缸容积和大气压，想要更大马力只能加大排量。优点是动力输出线性、响应直接、结构简单。",
        "**涡轮增压（Turbo）**：在排气管里装一个涡轮，用废气的能量驱动压气机，把空气「压」进气缸。同样排量能进入更多空气、喷更多油，轻松多出 30%~50% 的动力。1.5T 的输出可以媲美 2.0L~2.4L 自然吸气。",
        "涡轮的代价：**涡轮迟滞**——低转速时废气能量不足，涡轮不起压，动力响应慢半拍；排气背压升高、机舱温度高，对机油和冷却系统要求更高。主流方案是小惯量涡轮 + 电控泄压阀尽量抹平迟滞。",
      ],
      points: [
        "涡轮 = 用废气的能量压入更多空气 → 小排量大马力",
        "涡轮迟滞：低转速踩油门，动力「思考人生」半秒才来",
        "自然吸气更线性平顺；涡轮机更省油（同动力水平下）且高原动力衰减小",
      ],
    },
    {
      key: "suspension",
      title: "悬挂：麦弗逊 / 双叉臂 / 多连杆",
      icon: "🪝",
      paragraphs: [
        "悬挂的职责：让车轮贴住地面、吸收震动、控制车身姿态。三个主流结构：",
        "**麦弗逊**：结构最简单、成本最低、占用空间小，是前悬挂的绝对主流（从飞度到保时捷 911 都在用）。缺点是侧向支撑相对弱，急弯时车轮外倾角变化大。**双叉臂**：上下两个叉臂像「A」字把车轮夹住，侧向刚性极强，是高性能车和赛车的最爱，但成本高、占空间。**多连杆**：三根以上连杆精确控制车轮运动轨迹，兼顾舒适与操控，常用于中高端车的后悬挂。",
        "选车别只看结构，**调校比结构更重要**：同样麦弗逊，运动调校和舒适调校能开出两辆车的感觉。试驾时找一段烂路和几个急弯，比看参数表有用得多。",
      ],
      points: [
        "麦弗逊：便宜够用；双叉臂：操控上限高；多连杆：舒适操控兼得",
        "悬挂的调校（软硬、阻尼）比结构更影响实际感受",
        "「板悬」扭力梁 ≠ 差：空间大成本低，调校好也能很舒服",
      ],
    },
    {
      key: "newenergy",
      title: "新能源：HEV / PHEV / BEV / 增程",
      icon: "🔋",
      paragraphs: [
        "**HEV 油电混动**：不用充电，发动机为主、电机辅助，刹车回收能量存进小电池。代表：丰田 THS、本田 i-MMD。省油但纯电续航极短。**PHEV 插电混动**：电池更大、能外接充电，纯电跑 50~150 km，长途烧油没焦虑。适合「每天通勤纯电 + 偶尔长途」。",
        "**BEV 纯电**：没有发动机，全靠电池。安静、动力响应极快、使用成本低（家充每公里几分钱），但冬天续航打折、高速能耗高、长途依赖充电桩。**增程（EREV）**：本质上是一台「带发电机的纯电车」——发动机不驱动车轮，只负责发电，永远由电机驱动。城市用电、长途加油，但高速油耗反而不如直驱混动。",
        "选新能源的第一原则：**看你的充电条件**。有家充桩，纯电/插混随便选；没有固定充电条件，老老实实选 HEV 或纯油。别为了「绿牌」硬上纯电。",
      ],
      points: [
        "HEV 不充电省油；PHEV 通勤用电长途用油；BEV 使用成本最低；增程 = 纯电体验 + 加油补能",
        "电池特性：冬天续航打 6~8 折，高速 120km/h 能耗显著上升",
        "没有充电条件别硬买纯电——充电体验决定用车体验",
      ],
    },
  ],
  terms: [
    { term: "马力（hp）", definition: "功率单位，1 马力 ≈ 0.735 kW。决定车的最高速度和持续动力，越大越快。" },
    { term: "扭矩（N·m）", definition: "「劲有多大」的指标，决定起步和加速的推背感。柴油机、电动车扭矩大，所以起步猛。" },
    { term: "排量（L）", definition: "所有气缸工作容积的总和。1.5L、2.0T 中的数字就是它，是动力和税费的基础。" },
    { term: "压缩比", definition: "气缸最大容积与最小容积之比，汽油机一般 9:1~13:1。越高效率越高，但对燃油标号要求也越高。" },
    { term: "百公里加速", definition: "静止加速到 100 km/h 的时间，衡量动力性能的通用指标。家用车 8~12 秒，性能车 3~5 秒。" },
    { term: "油耗（L/100km）", definition: "行驶 100 公里消耗的燃油。实测油耗≈表显+1L，别信「NEDC 工况」的官方数字。" },
    { term: "轴距", definition: "前后轴之间的距离，决定车内纵向空间和高速稳定性。同级别轴距越长后排越大。" },
    { term: "离地间隙", definition: "底盘最低点到地面的距离，SUV 一般 170~220mm，轿车 120~150mm。决定通过性。" },
    { term: "CLTC / WLTC", definition: "两种续航测试标准。CLTC（国内）数字好看但偏乐观，看真实续航请参考 WLTC 打 7~8 折。" },
    { term: "悬挂结构", definition: "连接车轮与车身的机构总称，常见麦弗逊、双叉臂、多连杆、扭力梁。" },
  ],
};

const en: CarsContent = {
  intro:
    "Notes from a car enthusiast: from how engines work to gearbox design, from drivetrains to new energy tech — everything that makes a car go, and go well.",
  topics: [
    {
      key: "engine",
      title: "Engines: The Four-Stroke Cycle",
      icon: "🔥",
      paragraphs: [
        "A gasoline engine works in four strokes: **Intake** — the piston moves down with the intake valve open, drawing in the air-fuel mixture. **Compression** — both valves close and the piston moves up, squeezing the mixture to 1/8–1/12 of its volume. **Power** — the spark plug fires, the mixture burns explosively and slams the piston down; this is the only stroke that produces power. **Exhaust** — the exhaust valve opens and the piston pushes the burnt gases out.",
        "The crankshaft converts the piston's up-and-down motion into rotation: four strokes equal two full crankshaft revolutions (720°). Multi-cylinder engines (usually 4) stagger their power strokes so the output feels smooth — the idle vibration you feel is directly related to cylinder count and layout.",
        "Three keywords for performance: **displacement** (total cylinder volume — the base power indicator), **compression ratio** (how much the mixture is squeezed — affects efficiency and required fuel octane), and **specific output** (horsepower per liter — a measure of engineering skill).",
      ],
      points: [
        "Four strokes = intake → compression → power → exhaust; two crank revolutions per cycle",
        "Only the power stroke produces force; the other three run on flywheel inertia",
        "Turbocharging uses exhaust energy to force in more air — big power from small displacement",
      ],
    },
    {
      key: "gearbox",
      title: "Gearboxes: MT / AT / CVT / DCT",
      icon: "⚙️",
      paragraphs: [
        "An engine only works efficiently between roughly 1000–6500 rpm, while road speed varies from 0 to 200 km/h. The gearbox translates engine speed into suitable wheel speed — **the lower the gear ratio (higher gear), the faster the wheels turn for the same engine speed**.",
        "**MT (manual)**: simple, robust, direct, engaging — but you work the clutch. **AT (torque-converter auto)**: fluid coupling delivers power smoothly; the mature, durable choice. **CVT**: no fixed gears — a steel belt between variable pulleys changes the ratio continuously; ultra-smooth and efficient, but it slips under big torque and lacks character. **DCT (dual-clutch)**: two clutches split odd and even gears; shifts in milliseconds and feels sporty, though low-speed creep can be jerky.",
        "Buying advice: pick AT or CVT for relaxed daily use, a wet-clutch DCT for sportiness, and MT only for pure driving joy. Remember: wet DCT > dry DCT — the wet clutch is oil-cooled and lasts longer.",
      ],
      points: [
        "Gear ratio = engine speed ÷ wheel speed; higher gears mean lower ratios",
        "CVT is smoothest and most efficient, AT most balanced, DCT fastest-shifting, MT most engaging",
        "Avoid dry-clutch DCTs; don't thrash a CVT with repeated full-throttle launches",
      ],
    },
    {
      key: "drivetrain",
      title: "Drivetrains: FWD / RWD / AWD",
      icon: "🛞",
      paragraphs: [
        "**Front-wheel drive (FWD)**: the transverse engine sits above the front axle and drives it directly. Compact, cheap, flat rear floor — the choice of most family cars. The catch: under hard acceleration weight shifts rearward and the front tires lose grip, causing understeer ('pushing wide').",
        "**Rear-wheel drive (RWD)**: a longitudinal engine sends power down a driveshaft to the rear wheels. Weight balance is better, and acceleration plants the rear tires harder — which is why sports cars and drifters love RWD. The cost: complexity, a rear tunnel, and caution on ice and snow.",
        "**All-wheel drive (AWD/4WD)**: all four wheels can be driven. Full-time AWD distributes power constantly; on-demand AWD (the norm in urban SUVs) runs FWD until slip is detected. AWD improves traction and wet-weather stability — **but it neither shortens braking distances nor replaces winter tires**. That's the most common misconception.",
      ],
      points: [
        "FWD: economical, understeers; RWD: balanced, fun, careful in snow",
        "On-demand AWD is not off-road 4WD — city SUVs use it for rain and snow, not rock crawling",
        "Braking distance has nothing to do with which wheels are driven — tires and speed decide",
      ],
    },
    {
      key: "turbo",
      title: "Turbocharged vs Naturally Aspirated",
      icon: "🌀",
      paragraphs: [
        "**Naturally aspirated (NA)**: the engine 'sucks' air in using the vacuum created by the descending piston. Intake is limited by cylinder volume and atmospheric pressure — more power means more displacement. The upside: linear power delivery, instant response, simple construction.",
        "**Turbocharged**: a turbine in the exhaust stream uses waste energy to spin a compressor that forces air into the cylinders. The same displacement can swallow more air and burn more fuel — typically 30–50% more power. A 1.5T can match a 2.0–2.4L naturally aspirated engine.",
        "The price of boost: **turbo lag** — at low rpm there isn't enough exhaust energy to spin the turbo, so response feels delayed. Exhaust backpressure and under-hood heat also rise, demanding better oil and cooling. Small-inertia turbos and electronic wastegates are the usual fixes.",
      ],
      points: [
        "A turbo uses exhaust energy to force in more air — big power from small displacement",
        "Turbo lag: floor it at low rpm and the engine 'thinks about it' for half a second",
        "NA is more linear; turbo is more efficient at equal power and loses less at altitude",
      ],
    },
    {
      key: "suspension",
      title: "Suspension: MacPherson / Double-Wishbone / Multi-Link",
      icon: "🪝",
      paragraphs: [
        "Suspension has three jobs: keep tires on the road, absorb bumps, and control body attitude. Three dominant designs:",
        "**MacPherson strut**: the simplest, cheapest and most space-efficient — the default front suspension from a Fit to a Porsche 911. Its weakness is lateral support: wheel camber changes noticeably in hard corners. **Double-wishbone**: two A-shaped arms clamp the wheel from above and below, giving superb lateral rigidity — the favorite of performance cars and race cars, at the cost of money and space. **Multi-link**: three or more links precisely control wheel motion, blending comfort and handling; common on premium rear axles.",
        "Don't judge a car by its structure alone — **tuning matters more than architecture**. The same MacPherson setup can feel like two different cars depending on spring and damper tuning. A test drive over rough roads and through tight corners beats any spec sheet.",
      ],
      points: [
        "MacPherson: cheap and good enough; double-wishbone: highest handling ceiling; multi-link: comfort plus control",
        "Tuning (spring rates, damping) affects feel more than the layout itself",
        "A torsion-beam 'solid axle' isn't automatically bad — tuned well it can ride beautifully",
      ],
    },
    {
      key: "newenergy",
      title: "New Energy: HEV / PHEV / BEV / EREV",
      icon: "🔋",
      paragraphs: [
        "**HEV (hybrid)**: no plugging in. The engine does the heavy lifting with electric assistance; braking energy recharges a small battery. Toyota THS and Honda i-MMD are the reference designs. Efficient, but pure-electric range is negligible. **PHEV (plug-in hybrid)**: a bigger battery that charges from the wall gives 50–150 km of electric range, with the engine for long trips — ideal for electric commuting plus occasional road trips.",
        "**BEV (battery electric)**: no engine at all. Silent, instant torque, cheapest to run (home charging costs a few cents per km) — but winter range drops, high-speed energy use climbs, and long trips depend on charging infrastructure. **EREV (extended range)**: essentially an EV with a generator on board — the engine never drives the wheels, it only makes electricity. Electric in the city, fuel on the highway, though highway efficiency lags direct-drive hybrids.",
        "Rule number one for choosing: **look at your charging situation first**. Home charger? BEV or PHEV makes sense. No reliable charging? Choose HEV or stick with petrol. Don't force an EV for the license plate.",
      ],
      points: [
        "HEV saves fuel without charging; PHEV commutes electric and travels on fuel; BEV is cheapest to run; EREV = EV feel + fuel refueling",
        "Battery reality: winter range drops 20–40%; energy use climbs sharply at 120 km/h",
        "No charging access? Don't buy a BEV — charging experience defines EV ownership",
      ],
    },
  ],
  terms: [
    { term: "Horsepower (hp)", definition: "A power unit; 1 hp ≈ 0.735 kW. Determines top speed and sustained acceleration." },
    { term: "Torque (N·m)", definition: "The 'shove'. Decides launch feel and low-end grunt. Diesels and EVs have huge torque, hence their punchy starts." },
    { term: "Displacement (L)", definition: "Total swept volume of all cylinders. The number in '2.0T' — basis for power and vehicle tax." },
    { term: "Compression ratio", definition: "Max cylinder volume ÷ min volume; petrol engines typically 9:1–13:1. Higher is more efficient but demands higher-octane fuel." },
    { term: "0–100 km/h", definition: "Standstill to 100 km/h time — the universal performance yardstick. Family cars: 8–12 s; performance cars: 3–5 s." },
    { term: "Fuel consumption (L/100km)", definition: "Fuel used per 100 km. Real-world figures run about 1 L above the dash readout; ignore official NEDC numbers." },
    { term: "Wheelbase", definition: "Distance between front and rear axles. Longer means more rear legroom and high-speed stability." },
    { term: "Ground clearance", definition: "Lowest chassis point to the ground; SUVs 170–220 mm, sedans 120–150 mm. Defines how rough a road you can take." },
    { term: "CLTC / WLTC", definition: "Range test standards. CLTC (China) looks optimistic — for realistic range, take WLTC and knock off 20–30%." },
    { term: "Suspension type", definition: "The linkage between wheels and body: MacPherson, double-wishbone, multi-link, torsion beam." },
  ],
};

const data: Record<Locale, CarsContent> = { zh, en };

export function getCarsContent(locale: Locale): CarsContent {
  return data[locale];
}
