// Audio context
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

// 🔊 Play sound based on xinar value
function playSound(xinar) {
    const ctx = audioCtx;

    function beep(freq, volume, duration) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.value = freq;
        gain.gain.value = volume;

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        setTimeout(() => osc.stop(), duration);
    }

    // Sound intensity logic
    if (xinar <= 20) {
        beep(180, 0.04, 500);
    } else if (xinar <= 50) {
        beep(350, 0.08, 400);
    } else if (xinar <= 80) {
        beep(650, 0.15, 400);
    } else if (xinar < 100) {
        beep(900, 0.25, 300);
        setTimeout(() => beep(900, 0.25, 300), 350);
    } else { // TAPPU POINT
        let freqs = [600, 900, 1200, 900, 600];
        freqs.forEach((f, i) => {
            setTimeout(() => beep(f, 0.35, 250), i * 260);
        });
    }
}

// Generate deterministic fingerprint per device
function getFingerprint() {
    return [
        navigator.userAgent,
        navigator.language,
        screen.width,
        screen.height,
        navigator.platform,
        new Date().getTimezoneOffset()
    ].join("|");
}

// Simple hash
function hash(str) {
    let h = 0;
    for (let i = 0; i < str.length; i++) {
        h = ((h << 5) - h) + str.charCodeAt(i);
        h |= 0;
    }
    return Math.abs(h);
}

// Status text for Xinar values
function statusText(x) {
    if (x === 100) return "tappu point"; // updated
    if (x >= 81) return "Danger Zone";
    if (x >= 51) return "Highly Xinar";
    if (x >= 21) return "Mildly Xinar";
    return "Mostly Normal";
}

// Scan function
function startScan() {
    const scanner = document.getElementById("scanner");
    const msg = document.getElementById("message");
    const fill = document.getElementById("fill");
    const marker = document.getElementById("marker");
    const result = document.getElementById("result");

    scanner.classList.add("scanning");
    msg.innerText = "Scanning perverted energy…";
    fill.style.width = "0%";
    marker.style.left = "0%";
    result.innerText = "";

    setTimeout(() => {
        msg.innerText = "Analyzing xinar patterns…";
    }, 1500);

    setTimeout(() => {
        let xinar = hash(getFingerprint()) % 101;
        if (xinar >= 95) xinar = 100;

        fill.style.width = xinar + "%";
        marker.style.left = xinar + "%";

        // Updated result: show tappu point at 100
        if (xinar === 100) {
            result.innerText = xinar + " Xr — tappu point";
        } else {
            result.innerText = xinar + " Xr — " + statusText(xinar);
        }

        playSound(xinar);
        msg.innerText = "Measurement complete";
        scanner.classList.remove("scanning");
    }, 3000);
}

