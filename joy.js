// Function to initialise the lightbox; wrapped in DOMContentLoaded to ensure DOM presence
document.addEventListener('DOMContentLoaded', function() {
    const clickableImage = document.getElementById('clickable-image');
    const enlargedImage = document.getElementById('enlarged-image');
    const overlay = document.getElementById('overlay');
    const inlineContainer = document.getElementById('inline-enlarged');
    const inlineImage = document.getElementById('inline-image');
    const lightboxClose = document.getElementById('lightbox-close');

    if (!clickableImage || !enlargedImage || !overlay) {
        // elements missing; nothing to wire
        return;
    }

    // define helper functions
    function openOverlay(src) {
        enlargedImage.src = src;
        overlay.style.display = 'flex';
        overlay.setAttribute('aria-hidden', 'false');
        requestAnimationFrame(() => overlay.classList.add('show'));
        enlargedImage.style.display = 'block';
        document._previouslyFocused = document.activeElement;
        if (lightboxClose) lightboxClose.focus();
        const mainContainer = document.querySelector('.container');
        if (mainContainer) mainContainer.setAttribute('aria-hidden', 'true');
        const captionEl = document.getElementById('lightbox-caption');
        if (captionEl && clickableImage.dataset && clickableImage.dataset.caption) {
            captionEl.textContent = clickableImage.dataset.caption;
        }
    }

    function closeOverlay() {
        overlay.classList.remove('show');
        setTimeout(() => {
            enlargedImage.style.display = 'none';
            overlay.style.display = 'none';
            overlay.setAttribute('aria-hidden', 'true');
            const mainContainer = document.querySelector('.container');
            if (mainContainer) mainContainer.removeAttribute('aria-hidden');
            if (document._previouslyFocused) document._previouslyFocused.focus();
        }, 240);
    }

    function openInline(src) {
        if (!inlineContainer || !inlineImage) return openOverlay(src);
        inlineImage.src = src;
        inlineImage.style.display = 'block';
        inlineContainer.style.display = 'block';
        inlineContainer.setAttribute('aria-hidden', 'false');
        inlineContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    function closeInline() {
        if (!inlineContainer || !inlineImage) return;
        inlineImage.style.display = 'none';
        inlineContainer.style.display = 'none';
        inlineContainer.setAttribute('aria-hidden', 'true');
    }

    // attach events
    clickableImage.addEventListener('click', function() {
        if (inlineContainer && inlineImage) openInline(this.src);
        else openOverlay(this.src);
    });

    clickableImage.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (inlineContainer && inlineImage) openInline(this.src);
            else openOverlay(this.src);
        }
    });

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeOverlay();
    });

    if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
            closeOverlay();
        });
    }

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (overlay.style.display === 'flex') closeOverlay();
            if (inlineContainer && inlineContainer.style.display === 'block') closeInline();
        }
    });

    document.addEventListener('focusin', function(e) {
        if (overlay.style.display === 'flex') {
            const focusable = [lightboxClose, enlargedImage].filter(Boolean);
            if (focusable.length && !focusable.includes(e.target)) {
                if (lightboxClose) lightboxClose.focus();
            }
        }
    });

    // expose optional closeImage function
    window.closeImage = function() {
        if (enlargedImage && overlay) closeOverlay();
    };
});
