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

// Close mobile menu when clicking on nav links
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Active Navigation Link on Scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            navLink?.classList.add('active');
        }
    });
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
        this.sectionTimes = new Map(); // Para rastrear tempo em cada seção
        this.currentSection = null;
        this.sectionStartTime = Date.now();
        this.hasReportedVisit = false;
        this.minTimeThreshold = 0; // Capturar todas as visitas
        this.isProduction = !this.isLocalDevelopment();
        this.init();
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
        window.addEventListener('beforeunload', () => {
            this.reportCompleteVisit();
        });

        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                setTimeout(() => {
                    if (document.hidden && !this.hasReportedVisit) {
                        this.reportCompleteVisit();
                    }
                }, 30000);
            }
        });
    }

    generateVisitorId() {
        // Gerar ID único baseado em timestamp + random
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 9);
        return `visitor_${timestamp}_${random}`;
    }

    getTimeOnSite() {
        const duration = Date.now() - this.visitStartTime;
        const seconds = Math.floor(duration / 1000);
        const minutes = Math.floor(seconds / 60);
        
        if (minutes > 0) {
            return `${minutes}m ${seconds % 60}s`;
        }
        return `${seconds}s`;
    }

    trackSectionVisit(sectionId) {
        const now = Date.now();
        
        // Se estava em outra seção, salvar o tempo dela
        if (this.currentSection && this.currentSection !== sectionId) {
            const timeSpent = now - this.sectionStartTime;
            const currentTime = this.sectionTimes.get(this.currentSection) || 0;
            this.sectionTimes.set(this.currentSection, currentTime + timeSpent);
        }
        
        // Começar a contar tempo da nova seção
        this.currentSection = sectionId;
        this.sectionStartTime = now;
    }

    async reportCompleteVisit() {
        // Não enviar em desenvolvimento local
        if (!this.isProduction) return;
        
        const totalTime = Date.now() - this.visitStartTime;
        if (totalTime < this.minTimeThreshold || this.hasReportedVisit) return;

        this.hasReportedVisit = true;
        
        // Finalizar tempo da seção atual
        if (this.currentSection) {
            const timeSpent = Date.now() - this.sectionStartTime;
            const currentTime = this.sectionTimes.get(this.currentSection) || 0;
            this.sectionTimes.set(this.currentSection, currentTime + timeSpent);
        }
        
        const form = document.getElementById('visitor-form');
        if (!form) return;

        // Preencher campos básicos
        document.getElementById('visit_time').value = new Date().toLocaleString('pt-BR');
        document.getElementById('visit_duration').value = this.getTimeOnSite();
        document.getElementById('visit_id').value = this.visitorId;

        const formData = new FormData(form);
        formData.append('sections_visited', this.getSectionsVisited());
        formData.append('visit_quality', this.getSimpleVisitQuality());

        try {
            navigator.sendBeacon(form.action, formData) || 
            await fetch(form.action, { method: 'POST', body: formData, mode: 'no-cors' });
        } catch (error) {
            // Silencioso em produção
        }
    }

    getSectionsVisited() {
        const sections = [];
        this.sectionTimes.forEach((time, sectionId) => {
            const seconds = Math.round(time / 1000);
            const sectionName = sectionId.replace('#', '');
            sections.push(`${sectionName}: ${seconds}s`);
        });
        
        return sections.length > 0 ? sections.join(' | ') : 'Apenas página inicial';
    }

    getSimpleVisitQuality() {
        const duration = Date.now() - this.visitStartTime;
        const sectionsCount = this.sectionTimes.size;
        
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
            // Rastrear seções visitadas por tempo
            const sections = document.querySelectorAll('section[id]');
            const sectionObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const sectionId = '#' + entry.target.id;
                        analytics.trackSectionVisit(sectionId);
                    }
                });
            }, {
                threshold: 0.6,
                rootMargin: '-50px 0px'
            });

            sections.forEach(section => {
                sectionObserver.observe(section);
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