/*GLOBAL VARIABLES & INITIALIZATION*/
let currentRotation = 0;
const bgAudio = document.getElementById('bg-audio');
const audioBtn = document.getElementById('audio-btn');

// Combined window.onload to handle both carousel and welcome text
window.onload = () => {
    rotateCarousel(0);
    
    // Check if someone is logged in
    const activeUser = sessionStorage.getItem('userName');
    if (activeUser) {
        const welcomeDisplay = document.getElementById('welcome-text');
        if (welcomeDisplay) welcomeDisplay.innerText = `Welcome, ${activeUser}`;
    }
};

// Re-calculate carousel if screen is resized (for phone rotation)
window.onresize = () => rotateCarousel(0);

/*NAVIGATION & MOBILE MENU */

function toggleMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
    }
}

function showPage(pageId) {
    console.log("Attempting to show page:", pageId);
    const cleanId = pageId.startsWith('page-') ? pageId : 'page-' + pageId;
    const target = document.getElementById(cleanId);
    
    if (!target) {
        console.error("Target page not found in HTML:", cleanId);
        return;
    }

    document.querySelectorAll('.page-node').forEach(page => {
        page.classList.add('hidden-page');
        page.classList.remove('active-page');
    });

    target.classList.remove('hidden-page');
    target.classList.add('active-page');
    window.scrollTo(0, 0);
}

/* REGISTRATION (SIGNUP)*/
const signupBtn = document.getElementById('signup-btn');
if (signupBtn) {
    signupBtn.addEventListener('click', async () => {
        const nameInput = document.getElementById('signup-name');
        const emailInput = document.getElementById('signup-email');
        const passInput = document.getElementById('signup-password');

        if (!nameInput || !emailInput || !passInput) return;

        const name = nameInput.value;
        const email = emailInput.value;
        const password = passInput.value;

        if (!name || !email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/user/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });

            const data = await response.json();

            if (response.status === 201) {
                alert("Success! Profile created in the Archive.");
                showPage('page-login'); 
            } else {
                alert("Error: " + (data.message || "Registration failed"));
            }
        } catch (error) {
            alert("Connection Failed: Make sure your Backend terminal shows 'Server running on port 4000'.");
        }
    });
}

/*LOGIN LOGIC*/
const loginBtn = document.getElementById('login-btn');
if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
        const email = document.getElementById('login-email')?.value;
        const password = document.getElementById('login-password')?.value;

        if (!email || !password) {
            alert("The Lab requires both email and password for entry.");
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/api/user/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                const userName = data.user.name || "Scholar";
                alert(`✨ Welcome back, ${userName}! Accessing the Lab...`);
                sessionStorage.setItem('userName', userName);
                showPage('page-home'); 
            } else {
                alert("Access Denied: " + (data.message || "Invalid credentials"));
            }
        } catch (error) {
            alert("The Lab server is unreachable.");
        }
    });
}

/*SPECIAL EFFECTS & AUDIO*/

function triggerLightning() {
    const flash = document.getElementById('flash-overlay');
    if (flash) {
        flash.classList.add('animate-flash');
        setTimeout(() => flash.classList.remove('animate-flash'), 800);
    }
    
    setTimeout(() => {
        const target = document.getElementById('characters');
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        rotateCarousel(0);
    }, 200); 
}

/* AUDIO CONTROL LOGIC*/
function toggleAudio() {
    const bgAudio = document.getElementById('bg-audio');
    const audioBtn = document.getElementById('audio-btn');

    if (!bgAudio || !audioBtn) {
        console.error("Audio element or Button not found!");
        return;
    }

    // Check if audio is paused or muted
    if (bgAudio.paused) {
        // Try to play the audio
        bgAudio.play().then(() => {
            // Success: Change icon to volume full and add glow
            audioBtn.innerHTML = "<i class='bx bx-volume-full'></i>";
            audioBtn.style.boxShadow = "0 0 15px #14b8a6";
            bgAudio.muted = false; 
        }).catch(err => {
            console.log("Browser blocked autoplay. User must interact first.");
            alert("Please click anywhere on the page first, then press the audio button!");
        });
    } else {
        // If it's already playing, pause it
        bgAudio.pause();
        // Change icon to mute and remove glow
        audioBtn.innerHTML = "<i class='bx bx-volume-mute'></i>";
        audioBtn.style.boxShadow = "none";
    }
}

/*RESPONSIVE CAROUSEL*/

function rotateCarousel(angle) {
    currentRotation += angle;
    const items = document.querySelectorAll('.carousel-item');
    const radius = window.innerWidth < 768 ? 160 : 350; 

    items.forEach((item, index) => {
        const itemAngle = (index * 72) + currentRotation;
        item.style.transform = `rotateY(${itemAngle}deg) translateZ(${radius}px)`;
        const normalizedAngle = ((itemAngle % 360) + 360) % 360;

        if (normalizedAngle > 45 && normalizedAngle < 315) {
            item.style.opacity = "0.15"; 
            item.style.filter = "blur(4px) grayscale(100%)";
            item.style.zIndex = "1";
        } else {
            item.style.opacity = "1";
            item.style.filter = "blur(0px) grayscale(0%)";
            item.style.zIndex = "10";
            item.style.transform += " scale(1.1)"; 
        }
    });
}