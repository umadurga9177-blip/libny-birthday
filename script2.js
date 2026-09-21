// ===============================
// CREATE STARS
// ===============================
const starsContainer = document.getElementById("stars");

for (let i = 0; i < 100; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.left = Math.random() * 100 + "%";
    star.style.top = Math.random() * 100 + "%";
    star.style.animationDelay = Math.random() * 2 + "s";
    starsContainer.appendChild(star);
}

// ===============================
// PASSCODE
// ===============================

// Temporary code for testing. We will change this later.
const correctPasscode = "2007";

const passcodeInput = document.getElementById("passcode");
const unlockButton = document.getElementById("unlockButton");
const errorMessage = document.getElementById("errorMessage");
const lockScreen = document.querySelector(".lock-screen");
const balloonScreen = document.getElementById("balloonScreen");

// ===============================
// UNLOCK
// ===============================
function unlock() {
    const enteredCode = passcodeInput.value.trim();

    if (enteredCode === correctPasscode) {
        errorMessage.textContent = "🔓 Unlocked! Welcome, Libny... ";
        errorMessage.style.color = "#8ce99a";

        // Make screen brighter
        document.body.style.filter = "brightness(1)";

        // Wait before moving to next scene
        setTimeout(() => {
            lockScreen.style.display = "none";
            balloonScreen.style.display = "block";
            createBalloons();
        }, 1000);

    } else {
        errorMessage.textContent = "🤔 Hmm... that's not the secret code.";
        lockScreen.classList.remove("shake");

        // Restart animation
        void lockScreen.offsetWidth;
        lockScreen.classList.add("shake");
    }
}

// Button click
unlockButton.addEventListener("click", unlock);

// Enter key
passcodeInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        unlock();
    }
});

// ===============================
// BALLOON GAME
// ===============================
let balloonsLeft = 6;

const balloonColors = [
    "#ff6b9d",
    "#845ef7",
    "#339af0",
    "#51cf66",
    "#ffd43b",
    "#ff922b"
];

function createBalloons() {
    const balloonArea = document.getElementById("balloonArea");
    balloonArea.innerHTML = "";
    balloonsLeft = 6;
    document.getElementById("balloonCounter").textContent = "Balloons left: 6";

    for (let i = 0; i < 6; i++) {
        const balloon = document.createElement("div");
        balloon.classList.add("balloon");
        balloon.style.background = balloonColors[i];
        balloon.style.left = Math.random() * 85 + "%";
        balloon.style.top = Math.random() * 65 + "%";
        balloon.style.animationDuration = (2 + Math.random() * 2) + "s";

        balloon.addEventListener("click", function () {
            popBalloon(balloon);
        });

        balloonArea.appendChild(balloon);
    }
}

// ===============================
// POP BALLOON
// ===============================
function popBalloon(balloon) {
    // Prevent double clicking
    if (balloon.classList.contains("pop")) {
        return;
    }

    // Add pop animation
    balloon.classList.add("pop");

    // Reduce counter
    balloonsLeft--;
    document.getElementById("balloonCounter").textContent = "Balloons left: " + balloonsLeft;

    // Pop sound
    playPopSound();

    // Remove balloon after animation
    setTimeout(() => {
        balloon.remove();

        if (balloonsLeft === 0) {
            balloonsFinished();
        }
    }, 300);
}

// ===============================
// ALL BALLOONS POPPED
// ===============================
function balloonsFinished() {
    const cakeScreen = document.getElementById("cakeScreen");
    balloonScreen.style.display = "none";
    cakeScreen.style.display = "block";
}

// ===============================
// POP SOUND
// ===============================
let audioContext = null;

function playPopSound() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const now = audioContext.currentTime;

    // Create a short burst of noise
    const bufferSize = audioContext.sampleRate * 0.08;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const data = buffer.getChannelData(0);

    // Random noise
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const noise = audioContext.createBufferSource();
    noise.buffer = buffer;

    // Shape the noise
    const gain = audioContext.createGain();
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(gain);
    gain.connect(audioContext.destination);
    noise.start(now);
}

// ===============================
// BLOW OUT CANDLES
// ===============================
const blowButton = document.getElementById("blowButton");

blowButton.addEventListener("click", () => {
    const flames = document.querySelectorAll(".flame");

    // Put out all flames
    flames.forEach((flame) => {
        flame.style.opacity = "0";
    });

    // Update message
    document.querySelector(".blow-message").textContent = "You made a wish! ✨";

    // Disable button
    blowButton.disabled = true;

    // Wait until the candles are out
    setTimeout(() => {
        document.body.classList.add("celebration");
        createConfetti();
    }, 800);
});

// ===============================
// BIG CELEBRATION
// ===============================
function burstConfetti() {
    const colors = [
        "#ff4d8d",
        "#ffd43b",
        "#74c0fc",
        "#b197fc",
        "#69db7c",
        "#ff922b",
        "#ffffff"
    ];

    const confettiCount = 180;

    for (let i = 0; i < confettiCount; i++) {
        const piece = document.createElement("div");
        piece.classList.add("confetti");

        // Start around the middle/top area
        piece.style.left = "50vw";
        piece.style.top = "45vh";
        piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Different sizes
        const size = Math.random() * 7 + 6;
        piece.style.width = size + "px";
        piece.style.height = size * 1.5 + "px";

        // Random direction
        const x = (Math.random() - 0.5) * 1000;
        const y = Math.random() * 700 - 250;
        const rotation = Math.random() * 1440 - 720;

        piece.style.setProperty("--x", x + "px");
        piece.style.setProperty("--y", y + "px");
        piece.style.setProperty("--rotation", rotation + "deg");
        piece.style.animationDelay = "0s";

        document.body.appendChild(piece);

        setTimeout(() => {
            piece.remove();
        }, 2000);
    }
}

function createConfetti() {
    burstConfetti();

    setTimeout(() => {
        // 💥 BIG POP SOUND
        const bigPopSound = document.getElementById("bigPopSound");
        bigPopSound.currentTime = 0;
        bigPopSound.volume = 1;
        bigPopSound.play().catch((error) => {
            console.log("Pop sound could not play:", error);
        });

        // 🌟 BRIGHTEN BACKGROUND
        document.body.classList.add("birthday-finale");

        // 🎂 SHOW HAPPY BIRTHDAY
        const birthdayMessage = document.getElementById("birthdayMessage");
        birthdayMessage.classList.add("show");

        // 🎵 START BIRTHDAY MUSIC
        const birthdayMusic = document.getElementById("birthdayMusic");
        birthdayMusic.currentTime = 0;
        birthdayMusic.volume = 0.7;
        birthdayMusic.play().catch((error) => {
            console.log("Birthday music could not play:", error);
        });
    }, 2200);
}

// ===============================
// OPEN BIRTHDAY MESSAGE (ENVELOPE)
// ===============================
const continueButton = document.getElementById("continueButton");
const birthdayMessage = document.getElementById("birthdayMessage");

function openBirthdayEnvelope() {
    const cakeScreen = document.getElementById("cakeScreen");
    if (cakeScreen) {
        cakeScreen.style.display = "none";
    }

    if (birthdayMessage) {
        birthdayMessage.classList.remove("show");
    }

    const envelope = document.createElement("div");
    envelope.className = "birthday-envelope";

    const icon = document.createElement("div");
    icon.className = "envelope-icon";
    icon.textContent = "💌";

    const title = document.createElement("h2");
    title.textContent = "A little message for you";

    const text = document.createElement("p");
    text.textContent = "Open this when you're ready...";

    envelope.appendChild(icon);
    envelope.appendChild(title);
    envelope.appendChild(text);
    document.body.appendChild(envelope);

    // CLICK THE ENVELOPE
    envelope.addEventListener("click", () => {
        envelope.classList.add("open");

        setTimeout(() => {
            envelope.remove();

            const letter = document.createElement("div");
            letter.className = "birthday-letter";
            letter.innerHTML = `
                <h2>Happy Birthday, Libny! 💖🎂</h2>

                <p>
                    I hope your day is filled with
                    happiness, laughter, and lots
                    of beautiful moments. You
                    deserve all the good things
                    today and always. ✨
                </p>

                <p>
                    Thank you for being such a
                    special person. I hope this
                    little surprise makes your
                    birthday a little more
                    memorable. 🥹💗
                </p>

                <p>
                    Happy Birthday once again! 🎉🎈
                </p>

                <p>
                    Keep smiling, keep shining, and
                    enjoy your special day! 🌸✨🍀
                </p>
                <button id="musicButton">🎵 Continue to music</button>
            `;

            document.body.appendChild(letter);

            // ===============================
            // CONTINUE TO MUSICAL PADS
            // ===============================
            const musicButton = document.getElementById("musicButton");

            if (musicButton) {
                musicButton.addEventListener("click", () => {
                    // Stop birthday music
                    const birthdayMusic = document.getElementById("birthdayMusic");
                    if (birthdayMusic) {
                        birthdayMusic.pause();
                        birthdayMusic.currentTime = 0;
                    }

                    // Remove the birthday letter
                    letter.remove();

                    // Show musical pads
                    const musicScreen = document.getElementById("musicScreen");
                    if (musicScreen) {
                        musicScreen.style.display = "block";
                    }
                });
            }
        }, 700);
    });
}

// ===============================
// GIFT REVEAL ANIMATION
// ===============================
function openGiftReveal() {
    const letter = document.querySelector(".birthday-letter");
    if (letter) {
        letter.remove();
    }

    const padsContainer = document.querySelector(".electro-pads");
    if (padsContainer) {
        padsContainer.classList.add("gift-mode");
    }

    const closeBtn = document.createElement("button");
    closeBtn.className = "gift-close";
    closeBtn.setAttribute("aria-label", "Close");
    closeBtn.textContent = "✕";
    closeBtn.addEventListener("click", () => {
        if (padsContainer) {
            padsContainer.classList.remove("gift-mode");
        }
        reveal.remove();
        closeBtn.remove();
    });
    document.body.appendChild(closeBtn);

    const reveal = document.createElement("div");
    reveal.className = "gift-reveal";
    reveal.innerHTML = `
        <div class="gift-box">
            <div class="gift-lid">🎀</div>
            <div class="gift-body">🎁</div>
        </div>
        <p class="gift-hint">Tap the box!</p>
    `;
    document.body.appendChild(reveal);

    const box = reveal.querySelector(".gift-box");
    const hint = reveal.querySelector(".gift-hint");

    box.addEventListener("click", () => {
        if (box.classList.contains("opened")) {
            return;
        }
        box.classList.add("shake");

        setTimeout(() => {
            box.classList.remove("shake");
            box.classList.add("opened");
            hint.style.opacity = "0";
            burstConfetti();

            const card = document.createElement("div");
            card.className = "gift-card";
            card.innerHTML = `
                <h2>🎉 These are your 19 compliments</h2>
                <p>for your 19th birthday!</p>
            `;
            reveal.appendChild(card);

            setTimeout(() => {
                showComplimentBurst(19);
            }, 1200);
        }, 700);
    });
}

// ===============================
// 19 "GOOD BOY" COMPLIMENTS
// ===============================
function showComplimentBurst(count) {
    for (let i = 0; i < count; i++) {
        const delay = i * 350 + Math.random() * 300;

        setTimeout(() => {
            const el = document.createElement("div");
            el.className = "compliment-text";
            el.textContent = "Good boy";

            const left = Math.random() * 78;
            const top = Math.random() * 82;
            const rotation = Math.random() * 30 - 15;

            el.style.left = left + "vw";
            el.style.top = top + "vh";
            el.style.setProperty("--rot", rotation + "deg");

            document.body.appendChild(el);

            setTimeout(() => {
                el.classList.add("fade-out");
                setTimeout(() => el.remove(), 800);
            }, 5000);
        }, delay);
    }
}

if (continueButton) {
    continueButton.addEventListener("click", openBirthdayEnvelope);
}

const birthdayMusic = document.getElementById("birthdayMusic");
if (birthdayMusic) {
    birthdayMusic.pause();
    birthdayMusic.currentTime = 0;
}

// ===============================
// ELECTRO PADS (record/play/loop, mixer, kits, FX)
// ===============================
const AudioCtx = window.AudioContext || window.webkitAudioContext;
const ctx = new AudioCtx();

const overlay = document.getElementById('overlay');
document.getElementById('gearBtn').addEventListener('click', () => overlay.classList.add('open'));
document.getElementById('closeSettings').addEventListener('click', () => overlay.classList.remove('open'));
overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.remove('open'); });

// Master bus: gain -> tone filter -> drive (waveshaper) -> compressor -> destination,
// with a reverb send for natural room ambience and a delay send for echo FX
const masterGain = ctx.createGain();
const toneFilter = ctx.createBiquadFilter();
toneFilter.type = 'lowpass';
toneFilter.Q.value = 0.4;
const warmth = ctx.createWaveShaper();
warmth.oversample = '4x';
function makeSaturationCurve(amount) {
  const n = 44100;
  const curve = new Float32Array(n);
  const k = Math.max(amount, 0.0001);
  for (let i = 0; i < n; i++) {
    const x = (i * 2) / n - 1;
    curve[i] = Math.tanh(k * x) / Math.tanh(k);
  }
  return curve;
}
function setDrive(amount) {
  // amount 0-1 maps to a tanh saturation curve, like turning up a hardware drive knob
  warmth.curve = makeSaturationCurve(0.6 + amount * 9);
}
const compressor = ctx.createDynamicsCompressor();
compressor.threshold.value = -18;
compressor.knee.value = 20;
compressor.ratio.value = 4;
compressor.attack.value = 0.003;
compressor.release.value = 0.25;
masterGain.connect(toneFilter).connect(warmth).connect(compressor).connect(ctx.destination);

function makeImpulseResponse(duration = 1.8, decay = 2.5) {
  const rate = ctx.sampleRate;
  const length = Math.floor(rate * duration);
  const impulse = ctx.createBuffer(2, length, rate);
  for (let ch = 0; ch < 2; ch++) {
    const data = impulse.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
    }
  }
  return impulse;
}
const reverb = ctx.createConvolver();
reverb.buffer = makeImpulseResponse();
const reverbSend = ctx.createGain();
reverbSend.gain.value = 1;
reverbSend.connect(reverb).connect(masterGain);

// Delay/echo FX: a real send-return effect like a hardware delay unit,
// with a darkening filter in the feedback loop so repeats decay naturally
const delayNode = ctx.createDelay(2);
delayNode.delayTime.value = 0.28;
const delayFilter = ctx.createBiquadFilter();
delayFilter.type = 'lowpass'; delayFilter.frequency.value = 3500;
const delayFeedback = ctx.createGain();
delayFeedback.gain.value = 0.35;
const delayWet = ctx.createGain();
delayWet.gain.value = 0;
masterGain.connect(delayNode);
delayNode.connect(delayFilter).connect(delayFeedback).connect(delayNode);
delayNode.connect(delayWet).connect(compressor);

// Mixer: one channel strip per instrument group, like a real hardware mixer,
// each with Mute/Solo just like a real mixing console
const CHANNEL_NAMES = ['Kick', 'Snare', 'Hats', 'Toms', 'Synths', 'FX'];
const channelGains = {};
const mutedChannels = new Set();
const soloChannels = new Set();
CHANNEL_NAMES.forEach(name => {
  const g = ctx.createGain();
  g.gain.value = 0.95;
  g.connect(masterGain);
  channelGains[name] = g;
});
const channelOf = {
  kick: 'Kick', snare: 'Snare', hihat: 'Hats', ride: 'Hats',
  tom: 'Toms', perc: 'Toms', synth: 'Synths', bass: 'Synths', blip: 'Synths',
  clap: 'FX', noise: 'FX'
};

function updateChannelGain(ch) {
  const slider = document.querySelector(`.mix[data-ch="${ch}"]`);
  const raw = parseFloat(slider.value);
  const audible = soloChannels.size > 0 ? soloChannels.has(ch) : !mutedChannels.has(ch);
  channelGains[ch].gain.value = audible ? raw : 0.0001;
}

const mixerBody = document.getElementById('mixerBody');
CHANNEL_NAMES.forEach(name => {
  const row = document.createElement('div');
  row.className = 'mix-row';
  row.innerHTML = `
    <label style="font-size:0.75rem;opacity:0.8;">${name}</label>
    <input type="range" class="mix" data-ch="${name}" min="0" max="1.3" step="0.01" value="0.95">
    <div class="ms-btns">
      <button class="mute-btn" data-ch="${name}">M</button>
      <button class="solo-btn" data-ch="${name}">S</button>
    </div>`;
  mixerBody.appendChild(row);
});
document.querySelectorAll('.mix').forEach(sl => {
  sl.addEventListener('input', () => updateChannelGain(sl.dataset.ch));
});
document.querySelectorAll('.mute-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const ch = btn.dataset.ch;
    mutedChannels.has(ch) ? mutedChannels.delete(ch) : mutedChannels.add(ch);
    btn.classList.toggle('on-mute');
    CHANNEL_NAMES.forEach(updateChannelGain);
  });
});
document.querySelectorAll('.solo-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const ch = btn.dataset.ch;
    soloChannels.has(ch) ? soloChannels.delete(ch) : soloChannels.add(ch);
    btn.classList.toggle('on-solo');
    CHANNEL_NAMES.forEach(updateChannelGain);
  });
});

// Route a source through an optional dry/wet split to the reverb send.
// Each trigger sets currentBus to a fresh panner+velocity chain so every hit
// gets slight natural stereo width and loudness variance, like a real player.
let currentBus = null;
function toBus(node, sendAmount = 0) {
  const target = currentBus || masterGain;
  node.connect(target);
  if (sendAmount > 0) {
    const send = ctx.createGain();
    send.gain.value = sendAmount;
    node.connect(send).connect(reverbSend);
  }
}

const volumeSlider = document.getElementById('volume');
const sustainSlider = document.getElementById('sustain');
masterGain.gain.value = parseFloat(volumeSlider.value);
volumeSlider.addEventListener('input', () => {
  masterGain.gain.value = parseFloat(volumeSlider.value);
});

const attackSlider = document.getElementById('attack');
const decaySlider = document.getElementById('decay');
const sustainLevelSlider = document.getElementById('sustainLevel');
const releaseSlider = document.getElementById('release');

const toneSlider = document.getElementById('tone');
function applyTone() {
  // 0-1 maps log-scale to 400Hz (dark) - 16000Hz (bright), like a real tone knob
  const v = parseFloat(toneSlider.value);
  toneFilter.frequency.value = 400 * Math.pow(40, v);
}
toneSlider.addEventListener('input', applyTone);
applyTone();

const driveSlider = document.getElementById('drive');
driveSlider.addEventListener('input', () => setDrive(parseFloat(driveSlider.value)));
setDrive(parseFloat(driveSlider.value));

const reverbAmtSlider = document.getElementById('reverbAmt');
reverbAmtSlider.addEventListener('input', () => { reverbSend.gain.value = parseFloat(reverbAmtSlider.value); });

const delayAmtSlider = document.getElementById('delayAmt');
delayAmtSlider.addEventListener('input', () => { delayWet.gain.value = parseFloat(delayAmtSlider.value); });

// --- Timing: tempo, metronome, quantize ---
let bpm = 100;
let quantizeOn = true;
let metronomeOn = false;
let metronomeTimerID = null;
let nextClickTime = 0;
let transportStartTime = ctx.currentTime;

const tempoSlider = document.getElementById('tempo');
const bpmLabel = document.getElementById('bpmLabel');
tempoSlider.addEventListener('input', () => {
  bpm = parseFloat(tempoSlider.value);
  bpmLabel.textContent = bpm;
});

function playClick(time, accent) {
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.value = accent ? 1500 : 1000;
  g.gain.setValueAtTime(0.3, time);
  g.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
  osc.connect(g).connect(masterGain);
  osc.start(time); osc.stop(time + 0.05);
}
let beatCount = 0;
function scheduleClicks() {
  while (nextClickTime < ctx.currentTime + 0.1) {
    playClick(nextClickTime, beatCount % 4 === 0);
    beatCount++;
    nextClickTime += 60 / bpm;
  }
}
function startMetronome() {
  beatCount = 0;
  nextClickTime = ctx.currentTime;
  transportStartTime = ctx.currentTime;
  metronomeTimerID = setInterval(scheduleClicks, 25);
}
function stopMetronome() {
  clearInterval(metronomeTimerID);
  metronomeTimerID = null;
}
const metroToggle = document.getElementById('metroToggle');
metroToggle.addEventListener('click', () => {
  metronomeOn = !metronomeOn;
  metroToggle.classList.toggle('on', metronomeOn);
  if (ctx.state === 'suspended') ctx.resume();
  metronomeOn ? startMetronome() : stopMetronome();
});
const quantizeToggle = document.getElementById('quantizeToggle');
quantizeToggle.addEventListener('click', () => {
  quantizeOn = !quantizeOn;
  quantizeToggle.classList.toggle('on', quantizeOn);
});

function quantizeTime(time) {
  if (!quantizeOn) return time;
  const step = 60 / bpm / 4; // snap to the nearest 16th note
  const elapsed = time - transportStartTime;
  const snapped = transportStartTime + Math.round(elapsed / step) * step;
  return Math.max(snapped, ctx.currentTime + 0.001);
}

// --- Kits: switching presets changes tone/drive/envelope/mix/FX all at once,
// like loading a different kit on real hardware ---
const KITS = {
  Rock: { tone: 0.75, drive: 0.35, attack: 0.002, decay: 0.15, sustainLevel: 0.3, release: 0.15,
    mix: { Kick: 1.05, Snare: 1.05, Hats: 0.85, Toms: 1.0, Synths: 0.8, FX: 0.85 }, reverb: 1.1, delay: 0 },
  HipHop: { tone: 0.5, drive: 0.5, attack: 0.001, decay: 0.25, sustainLevel: 0.45, release: 0.3,
    mix: { Kick: 1.2, Snare: 0.9, Hats: 0.8, Toms: 0.9, Synths: 1.05, FX: 0.9 }, reverb: 0.6, delay: 0.15 },
  Electronic: { tone: 0.9, drive: 0.15, attack: 0.001, decay: 0.08, sustainLevel: 0.25, release: 0.1,
    mix: { Kick: 0.9, Snare: 0.95, Hats: 1.0, Toms: 0.9, Synths: 1.1, FX: 1.0 }, reverb: 0.8, delay: 0.25 }
};
function applyKit(name) {
  const k = KITS[name];
  toneSlider.value = k.tone; applyTone();
  driveSlider.value = k.drive; setDrive(k.drive);
  attackSlider.value = k.attack;
  decaySlider.value = k.decay;
  sustainLevelSlider.value = k.sustainLevel;
  releaseSlider.value = k.release;
  reverbAmtSlider.value = k.reverb; reverbSend.gain.value = k.reverb;
  delayAmtSlider.value = k.delay; delayWet.gain.value = k.delay;
  Object.entries(k.mix).forEach(([ch, val]) => {
    document.querySelector(`.mix[data-ch="${ch}"]`).value = val;
    updateChannelGain(ch);
  });
}
document.getElementById('kitSelect').addEventListener('change', (e) => applyKit(e.target.value));
applyKit('Electronic');

// Pad definitions: type describes the synthesis approach
const pads = [
  { key: '1', label: 'Kick',    color: '#ff6b9d', type: 'kick' },
  { key: '2', label: 'Snare',   color: '#ff8fab', type: 'snare' },
  { key: '3', label: 'HiHat',   color: '#ffb37a', type: 'hihat' },
  { key: '4', label: 'Clap',    color: '#ffd86b', type: 'clap' },
  { key: 'Q', label: 'Tom Lo',  color: '#e39bd6', type: 'tom', freq: 110 },
  { key: 'W', label: 'Tom Hi',  color: '#c98bd9', type: 'tom', freq: 180 },
  { key: 'E', label: 'Perc',    color: '#a06cff', type: 'perc' },
  { key: 'R', label: 'Ride',    color: '#d9426e', type: 'ride' },
];

// ---------------------------------------------------------------
// Sound synthesis engine
// ---------------------------------------------------------------

function shade(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  let r = (num >> 16) + percent;
  let g = ((num >> 8) & 0x00ff) + percent;
  let b = (num & 0x0000ff) + percent;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return `#${(0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1)}`;
}

function makeNoiseBuffer(duration) {
  const size = Math.max(1, Math.floor(ctx.sampleRate * duration));
  const buffer = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < size; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}
function noiseSource(duration) {
  const src = ctx.createBufferSource();
  src.buffer = makeNoiseBuffer(duration);
  return src;
}

// Shared ADSR envelope, shaped by the Envelope panel + the "Length" (hold) knob.
// Returns the gain node to connect voices into, and the time the sound fully ends.
function makeVoiceGain(time, sendAmount) {
  const g = ctx.createGain();
  const a = Math.max(parseFloat(attackSlider.value), 0.001);
  const d = Math.max(parseFloat(decaySlider.value), 0.001);
  const s = Math.max(parseFloat(sustainLevelSlider.value), 0.0001);
  const r = Math.max(parseFloat(releaseSlider.value), 0.001);
  const hold = parseFloat(sustainSlider.value);

  g.gain.cancelScheduledValues(time);
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(1, time + a);
  g.gain.exponentialRampToValueAtTime(s, time + a + d);
  const releaseStart = time + a + d + hold;
  g.gain.setValueAtTime(s, releaseStart);
  g.gain.exponentialRampToValueAtTime(0.0001, releaseStart + r);

  toBus(g, sendAmount);
  return { gain: g, endTime: releaseStart + r };
}

function playKick(time) {
  const { gain, endTime } = makeVoiceGain(time, 0.12);
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(150, time);
  osc.frequency.exponentialRampToValueAtTime(45, time + 0.12);
  osc.connect(gain);
  osc.start(time);
  osc.stop(endTime + 0.05);

  const click = noiseSource(0.03);
  const clickFilter = ctx.createBiquadFilter();
  clickFilter.type = 'highpass';
  clickFilter.frequency.value = 1000;
  const clickGain = ctx.createGain();
  clickGain.gain.setValueAtTime(0.4, time);
  clickGain.gain.exponentialRampToValueAtTime(0.001, time + 0.03);
  click.connect(clickFilter).connect(clickGain).connect(gain);
  click.start(time);
  click.stop(time + 0.03);
}

function playSnare(time) {
  const { gain, endTime } = makeVoiceGain(time, 0.3);
  const noise = noiseSource(0.3);
  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.value = 1800;
  noiseFilter.Q.value = 0.7;
  noise.connect(noiseFilter).connect(gain);
  noise.start(time);
  noise.stop(endTime + 0.05);

  const osc = ctx.createOscillator();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(190, time);
  osc.frequency.exponentialRampToValueAtTime(120, time + 0.1);
  const oscGain = ctx.createGain();
  oscGain.gain.value = 0.6;
  osc.connect(oscGain).connect(gain);
  osc.start(time);
  osc.stop(endTime + 0.05);
}

function playMetallic(time, sendAmount, highpassFreq, sustainExtra) {
  const { gain, endTime } = makeVoiceGain(time, sendAmount);
  const ratios = [2, 3, 4.16, 5.43, 6.79, 8.21];
  const fundamental = 40;
  const bandpass = ctx.createBiquadFilter();
  bandpass.type = 'highpass';
  bandpass.frequency.value = highpassFreq;
  bandpass.connect(gain);

  ratios.forEach((r) => {
    const osc = ctx.createOscillator();
    osc.type = 'square';
    osc.frequency.value = fundamental * r;
    osc.connect(bandpass);
    osc.start(time);
    osc.stop(endTime + sustainExtra);
  });
}

function playHiHat(time) {
  playMetallic(time, 0.2, 7000, 0.05);
}

function playRide(time) {
  playMetallic(time, 0.4, 4000, 0.3);
}

function playClap(time) {
  const { gain, endTime } = makeVoiceGain(time, 0.35);
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 1500;
  filter.Q.value = 1.2;
  filter.connect(gain);

  [0, 0.01, 0.02, 0.03].forEach((offset) => {
    const noise = noiseSource(0.05);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.5, time + offset);
    g.gain.exponentialRampToValueAtTime(0.001, time + offset + 0.04);
    noise.connect(g).connect(filter);
    noise.start(time + offset);
    noise.stop(time + offset + 0.05);
  });
}

function playTom(time, freq) {
  const { gain, endTime } = makeVoiceGain(time, 0.25);
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(freq * 1.5, time);
  osc.frequency.exponentialRampToValueAtTime(freq * 0.8, time + 0.2);
  osc.connect(gain);
  osc.start(time);
  osc.stop(endTime + 0.05);
}

function playPerc(time) {
  const { gain, endTime } = makeVoiceGain(time, 0.3);
  const noise = noiseSource(0.15);
  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2500;
  filter.Q.value = 3;
  noise.connect(filter).connect(gain);
  noise.start(time);
  noise.stop(endTime + 0.05);
}

function playSynth(time, freq) {
  const { gain, endTime } = makeVoiceGain(time, 0.3);
  const layers = [
    { type: 'sawtooth', detune: -7, mix: 0.5 },
    { type: 'triangle', detune: 0, mix: 1 },
    { type: 'sawtooth', detune: 7, mix: 0.5 }
  ];
  layers.forEach((layer) => {
    const osc = ctx.createOscillator();
    const og = ctx.createGain();
    osc.type = layer.type;
    osc.frequency.value = freq;
    osc.detune.value = layer.detune;
    og.gain.value = layer.mix;
    osc.connect(og).connect(gain);
    osc.start(time);
    osc.stop(endTime + 0.05);
  });
}

function playBass(time, freq) {
  const { gain, endTime } = makeVoiceGain(time, 0.1);
  const osc = ctx.createOscillator();
  osc.type = 'sine';
  osc.frequency.value = freq;
  osc.connect(gain);
  osc.start(time);
  osc.stop(endTime + 0.05);

  const sub = ctx.createOscillator();
  sub.type = 'sine';
  sub.frequency.value = freq / 2;
  const subGain = ctx.createGain();
  subGain.gain.value = 0.6;
  sub.connect(subGain).connect(gain);
  sub.start(time);
  sub.stop(endTime + 0.05);
}

function playBlip(time) {
  const { gain, endTime } = makeVoiceGain(time, 0.2);
  const osc = ctx.createOscillator();
  osc.type = 'square';
  osc.frequency.setValueAtTime(1200, time);
  osc.frequency.exponentialRampToValueAtTime(600, time + 0.08);
  osc.connect(gain);
  osc.start(time);
  osc.stop(endTime + 0.05);
}

function playNoiseHit(time) {
  const { gain, endTime } = makeVoiceGain(time, 0.5);
  const noise = noiseSource(0.4);
  noise.connect(gain);
  noise.start(time);
  noise.stop(endTime + 0.05);
}

function synthesizeSound(padDef, time) {
  switch (padDef.type) {
    case 'kick': return playKick(time);
    case 'snare': return playSnare(time);
    case 'hihat': return playHiHat(time);
    case 'clap': return playClap(time);
    case 'tom': return playTom(time, padDef.freq);
    case 'perc': return playPerc(time);
    case 'ride': return playRide(time);
    case 'synth': return playSynth(time, padDef.freq);
    case 'bass': return playBass(time, padDef.freq);
    case 'blip': return playBlip(time);
    case 'noise': return playNoiseHit(time);
    default: return null;
  }
}

// ---------------------------------------------------------------
// Triggering: pointer + keyboard, per-hit stereo width & velocity,
// plus optional recording of the hit for playback
// ---------------------------------------------------------------

const padLevels = {};
let isRecording = false;
let recordedHits = [];
let recordStartTime = 0;

function triggerPad(padDef, time, recordHit) {
  if (ctx.state === 'suspended') {
    ctx.resume();
  }

  const channel = channelOf[padDef.type];
  const channelBus = channelGains[channel];

  const panner = ctx.createStereoPanner();
  panner.pan.value = (Math.random() - 0.5) * 0.25;
  const velocity = ctx.createGain();
  velocity.gain.value = padLevels[padDef.label] ?? 1;
  panner.connect(velocity).connect(channelBus);

  currentBus = panner;
  synthesizeSound(padDef, time);
  currentBus = null;

  if (recordHit && isRecording) {
    recordedHits.push({ padKey: padDef.key, time: time - recordStartTime });
  }
}

const grid = document.getElementById('grid');
const padEls = {};
const activePointers = new Map(); // pointerId -> pad element currently pressed

function flashPad(el, duration) {
  el.classList.add('active');
  setTimeout(() => el.classList.remove('active'), duration);
}

function activatePad(padDef, el) {
  const time = quantizeTime(ctx.currentTime);
  triggerPad(padDef, time, true);
  el.classList.add('active');
}

function deactivatePad(el) {
  el.classList.remove('active');
}

pads.forEach((padDef) => {
  const el = document.createElement('button');
  el.className = 'pad';
  el.style.background = `linear-gradient(160deg, ${padDef.color}, ${shade(padDef.color, -35)})`;
  el.innerHTML = `<span>${padDef.label}</span><span class="key">${padDef.key}</span>`;

  el.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    activatePad(padDef, el);
    activePointers.set(e.pointerId, el);
  });
  el.addEventListener('pointerup', (e) => {
    deactivatePad(el);
    activePointers.delete(e.pointerId);
  });
  el.addEventListener('pointerleave', (e) => {
    if (activePointers.has(e.pointerId)) {
      deactivatePad(el);
      activePointers.delete(e.pointerId);
    }
  });

  grid.appendChild(el);
  padEls[padDef.key.toUpperCase()] = { el, padDef };
});

document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const entry = padEls[e.key.toUpperCase()];
  if (entry) {
    activatePad(entry.padDef, entry.el);
  }
});
document.addEventListener('keyup', (e) => {
  const entry = padEls[e.key.toUpperCase()];
  if (entry) {
    deactivatePad(entry.el);
  }
});

// Pad Levels panel: one trim slider per pad
const padLevelsContainer = document.getElementById('padLevels');
pads.forEach((padDef) => {
  padLevels[padDef.label] = 1;
  const row = document.createElement('label');
  row.innerHTML = `${padDef.label}
    <input type="range" min="0" max="1.5" step="0.01" value="1" data-label="${padDef.label}">`;
  padLevelsContainer.appendChild(row);
});
padLevelsContainer.addEventListener('input', (e) => {
  if (e.target.dataset.label) {
    padLevels[e.target.dataset.label] = parseFloat(e.target.value);
  }
});

// ---------------------------------------------------------------
// Record / Play / Loop transport
// ---------------------------------------------------------------

const recordBtn = document.getElementById('recordBtn');
const playBtn = document.getElementById('playBtn');
const loopBtn = document.getElementById('loopBtn');

let isPlaying = false;
let isLooping = false;
let playbackTimeouts = [];
let patternDuration = 0;

recordBtn.addEventListener('click', () => {
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  if (!isRecording) {
    isRecording = true;
    recordedHits = [];
    recordStartTime = ctx.currentTime;
    recordBtn.classList.add('on');
    recordBtn.textContent = '● Stop';
  } else {
    isRecording = false;
    patternDuration = Math.max(ctx.currentTime - recordStartTime, 0.2);
    recordBtn.classList.remove('on');
    recordBtn.textContent = '● Rec';
  }
});

function stopPlayback() {
  playbackTimeouts.forEach((id) => clearTimeout(id));
  playbackTimeouts = [];
  isPlaying = false;
  playBtn.classList.remove('on');
  playBtn.textContent = '▶ Play';
}

function schedulePlayback() {
  if (recordedHits.length === 0) {
    return;
  }
  isPlaying = true;
  playBtn.classList.add('on');
  playBtn.textContent = '⏸ Stop';

  recordedHits.forEach((hit) => {
    const id = setTimeout(() => {
      const entry = padEls[hit.padKey.toUpperCase()];
      if (!entry) return;
      triggerPad(entry.padDef, ctx.currentTime, false);
      flashPad(entry.el, 120);
    }, hit.time * 1000);
    playbackTimeouts.push(id);
  });

  const endId = setTimeout(() => {
    if (isLooping) {
      schedulePlayback();
    } else {
      stopPlayback();
    }
  }, patternDuration * 1000 + 60);
  playbackTimeouts.push(endId);
}

playBtn.addEventListener('click', () => {
  if (ctx.state === 'suspended') {
    ctx.resume();
  }
  if (isPlaying) {
    stopPlayback();
  } else {
    schedulePlayback();
  }
});

loopBtn.addEventListener('click', () => {
  isLooping = !isLooping;
  loopBtn.classList.toggle('on', isLooping);
});

const padsGiftButton = document.getElementById('giftButton');
if (padsGiftButton) {
  padsGiftButton.addEventListener('click', openGiftReveal);
}