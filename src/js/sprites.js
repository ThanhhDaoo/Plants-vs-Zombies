export const ZOMBIE_IMAGES = {
  normal: '/assets/zombie_normal.png',
  cone: '/assets/zombie_cone.png',
  bucket: '/assets/zombie_bucket.png',
  fast: '/assets/zombie_fast.png',
  strong: '/assets/zombie_strong.png'
};

export const SPRITES = {

  // --- PLANTS ---

  peashooter: `
    <svg viewBox="0 0 100 100" class="sprite-svg peashooter-sprite">
      <!-- Shadow -->
      <ellipse cx="50" cy="92" rx="28" ry="6" fill="rgba(0,0,0,0.25)" />
      <!-- Base Leaves -->
      <path d="M50 82 C35 84 20 88 15 82 C22 75 38 76 48 80 Z" fill="#388e3c" stroke="#1b5e20" stroke-width="2"/>
      <path d="M50 82 C65 84 80 88 85 82 C78 75 62 76 52 80 Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="2"/>
      <path d="M50 84 C48 95 35 96 28 92 C36 86 45 84 50 84 Z" fill="#43a047" stroke="#1b5e20" stroke-width="2"/>
      <path d="M50 84 C52 95 65 96 72 92 C64 86 55 84 50 84 Z" fill="#388e3c" stroke="#1b5e20" stroke-width="2"/>
      <!-- Stem -->
      <path d="M48 80 C46 65 42 55 45 42" stroke="#4caf50" stroke-width="7" stroke-linecap="round" fill="none"/>
      <path d="M48 80 C46 65 42 55 45 42" stroke="#2e7d32" stroke-width="2" stroke-linecap="round" fill="none"/>
      <!-- Back Ponytail Leaf -->
      <path d="M35 32 C15 28 8 36 12 45 C20 45 28 38 35 36 Z" fill="#66bb6a" stroke="#1b5e20" stroke-width="2"/>
      <!-- Head Group -->
      <g class="anim-head">
        <!-- Main Head Ball -->
        <circle cx="48" cy="35" r="22" fill="#7cb342" stroke="#33691e" stroke-width="2.5"/>
        <ellipse cx="44" cy="28" rx="14" ry="9" fill="#9ccc65"/>
        <!-- Snout / Barrel -->
        <path d="M58 26 C68 24 78 22 84 26 C88 28 88 42 84 44 C78 48 68 46 58 44 Z" fill="#689f38" stroke="#33691e" stroke-width="2.5"/>
        <ellipse cx="84" cy="35" rx="5" ry="9" fill="#33691e"/>
        <ellipse cx="83" cy="35" rx="3.5" ry="7" fill="#1b5e20"/>
        <!-- Big Cute Eye -->
        <ellipse cx="48" cy="28" rx="6" ry="8" fill="#ffffff" stroke="#1b5e20" stroke-width="1.5"/>
        <ellipse cx="50" cy="28" rx="3.5" ry="5.5" fill="#111111"/>
        <circle cx="51.5" cy="26" r="1.8" fill="#ffffff"/>
        <!-- Cheek blush -->
        <ellipse cx="40" cy="40" rx="4" ry="2.5" fill="rgba(255,100,100,0.3)"/>
      </g>
    </svg>
  `,

  sunflower: `
    <svg viewBox="0 0 100 100" class="sprite-svg sunflower-sprite">
      <!-- Shadow -->
      <ellipse cx="50" cy="92" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
      <!-- Base Leaves -->
      <path d="M50 82 C30 84 15 88 12 82 C22 75 38 76 48 80 Z" fill="#388e3c" stroke="#1b5e20" stroke-width="2"/>
      <path d="M50 82 C70 84 85 88 88 82 C78 75 62 76 52 80 Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="2"/>
      <!-- Stem with little sway -->
      <path d="M50 82 C48 68 48 55 50 45" stroke="#4caf50" stroke-width="7" stroke-linecap="round" fill="none"/>
      <!-- Rotating Golden Petals -->
      <g class="anim-petals" transform-origin="50 40">
        <!-- 12 Petals around the center -->
        <ellipse cx="50" cy="14" rx="8" ry="14" fill="#fbc02d" stroke="#f57f17" stroke-width="1.8"/>
        <ellipse cx="50" cy="66" rx="8" ry="14" fill="#fbc02d" stroke="#f57f17" stroke-width="1.8"/>
        <ellipse cx="24" cy="40" rx="14" ry="8" fill="#fbc02d" stroke="#f57f17" stroke-width="1.8"/>
        <ellipse cx="76" cy="40" rx="14" ry="8" fill="#fbc02d" stroke="#f57f17" stroke-width="1.8"/>
        <ellipse cx="32" cy="22" rx="10" ry="14" transform="rotate(-45 32 22)" fill="#ffd54f" stroke="#f57f17" stroke-width="1.8"/>
        <ellipse cx="68" cy="22" rx="10" ry="14" transform="rotate(45 68 22)" fill="#ffd54f" stroke="#f57f17" stroke-width="1.8"/>
        <ellipse cx="32" cy="58" rx="10" ry="14" transform="rotate(45 32 58)" fill="#ffd54f" stroke="#f57f17" stroke-width="1.8"/>
        <ellipse cx="68" cy="58" rx="10" ry="14" transform="rotate(-45 68 58)" fill="#ffd54f" stroke="#f57f17" stroke-width="1.8"/>
      </g>
      <!-- Sunflower Center Face -->
      <g class="anim-head">
        <circle cx="50" cy="40" r="19" fill="#795548" stroke="#4e342e" stroke-width="2.5"/>
        <circle cx="50" cy="40" r="16" fill="#8d6e63"/>
        <!-- Big Happy Eyes -->
        <ellipse cx="43" cy="36" rx="3.5" ry="6" fill="#111111"/>
        <circle cx="44.2" cy="34" r="1.5" fill="#ffffff"/>
        <ellipse cx="57" cy="36" rx="3.5" ry="6" fill="#111111"/>
        <circle cx="58.2" cy="34" r="1.5" fill="#ffffff"/>
        <!-- Sweet Smile -->
        <path d="M43 45 Q50 51 57 45" stroke="#3e2723" stroke-width="2.2" stroke-linecap="round" fill="none"/>
        <!-- Pink Blush Cheeks -->
        <circle cx="38" cy="43" r="3" fill="rgba(255,138,128,0.7)"/>
        <circle cx="62" cy="43" r="3" fill="rgba(255,138,128,0.7)"/>
      </g>
    </svg>
  `,

  wallnut: `
    <svg viewBox="0 0 100 100" class="sprite-svg wallnut-sprite">
      <!-- Shadow -->
      <ellipse cx="50" cy="92" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
      <!-- Main Nut Body -->
      <g class="anim-body">
        <path d="M50 14 C68 14 76 30 76 56 C76 76 68 88 50 88 C32 88 24 76 24 56 C24 30 32 14 50 14 Z" 
              fill="#a1887f" stroke="#4e342e" stroke-width="3"/>
        <!-- Nut shading -->
        <path d="M50 17 C64 17 72 32 72 56 C72 74 65 85 50 85 C42 85 36 82 34 76 C42 80 58 78 64 60 C70 44 64 26 50 17 Z" 
              fill="#8d6e63"/>
        <ellipse cx="44" cy="28" rx="14" ry="8" fill="#bcaaa4" opacity="0.6"/>
        <!-- Expressive Big Eyes -->
        <ellipse cx="40" cy="42" rx="7" ry="10" fill="#ffffff" stroke="#3e2723" stroke-width="2"/>
        <ellipse cx="42" cy="42" rx="4" ry="7" fill="#1a1a1a"/>
        <circle cx="43.5" cy="39" r="2" fill="#ffffff"/>

        <ellipse cx="60" cy="42" rx="7" ry="10" fill="#ffffff" stroke="#3e2723" stroke-width="2"/>
        <ellipse cx="62" cy="42" rx="4" ry="7" fill="#1a1a1a"/>
        <circle cx="63.5" cy="39" r="2" fill="#ffffff"/>

        <!-- Cute Smile -->
        <path d="M45 62 Q50 66 55 62" stroke="#3e2723" stroke-width="2.5" stroke-linecap="round" fill="none"/>
        <!-- Dynamic crack overlay placeholder -->
        <g class="nut-cracks" stroke="#3e2723" stroke-width="2" fill="none" opacity="0">
          <path d="M30 40 L38 48 L32 58" />
          <path d="M68 35 L62 45 L66 54" />
        </g>
      </g>
    </svg>
  `,

  snowpea: `
    <svg viewBox="0 0 100 100" class="sprite-svg snowpea-sprite">
      <!-- Shadow -->
      <ellipse cx="50" cy="92" rx="28" ry="6" fill="rgba(0,0,0,0.25)" />
      <!-- Base Leaves (Frosty Blue) -->
      <path d="M50 82 C35 84 20 88 15 82 C22 75 38 76 48 80 Z" fill="#00838f" stroke="#004d40" stroke-width="2"/>
      <path d="M50 82 C65 84 80 88 85 82 C78 75 62 76 52 80 Z" fill="#006064" stroke="#004d40" stroke-width="2"/>
      <!-- Stem -->
      <path d="M48 80 C46 65 42 55 45 42" stroke="#26c6da" stroke-width="7" stroke-linecap="round" fill="none"/>
      <!-- Ice Crystal Spikes at Back -->
      <path d="M30 25 L16 18 L24 30 L8 28 L22 40 Z" fill="#e0f7fa" stroke="#0097a7" stroke-width="2"/>
      <!-- Frost Head Group -->
      <g class="anim-head">
        <circle cx="48" cy="35" r="22" fill="#4dd0e1" stroke="#006064" stroke-width="2.5"/>
        <ellipse cx="44" cy="27" rx="14" ry="8" fill="#b2ebf2"/>
        <!-- Snout -->
        <path d="M58 26 C68 24 78 22 84 26 C88 28 88 42 84 44 C78 48 68 46 58 44 Z" fill="#00acc1" stroke="#006064" stroke-width="2.5"/>
        <ellipse cx="84" cy="35" rx="5" ry="9" fill="#006064"/>
        <ellipse cx="83" cy="35" rx="3.5" ry="7" fill="#004d40"/>
        <!-- Eye with blue tint -->
        <ellipse cx="48" cy="28" rx="6" ry="8" fill="#ffffff" stroke="#006064" stroke-width="1.5"/>
        <ellipse cx="50" cy="28" rx="3.5" ry="5.5" fill="#004d40"/>
        <circle cx="51.5" cy="26" r="1.8" fill="#ffffff"/>
      </g>
    </svg>
  `,

  repeater: `
    <svg viewBox="0 0 100 100" class="sprite-svg repeater-sprite">
      <!-- Shadow -->
      <ellipse cx="50" cy="92" rx="28" ry="6" fill="rgba(0,0,0,0.25)" />
      <!-- Base Leaves -->
      <path d="M50 82 C35 84 20 88 15 82 C22 75 38 76 48 80 Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="2"/>
      <path d="M50 82 C65 84 80 88 85 82 C78 75 62 76 52 80 Z" fill="#1b5e20" stroke="#1b5e20" stroke-width="2"/>
      <!-- Stem -->
      <path d="M48 80 C46 65 42 55 45 42" stroke="#388e3c" stroke-width="7" stroke-linecap="round" fill="none"/>
      <!-- Double Spiky Back Leaves -->
      <path d="M32 28 C14 18 6 25 10 35 C18 35 25 32 32 32 Z" fill="#43a047" stroke="#1b5e20" stroke-width="2"/>
      <path d="M30 40 C10 38 4 46 8 54 C16 52 24 46 30 43 Z" fill="#388e3c" stroke="#1b5e20" stroke-width="2"/>
      <!-- Head Group with Determined Eyebrow -->
      <g class="anim-head">
        <circle cx="48" cy="35" r="22" fill="#558b2f" stroke="#1b5e20" stroke-width="2.5"/>
        <ellipse cx="44" cy="28" rx="14" ry="9" fill="#7cb342"/>
        <!-- Snout -->
        <path d="M58 26 C68 24 78 22 84 26 C88 28 88 42 84 44 C78 48 68 46 58 44 Z" fill="#33691e" stroke="#1b5e20" stroke-width="2.5"/>
        <ellipse cx="84" cy="35" rx="5" ry="9" fill="#1b5e20"/>
        <!-- Fierce Eye -->
        <ellipse cx="48" cy="28" rx="6" ry="8" fill="#ffffff" stroke="#1b5e20" stroke-width="1.5"/>
        <ellipse cx="50" cy="28" rx="3.5" ry="5.5" fill="#111111"/>
        <circle cx="51.5" cy="26" r="1.8" fill="#ffffff"/>
        <!-- Fierce Eyebrow -->
        <path d="M40 22 L55 26" stroke="#1b5e20" stroke-width="3" stroke-linecap="round"/>
      </g>
    </svg>
  `,

  chomper: `
    <svg viewBox="0 0 100 100" class="sprite-svg chomper-sprite">
      <!-- Shadow -->
      <ellipse cx="50" cy="92" rx="30" ry="7" fill="rgba(0,0,0,0.25)" />
      <!-- Base Leaves -->
      <path d="M50 82 C25 85 10 90 8 82 C18 74 36 76 46 80 Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="2"/>
      <path d="M50 82 C75 85 90 90 92 82 C82 74 64 76 54 80 Z" fill="#1b5e20" stroke="#1b5e20" stroke-width="2"/>
      <!-- S-Curved Vine Stem -->
      <path d="M48 80 Q56 60 44 48 Q40 40 46 32" stroke="#43a047" stroke-width="8" stroke-linecap="round" fill="none"/>
      <!-- Giant Purple Chomping Head -->
      <g class="anim-head chomper-mouth">
        <!-- Back inside mouth -->
        <ellipse cx="54" cy="30" rx="22" ry="16" fill="#880e4f"/>
        <!-- Top Jaw -->
        <path d="M30 30 C30 14 55 12 74 20 C76 26 70 34 54 32 C38 30 30 30 30 30 Z" fill="#7b1fa2" stroke="#4a148c" stroke-width="2.5"/>
        <!-- Bottom Jaw -->
        <path d="M32 30 C32 46 56 48 74 40 C76 34 70 30 54 32 C38 34 32 30 32 30 Z" fill="#6a1b9a" stroke="#4a148c" stroke-width="2.5"/>
        <!-- Sharp White Teeth Top -->
        <polygon points="42,26 46,33 50,26" fill="#ffffff" stroke="#4a148c" stroke-width="1"/>
        <polygon points="52,27 56,34 60,27" fill="#ffffff" stroke="#4a148c" stroke-width="1"/>
        <polygon points="62,28 66,35 70,28" fill="#ffffff" stroke="#4a148c" stroke-width="1"/>
        <!-- Sharp White Teeth Bottom -->
        <polygon points="46,36 50,29 54,36" fill="#ffffff" stroke="#4a148c" stroke-width="1"/>
        <polygon points="56,37 60,30 64,37" fill="#ffffff" stroke="#4a148c" stroke-width="1"/>
        <!-- Green Lips Trim -->
        <path d="M30 30 Q54 32 74 20" stroke="#7cb342" stroke-width="3" stroke-linecap="round" fill="none"/>
        <path d="M32 30 Q54 32 74 40" stroke="#7cb342" stroke-width="3" stroke-linecap="round" fill="none"/>
        <!-- Hungry Eye -->
        <ellipse cx="40" cy="18" rx="5" ry="6" fill="#ffffff" stroke="#4a148c" stroke-width="1.5"/>
        <circle cx="42" cy="18" r="3" fill="#111111"/>
        <circle cx="43" cy="17" r="1" fill="#ffffff"/>
      </g>
    </svg>
  `,

  threepeater: `
    <svg viewBox="0 0 100 100" class="sprite-svg threepeater-sprite">
      <!-- Shadow -->
      <ellipse cx="50" cy="92" rx="30" ry="6" fill="rgba(0,0,0,0.25)" />
      <!-- Base leaves -->
      <path d="M50 82 C30 85 15 90 12 82 C22 75 38 76 48 80 Z" fill="#2e7d32" stroke="#1b5e20" stroke-width="2"/>
      <path d="M50 82 C70 85 85 90 88 82 C78 75 62 76 52 80 Z" fill="#1b5e20" stroke="#1b5e20" stroke-width="2"/>
      <!-- Main stem branching into 3 -->
      <path d="M50 82 L50 55" stroke="#388e3c" stroke-width="8" stroke-linecap="round"/>
      <path d="M50 55 Q35 48 28 36" stroke="#43a047" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M50 55 Q65 48 72 36" stroke="#43a047" stroke-width="6" stroke-linecap="round" fill="none"/>
      <path d="M50 55 L50 26" stroke="#43a047" stroke-width="6" stroke-linecap="round"/>
      <!-- Head Left -->
      <g transform="translate(-20, -10) scale(0.65)">
        <circle cx="70" cy="45" r="20" fill="#7cb342" stroke="#33691e" stroke-width="2.5"/>
        <path d="M78 38 C88 36 94 34 100 38 C103 40 103 50 100 52 C94 55 88 53 78 51 Z" fill="#689f38" stroke="#33691e" stroke-width="2"/>
        <ellipse cx="70" cy="40" rx="5" ry="6" fill="#ffffff"/>
        <circle cx="71" cy="40" r="3" fill="#111111"/>
      </g>
      <!-- Head Right -->
      <g transform="translate(24, -10) scale(0.65)">
        <circle cx="70" cy="45" r="20" fill="#7cb342" stroke="#33691e" stroke-width="2.5"/>
        <path d="M78 38 C88 36 94 34 100 38 C103 40 103 50 100 52 C94 55 88 53 78 51 Z" fill="#689f38" stroke="#33691e" stroke-width="2"/>
        <ellipse cx="70" cy="40" rx="5" ry="6" fill="#ffffff"/>
        <circle cx="71" cy="40" r="3" fill="#111111"/>
      </g>
      <!-- Head Center (Main) -->
      <g transform="translate(1, -22) scale(0.7)">
        <circle cx="70" cy="45" r="20" fill="#8bc34a" stroke="#33691e" stroke-width="2.5"/>
        <path d="M78 38 C88 36 94 34 100 38 C103 40 103 50 100 52 C94 55 88 53 78 51 Z" fill="#689f38" stroke="#33691e" stroke-width="2"/>
        <ellipse cx="70" cy="40" rx="5" ry="6" fill="#ffffff"/>
        <circle cx="71" cy="40" r="3" fill="#111111"/>
      </g>
    </svg>
  `,

  firepea: `
    <svg viewBox="0 0 100 100" class="sprite-svg firepea-sprite">
      <!-- Shadow -->
      <ellipse cx="50" cy="92" rx="28" ry="6" fill="rgba(0,0,0,0.25)" />
      <!-- Flame Aura -->
      <path d="M25 45 Q15 25 35 15 Q45 5 55 12 Q75 10 75 30 Q85 45 70 60 Q50 68 30 55 Z" fill="rgba(255,87,34,0.3)" filter="blur(2px)"/>
      <!-- Base Leaves (Burnt Red/Green) -->
      <path d="M50 82 C35 84 20 88 15 82 C22 75 38 76 48 80 Z" fill="#b71c1c" stroke="#5d0f0f" stroke-width="2"/>
      <path d="M50 82 C65 84 80 88 85 82 C78 75 62 76 52 80 Z" fill="#bf360c" stroke="#5d0f0f" stroke-width="2"/>
      <!-- Stem -->
      <path d="M48 80 C46 65 42 55 45 42" stroke="#d84315" stroke-width="7" stroke-linecap="round" fill="none"/>
      <!-- Fire Crown Back -->
      <path d="M35 30 Q12 18 20 38 Q10 26 28 44 Z" fill="#ff9800" stroke="#e65100" stroke-width="2"/>
      <!-- Head Group with Fire Colors -->
      <g class="anim-head">
        <circle cx="48" cy="35" r="22" fill="#ff5722" stroke="#bf360c" stroke-width="2.5"/>
        <ellipse cx="44" cy="28" rx="14" ry="9" fill="#ff8a65"/>
        <!-- Snout -->
        <path d="M58 26 C68 24 78 22 84 26 C88 28 88 42 84 44 C78 48 68 46 58 44 Z" fill="#e64a19" stroke="#bf360c" stroke-width="2.5"/>
        <ellipse cx="84" cy="35" rx="5" ry="9" fill="#ffeb3b"/>
        <ellipse cx="83" cy="35" rx="3.5" ry="7" fill="#ff5722"/>
        <!-- Glowing Fierce Eye -->
        <ellipse cx="48" cy="28" rx="6" ry="8" fill="#fff9c4" stroke="#bf360c" stroke-width="1.5"/>
        <ellipse cx="50" cy="28" rx="3.5" ry="5.5" fill="#d50000"/>
        <circle cx="51.5" cy="26" r="1.8" fill="#ffffff"/>
      </g>
    </svg>
  `,

  cactus: `
    <svg viewBox="0 0 100 100" class="sprite-svg cactus-sprite">
      <!-- Shadow -->
      <ellipse cx="50" cy="92" rx="26" ry="6" fill="rgba(0,0,0,0.25)" />
      <!-- Cactus Body -->
      <g class="anim-body">
        <rect x="36" y="22" width="28" height="66" rx="14" fill="#43a047" stroke="#1b5e20" stroke-width="2.5"/>
        <!-- Left Arm -->
        <path d="M36 48 L22 48 L22 32" stroke="#43a047" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M36 48 L22 48 L22 32" stroke="#1b5e20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <!-- Right Arm -->
        <path d="M64 56 L78 56 L78 40" stroke="#43a047" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <path d="M64 56 L78 56 L78 40" stroke="#1b5e20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
        <!-- Little Pink Flower on Head -->
        <circle cx="50" cy="18" r="6" fill="#e91e63" stroke="#880e4f" stroke-width="1.5"/>
        <!-- Thorns -->
        <line x1="32" y1="35" x2="28" y2="33" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <line x1="68" y1="35" x2="72" y2="33" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <line x1="32" y1="65" x2="28" y2="63" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <line x1="68" y1="65" x2="72" y2="63" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        <!-- Eyes -->
        <circle cx="44" cy="34" r="3" fill="#111"/>
        <circle cx="56" cy="34" r="3" fill="#111"/>
        <!-- Cute needle-spitting mouth -->
        <ellipse cx="50" cy="44" rx="4" ry="5" fill="#1b5e20"/>
      </g>
    </svg>
  `,

  // --- ZOMBIES ---

  normal: `
    <svg viewBox="0 0 100 120" class="sprite-svg zombie-sprite">
      <!-- Shadow -->
      <ellipse cx="50" cy="112" rx="28" ry="6" fill="rgba(0,0,0,0.3)" />
      <!-- Legs with Walking Animation -->
      <g class="anim-legs">
        <rect x="38" y="78" width="8" height="28" rx="4" fill="#37474f" stroke="#212121" stroke-width="1.5"/>
        <rect x="52" y="80" width="8" height="28" rx="4" fill="#263238" stroke="#212121" stroke-width="1.5"/>
        <ellipse cx="40" cy="107" rx="7" ry="4" fill="#1a1a1a"/>
        <ellipse cx="56" cy="109" rx="7" ry="4" fill="#1a1a1a"/>
      </g>
      <!-- Torso: Brown Ragged Suit & Red Tie -->
      <g class="anim-torso">
        <path d="M30 46 L70 46 L66 80 L34 80 Z" fill="#6d4c41" stroke="#3e2723" stroke-width="2"/>
        <!-- White ragged shirt collar -->
        <polygon points="46,46 54,46 50,56" fill="#eceff1"/>
        <!-- Red loose tie -->
        <polygon points="48,52 52,52 54,72 50,76 46,72" fill="#d32f2f" stroke="#b71c1c" stroke-width="1"/>
        <!-- Outstretched Zombie Arms -->
        <path d="M34 50 L12 55 L8 60" stroke="#7cb342" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M66 50 L84 54 L92 50" stroke="#7cb342" stroke-width="7" stroke-linecap="round" fill="none"/>
      </g>
      <!-- Zombie Head & Expression -->
      <g class="anim-zombie-head">
        <circle cx="50" cy="30" r="18" fill="#8bc34a" stroke="#33691e" stroke-width="2.5"/>
        <!-- Wispy hair -->
        <path d="M42 12 Q44 6 48 10 Q52 4 56 12" stroke="#212121" stroke-width="2" stroke-linecap="round" fill="none"/>
        <!-- Uneven Googly Eyes -->
        <circle cx="42" cy="27" r="6" fill="#fff9c4" stroke="#33691e" stroke-width="1.5"/>
        <circle cx="43" cy="27" r="2.5" fill="#212121"/>
        <circle cx="56" cy="25" r="4.5" fill="#fff9c4" stroke="#33691e" stroke-width="1.5"/>
        <circle cx="56.5" cy="25" r="2" fill="#212121"/>
        <!-- Slack Jaw & Crooked Teeth -->
        <path d="M40 36 C42 45 56 46 58 36 Z" fill="#3e2723" stroke="#1b5e20" stroke-width="1.5"/>
        <rect x="44" y="36" width="3" height="4" fill="#ffffff"/>
        <rect x="52" y="36" width="3" height="3" fill="#ffffff"/>
      </g>
    </svg>
  `,

  cone: `
    <svg viewBox="0 0 100 120" class="sprite-svg zombie-sprite cone-sprite">
      <!-- Shadow -->
      <ellipse cx="50" cy="112" rx="28" ry="6" fill="rgba(0,0,0,0.3)" />
      <!-- Legs -->
      <g class="anim-legs">
        <rect x="38" y="78" width="8" height="28" rx="4" fill="#37474f" stroke="#212121" stroke-width="1.5"/>
        <rect x="52" y="80" width="8" height="28" rx="4" fill="#263238" stroke="#212121" stroke-width="1.5"/>
        <ellipse cx="40" cy="107" rx="7" ry="4" fill="#1a1a1a"/>
        <ellipse cx="56" cy="109" rx="7" ry="4" fill="#1a1a1a"/>
      </g>
      <!-- Torso -->
      <g class="anim-torso">
        <path d="M30 46 L70 46 L66 80 L34 80 Z" fill="#6d4c41" stroke="#3e2723" stroke-width="2"/>
        <polygon points="46,46 54,46 50,56" fill="#eceff1"/>
        <polygon points="48,52 52,52 54,72 50,76 46,72" fill="#d32f2f" stroke="#b71c1c" stroke-width="1"/>
        <path d="M34 50 L12 55 L8 60" stroke="#7cb342" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M66 50 L84 54 L92 50" stroke="#7cb342" stroke-width="7" stroke-linecap="round" fill="none"/>
      </g>
      <!-- Head + Traffic Cone Hat -->
      <g class="anim-zombie-head">
        <circle cx="50" cy="34" r="18" fill="#8bc34a" stroke="#33691e" stroke-width="2.5"/>
        <circle cx="42" cy="31" r="6" fill="#fff9c4" stroke="#33691e" stroke-width="1.5"/>
        <circle cx="43" cy="31" r="2.5" fill="#212121"/>
        <circle cx="56" cy="29" r="4.5" fill="#fff9c4" stroke="#33691e" stroke-width="1.5"/>
        <circle cx="56.5" cy="29" r="2" fill="#212121"/>
        <path d="M40 40 C42 49 56 50 58 40 Z" fill="#3e2723" stroke="#1b5e20" stroke-width="1.5"/>
        <rect x="44" y="40" width="3" height="4" fill="#ffffff"/>
        <!-- Traffic Cone on Head -->
        <g class="cone-hat">
          <!-- Cone Base -->
          <ellipse cx="50" cy="22" rx="19" ry="5" fill="#f57c00" stroke="#b23c00" stroke-width="2"/>
          <!-- Orange Cone Body -->
          <polygon points="35,21 46,-8 54,-8 65,21" fill="#ff9800" stroke="#b23c00" stroke-width="2"/>
          <!-- White reflective stripes -->
          <polygon points="38,13 42,4 58,4 62,13" fill="#ffffff" opacity="0.95"/>
        </g>
      </g>
    </svg>
  `,

  bucket: `
    <svg viewBox="0 0 100 120" class="sprite-svg zombie-sprite bucket-sprite">
      <!-- Shadow -->
      <ellipse cx="50" cy="112" rx="28" ry="6" fill="rgba(0,0,0,0.3)" />
      <!-- Legs -->
      <g class="anim-legs">
        <rect x="38" y="78" width="8" height="28" rx="4" fill="#37474f" stroke="#212121" stroke-width="1.5"/>
        <rect x="52" y="80" width="8" height="28" rx="4" fill="#263238" stroke="#212121" stroke-width="1.5"/>
        <ellipse cx="40" cy="107" rx="7" ry="4" fill="#1a1a1a"/>
        <ellipse cx="56" cy="109" rx="7" ry="4" fill="#1a1a1a"/>
      </g>
      <!-- Torso -->
      <g class="anim-torso">
        <path d="M30 46 L70 46 L66 80 L34 80 Z" fill="#6d4c41" stroke="#3e2723" stroke-width="2"/>
        <polygon points="46,46 54,46 50,56" fill="#eceff1"/>
        <polygon points="48,52 52,52 54,72 50,76 46,72" fill="#d32f2f" stroke="#b71c1c" stroke-width="1"/>
        <path d="M34 50 L12 55 L8 60" stroke="#7cb342" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M66 50 L84 54 L92 50" stroke="#7cb342" stroke-width="7" stroke-linecap="round" fill="none"/>
      </g>
      <!-- Head + Metal Bucket Hat -->
      <g class="anim-zombie-head">
        <circle cx="50" cy="34" r="18" fill="#8bc34a" stroke="#33691e" stroke-width="2.5"/>
        <circle cx="42" cy="31" r="6" fill="#fff9c4" stroke="#33691e" stroke-width="1.5"/>
        <circle cx="43" cy="31" r="2.5" fill="#212121"/>
        <circle cx="56" cy="29" r="4.5" fill="#fff9c4" stroke="#33691e" stroke-width="1.5"/>
        <circle cx="56.5" cy="29" r="2" fill="#212121"/>
        <path d="M40 40 C42 49 56 50 58 40 Z" fill="#3e2723" stroke="#1b5e20" stroke-width="1.5"/>
        <rect x="44" y="40" width="3" height="4" fill="#ffffff"/>
        <!-- Metal Bucket on Head -->
        <g class="bucket-hat">
          <!-- Bucket rim -->
          <ellipse cx="50" cy="24" rx="20" ry="6" fill="#b0bec5" stroke="#37474f" stroke-width="2"/>
          <!-- Bucket body -->
          <path d="M30 24 L34 0 L66 0 L70 24 Z" fill="#90a4ae" stroke="#37474f" stroke-width="2"/>
          <!-- Metal shine highlight -->
          <path d="M42 22 L45 2 L52 2 L49 22 Z" fill="#cfd8dc" opacity="0.6"/>
          <!-- Bucket handle ring -->
          <circle cx="29" cy="18" r="3" fill="#37474f"/>
          <circle cx="71" cy="18" r="3" fill="#37474f"/>
        </g>
      </g>
    </svg>
  `,

  fast: `
    <svg viewBox="0 0 100 120" class="sprite-svg zombie-sprite fast-sprite">
      <!-- Shadow -->
      <ellipse cx="50" cy="112" rx="24" ry="5" fill="rgba(0,0,0,0.3)" />
      <!-- Sprinting Legs -->
      <g class="anim-legs">
        <path d="M38 78 L26 95 L18 108" stroke="#c62828" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M52 78 L68 92 L76 106" stroke="#b71c1c" stroke-width="7" stroke-linecap="round" fill="none"/>
      </g>
      <!-- Red Jersey Torso -->
      <g class="anim-torso">
        <path d="M28 46 L72 46 L68 80 L32 80 Z" fill="#e53935" stroke="#b71c1c" stroke-width="2"/>
        <text x="50" y="70" font-family="sans-serif" font-size="18" font-weight="900" fill="#fff" text-anchor="middle">7</text>
        <path d="M32 50 L14 62 L6 55" stroke="#8bc34a" stroke-width="7" stroke-linecap="round" fill="none"/>
        <path d="M68 50 L86 62 L94 55" stroke="#8bc34a" stroke-width="7" stroke-linecap="round" fill="none"/>
      </g>
      <!-- Head with Football Helmet -->
      <g class="anim-zombie-head">
        <circle cx="50" cy="28" r="20" fill="#8bc34a" stroke="#33691e" stroke-width="2.5"/>
        <path d="M30 26 C30 8 70 8 70 26 L68 36 L32 36 Z" fill="#c62828" stroke="#8e0000" stroke-width="2"/>
        <!-- Face guard grille -->
        <rect x="36" y="24" width="28" height="12" fill="none" stroke="#212121" stroke-width="2.5"/>
        <line x1="45" y1="24" x2="45" y2="36" stroke="#212121" stroke-width="2"/>
        <line x1="55" y1="24" x2="55" y2="36" stroke="#212121" stroke-width="2"/>
        <!-- Fierce red eyes -->
        <circle cx="43" cy="25" r="3" fill="#ffeb3b"/>
        <circle cx="57" cy="25" r="3" fill="#ffeb3b"/>
      </g>
    </svg>
  `,

  strong: `
    <svg viewBox="0 0 110 130" class="sprite-svg zombie-sprite strong-sprite">
      <!-- Shadow -->
      <ellipse cx="55" cy="124" rx="36" ry="8" fill="rgba(0,0,0,0.4)" />
      <!-- Giant Heavy Legs -->
      <g class="anim-legs">
        <rect x="34" y="86" width="16" height="34" rx="6" fill="#3e2723" stroke="#1b0000" stroke-width="2"/>
        <rect x="58" y="86" width="16" height="34" rx="6" fill="#2d1c19" stroke="#1b0000" stroke-width="2"/>
      </g>
      <!-- Massive Gargantuar Torso -->
      <g class="anim-torso">
        <path d="M20 42 L90 42 L80 90 L30 90 Z" fill="#558b2f" stroke="#1b5e20" stroke-width="3"/>
        <!-- Bandages / Ripped Shorts -->
        <path d="M28 78 L82 78 L80 92 L30 92 Z" fill="#4e342e"/>
        <!-- Giant Club / Telephone Pole in Hand -->
        <rect x="76" y="10" width="16" height="95" rx="4" transform="rotate(-15 76 10)" fill="#795548" stroke="#3e2723" stroke-width="2"/>
        <!-- Massive Arms -->
        <path d="M24 50 L10 75" stroke="#558b2f" stroke-width="14" stroke-linecap="round" fill="none"/>
        <path d="M86 50 L75 75" stroke="#558b2f" stroke-width="14" stroke-linecap="round" fill="none"/>
      </g>
      <!-- Boss Head -->
      <g class="anim-zombie-head">
        <circle cx="55" cy="28" r="22" fill="#689f38" stroke="#1b5e20" stroke-width="3"/>
        <!-- Red Glowing Eyes -->
        <circle cx="45" cy="24" r="5" fill="#d50000" stroke="#212121" stroke-width="1.5"/>
        <circle cx="46" cy="24" r="2" fill="#ffeb3b"/>
        <circle cx="65" cy="24" r="5" fill="#d50000" stroke="#212121" stroke-width="1.5"/>
        <circle cx="66" cy="24" r="2" fill="#ffeb3b"/>
        <!-- Big scary underbite -->
        <path d="M40 38 Q55 48 70 38" stroke="#1b5e20" stroke-width="4" stroke-linecap="round" fill="none"/>
        <polygon points="45,39 48,32 51,39" fill="#fff"/>
        <polygon points="59,39 62,32 65,39" fill="#fff"/>
      </g>
    </svg>
  `,

  // --- ENTITIES & PROPS ---

  sun: `
    <svg viewBox="0 0 100 100" class="sun-svg">
      <!-- Spinning Golden Sunburst Rays -->
      <g class="anim-sun-spin" transform-origin="50 50">
        <polygon points="50,2 56,22 44,22" fill="#ffc107"/>
        <polygon points="50,98 56,78 44,78" fill="#ffc107"/>
        <polygon points="2,50 22,56 22,44" fill="#ffc107"/>
        <polygon points="98,50 78,56 78,44" fill="#ffc107"/>
        <polygon points="16,16 34,26 26,34" fill="#ffa000"/>
        <polygon points="84,16 66,26 74,34" fill="#ffa000"/>
        <polygon points="16,84 34,74 26,66" fill="#ffa000"/>
        <polygon points="84,84 66,74 74,66" fill="#ffa000"/>
      </g>
      <!-- Inner Radiant Sphere -->
      <circle cx="50" cy="50" r="28" fill="url(#sunGrad)" stroke="#ff8f00" stroke-width="2.5"/>
      <!-- Happy Cute Face -->
      <ellipse cx="42" cy="46" rx="3.5" ry="5.5" fill="#5d4037"/>
      <circle cx="43" cy="44" r="1.5" fill="#ffffff"/>
      <ellipse cx="58" cy="46" rx="3.5" ry="5.5" fill="#5d4037"/>
      <circle cx="59" cy="44" r="1.5" fill="#ffffff"/>
      <path d="M44 55 Q50 60 56 55" stroke="#5d4037" stroke-width="2" stroke-linecap="round" fill="none"/>
      <!-- Gradient definition -->
      <defs>
        <radialGradient id="sunGrad" cx="40%" cy="35%">
          <stop offset="0%" stop-color="#fffde7" />
          <stop offset="40%" stop-color="#fff176" />
          <stop offset="100%" stop-color="#fbc02d" />
        </radialGradient>
      </defs>
    </svg>
  `,

  lawnmower: `
    <svg viewBox="0 0 100 80" class="lawnmower-svg">
      <!-- Shadow -->
      <ellipse cx="50" cy="74" rx="36" ry="5" fill="rgba(0,0,0,0.3)"/>
      <!-- Red Motor Cover Engine -->
      <path d="M30 38 Q30 20 52 20 Q74 20 74 38 L80 58 L24 58 Z" fill="#d32f2f" stroke="#b71c1c" stroke-width="2"/>
      <ellipse cx="52" cy="24" rx="14" ry="4" fill="#ff5252"/>
      <!-- Silver Handlebars -->
      <path d="M30 40 L8 14 L4 18" stroke="#90a4ae" stroke-width="4" stroke-linecap="round" fill="none"/>
      <!-- Pull Cord Starter -->
      <circle cx="64" cy="30" r="3" fill="#212121"/>
      <!-- Front & Back Rubber Wheels -->
      <circle cx="28" cy="62" r="12" fill="#212121" stroke="#424242" stroke-width="2"/>
      <circle cx="28" cy="62" r="5" fill="#b0bec5"/>
      <circle cx="72" cy="62" r="12" fill="#212121" stroke="#424242" stroke-width="2"/>
      <circle cx="72" cy="62" r="5" fill="#b0bec5"/>
      <!-- Cutting Blade Base -->
      <rect x="22" y="54" width="56" height="6" fill="#37474f"/>
    </svg>
  `,

  projectiles: {
    peashooter: `
      <svg viewBox="0 0 40 40" class="projectile-svg">
        <circle cx="20" cy="20" r="14" fill="#8bc34a" stroke="#33691e" stroke-width="2"/>
        <ellipse cx="16" cy="15" rx="6" ry="4" fill="#dcedc8"/>
      </svg>
    `,
    snowpea: `
      <svg viewBox="0 0 40 40" class="projectile-svg">
        <circle cx="20" cy="20" r="14" fill="#4dd0e1" stroke="#006064" stroke-width="2"/>
        <ellipse cx="16" cy="15" rx="6" ry="4" fill="#e0f7fa"/>
        <!-- Little ice crystals -->
        <polygon points="20,8 22,14 18,14" fill="#ffffff"/>
      </svg>
    `,
    firepea: `
      <svg viewBox="0 0 40 40" class="projectile-svg fire-ball-svg">
        <circle cx="20" cy="20" r="15" fill="#ff5722" stroke="#bf360c" stroke-width="2"/>
        <circle cx="20" cy="20" r="10" fill="#ffeb3b"/>
        <ellipse cx="16" cy="16" rx="5" ry="3" fill="#ffffff"/>
      </svg>
    `,
    cactus: `
      <svg viewBox="0 0 40 40" class="projectile-svg">
        <rect x="6" y="16" width="28" height="8" rx="4" fill="#2e7d32" stroke="#1b5e20" stroke-width="1.5"/>
        <polygon points="34,16 40,20 34,24" fill="#81c784"/>
      </svg>
    `,
    chomper: `
      <svg viewBox="0 0 40 40" class="projectile-svg">
        <path d="M10 20 C10 10 30 10 30 20 C30 30 10 30 10 20 Z" fill="#8bc34a" stroke="#33691e" stroke-width="2"/>
        <line x1="12" y1="20" x2="28" y2="20" stroke="#33691e" stroke-width="1.5"/>
      </svg>
    `
  }
};
