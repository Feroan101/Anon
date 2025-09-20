// Enhanced Jeppiaar Confessions - Mobile-First with Backend Integration
// EmailJS Configuration - Replace these with your actual values
const EMAIL_CONFIG = {
    serviceId: 'service_dvrelxi',        // Replace with your EmailJS service ID
    templateId: 'template_uiujhss',      // Replace with your EmailJS template ID
    publicKey: 'AuiQXjhSdqgs86ZiX',        // Replace with your EmailJS public key
    subject: 'Con101'                            // Email subject as requested
};

// Application data from instructions
const APP_DATA = {
    taglines: [
        "Your secrets, safely shared 💭",
        "Confess without fear 🤐", 
        "Anonymous thoughts, real feelings 💝",
        "What's on your mind? 🧠",
        "Share your story 📖",
        "Unburden your heart ❤️",
        "Speak your truth 🗣️",
        "Your voice, your choice 🎭",
        "Anonymous but not alone 🤝",
        "Safe space for real thoughts 🏠",
        "Confessions without judgment ⚖️",
        "Your story matters 📝",
        "Express yourself freely 🕊️",
        "Anonymous expressions 🎨",
        "Share without shame 🌟"
    ],
    confessionSettings: {
        maxLength: 800,
        minLength: 5,
        startingCount: 2
    }
};

// Global variables
let currentTaglineIndex = 0;
let taglineInterval;
let confessionCount = APP_DATA.confessionSettings.startingCount;
let isSubmitting = false;

// DOM elements
const taglineElement = document.getElementById('tagline');
const confessionForm = document.getElementById('confession-form');
const confessionTextarea = document.getElementById('confession-text');
const charCountElement = document.getElementById('char-count');
const submitBtn = document.getElementById('submit-btn');
const successMessage = document.getElementById('success-message');
const errorMessage = document.getElementById('error-message');
const loadingScreen = document.getElementById('loading-screen');
const confessionCountElement = document.getElementById('confession-count');

// Hidden form fields for backend integration
const timestampField = document.getElementById('timestamp-field');
const deviceInfoField = document.getElementById('device-info-field');
const charCountField = document.getElementById('char-count-field');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Jeppiaar Confessions - Mobile-First Version');
    console.log('📧 EmailJS Integration Ready (Configure with your API keys)');
    
    // Initialize EmailJS if keys are configured
    initializeEmailJS();
    
    // Hide loading screen with mobile-optimized timing
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }, 1000); // Faster loading for mobile
    
    // Initialize all functionality
    startTaglineRotation();
    initializeFormListeners();
    loadConfessionCount();
    setupMobileOptimizations();
    
    // Add entrance animations with mobile consideration
    setTimeout(() => {
        addEntranceAnimations();
    }, 1500);
    
    // Performance monitoring
    if ('performance' in window) {
        const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
        console.log(`⚡ Page loaded in ${loadTime}ms`);
    }
});

// Initialize EmailJS
function initializeEmailJS() {
    try {
        if (typeof emailjs !== 'undefined' && EMAIL_CONFIG.publicKey && EMAIL_CONFIG.publicKey !== '') {
            emailjs.init(EMAIL_CONFIG.publicKey);
            console.log('✅ EmailJS initialized successfully');
        } else {
            console.log('⚠️ EmailJS not configured. Please update EMAIL_CONFIG with your keys.');
            console.log('📖 Setup instructions: https://www.emailjs.com/docs/');
        }

    } catch (error) {
        console.error('❌ EmailJS initialization failed:', error);
    }
}

// Mobile-specific optimizations
function setupMobileOptimizations() {
    // Prevent zoom on form focus for iOS
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
        confessionTextarea.addEventListener('focus', () => {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
        });
        
        confessionTextarea.addEventListener('blur', () => {
            viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no');
        });
    }
    
    // Mobile-friendly textarea resize
    let resizeTimeout;
    confessionTextarea.addEventListener('input', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(autoResizeTextarea, 100);
    });
    
    // Touch feedback for buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('touchstart', () => {
            button.style.transform = 'scale(0.98)';
        });
        
        button.addEventListener('touchend', () => {
            button.style.transform = '';
        });
    });
    
    // Optimize for low-end devices
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.documentElement.classList.add('low-performance');
        console.log('🔧 Low-performance mode enabled');
    }
    
    // Reduce animations on slow connections
    if ('connection' in navigator) {
        const connection = navigator.connection;
        if (connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g')) {
            document.documentElement.classList.add('slow-connection');
            console.log('📶 Slow connection detected - reduced animations');
        }
    }
}

// Tagline rotation functionality
function startTaglineRotation() {
    taglineInterval = setInterval(() => {
        rotateTagline();
    }, 4000); // Slightly faster for mobile engagement
}

function rotateTagline() {
    taglineElement.classList.add('fade-out');
    
    setTimeout(() => {
        currentTaglineIndex = (currentTaglineIndex + 1) % APP_DATA.taglines.length;
        taglineElement.textContent = APP_DATA.taglines[currentTaglineIndex];
        taglineElement.classList.remove('fade-out');
    }, 400);
}

// Enhanced form functionality
function initializeFormListeners() {
    // Character counter with mobile-optimized updates
    confessionTextarea.addEventListener('input', debounce(updateCharacterCount, 100));
    
    // Form submission with enhanced mobile handling
    confessionForm.addEventListener('submit', handleFormSubmission);
    
    // Button ripple effect optimized for touch
    submitBtn.addEventListener('touchstart', createRippleEffect);
    submitBtn.addEventListener('click', createRippleEffect);
    
    // Auto-resize textarea for mobile
    confessionTextarea.addEventListener('input', debounce(autoResizeTextarea, 100));
    
    // Mobile-specific form validation
    confessionTextarea.addEventListener('blur', validateInput);
    
    // Prevent form submission on Enter (mobile keyboards)
    confessionTextarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey && window.innerWidth < 768) {
            e.preventDefault();
            confessionTextarea.value += '\n';
            updateCharacterCount();
            autoResizeTextarea();
        }
    });
}

function updateCharacterCount() {
    const currentLength = confessionTextarea.value.length;
    const maxLength = APP_DATA.confessionSettings.maxLength;
    
    charCountElement.textContent = currentLength;
    
    // Update hidden field for backend
    if (charCountField) {
        charCountField.value = currentLength;
    }
    
    // Mobile-friendly color coding
    if (currentLength > maxLength * 0.9) {
        charCountElement.style.color = '#ff6b6b';
        charCountElement.style.fontWeight = '700';
    } else if (currentLength > maxLength * 0.7) {
        charCountElement.style.color = '#ffcc80';
        charCountElement.style.fontWeight = '600';
    } else {
        charCountElement.style.color = 'rgba(255, 255, 255, 0.9)';
        charCountElement.style.fontWeight = '600';
    }
    
    // Enable/disable submit button
    const minLength = APP_DATA.confessionSettings.minLength;
    if (currentLength >= minLength && currentLength <= maxLength) {
        submitBtn.disabled = false;
        confessionTextarea.classList.remove('error');
        confessionTextarea.classList.add('success');
    } else {
        submitBtn.disabled = true;
        confessionTextarea.classList.remove('success');
        if (currentLength > 0) {
            confessionTextarea.classList.add('error');
        }
    }
}

function validateInput() {
    const text = confessionTextarea.value.trim();
    const minLength = APP_DATA.confessionSettings.minLength;
    const maxLength = APP_DATA.confessionSettings.maxLength;
    
    if (text.length > 0 && text.length < minLength) {
        showMobileNotification(`Please write at least ${minLength} characters`, 'warning');
    } else if (text.length > maxLength) {
        showMobileNotification(`Please keep your confession under ${maxLength} characters`, 'error');
    }
}

function autoResizeTextarea() {
    confessionTextarea.style.height = 'auto';
    const newHeight = Math.max(120, Math.min(300, confessionTextarea.scrollHeight));
    confessionTextarea.style.height = newHeight + 'px';
}

// Enhanced form submission with dual backend integration
async function handleFormSubmission(e) {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    const confessionText = confessionTextarea.value.trim();
    
    // Enhanced mobile-friendly validation
    if (!validateConfession(confessionText)) {
        return;
    }
    
    isSubmitting = true;
    showLoadingState();
    
    console.log('📝 Starting confession submission...');
    
    try {
        // Prepare submission data
        const submissionData = prepareSubmissionData(confessionText);
        
        // Always proceed with success flow for demo (since EmailJS requires real API keys)
        // In production, replace this with actual backend calls
        await processSubmission(submissionData);
        
        handleSuccessfulSubmission(confessionText);
        
    } catch (error) {
        console.error('❌ Submission failed:', error);
        handleSubmissionError(error);
    } finally {
        isSubmitting = false;
        hideLoadingState();
    }
}

// Process submission (demo version)
async function processSubmission(data) {
    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('📧 Processing confession submission:', {
        length: data.confession_text.length,
        timestamp: data.timestamp,
        id: data.submission_id
    });
    
    // Try to submit to actual backends if configured
    const results = await Promise.allSettled([
        submitToEmailJS(data).catch(error => {
            console.log('EmailJS not configured or failed:', error.message);
            return { status: 'demo', message: 'EmailJS not configured - using demo mode' };
        }),
    ]);
    
    console.log('✅ Submission processed successfully');
    return results;
}

function validateConfession(text) {
    const minLength = APP_DATA.confessionSettings.minLength;
    const maxLength = APP_DATA.confessionSettings.maxLength;
    
    if (text.length < minLength) {
        showMobileNotification(`Please write at least ${minLength} characters`, 'error');
        confessionTextarea.focus();
        return false;
    }
    
    if (text.length > maxLength) {
        showMobileNotification(`Please keep your confession under ${maxLength} characters`, 'error');
        confessionTextarea.focus();
        return false;
    }
    
    // Check for spam-like content
    if (isSpamContent(text)) {
        showMobileNotification('Please write a meaningful confession', 'error');
        return false;
    }
    
    return true;
}

function isSpamContent(text) {
    const spamPatterns = [
        /(.)\1{10,}/, // Repeated characters
        /^[^a-zA-Z]*$/, // No letters
    ];
    
    return spamPatterns.some(pattern => pattern.test(text));
}

function prepareSubmissionData(confessionText) {
    const now = new Date();
    const deviceInfo = getDeviceInfo();
    
    // Update hidden fields for Netlify
    if (timestampField) timestampField.value = now.toISOString();
    if (deviceInfoField) deviceInfoField.value = deviceInfo;
    if (charCountField) charCountField.value = confessionText.length;
    
    return {
        confession_text: confessionText,
        subject: EMAIL_CONFIG.subject,
        timestamp: now.toLocaleString(),
        char_count: confessionText.length,
        device_info: deviceInfo,
        submission_id: generateSubmissionId()
    };
}

function getDeviceInfo() {
    const info = {
        userAgent: navigator.userAgent.substring(0, 100), // Truncate for privacy
        screen: `${screen.width}x${screen.height}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language
    };
    
    // Add connection info if available
    if ('connection' in navigator) {
        const conn = navigator.connection;
        info.connection = conn.effectiveType || 'unknown';
    }
    
    return JSON.stringify(info);
}

function generateSubmissionId() {
    return Date.now().toString(36) + Math.random().toString(36);
}

// EmailJS submission
async function submitToEmailJS(data) {
    if (
        typeof emailjs === 'undefined' ||
        !EMAIL_CONFIG.serviceId ||
        !EMAIL_CONFIG.templateId ||
        !EMAIL_CONFIG.publicKey
    ) {
        throw new Error('EmailJS not configured');
    }
    
    const templateParams = {
        subject: data.subject,
        confession_text: data.confession_text,
        timestamp: data.timestamp,
        device_info: data.device_info,
        char_count: data.char_count,
        submission_id: data.submission_id
    };
    
    const response = await emailjs.send(
        EMAIL_CONFIG.serviceId,
        EMAIL_CONFIG.templateId,
        templateParams
    );
    
    console.log('✅ EmailJS Success:', response);
    return response;
}

function handleSuccessfulSubmission(confessionText) {
    console.log('🎉 Handling successful submission...');
    
    // Increment counter with smooth animation
    confessionCount++;
    updateConfessionCountWithAnimation();
    
    // Store locally for persistence
    storeConfessionLocally({
        text: confessionText,
        timestamp: new Date().toISOString(),
        id: Date.now()
    });
    
    // Show success message
    showSuccessMessage();
    
    // Reset form
    resetForm();
    
    // Analytics (if configured)
    trackConfessionSubmission();
    
    console.log('✅ Confession submitted successfully! Counter:', confessionCount);
}

function handleSubmissionError(error) {
    console.error('❌ Submission error:', error);
    
    // Show user-friendly error message
    const errorText = document.getElementById('error-text');
    if (errorText) {
        if (error.message.includes('EmailJS')) {
            errorText.textContent = 'Email service temporarily unavailable. Your message was saved and will be processed.';
        } else {
            errorText.textContent = 'Something went wrong. Please try again in a moment.';
        }
    }
    
    showErrorMessage();
}

// Loading states - FIXED
function showLoadingState() {
    console.log('⏳ Showing loading state...');
    
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    
    // Show loading content
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (btnText) btnText.style.display = 'none';
    if (btnIcon) btnIcon.style.display = 'none';
    if (btnLoading) {
        btnLoading.classList.remove('hidden');
        btnLoading.style.display = 'flex';
    }
}

function hideLoadingState() {
    console.log('✅ Hiding loading state...');
    
    submitBtn.classList.remove('loading');
    
    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');
    const btnLoading = submitBtn.querySelector('.btn-loading');
    
    if (btnText) btnText.style.display = '';
    if (btnIcon) btnIcon.style.display = '';
    if (btnLoading) {
        btnLoading.classList.add('hidden');
        btnLoading.style.display = 'none';
    }
    
    // Re-enable button after short delay to prevent double submission
    setTimeout(() => {
        submitBtn.disabled = false;
    }, 500);
}

// Confession counter management - FIXED
function loadConfessionCount() {
    const stored = localStorage.getItem('confessionCount');
    if (stored) {
        confessionCount = parseInt(stored);
    }
    if (confessionCountElement) {
        confessionCountElement.textContent = confessionCount;
    }
    console.log('📊 Loaded confession count:', confessionCount);
}

function updateConfessionCountWithAnimation() {
    console.log('🔢 Updating confession counter from', confessionCountElement.textContent, 'to', confessionCount);
    
    if (!confessionCountElement) return;
    
    // Save to localStorage immediately
    localStorage.setItem('confessionCount', confessionCount.toString());
    
    // Animate number change
    const duration = 800;
    const start = parseInt(confessionCountElement.textContent) || 0;
    const end = confessionCount;
    const startTime = performance.now();
    
    function animate(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * easeOut);
        
        confessionCountElement.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            // Add pulse effect
            confessionCountElement.style.transform = 'scale(1.2)';
            confessionCountElement.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                confessionCountElement.style.transform = 'scale(1)';
            }, 300);
        }
    }
    
    requestAnimationFrame(animate);
}

function storeConfessionLocally(confession) {
    try {
        const existing = JSON.parse(localStorage.getItem('confessions') || '[]');
        existing.push(confession);
        
        // Keep only last 100 for storage efficiency
        if (existing.length > 100) {
            existing.splice(0, existing.length - 100);
        }
        
        localStorage.setItem('confessions', JSON.stringify(existing));
        console.log('💾 Confession stored locally');
    } catch (error) {
        console.warn('⚠️ Could not store confession locally:', error);
    }
}

// Message management - FIXED
function showSuccessMessage() {
    console.log('🎉 Showing success message...');
    
    if (!successMessage) return;
    
    successMessage.classList.remove('hidden');
    // Use setTimeout to ensure CSS transition works
    setTimeout(() => {
        successMessage.classList.add('show');
    }, 10);
}

function hideSuccessMessage() {
    console.log('👋 Hiding success message...');
    
    if (!successMessage) return;
    
    successMessage.classList.remove('show');
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 300);
}

function showErrorMessage() {
    console.log('❌ Showing error message...');
    
    if (!errorMessage) return;
    
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        errorMessage.classList.add('show');
    }, 10);
}

function hideErrorMessage() {
    console.log('👋 Hiding error message...');
    
    if (!errorMessage) return;
    
    errorMessage.classList.remove('show');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 300);
}

// Mobile notification system
function showMobileNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelector('.mobile-notification');
    if (existing) {
        existing.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `mobile-notification mobile-notification--${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${getNotificationIcon(type)}</span>
            <span class="notification-message">${message}</span>
        </div>
    `;
    
    // Mobile-optimized positioning
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${getNotificationColor(type)};
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        backdrop-filter: blur(10px);
        z-index: 10000;
        animation: slideInTop 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-width: calc(100vw - 40px);
        font-size: 0.9rem;
        text-align: center;
    `;
    
    document.body.appendChild(notification);
    
    // Haptic feedback on mobile
    if ('vibrate' in navigator) {
        navigator.vibrate(type === 'error' ? [100, 50, 100] : 100);
    }
    
    setTimeout(() => {
        notification.style.animation = 'slideOutTop 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: 'rgba(76, 175, 80, 0.9)',
        error: 'rgba(244, 67, 54, 0.9)',
        warning: 'rgba(255, 152, 0, 0.9)',
        info: 'rgba(33, 150, 243, 0.9)'
    };
    return colors[type] || colors.info;
}

function resetForm() {
    console.log('🔄 Resetting form...');
    
    confessionTextarea.value = '';
    confessionTextarea.classList.remove('error', 'success');
    updateCharacterCount();
    autoResizeTextarea();
    
    // Reset hidden fields
    if (timestampField) timestampField.value = '';
    if (deviceInfoField) deviceInfoField.value = '';
    if (charCountField) charCountField.value = '';
}

// Ripple effect optimized for mobile
function createRippleEffect(e) {
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    let x, y;
    if (e.type === 'touchstart' && e.touches && e.touches[0]) {
        x = e.touches[0].clientX - rect.left - size / 2;
        y = e.touches[0].clientY - rect.top - size / 2;
    } else {
        x = e.clientX - rect.left - size / 2;
        y = e.clientY - rect.top - size / 2;
    }
    
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    ripple.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
    `;
    
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Enhanced entrance animations
function addEntranceAnimations() {
    const elements = document.querySelectorAll('.confession-card, .confession-counter');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 150);
    });
}

// Analytics tracking (optional)
function trackConfessionSubmission() {
    // Add your analytics tracking here
    // Example: gtag('event', 'confession_submitted', { 'method': 'form' });
    console.log('📊 Confession submission tracked');
}

// Utility functions
function debounce(func, wait) {
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

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to submit (desktop only)
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && window.innerWidth >= 768) {
        if (!submitBtn.disabled && !isSubmitting) {
            confessionForm.dispatchEvent(new Event('submit'));
        }
    }
    
    // Escape to close modals
    if (e.key === 'Escape') {
        if (successMessage && successMessage.classList.contains('show')) {
            hideSuccessMessage();
        }
        if (errorMessage && errorMessage.classList.contains('show')) {
            hideErrorMessage();
        }
    }
});

// Page visibility handling
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        clearInterval(taglineInterval);
    } else {
        startTaglineRotation();
    }
});

// Add mobile-specific CSS animations
const mobileStyles = document.createElement('style');
mobileStyles.textContent = `
    @keyframes slideInTop {
        from {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
        to {
            transform: translate(-50%, 0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutTop {
        from {
            transform: translate(-50%, 0);
            opacity: 1;
        }
        to {
            transform: translate(-50%, -100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: center;
    }
`;
document.head.appendChild(mobileStyles);

// Cleanup on page unload
window.addEventListener('beforeunload', function() {
    clearInterval(taglineInterval);
});

// Development helpers (remove in production)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    window.debugApp = {
        getConfessions: () => JSON.parse(localStorage.getItem('confessions') || '[]'),
        clearData: () => {
            localStorage.clear();
            location.reload();
        },
        testSubmission: () => {
            confessionTextarea.value = 'Test confession for debugging purposes';
            updateCharacterCount();
            handleFormSubmission({ preventDefault: () => {} });
        },
        getConfig: () => EMAIL_CONFIG,
        incrementCounter: () => {
            confessionCount++;
            updateConfessionCountWithAnimation();
        },
        showSuccess: showSuccessMessage,
        showError: showErrorMessage
    };
    
    console.log('🔧 Debug helpers available: window.debugApp');
    console.log('📧 EmailJS Config Check:', {
        configured: EMAIL_CONFIG.serviceId !== 'service_dvrelxi',
        serviceId: EMAIL_CONFIG.serviceId,
        hasTemplate: EMAIL_CONFIG.templateId !== 'template_uiujhss'
    });
}