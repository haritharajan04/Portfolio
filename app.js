// Initialize Lucide Icons
document.addEventListener("DOMContentLoaded", () => {
    lucide.createIcons();
    initMobileMenu();
    initScrollAnimations();
    initParticleBackground();
    initProjectFilter();
    initVoiceSimulator();
    initContactForm();
    initResumeDownload();
});

// 1. Mobile Menu Toggle
function initMobileMenu() {
    const toggleBtn = document.querySelector(".mobile-nav-toggle");
    const mobileMenu = document.querySelector(".mobile-menu");
    
    if (toggleBtn && mobileMenu) {
        toggleBtn.addEventListener("click", () => {
            const isOpen = mobileMenu.style.display === "block";
            mobileMenu.style.display = isOpen ? "none" : "block";
            toggleBtn.innerHTML = isOpen 
                ? '<i data-lucide="menu"></i>' 
                : '<i data-lucide="x"></i>';
            lucide.createIcons();
        });

        // Close when clicking nav links
        const mobileLinks = mobileMenu.querySelectorAll("a");
        mobileLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.style.display = "none";
                toggleBtn.innerHTML = '<i data-lucide="menu"></i>';
                lucide.createIcons();
            });
        });
    }
}

// 2. Scroll Triggered Transitions (Intersection Observer)
function initScrollAnimations() {
    const sections = document.querySelectorAll("section");
    
    // Add class for animations
    sections.forEach(sec => {
        sec.classList.add("fade-in-section");
    });

    const observerOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(sec => {
        observer.observe(sec);
    });
}

// 3. Floating Interactive Particle Canvas Background
function initParticleBackground() {
    const container = document.getElementById("particle-bg");
    if (!container) return;

    const canvas = document.createElement("canvas");
    container.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = container.offsetWidth);
    let height = (canvas.height = container.offsetHeight);

    window.addEventListener("resize", () => {
        width = (canvas.width = container.offsetWidth);
        height = (canvas.height = container.offsetHeight);
    });

    const particles = [];
    const particleCount = 40;

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2.5 + 1.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        // Draw connections
        ctx.beginPath();
        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                if (dist < 100) {
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                }
            }
        }
        ctx.strokeStyle = "rgba(59, 130, 246, 0.04)";
        ctx.stroke();

        requestAnimationFrame(animate);
    }

    animate();
}

// 4. Project Filters
function initProjectFilter() {
    const filters = document.querySelectorAll(".filter-btn");
    const items = document.querySelectorAll(".project-item");

    filters.forEach(btn => {
        btn.addEventListener("click", () => {
            // Remove active class
            filters.forEach(f => f.classList.remove("active"));
            btn.classList.add("active");

            const filterVal = btn.getAttribute("data-filter");

            items.forEach(item => {
                const cat = item.getAttribute("data-category");
                if (filterVal === "all" || cat === filterVal) {
                    item.style.display = "flex";
                    setTimeout(() => {
                        item.style.opacity = "1";
                        item.style.transform = "scale(1)";
                    }, 50);
                } else {
                    item.style.opacity = "0";
                    item.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        item.style.display = "none";
                    }, 300);
                }
            });
        });
    });
}

// 5. Smart Hostel Voice Simulator Widget Engine
function initVoiceSimulator() {
    const trigger = document.getElementById("start-voice-sim");
    const wave = document.getElementById("audio-wave");
    const transcript = document.getElementById("transcript-txt");
    const tableBody = document.getElementById("complaint-table-body");

    if (!trigger || !wave || !transcript || !tableBody) return;

    let isRunning = false;
    const testComplaint = "Sir, water tap in Room 304 is leaking heavily. Please initiate repair.";

    trigger.addEventListener("click", () => {
        if (isRunning) return;
        isRunning = true;

        // Visual states trigger
        trigger.classList.add("pulsing");
        wave.classList.remove("hidden");
        transcript.textContent = "Listening...";
        transcript.style.fontStyle = "italic";
        transcript.style.color = "#94a3b8";

        let index = 0;
        
        setTimeout(() => {
            transcript.textContent = "";
            transcript.style.fontStyle = "normal";
            transcript.style.color = "#e2e8f0";

            // Character typewrite animation simulating speech recognition stream
            const typeTimer = setInterval(() => {
                if (index < testComplaint.length) {
                    transcript.textContent += testComplaint.charAt(index);
                    index++;
                } else {
                    clearInterval(typeTimer);
                    finalizeSim();
                }
            }, 60);
        }, 1500);
    });

    function finalizeSim() {
        trigger.classList.remove("pulsing");
        wave.classList.add("hidden");

        // Flash transcript green to show successful speech synthesis check
        transcript.style.color = "#34d399";
        
        setTimeout(() => {
            // Append simulated parsed payload into the live warden dashboard table
            const newRow = document.createElement("tr");
            newRow.style.opacity = "0";
            newRow.style.transform = "translateY(10px)";
            newRow.style.transition = "all 0.6s ease-out";
            
            newRow.innerHTML = `
                <td>Room 304</td>
                <td>Water tap leaking</td>
                <td><span class="prio-tag prio-high">High</span></td>
                <td><span class="status-tag status-pending">Pending</span></td>
            `;

            tableBody.insertBefore(newRow, tableBody.firstChild);
            
            // Reflow trigger
            setTimeout(() => {
                newRow.style.opacity = "1";
                newRow.style.transform = "translateY(0)";
            }, 50);

            // Simulate Warden response workflow state transition
            setTimeout(() => {
                const statusBadge = newRow.querySelector(".status-tag");
                if (statusBadge) {
                    statusBadge.textContent = "Approved";
                    statusBadge.className = "status-tag status-progress";
                    statusBadge.style.background = "#1e3a8a";
                    statusBadge.style.color = "#93c5fd";
                }
            }, 3000);

            setTimeout(() => {
                const statusBadge = newRow.querySelector(".status-tag");
                if (statusBadge) {
                    statusBadge.textContent = "Resolved";
                    statusBadge.className = "status-tag status-success";
                    statusBadge.style.background = "#064e3b";
                    statusBadge.style.color = "#6ee7b7";
                }
                isRunning = false;
            }, 6000);

        }, 1000);
    }
}

// 6. Recruitment Contact Form Validation
function initContactForm() {
    const form = document.getElementById("contact-form");
    const statusMsg = document.getElementById("form-status");

    if (!form || !statusMsg) return;

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById("form-submit");
        const originalText = submitBtn.innerHTML;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i data-lucide="loader"></i> Transmitting...';
        lucide.createIcons();

        // Simulate secure SMTP routing
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
            lucide.createIcons();

            statusMsg.classList.remove("hidden", "error");
            statusMsg.classList.add("success");
            statusMsg.textContent = "✓ Application transmitted successfully! Recruiters will receive this portfolio packet instantly.";
            
            form.reset();
        }, 1500);
    });
}

// 7. Resume Download Link Simulated Action
function initResumeDownload() {
    const triggers = ["download-resume", "download-resume-bottom"];
    
    triggers.forEach(id => {
        const btn = document.getElementById(id);
        if (btn) {
            btn.addEventListener("click", (e) => {
                e.preventDefault();
                alert("Simulating PDF Resume Download...\n\nSuccessfully bundled: \n- Haritha Rajan's CS Engineering Resume (NIT Patna)\n- Flagship Project Workflow Spec (Speech-to-Text Complaint Registry)\n- Deep Transfer Learning URL Malware Research Paper\n- GBM Industry Internship Reference Sheets");
            });
        }
    });
}
