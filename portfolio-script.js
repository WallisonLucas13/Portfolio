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

// ===== SERVICE WORKER REGISTRATION =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('✅ Service Worker registrado:', registration);
            })
            .catch(error => {
                console.log('❌ Falha ao registrar Service Worker:', error);
            });
    });
}

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

// ===== PWA SERVICE WORKER REGISTRATION =====
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.init();
    }

    async init() {
        // Registrar Service Worker
        await this.registerServiceWorker();
        
        // Configurar eventos PWA
        this.setupPWAEvents();
        
        // Criar botão de instalação
        this.createInstallButton();
        
        // Verificar se já está instalado
        this.checkIfInstalled();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('./sw.js');
                
                console.log('✅ Service Worker registrado:', registration.scope);
                
                // Verificar atualizações
                registration.addEventListener('updatefound', () => {
                    console.log('🔄 Nova versão do Service Worker disponível');
                    const newWorker = registration.installing;
                    
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateAvailable();
                        }
                    });
                });
                
            } catch (error) {
                console.error('❌ Falha ao registrar Service Worker:', error);
            }
        }
    }

    setupPWAEvents() {
        // Capturar evento de instalação
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('💾 PWA pode ser instalado');
            e.preventDefault();
            this.deferredPrompt = e;
            this.showInstallButton();
        });

        // Detectar quando foi instalado
        window.addEventListener('appinstalled', () => {
            console.log('🎉 PWA foi instalado!');
            this.hideInstallButton();
            this.isInstalled = true;
            this.showInstallSuccess();
        });
    }

    createInstallButton() {
        // Criar botão de instalação se não existir
        if (!document.getElementById('pwa-install-btn')) {
            const installBtn = document.createElement('button');
            installBtn.id = 'pwa-install-btn';
            installBtn.className = 'pwa-install-btn hidden';
            installBtn.innerHTML = `
                <i class="fas fa-download"></i>
                <span>Instalar App</span>
            `;
            installBtn.addEventListener('click', () => this.installPWA());
            
            // Adicionar ao header ou criar container flutuante
            const header = document.querySelector('.header .nav-container');
            if (header) {
                header.appendChild(installBtn);
            }
        }
    }

    showInstallButton() {
        const btn = document.getElementById('pwa-install-btn');
        if (btn && !this.isInstalled) {
            btn.classList.remove('hidden');
        }
    }

    hideInstallButton() {
        const btn = document.getElementById('pwa-install-btn');
        if (btn) {
            btn.classList.add('hidden');
        }
    }

    async installPWA() {
        if (!this.deferredPrompt) return;

        try {
            // Mostrar prompt de instalação
            this.deferredPrompt.prompt();
            
            // Aguardar escolha do usuário
            const { outcome } = await this.deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('✅ Usuário aceitou instalar o PWA');
            } else {
                console.log('❌ Usuário rejeitou instalar o PWA');
            }
            
            this.deferredPrompt = null;
        } catch (error) {
            console.error('❌ Erro ao instalar PWA:', error);
        }
    }

    checkIfInstalled() {
        // Verificar se está rodando como PWA
        if (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) {
            console.log('📱 Rodando como PWA instalado');
            this.isInstalled = true;
        }
    }

    showUpdateAvailable() {
        // Mostrar notificação de atualização disponível
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span>Nova versão disponível!</span>
                <button onclick="window.location.reload()">Atualizar</button>
            </div>
        `;
        document.body.appendChild(notification);
        
        // Remover após 10 segundos
        setTimeout(() => {
            notification.remove();
        }, 10000);
    }

    showInstallSuccess() {
        // Mostrar mensagem de sucesso
        const success = document.createElement('div');
        success.className = 'pwa-install-success';
        success.innerHTML = `
            <div class="success-content">
                <i class="fas fa-check-circle"></i>
                <span>App instalado com sucesso!</span>
            </div>
        `;
        document.body.appendChild(success);
        
        setTimeout(() => {
            success.remove();
        }, 3000);
    }
}

// Inicializar PWA quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new PWAManager();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        ProjectFilter,
        AnimationObserver,
        ContactForm,
        ThemeManager,
        DeviceUtils,
        PWAManager
    };
}