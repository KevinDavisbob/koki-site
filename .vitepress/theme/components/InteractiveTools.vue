<script setup lang="ts">
import { computed, ref } from 'vue'

type ToolKind = 'security' | 'challenge' | 'cars' | 'physics'
type CryptoTab = 'caesar' | 'base64'
type CryptoMode = 'encode' | 'decode'

const props = defineProps<{ kind: ToolKind; locale?: 'zh' | 'en' }>()
const en = computed(() => props.locale === 'en')

const securityTab = ref<CryptoTab>('caesar')
const cryptoMode = ref<CryptoMode>('encode')
const cryptoInput = ref('')
const shift = ref(3)

function caesarTransform(value: string, amount: number) {
  return [...value].map((char) => {
    const code = char.charCodeAt(0)
    const base = code >= 97 && code <= 122 ? 97 : code >= 65 && code <= 90 ? 65 : -1
    return base === -1 ? char : String.fromCharCode((code - base + amount + 26) % 26 + base)
  }).join('')
}

function encodeBase64(value: string) {
  if (typeof btoa !== 'function' || typeof TextEncoder === 'undefined') return ''
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => { binary += String.fromCharCode(byte) })
  return btoa(binary)
}

function decodeBase64(value: string) {
  if (typeof atob !== 'function' || typeof TextDecoder === 'undefined') throw new Error('invalid base64')
  const binary = atob(value.replace(/\s/g, ''))
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

const cryptoResult = computed(() => {
  if (!cryptoInput.value) return ''
  if (securityTab.value === 'caesar') {
    return caesarTransform(cryptoInput.value, cryptoMode.value === 'encode' ? shift.value : -shift.value)
  }
  if (cryptoMode.value === 'encode') return encodeBase64(cryptoInput.value)
  try { return decodeBase64(cryptoInput.value) } catch { return '' }
})

const cryptoError = computed(() => {
  if (securityTab.value !== 'base64' || cryptoMode.value !== 'decode' || !cryptoInput.value) return ''
  try { decodeBase64(cryptoInput.value); return '' } catch {
    return en.value ? 'The value is not valid Base64.' : '输入内容不是有效的 Base64。'
  }
})

type Challenge = { title: string; prompt: string; hint: string; answer: string }
const challengeData: Challenge[] = [
  { title: 'Source trail / 源码线索', prompt: 'Inspect the page source and find the first flag.', hint: 'Look for a short flag in the rendered page and its source.', answer: 'flag{read_the_source}' },
  { title: 'Caesar shift / 凯撒移位', prompt: 'Decode the lesson phrase with a shift of 3.', hint: 'The answer is the flag shown after shifting letters backwards.', answer: 'flag{small_steps}' },
  { title: 'Permission boundary / 授权边界', prompt: 'Name the rule that keeps security practice ethical.', hint: 'The answer starts with “flag” and contains “authorized”.', answer: 'flag{authorized_only}' },
  { title: 'Encoding / 编码', prompt: 'Identify the reversible text representation used by the tool above.', hint: 'It uses letters, numbers, +, / and = padding.', answer: 'flag{encode_decode}' },
  { title: 'Practice habit / 练习习惯', prompt: 'What makes a difficult topic easier to learn?', hint: 'The flag contains two words about steady practice.', answer: 'flag{keep_learning}' },
  { title: 'Local milestone / 本地彩蛋', prompt: 'Enter the final local milestone flag.', hint: 'It contains the current project year.', answer: 'flag{koki_2026}' },
]
const challengePromptsZh = ['查看页面源码，找到第一枚 flag。', '用偏移量 3 解密课程短语。', '说出保证安全实践合乎道德的规则。', '识别上方工具使用的可逆文本表示。', '什么能让困难主题更容易学会？', '输入本地练习的最终彩蛋 flag。']
const challengeHintsZh = ['在渲染页面和源码中寻找一段简短 flag。', '答案是把字母向后移动后的 flag。', '提示：答案包含 authorized。', '它使用字母、数字、+、/ 和 = 填充。', '提示：flag 包含关于持续练习的两个单词。', '提示：它包含当前项目年份。']
const challenges = computed(() => challengeData.map((challenge, index) => ({
  ...challenge,
  title: en.value ? challenge.title.split(' / ')[0] : challenge.title.split(' / ')[1],
  prompt: en.value ? challenge.prompt : challengePromptsZh[index],
  hint: en.value ? challenge.hint : challengeHintsZh[index],
})))
const activeChallenge = ref<number | null>(0)
const challengeAnswers = ref<Record<number, string>>({})
const challengeFeedback = ref<Record<number, 'success' | 'error'>>({})
const completedChallenges = ref<number[]>([])

function verifyChallenge(index: number) {
  const answer = (challengeAnswers.value[index] || '').trim().toLowerCase()
  if (answer === challengeData[index].answer) {
    if (!completedChallenges.value.includes(index)) completedChallenges.value.push(index)
    challengeFeedback.value[index] = 'success'
  } else {
    challengeFeedback.value[index] = 'error'
  }
}

const carRpm = ref(1200)
const gear = ref(3)
const tireDiameter = ref(0.64)
const finalDrive = ref(3.9)
const gearRatios = [0, 3.5, 2.1, 1.4, 1, 0.8, 0.65]
const carSpeed = computed(() => {
  if (gear.value === 0) return 0
  const tireCircumference = Math.PI * tireDiameter.value
  return carRpm.value / (gearRatios[gear.value] * finalDrive.value) * tireCircumference * 60 / 1000
})
const enginePhase = computed(() => Math.floor((carRpm.value / 900) % 4))
const enginePhaseLabel = computed(() => {
  const phases = en.value ? ['Intake', 'Compression', 'Power', 'Exhaust'] : ['进气', '压缩', '做功', '排气']
  return phases[enginePhase.value]
})
const motorDuration = computed(() => `${Math.max(0.15, 2.2 - carRpm.value / 3500)}s`)

const frequency = ref(10)
const poles = ref(4)
const slip = ref(2)
const synchronousSpeed = computed(() => 120 * frequency.value / poles.value)
const actualSpeed = computed(() => synchronousSpeed.value * (1 - slip.value / 100))
const motorDurationPhysics = computed(() => `${Math.max(0.15, 2.4 - actualSpeed.value / 1800)}s`)
</script>

<template>
  <div class="tool-shell">
    <div v-if="kind === 'security'" class="tool-tabs" role="tablist">
      <button type="button" :class="{ active: securityTab === 'caesar' }" @click="securityTab = 'caesar'">{{ en ? 'Caesar cipher' : '凯撒密码' }}</button>
      <button type="button" :class="{ active: securityTab === 'base64' }" @click="securityTab = 'base64'">{{ en ? 'Base64' : 'Base64 编解码' }}</button>
    </div>

    <div v-if="kind === 'security'" class="tool-grid">
      <div class="tool-controls">
        <label>{{ en ? 'Operation' : '操作' }}
          <select v-model="cryptoMode">
            <option value="encode">{{ securityTab === 'caesar' ? (en ? 'Encrypt' : '加密') : (en ? 'Encode' : '编码') }}</option>
            <option value="decode">{{ securityTab === 'caesar' ? (en ? 'Decrypt' : '解密') : (en ? 'Decode' : '解码') }}</option>
          </select>
        </label>
        <label v-if="securityTab === 'caesar'">{{ en ? 'Shift' : '偏移量' }}
          <input v-model.number="shift" type="range" min="-13" max="13" step="1">
          <output>{{ shift }}</output>
        </label>
      </div>
      <label>{{ en ? 'Input' : '输入' }}<textarea v-model="cryptoInput" rows="3" :placeholder="en ? 'Processed locally in your browser' : '仅在浏览器本地处理'"></textarea></label>
      <div class="tool-output"><span>{{ en ? 'Result' : '结果' }}</span><code class="tool-result">{{ cryptoResult || (cryptoError ? '—' : (en ? 'Waiting for input…' : '等待输入…')) }}</code></div>
      <p v-if="cryptoError" class="tool-error" role="alert">{{ cryptoError }}</p>
    </div>

    <div v-else-if="kind === 'challenge'" class="challenge-grid">
      <article v-for="(challenge, index) in challenges" :key="challenge.answer" class="challenge-item" :class="{ complete: completedChallenges.includes(index) }">
        <strong>0{{ index + 1 }}</strong>
        <div class="challenge-content">
          <h3>{{ challenge.title }}</h3>
          <p v-if="completedChallenges.includes(index)" class="challenge-flag">{{ challenge.answer }}</p>
          <template v-else-if="activeChallenge === index">
            <p>{{ challenge.prompt }}</p>
            <p class="challenge-hint">{{ en ? 'Hint:' : '提示：' }} {{ challenge.hint }}</p>
            <div class="challenge-form">
              <input v-model="challengeAnswers[index]" :aria-label="en ? 'Challenge answer' : '挑战答案'" :placeholder="en ? 'Enter the flag' : '输入 flag'" @keyup.enter="verifyChallenge(index)">
              <button type="button" @click="verifyChallenge(index)">{{ en ? 'Check' : '校验' }}</button>
            </div>
            <p v-if="challengeFeedback[index] === 'error'" class="tool-error" role="alert">{{ en ? 'Not quite. Read the hint and try again.' : '还不对，请结合提示再试一次。' }}</p>
            <p v-else-if="challengeFeedback[index] === 'success'" class="tool-success">{{ en ? 'Solved.' : '已通过。' }}</p>
          </template>
          <p v-else class="muted">{{ en ? 'Challenge locked' : '挑战待解锁' }}</p>
        </div>
        <button v-if="!completedChallenges.includes(index)" type="button" class="challenge-toggle" @click="activeChallenge = activeChallenge === index ? null : index">{{ activeChallenge === index ? (en ? 'Hide' : '收起') : (en ? 'Open' : '查看') }}</button>
        <span v-else class="challenge-done">{{ en ? 'Done' : '完成' }}</span>
      </article>
      <p class="muted">{{ en ? `Solved ${completedChallenges.length} / ${challenges.length}. These puzzles run locally for learning.` : `已完成 ${completedChallenges.length} / ${challenges.length}。所有挑战仅用于本地学习。` }}</p>
    </div>

    <div v-else-if="kind === 'cars'" class="sim-grid">
      <div class="engine-visual"><svg viewBox="0 0 420 180" role="img" :aria-label="en ? 'Four-stroke engine animation' : '四冲程发动机动画'"><rect x="40" y="45" width="340" height="95" rx="12" fill="none" stroke="currentColor" opacity=".3"/><g v-for="x in [105,210,315]" :key="x"><rect :x="x - 24" y="58" width="48" height="70" rx="6" fill="currentColor" opacity=".08" stroke="currentColor"/><rect class="piston" :style="{ animationDuration: motorDuration, animationDelay: `${(x - 105) / 105 * .25}s` }" :x="x - 17" y="75" width="34" height="27" rx="4" fill="#ff375f"/><line :x1="x" y1="102" :x2="x" y2="133" stroke="#ff375f" stroke-width="4"/></g><line x1="65" y1="137" x2="355" y2="137" stroke="#2f7cf6" stroke-width="6"/><text x="210" y="30" text-anchor="middle" fill="currentColor" font-size="14">{{ enginePhaseLabel }}</text></svg></div>
      <div class="sim-controls">
        <label>{{ en ? 'Engine speed' : '发动机转速' }}<input v-model.number="carRpm" type="range" min="600" max="6500" step="100"><output>{{ carRpm }} rpm</output></label>
        <label>{{ en ? 'Gear' : '挡位' }}<select v-model.number="gear"><option :value="0">{{ en ? 'N · Neutral' : 'N · 空挡' }}</option><option v-for="g in 6" :key="g" :value="g">{{ en ? `${g} gear` : `${g} 挡` }}</option></select></label>
        <label>{{ en ? 'Tire diameter' : '轮胎直径' }}<input v-model.number="tireDiameter" type="range" min="0.5" max="0.8" step="0.01"><output>{{ tireDiameter.toFixed(2) }} m</output></label>
        <label>{{ en ? 'Final drive' : '主减速比' }}<input v-model.number="finalDrive" type="range" min="2.5" max="5.5" step="0.1"><output>{{ finalDrive.toFixed(1) }}</output></label>
      </div>
      <div class="metric"><span>{{ en ? 'Estimated speed' : '估算车速' }}</span><strong>{{ gear === 0 ? (en ? 'Neutral' : '空挡') : `${carSpeed.toFixed(1)} km/h` }}</strong></div>
      <p class="sim-note">{{ en ? `Four-stroke phase: ${enginePhaseLabel}. Speed uses gear ratio, final drive and tire circumference.` : `当前冲程：${enginePhaseLabel}。车速按挡位、主减速比和轮胎周长估算。` }}</p>
    </div>

    <div v-else class="sim-grid">
      <div class="motor-visual"><svg class="motor-svg" :style="{ animationDuration: motorDurationPhysics }" viewBox="0 0 220 220" role="img" :aria-label="en ? 'Three-phase motor animation' : '三相电机动画'"><circle cx="110" cy="110" r="88" fill="none" stroke="currentColor" opacity=".25" stroke-width="3"/><path d="M110 22v35M198 110h-35M110 198v-35M22 110h35" stroke="#ff375f" stroke-width="12" stroke-linecap="round"/><circle cx="110" cy="110" r="44" fill="none" stroke="#2f7cf6" stroke-width="18"/><path d="M110 66v88M66 110h88" stroke="#f59e0b" stroke-width="8" stroke-linecap="round"/></svg></div>
      <div class="sim-controls">
        <label>{{ en ? 'Supply frequency' : '供电频率' }}<input v-model.number="frequency" type="range" min="2" max="60" step="1"><output>{{ frequency }} Hz</output></label>
        <label>{{ en ? 'Number of poles' : '电机极数' }}<input v-model.number="poles" type="range" min="2" max="12" step="2"><output>{{ poles }}</output></label>
        <label>{{ en ? 'Slip' : '负载滑差' }}<input v-model.number="slip" type="range" min="0" max="10" step="0.5"><output>{{ slip.toFixed(1) }}%</output></label>
      </div>
      <div class="metric"><span>{{ en ? 'Synchronous speed' : '同步转速' }}</span><strong>{{ synchronousSpeed.toFixed(0) }} rpm</strong></div>
      <div class="metric"><span>{{ en ? 'Estimated rotor speed' : '估算转子转速' }}</span><strong>{{ actualSpeed.toFixed(0) }} rpm</strong></div>
      <p class="sim-note">{{ en ? 'Formula: nₛ = 120 × frequency ÷ poles; slip lowers the real rotor speed.' : '公式：nₛ = 120 × 频率 ÷ 极数；负载滑差会让实际转子转速略低。' }}</p>
    </div>
  </div>
</template>
