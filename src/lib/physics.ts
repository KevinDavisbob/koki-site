import type { Locale } from "@/i18n/routing";

export type PhysicsTopic = {
  key: string;
  title: string;
  icon: string;
  paragraphs: string[];
  points: string[];
};

export type MotorBrand = {
  name: string;
  origin: string;
  icon: string;
  description: string;
  strengths: string[];
};

export type PhysicsTerm = {
  term: string;
  definition: string;
};

export type PhysicsContent = {
  intro: string;
  topics: PhysicsTopic[];
  brands: MotorBrand[];
  terms: PhysicsTerm[];
};

const zh: PhysicsContent = {
  intro:
    "物理 × 工程：从有刷到无刷，看看电机这种「把电变成转动的机器」是怎么工作的，再认识几个电机领域的巨头品牌。",
  topics: [
    {
      key: "brushed",
      title: "有刷直流电机：经典但没退休",
      icon: "⚡",
      paragraphs: [
        "有刷电机是最古老的电机设计之一，结构核心是三样：**定子磁铁**（提供磁场）、**转子线圈**（通电后在磁场中受力转动）、**换向器 + 电刷**（解决持续旋转的关键装置）。",
        "为什么需要换向器？转子线圈转过半圈后，如果不改变电流方向，转矩就会反向——转子会来回摆动而不是持续旋转。换向器是一个随转子一起转动的分瓣铜环，电刷压在上面：每过半圈，线圈电流方向自动翻转一次，**保证转矩方向始终一致**。这就是「有刷」名字的由来——刷子真的会磨。",
        "优点：结构简单、成本低、调速容易（调电压就行）。缺点：电刷摩擦带来磨损、火花、噪音和电磁干扰，效率一般只有 75%~80%，寿命约数千小时。所以它至今活跃在：电动玩具、电钻、汽车雨刮和车窗电机里——便宜、耐造、坏了换一个也不心疼。",
      ],
      points: [
        "核心装置 = 换向器 + 电刷：机械式电流换向，每半圈翻转一次电流方向",
        "通电导线在磁场中受力（F = BIL），这就是电机转矩的来源",
        "电刷会磨损 → 火花、噪音、寿命有限，但结构简单便宜",
      ],
    },
    {
      key: "brushless",
      title: "无刷直流电机：把电刷换成芯片",
      icon: "🔀",
      paragraphs: [
        "无刷电机（BLDC）把有刷电机的结构「内外颠倒」：**磁铁装在转子上，线圈留在定子上**，而且彻底取消了电刷和换向器。那电流方向谁负责翻转？——由**电子控制器（ESC）**负责。",
        "控制器通过霍尔传感器（或反电动势）实时检测转子位置，然后按顺序给三相线圈通电，产生一个**旋转磁场**，永磁转子被磁场「牵着」同步旋转。三相依次通电的顺序就是电机旋转的节拍——下面的模拟器里你可以直观看到这个过程。",
        "没有电刷意味着：不磨损（寿命数万小时）、无火花（可用于粉尘/易燃环境）、效率高达 85%~95%、转速可以做到十万转以上（戴森吹风机的核心技术就是高速无刷电机）、更安静。代价是**必须搭配控制器**，成本更高。",
        "应用：无人机、电动自行车和电动车、变频空调压缩机、电脑散热风扇、高端电动工具，几乎你能想到的所有「高级转动」。",
      ],
      points: [
        "电子换向代替机械换向：霍尔传感器检测位置 → 控制器按序给三相线圈通电",
        "旋转磁场牵着永磁转子转，两者保持同步——同步转速 n = 60f / p",
        "无磨损、高效率、高转速、静音；缺点是需要控制器、成本高",
      ],
    },
  ],
  brands: [
    {
      name: "西门子 Siemens",
      origin: "德国",
      icon: "🏭",
      description:
        "工业电机与自动化领域的全球领导者，1847 年成立。西门子的强项是大型工业电机、变频器和工厂自动化整体方案，从风力发电机到钢铁生产线都有它的身影。",
      strengths: ["SINAMICS 变频器", "SIMOTICS 工业电机", "风力发电与工业驱动"],
    },
    {
      name: "松下 Panasonic",
      origin: "日本",
      icon: "🏠",
      description:
        "小型精密电机之王。松下把电机做到了极致的小型化和静音：洗衣机、空调、风扇里的无刷电机大量出自松下，汽车电子里的车载电机也是它的强项。",
      strengths: ["家电无刷电机", "小型化与静音技术", "车载电机"],
    },
    {
      name: "三菱电机 Mitsubishi Electric",
      origin: "日本",
      icon: "🤖",
      description:
        "工厂自动化（FA）巨头。三菱的伺服电机和变频器是数控机床、工业机器人的常见配置，MELSERVO 伺服系统以高精度定位著称。",
      strengths: ["MELSERVO 伺服系统", "FREQROL 变频器", "工厂自动化 / 机器人"],
    },
  ],
  terms: [
    { term: "定子 / 转子", definition: "电机不动的部分是定子，转动的部分是转子。有刷电机线圈在转子，无刷电机磁铁在转子。" },
    { term: "换向器", definition: "有刷电机转子上的分瓣铜环，配合电刷实现电流方向的机械式切换。" },
    { term: "电刷", definition: "压在换向器上的碳刷，导电又耐磨。有刷电机的名字和主要损耗都来自它。" },
    { term: "霍尔传感器", definition: "无刷电机里检测转子磁极位置的传感器，告诉控制器什么时候该给哪相线圈通电。" },
    { term: "PWM 调速", definition: "脉冲宽度调制——用开关的占空比等效出不同的电压，实现无级调速。ESC 的核心技术。" },
    { term: "KV 值", definition: "无刷电机的参数：每伏电压对应的空载转速（rpm/V）。无人机电机常见 1000~3000KV。" },
    { term: "转矩", definition: "电机「有多大力」的指标，单位 N·m。转速一定时，功率 = 转矩 × 角速度。" },
    { term: "同步转速", definition: "n = 60f / p：f 是电流频率，p 是磁极对数。无刷电机转子的转速与旋转磁场同步。" },
    { term: "变频器（VFD）", definition: "改变交流电频率来调节电机转速的设备，西门子、三菱的招牌产品。" },
    { term: "伺服电机", definition: "带位置反馈的高精度电机系统，能精确控制角度和速度，用于机器人和数控机床。" },
    { term: "步进电机", definition: "每接收一个脉冲就转过固定角度（如 1.8°），开环控制成本低，3D 打印机和雕刻机常用。" },
    { term: "极对数 p", definition: "磁极的对数。同步转速公式 n=60f/p 里的 p：极对数越多，同频率下转速越低、转矩越大。" },
  ],
};

const en: PhysicsContent = {
  intro:
    "Physics × engineering: how electric motors turn electricity into rotation — from brushed to brushless — plus the brands that rule the motor world.",
  topics: [
    {
      key: "brushed",
      title: "Brushed DC Motors: Classic, Not Retired",
      icon: "⚡",
      paragraphs: [
        "The brushed motor is one of the oldest motor designs. Three parts matter: **stator magnets** (the field), a **rotor coil** (force on a current-carrying wire in a magnetic field), and the **commutator + brushes** — the trick that makes continuous rotation possible.",
        "Why the commutator? Half a turn in, the coil's current must reverse or the torque reverses — the rotor would rock back and forth instead of spinning. The commutator is a split copper ring rotating with the rotor; brushes press against it and flip the coil's current every half turn, **keeping torque in one direction**. That's where 'brushed' comes from — the brushes literally wear down.",
        "Pros: simple, cheap, easy speed control (just vary the voltage). Cons: brush friction brings wear, sparks, noise and EMI; efficiency is only 75–80% and lifespan a few thousand hours. Which is why it still runs: toys, power drills, car wipers and window motors — cheap, tough, and no heartbreak when one dies.",
      ],
      points: [
        "The core device = commutator + brushes: mechanical current reversal every half turn",
        "Force on a current-carrying wire in a magnetic field (F = BIL) is where torque comes from",
        "Brushes wear → sparks, noise, limited life — but simple and inexpensive",
      ],
    },
    {
      key: "brushless",
      title: "Brushless DC Motors: Chips Instead of Brushes",
      icon: "🔀",
      paragraphs: [
        "The brushless motor (BLDC) turns the brushed design inside out: **magnets on the rotor, coils on the stator**, and no brushes or commutator at all. So who flips the current? The **electronic speed controller (ESC)**.",
        "The controller senses rotor position via Hall sensors (or back-EMF) and energizes the three phase coils in sequence, creating a **rotating magnetic field** that drags the permanent-magnet rotor around. That energization sequence is the rhythm of the motor — you can watch it happen in the simulator below.",
        "No brushes means: nothing wears out (tens of thousands of hours), no sparks (safe around dust and flammables), 85–95% efficiency, speeds beyond 100,000 rpm (the core tech behind Dyson hair dryers), and much quieter. The price: you must pair it with a controller.",
        "Applications: drones, e-bikes and EVs, inverter AC compressors, computer fans, premium power tools — almost every 'premium rotation' you can think of.",
      ],
      points: [
        "Electronic commutation: Hall sensors detect position → controller energizes three phases in sequence",
        "The rotating field drags the rotor along in sync — synchronous speed n = 60f / p",
        "Wear-free, efficient, fast, quiet; the trade-off is needing a controller",
      ],
    },
  ],
  brands: [
    {
      name: "Siemens",
      origin: "Germany",
      icon: "🏭",
      description:
        "A global leader in industrial motors and automation since 1847. Siemens dominates large industrial motors, VFDs and complete factory automation — from wind turbines to steel mills.",
      strengths: ["SINAMICS drives", "SIMOTICS motors", "Wind power & industrial drives"],
    },
    {
      name: "Panasonic",
      origin: "Japan",
      icon: "🏠",
      description:
        "The king of small precision motors. Panasonic pushes miniaturization and silence to the extreme — its brushless motors live inside washing machines, air conditioners and fans, and its automotive motors are everywhere.",
      strengths: ["Appliance BLDC motors", "Miniaturization & quiet tech", "Automotive motors"],
    },
    {
      name: "Mitsubishi Electric",
      origin: "Japan",
      icon: "🤖",
      description:
        "A factory automation (FA) giant. Mitsubishi's servo motors and VFDs are common inside CNC machines and industrial robots — the MELSERVO line is famous for high-precision positioning.",
      strengths: ["MELSERVO servo systems", "FREQROL drives", "Factory automation / robotics"],
    },
  ],
  terms: [
    { term: "Stator / Rotor", definition: "The stator is the stationary part; the rotor spins. Brushed motors put coils on the rotor; brushless put magnets there." },
    { term: "Commutator", definition: "The split copper ring on a brushed rotor that mechanically reverses current direction." },
    { term: "Brushes", definition: "Carbon contacts riding the commutator — conductive and wearable. Brushed motors are named after their main wear item." },
    { term: "Hall sensor", definition: "Senses rotor magnet position in a BLDC, telling the controller which phase to energize next." },
    { term: "PWM speed control", definition: "Pulse-width modulation — switch on/off rapidly to emulate any voltage, enabling stepless speed control. The heart of every ESC." },
    { term: "KV rating", definition: "A BLDC parameter: no-load rpm per volt. Drone motors typically run 1000–3000 KV." },
    { term: "Torque", definition: "How hard a motor twists, in N·m. At a given speed, power = torque × angular velocity." },
    { term: "Synchronous speed", definition: "n = 60f / p, where f is current frequency and p is pole pairs. BLDC rotors spin in sync with the rotating field." },
    { term: "VFD (variable-frequency drive)", definition: "Varies AC frequency to control motor speed — Siemens' and Mitsubishi's signature product." },
    { term: "Servo motor", definition: "A motor with position feedback for precise angle and speed control — robots and CNC machines." },
    { term: "Stepper motor", definition: "Rotates a fixed angle per pulse (e.g. 1.8°). Cheap open-loop control — 3D printers and engravers." },
    { term: "Pole pairs p", definition: "The p in n = 60f/p: more pole pairs mean lower speed but higher torque at the same frequency." },
  ],
};

const data: Record<Locale, PhysicsContent> = { zh, en };

export function getPhysicsContent(locale: Locale): PhysicsContent {
  return data[locale];
}
