/* ========================================
   ABC TRADERS ELITE — Auth JavaScript
   ======================================== */

// Este script maneja la lógica de autenticación en el cliente
// y la protección de contenido VIP. Se ejecuta en todas las páginas.

document.addEventListener('DOMContentLoaded', () => {
    initAuthSystem();
});

function initAuthSystem() {
    // Check local storage for mock auth (for preview without full firebase setup)
    const isVip = localStorage.getItem('abc_traders_vip') === 'true';
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('abc_traders_user'));
    } catch(e) {}

    updateNavbarUI(isVip, user);
    protectVipContent(isVip);
}

function updateNavbarUI(isVip, user) {
    const ctaContainers = document.querySelectorAll('.nav-cta');
    const mobileNavs = document.querySelectorAll('.nav-mobile');

    if (isVip && user) {
        // Desktop Navbar
        ctaContainers.forEach(container => {
            container.innerHTML = `
                <div style="display: flex; align-items: center; gap: 15px;">
                    <span class="badge badge-elite" style="font-size: 0.7rem;">VIP</span>
                    <span style="font-weight: 600; font-size: 0.9rem;">${user.name || user.email}</span>
                    <button onclick="logout()" class="btn btn-secondary btn-sm" style="padding: 6px 12px;">Salir</button>
                </div>
            `;
        });

        // Mobile Navbar
        mobileNavs.forEach(nav => {
            // Eliminar botón de "Acceder"
            const btn = nav.querySelector('.btn');
            if (btn) btn.remove();
            
            // Agregar info del usuario y botón de salir
            const userInfo = document.createElement('div');
            userInfo.style.marginTop = '1rem';
            userInfo.style.display = 'flex';
            userInfo.style.flexDirection = 'column';
            userInfo.style.alignItems = 'center';
            userInfo.style.gap = '10px';
            userInfo.innerHTML = `
                <span class="badge badge-elite">VIP</span>
                <span style="font-weight: 600; color: var(--text-primary);">${user.name || user.email}</span>
                <button onclick="logout()" class="btn btn-secondary" style="margin-top: 10px;">Cerrar sesión</button>
            `;
            nav.appendChild(userInfo);
        });
    } else {
        // Not logged in - Update CTAs to point to login
        ctaContainers.forEach(container => {
            container.innerHTML = `
                <a href="pages/login.html" class="btn btn-secondary btn-sm" style="margin-right: 10px;">Login VIP</a>
                <a href="pages/pricing.html" class="btn btn-primary btn-sm">Acceder al sistema</a>
            `;
            // Handle index.html paths
            const links = container.querySelectorAll('a');
            links.forEach(link => {
                if (window.location.pathname.includes('/pages/')) {
                    link.href = link.href.replace('pages/', ''); // Fix relative path
                }
            });
        });

        mobileNavs.forEach(nav => {
            const btn = nav.querySelector('.btn');
            if (btn) {
                btn.textContent = 'Ver Planes';
                btn.href = window.location.pathname.includes('/pages/') ? 'pricing.html' : 'pages/pricing.html';
                
                const loginBtn = document.createElement('a');
                loginBtn.className = 'btn btn-secondary';
                loginBtn.textContent = 'Login VIP';
                loginBtn.href = window.location.pathname.includes('/pages/') ? 'login.html' : 'pages/login.html';
                loginBtn.style.marginTop = '10px';
                nav.insertBefore(loginBtn, btn.nextSibling);
            }
        });
    }
}

function protectVipContent(isVip) {
    const currentPath = window.location.pathname;
    
    // Protect Academy Courses
    if (currentPath.includes('academy.html')) {
        const eliteCourses = document.querySelectorAll('.course-card [data-category]:not([data-category="fundamentos"])');
        // Actually, looking at academy.html structure, we can identify VIP courses by their badge
        const premiumBadges = document.querySelectorAll('.badge-elite, .badge-premium');
        
        premiumBadges.forEach(badge => {
            const card = badge.closest('.course-card');
            if (card && !isVip) {
                // Lock the course
                const thumbnail = card.querySelector('.course-thumbnail');
                const playBtn = card.querySelector('.play-btn');
                
                if (playBtn) playBtn.innerHTML = '🔒';
                
                card.style.position = 'relative';
                // Add overlay
                const overlay = document.createElement('div');
                overlay.className = 'vip-overlay';
                overlay.style.cssText = `
                    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(10,10,10,0.6); backdrop-filter: blur(4px);
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    z-index: 10; opacity: 0; transition: opacity 0.3s;
                `;
                
                overlay.innerHTML = `
                    <div style="background: var(--bg-surface-elevated); padding: 15px 20px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--accent-violet);">
                        <span style="font-size: 1.5rem; margin-bottom: 5px; display: block;">🔒</span>
                        <div style="font-weight: bold; font-size: 0.9rem; margin-bottom: 5px;">Contenido VIP</div>
                        <a href="login.html" class="btn btn-primary btn-sm">Iniciar Sesión</a>
                    </div>
                `;
                
                card.appendChild(overlay);
                card.addEventListener('mouseenter', () => overlay.style.opacity = '1');
                card.addEventListener('mouseleave', () => overlay.style.opacity = '0');
                
                // Prevent click
                card.addEventListener('click', (e) => {
                    if (e.target.tagName !== 'A') {
                        e.preventDefault();
                        window.location.href = 'login.html';
                    }
                }, true);
            } else if (card && isVip) {
                // Play VIP Video
                card.addEventListener('click', () => {
                    const ytUrl = card.getAttribute('data-youtube-url');
                    if(ytUrl) {
                        window.open(ytUrl, '_blank');
                    }
                });
            }
        });
    }
    
    // Protect Tools (Risk Calculator is VIP now per user request, ALL tools are VIP)
    if (currentPath.includes('tools.html')) {
        const tools = document.querySelectorAll('.tool-card');
        
        tools.forEach(tool => {
            const title = tool.querySelector('h3').textContent;
            const isRiskCalc = title.includes('Risk Calculator');
            const actionsDiv = tool.querySelector('.tool-actions');
            
            if (!isVip) {
                // Not VIP - hide normal buttons, show contact button
                if (actionsDiv) {
                    actionsDiv.innerHTML = `
                        <a href="https://t.me/diegoabctraders" target="_blank" class="btn btn-secondary btn-sm" style="width: 100%; justify-content: center;">
                            Comprar acceso (Telegram) ✈️
                        </a>
                    `;
                }
                
                // Change badge on Risk Calculator to Elite
                if (isRiskCalc) {
                    const badge = tool.querySelector('.badge-free');
                    if (badge) {
                        badge.className = 'tool-access badge badge-elite';
                        badge.textContent = 'ELITE';
                    }
                }
            } else {
                // Is VIP - ensure Risk calculator shows as accessible
                 if (isRiskCalc) {
                    const badge = tool.querySelector('.badge-free');
                    if (badge) {
                        badge.className = 'tool-access badge badge-elite';
                        badge.textContent = 'ELITE';
                    }
                }
            }
        });
    }

    // Protect Signals Table
    if (currentPath.includes('signals.html')) {
        const tableContainer = document.querySelector('.signals-table-container');
        
        if (tableContainer && !isVip) {
            // Keep first 5 rows visible, blur the rest
            const tbody = tableContainer.querySelector('tbody');
            const rows = tbody.querySelectorAll('tr');
            
            if (rows.length > 5) {
                for (let i = 5; i < rows.length; i++) {
                    rows[i].style.filter = 'blur(4px)';
                    rows[i].style.opacity = '0.5';
                    rows[i].style.pointerEvents = 'none';
                }
                
                // Add overlay over the blurred area
                tableContainer.style.position = 'relative';
                const lockDiv = document.createElement('div');
                lockDiv.style.cssText = `
                    position: absolute; bottom: 0; left: 0; width: 100%; height: 40%;
                    background: linear-gradient(transparent, var(--bg-surface) 60%);
                    display: flex; flex-direction: column; align-items: center; justify-content: flex-end;
                    padding-bottom: 40px; z-index: 10;
                `;
                
                lockDiv.innerHTML = `
                    <div style="background: rgba(17,17,17,0.9); padding: 20px 30px; border-radius: var(--radius-lg); text-align: center; border: 1px solid var(--accent-gold); box-shadow: var(--shadow-md);">
                        <div style="font-size: 2rem; margin-bottom: 10px;">🔒</div>
                        <h3 style="margin-bottom: 10px;">Historial Completo VIP</h3>
                        <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 15px;">Inicia sesión para ver el historial completo y usar la funcionalidad de copiado.</p>
                        <a href="login.html" class="btn btn-gold">Iniciar Sesión</a>
                    </div>
                `;
                
                tableContainer.appendChild(lockDiv);
            }
            
            // Disable copy buttons for first 5
            for (let i = 0; i < 5; i++) {
                if(rows[i]) {
                    const btn = rows[i].querySelector('.copy-btn');
                    if(btn) {
                        btn.onclick = (e) => {
                            e.preventDefault();
                            sessionStorage.setItem('redirectUrl', 'signals.html');
                            window.location.href = 'login.html';
                        };
                        btn.title = "Login requerido para copiar";
                    }
                }
            }
        }
    }

    // Protect Trading Hub
    if (currentPath.includes('trading-hub.html')) {
        const liveWidget = document.querySelector('.hub-live-widget');
        
        if (liveWidget && !isVip) {
            liveWidget.style.position = 'relative';
            const signalsContainer = liveWidget.querySelector('.live-signals-widget');
            if(signalsContainer) {
                signalsContainer.style.filter = 'blur(5px)';
                signalsContainer.style.pointerEvents = 'none';
                signalsContainer.style.userSelect = 'none';
            }
            
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                display: flex; flex-direction: column; align-items: center; justify-content: center;
                background: rgba(10,10,10,0.5); z-index: 10; border-radius: var(--radius-lg);
            `;
            
            overlay.innerHTML = `
                <div style="background: var(--bg-surface-elevated); padding: 20px 30px; border-radius: var(--radius-md); text-align: center; border: 1px solid var(--accent-violet); box-shadow: var(--shadow-lg);">
                    <span style="font-size: 2rem; margin-bottom: 10px; display: block;">🔒</span>
                    <h3 style="margin-bottom: 10px;">Señales en Vivo</h3>
                    <p style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 15px;">Exclusivo para miembros VIP.</p>
                    <a href="login.html" class="btn btn-primary">Iniciar Sesión</a>
                </div>
            `;
            
            liveWidget.appendChild(overlay);
        }
    }
}

// Global logout function
window.logout = function() {
    localStorage.removeItem('abc_traders_vip');
    localStorage.removeItem('abc_traders_user');
    window.location.reload();
};
