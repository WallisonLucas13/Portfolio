// ===== PORTFOLIO JAVASCRIPT =====

// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
const contactForm = document.getElementById('contact-form');
const header = document.querySelector('.header');

// ===== NAVIGATION FUNCTIONALITY =====

// Mobile Navigation Toggle
navToggle?.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on nav links and set active state
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
        
        // Remove active class from all nav links
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        
        // Add active class to clicked link (click effect with bottom bar)
        link.classList.add('active');
        
        // Remove focus from link to prevent CSS :focus conflicts
        link.blur();
    });
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // Se estiver no final da página (últimos 50px), ativar sempre o último item (contact)
    if (scrollY + windowHeight >= documentHeight - 50) {
        navLinks.forEach(link => link.classList.remove('active'));
        const contactLink = document.querySelector('.nav-link[href="#contact"]');
        contactLink?.classList.add('active');
        return;
    }

    let activeSection = null;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionBottom = sectionTop + sectionHeight;
        const sectionId = section.getAttribute('id');

        // Se a seção está visível na tela
        if (scrollY >= sectionTop && scrollY < sectionBottom) {
            activeSection = sectionId;
        }
    });

    // Ativar o link correspondente
    if (activeSection) {
        navLinks.forEach(link => link.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${activeSection}"]`);
        activeLink?.classList.add('active');
    }
});

// Header Background on Scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.background = 'rgba(10, 10, 10, 0.95)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.background = 'rgba(10, 10, 10, 0.9)';
        header.style.boxShadow = 'none';
    }
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80;
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== PROJECT FILTERING =====
const ProjectFilter = {
    init() {
        this.bindEvents();
        this.filterProjects('all'); // Show all projects initially
    },

    bindEvents() {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.getAttribute('data-filter');
                this.setActiveFilter(e.target);
                this.filterProjects(filter);
            });
        });
    },

    setActiveFilter(activeBtn) {
        filterBtns.forEach(btn => btn.classList.remove('active'));
        activeBtn.classList.add('active');
    },

    filterProjects(filter) {
        projectCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || category.includes(filter);
            
            if (shouldShow) {
                card.style.display = 'block';
                // Animate in with delay
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
};

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const AnimationObserver = {
    init() {
        this.createObserver();
        this.observeElements();
    },

    createObserver() {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        this.observer.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );
    },

    observeElements() {
        // Elements to animate on scroll
        const elements = document.querySelectorAll(`
            .hero-content,
            .about-content,
            .skill-category,
            .project-card,
            .contact-content,
            .section-title
        `);

        elements.forEach(el => {
            el.classList.add('reveal');
            this.observer.observe(el);
        });
    }
};

// ===== TYPING ANIMATION =====
class TypingAnimation {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.isDeleting = false;
        this.isWaiting = false;
    }

    start() {
        this.type();
    }

    type() {
        const currentText = this.texts[this.textIndex];
        
        if (!this.isDeleting && this.charIndex < currentText.length) {
            // Typing
            this.element.textContent = currentText.substring(0, this.charIndex + 1);
            this.charIndex++;
            setTimeout(() => this.type(), this.speed);
            
        } else if (this.isDeleting && this.charIndex > 0) {
            // Deleting
            this.element.textContent = currentText.substring(0, this.charIndex - 1);
            this.charIndex--;
            setTimeout(() => this.type(), this.speed / 2);
            
        } else {
            // Switch between typing and deleting
            if (!this.isDeleting) {
                this.isDeleting = true;
                setTimeout(() => this.type(), 2000); // Wait before deleting
            } else {
                this.isDeleting = false;
                this.textIndex = (this.textIndex + 1) % this.texts.length;
                setTimeout(() => this.type(), 500); // Wait before next text
            }
        }
    }
}

// ===== CONTACT FORM HANDLING =====
const ContactForm = {
    init() {
        if (contactForm) {
            contactForm.addEventListener('submit', this.handleSubmit.bind(this));
            this.addInputAnimations();
        }
    },

    handleSubmit(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        // Validate form
        if (!this.validateForm(data)) {
            return;
        }

        // Show loading state
        this.showLoadingState();

        // Set reply-to field
        document.getElementById('replyto').value = data.email;

        // Submit form to Formspree
        this.submitToFormspree(contactForm);
    },

    validateForm(data) {
        const requiredFields = ['name', 'email', 'subject', 'message'];
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        for (let field of requiredFields) {
            if (!data[field] || data[field].trim() === '') {
                this.showError(`${field.charAt(0).toUpperCase() + field.slice(1)} é obrigatório`);
                return false;
            }
        }

        if (!emailRegex.test(data.email)) {
            this.showError('Por favor, insira um email válido');
            return false;
        }

        return true;
    },

    async submitToFormspree(form) {
        try {
            const formData = new FormData(form);
            
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                this.showSuccessMessage();
                contactForm.reset();
            } else {
                throw new Error('Erro na resposta do servidor');
            }
            
        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            this.showErrorMessage('Erro ao enviar mensagem. Tente novamente.');
        }
    },

    addInputAnimations() {
        const inputs = contactForm.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });

            input.addEventListener('blur', () => {
                if (input.value === '') {
                    input.parentElement.classList.remove('focused');
                }
            });

            // Check if input has value on load
            if (input.value !== '') {
                input.parentElement.classList.add('focused');
            }
        });
    },

    showLoadingState() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        // Store original text to restore later
        submitBtn.setAttribute('data-original-text', originalText);
    },

    showSuccessMessage() {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.getAttribute('data-original-text');
        
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Mensagem Enviada!';
        submitBtn.style.background = 'var(--success)';
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);

        this.showNotification('Mensagem enviada com sucesso!', 'success');
    },

    showError(message) {
        this.showNotification(message, 'error');
    },

    showErrorMessage(message) {
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.getAttribute('data-original-text') || submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Erro no Envio';
        submitBtn.style.background = 'var(--error)';
        submitBtn.disabled = false;
        
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.style.background = '';
        }, 3000);

        this.showNotification(message, 'error');
    },

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;

        // Add notification styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : 'var(--error)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-lg);
            display: flex;
            align-items: center;
            gap: 0.5rem;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: var(--shadow-lg);
        `;

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Remove after delay
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
};

// ===== PERFORMANCE OPTIMIZATIONS =====

// Throttle function for scroll events
function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimized scroll handler
const optimizedScrollHandler = throttle(() => {
    const scrollY = window.pageYOffset;
    
    // Update header background
    if (scrollY > 100) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Update progress bar if exists
    const progressBar = document.querySelector('.progress-bar');
    if (progressBar) {
        const winHeight = window.innerHeight;
        const docHeight = document.documentElement.scrollHeight - winHeight;
        const progress = (scrollY / docHeight) * 100;
        progressBar.style.width = `${progress}%`;
    }
}, 16); // ~60fps

// ===== UTILITIES =====

// Update copyright year
function updateCopyrightYear() {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

// Device detection
const DeviceUtils = {
    isMobile: () => window.innerWidth <= 768,
    isTablet: () => window.innerWidth > 768 && window.innerWidth <= 1024,
    isDesktop: () => window.innerWidth > 1024,
    
    // Touch device detection
    isTouchDevice: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
};

// Preload images
function preloadImages() {
    const imageUrls = [
        // Add any image URLs you want to preload
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// ===== EASTER EGGS =====

// Konami Code Easter Egg
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    
    if (konamiCode.length > konamiSequence.length) {
        konamiCode.shift();
    }
    
    if (JSON.stringify(konamiCode) === JSON.stringify(konamiSequence)) {
        activateEasterEgg();
    }
});

function activateEasterEgg() {
    // Add some fun animation or effect
    document.body.style.animation = 'rainbow 2s infinite';
    
    // Create CSS for rainbow effect
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);
    
    // Show notification
    ContactForm.showNotification('🎉 Easter egg ativado! Código Konami detectado!', 'success');
    
    // Remove effect after 5 seconds
    setTimeout(() => {
        document.body.style.animation = '';
        document.head.removeChild(style);
    }, 5000);
}

// ===== INITIALIZATION =====

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Portfolio carregado com sucesso!');
    
    // Update copyright year dynamically
    updateCopyrightYear();
    
    // Initialize all modules
    ProjectFilter.init();
    AnimationObserver.init();
    ContactForm.init();
    
    // Set initial active navigation link
    const homeNavLink = document.querySelector('.nav-link[href="#home"]');
    if (homeNavLink) {
        // Remove active class from all nav links first
        navLinks.forEach(link => link.classList.remove('active'));
        // Add active class to home link
        homeNavLink.classList.add('active');
    }
    
    // Set timestamp for contact form
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        const now = new Date();
        timestampField.value = now.toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Initialize typing animation for hero section
    const heroTextElement = document.querySelector('.hero-profession');
    if (heroTextElement) {
        const typingTexts = [
            'Engenheiro de Software',
            'Desenvolvedor Java',
            'Desenvolvedor Typescript',
            'Desenvolvedor FullStack'
        ];
        
        const typingAnimation = new TypingAnimation(heroTextElement, typingTexts, 150);
        // Start typing animation after a short delay
        setTimeout(() => {
            typingAnimation.start();
        }, 2000);
    }
    
    // Preload images
    preloadImages();
    
    // Add optimized scroll listener
    window.addEventListener('scroll', optimizedScrollHandler);
    
    // Add resize listener for responsive adjustments
    window.addEventListener('resize', throttle(() => {
        // Recalculate any layout-dependent values
        if (DeviceUtils.isMobile() && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }, 250));
    
    // Log performance metrics
    if ('performance' in window) {
        window.addEventListener('load', () => {
            const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
            console.log(`⚡ Tempo de carregamento: ${loadTime}ms`);
        });
    }
});

// ===== THEME SWITCHING (Future Enhancement) =====
const ThemeManager = {
    init() {
        this.loadTheme();
        this.bindEvents();
    },
    
    loadTheme() {
        const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
        document.body.setAttribute('data-theme', savedTheme);
    },
    
    toggleTheme() {
        const currentTheme = document.body.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.body.setAttribute('data-theme', newTheme);
        localStorage.setItem('portfolio-theme', newTheme);
        
        // Animate theme transition
        document.body.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    },
    
    bindEvents() {
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', this.toggleTheme);
        }
    }
};

// ===== VISITOR ANALYTICS =====
class VisitorAnalytics {
    constructor() {
        this.visitStartTime = Date.now();
        this.visitorId = this.generateVisitorId();
        this.sectionEntries = []; // Lista de entradas: {section, timestamp}
        this.hasReportedVisit = false;
        this.minTimeThreshold = 0;
        this.isProduction = !this.isLocalDevelopment();
        this.init();
        
        // Registrar entrada inicial no home
        this.recordSectionEntry('#home');
    }

    isLocalDevelopment() {
        const hostname = window.location.hostname;
        return hostname === 'localhost' || 
               hostname === '127.0.0.1' || 
               hostname.startsWith('192.168.') ||
               hostname.includes('local') ||
               window.location.protocol === 'file:';
    }

    init() {
        // Múltiplas estratégias para capturar a saída
        
        // 1. beforeunload - funciona em recarregar
        window.addEventListener('beforeunload', () => {
            this.reportCompleteVisit();
        });

        // 2. pagehide - mais confiável que beforeunload
        window.addEventListener('pagehide', () => {
            this.reportCompleteVisit();
        });

        // 3. visibilitychange - quando a página sai de foco
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                // Enviar imediatamente quando esconder
                this.reportCompleteVisit();
                
                // Backup: enviar após 5 segundos se ainda estiver escondida
                setTimeout(() => {
                    if (document.hidden && !this.hasReportedVisit) {
                        this.reportCompleteVisit();
                    }
                }, 5000);
            }
        });

        // 4. Envio automático após tempo mínimo (backup)
        if (this.isProduction) {
            setTimeout(() => {
                if (!this.hasReportedVisit) {
                    this.reportCompleteVisit();
                }
            }, 30000); // 30 segundos como backup
        }

        // 5. Detecção de inatividade
        this.setupInactivityDetection();
    }

    setupInactivityDetection() {
        if (!this.isProduction) return;
        
        let inactivityTimer;
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                // Usuário inativo por 60 segundos
                if (!this.hasReportedVisit) {
                    this.reportCompleteVisit();
                }
            }, 60000);
        };

        // Reset timer em qualquer atividade
        ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'].forEach(event => {
            document.addEventListener(event, resetTimer, { passive: true });
        });

        resetTimer(); // Iniciar timer
    }

    generateVisitorId() {
        // Gerar ID único baseado em timestamp + random
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `visitor_${timestamp}_${random}`;
    }

    getTimeOnSite() {
        const duration = Date.now() - this.visitStartTime;
        const seconds = Math.max(1, Math.floor(duration / 1000)); // Mínimo 1 segundo
        const minutes = Math.floor(seconds / 60);
        
        if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        }
        return `${seconds}s`;
    }

    recordSectionEntry(sectionId) {
        const timestamp = Date.now();
        this.sectionEntries.push({
            section: sectionId,
            timestamp: timestamp
        });
    }

    trackSectionVisit(sectionId) {
        const lastEntry = this.sectionEntries[this.sectionEntries.length - 1];
        
        // Só registrar se for seção diferente da última
        if (!lastEntry || lastEntry.section !== sectionId) {
            this.recordSectionEntry(sectionId);
        }
    }

    async reportCompleteVisit() {
        // Não enviar em desenvolvimento local
        if (!this.isProduction) return;
        
        const totalTime = Date.now() - this.visitStartTime;
        if (totalTime < this.minTimeThreshold || this.hasReportedVisit) return;

        this.hasReportedVisit = true;
        
        const form = document.getElementById('visitor-form');
        if (!form) return;

        // Calcular todos os dados no momento do envio
        const visitDuration = this.getTimeOnSite();
        const sectionsData = this.getSectionsVisited();
        const visitQuality = this.getSimpleVisitQuality();

        // Preencher campos básicos
        document.getElementById('visit_time').value = new Date().toLocaleString('pt-BR');
        document.getElementById('visit_duration').value = visitDuration;
        document.getElementById('visit_id').value = this.visitorId;

        const formData = new FormData(form);
        formData.append('sections_visited', sectionsData);
        formData.append('visit_quality', visitQuality);
        
        // Debug temporário em produção
        const sectionTimes = this.calculateSectionTimes();
        formData.append('debug_total_ms', totalTime);
        formData.append('debug_entries_count', this.sectionEntries.length);
        formData.append('debug_entries', JSON.stringify(this.sectionEntries));

        try {
            // Tentar sendBeacon primeiro (mais confiável para saída da página)
            const beaconSent = navigator.sendBeacon && navigator.sendBeacon(form.action, formData);
            
            if (!beaconSent) {
                // Fallback com fetch
                fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    keepalive: true, // Importante: mantém a requisição mesmo se a página fechar
                    mode: 'no-cors'
                }).catch(() => {
                    // Último fallback: criar um form temporário e submeter
                    const tempForm = document.createElement('form');
                    tempForm.method = 'POST';
                    tempForm.action = form.action;
                    tempForm.style.display = 'none';
                    
                    // Copiar todos os dados
                    for (let [key, value] of formData.entries()) {
                        const input = document.createElement('input');
                        input.name = key;
                        input.value = value;
                        tempForm.appendChild(input);
                    }
                    
                    document.body.appendChild(tempForm);
                    tempForm.submit();
                });
            }
        } catch (error) {
            // Silencioso em produção
        }
    }

    calculateSectionTimes() {
        const sectionTimes = new Map();
        const now = Date.now();
        const totalVisitTime = now - this.visitStartTime;
        
        if (this.sectionEntries.length === 0) {
            // Se não há entradas, toda visita foi no home
            sectionTimes.set('#home', totalVisitTime);
            return sectionTimes;
        }
        
        if (this.sectionEntries.length === 1) {
            // Se há só uma entrada, toda visita foi nesta seção
            sectionTimes.set(this.sectionEntries[0].section, totalVisitTime);
            return sectionTimes;
        }
        
        // Calcular tempo em cada seção baseado nas entradas
        for (let i = 0; i < this.sectionEntries.length; i++) {
            const entry = this.sectionEntries[i];
            const nextEntry = this.sectionEntries[i + 1];
            
            // Tempo até próxima seção ou até agora
            const endTime = nextEntry ? nextEntry.timestamp : now;
            let timeSpent = endTime - entry.timestamp;
            
            // Adicionar tempo à seção (pode ter múltiplas visitas)
            const currentTime = sectionTimes.get(entry.section) || 0;
            sectionTimes.set(entry.section, currentTime + timeSpent);
        }
        
        return sectionTimes;
    }

    getSectionsVisited() {
        const sectionTimes = this.calculateSectionTimes();
        const sections = [];
        
        sectionTimes.forEach((time, sectionId) => {
            const seconds = (time / 1000).toFixed(3); // 3 casas decimais
            const sectionName = sectionId.replace('#', '');
            sections.push(`${sectionName}: ${seconds}s`);
        });
        
        return sections.length > 0 ? sections.join(' | ') : 'Visita muito rápida';
    }

    getSimpleVisitQuality() {
        const duration = Date.now() - this.visitStartTime;
        const sectionsCount = this.calculateSectionTimes().size;
        
        if (duration > 120000 && sectionsCount > 2) return 'Engajada';
        if (duration > 60000) return 'Média';
        return 'Rápida';
    }
}

// Inicializar analytics quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    // Aguardar um pouco para não impactar o carregamento da página
    setTimeout(() => {
        const analytics = new VisitorAnalytics();
        
        // Só configurar rastreamento em produção
        if (analytics.isProduction) {
            // Método mais confiável: rastrear por scroll position
            let lastSection = null;
            const checkCurrentSection = () => {
                const sections = document.querySelectorAll('section[id]');
                const scrollTop = window.scrollY;
                const windowHeight = window.innerHeight;
                const centerPoint = scrollTop + (windowHeight / 2);
                
                let currentSection = null;
                
                sections.forEach(section => {
                    const rect = section.getBoundingClientRect();
                    const sectionTop = scrollTop + rect.top;
                    const sectionBottom = sectionTop + rect.height;
                    
                    // Se o centro da tela está nesta seção
                    if (centerPoint >= sectionTop && centerPoint <= sectionBottom) {
                        currentSection = '#' + section.id;
                    }
                });
                
                // Se mudou de seção
                if (currentSection && currentSection !== lastSection) {
                    analytics.trackSectionVisit(currentSection);
                    lastSection = currentSection;
                }
            };
            
            // Verificar seção inicial
            setTimeout(checkCurrentSection, 500);
            
            // Verificar durante scroll com throttle
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(checkCurrentSection, 100);
            }, { passive: true });
            
            // Verificar quando clicar em links de navegação
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    setTimeout(checkCurrentSection, 800); // Esperar animação do scroll
                });
            });
        }
    }, 1000);
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProjectFilter,
        AnimationObserver,
        ContactForm,
        ThemeManager,
        DeviceUtils,
        VisitorAnalytics,
        InteractionTracker
    };
}