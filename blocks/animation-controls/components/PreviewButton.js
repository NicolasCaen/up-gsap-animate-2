const { __ } = window.wp.i18n;
const { Button } = window.wp.components;
const { createElement, useState, useEffect } = window.wp.element;
const { select } = window.wp.data;

function PreviewButton({ animation, clientId }) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [gsapLoaded, setGsapLoaded] = useState(false);

    useEffect(() => {
        const checkGsap = () => {
            if (window.gsap) {
                setGsapLoaded(true);
            } else {
                setTimeout(checkGsap, 100);
            }
        };
        checkGsap();
    }, []);

    const getBlockElement = (clientId) => {
        // Essayer différents sélecteurs pour trouver le bloc
        const selectors = [
            `[data-block="${clientId}"]`, // Ancien sélecteur
            `[data-type][data-block="${clientId}"]`, // Sélecteur avec data-type
            `.block-editor-block-list__block[data-block="${clientId}"]`, // Sélecteur complet
            `#block-${clientId}` // ID du bloc
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                console.log('Found block with selector:', selector);
                return element;
            }
        }

        // Si on ne trouve toujours pas le bloc, chercher dans l'iframe de l'éditeur
        const editor = document.querySelector('iframe[name="editor-canvas"]');
        if (editor?.contentDocument) {
            for (const selector of selectors) {
                const element = editor.contentDocument.querySelector(selector);
                if (element) {
                    console.log('Found block in iframe with selector:', selector);
                    return element;
                }
            }
        }

        return null;
    };

    const playPreview = () => {
        if (!animation?.enabled || isPlaying || !gsapLoaded || !window.gsap) {
            console.warn('Animation not ready:', {
                enabled: animation?.enabled,
                isPlaying,
                gsapLoaded,
                gsapExists: !!window.gsap
            });
            return;
        }

        const gsap = window.gsap;

        // Trouver le bloc en utilisant la fonction helper
        const blockElement = getBlockElement(clientId);
        if (!blockElement) {
            console.warn('Block element not found. Details:', {
                clientId,
                availableBlocks: document.querySelectorAll('[data-block]').length,
                iframeExists: !!document.querySelector('iframe[name="editor-canvas"]')
            });
            return;
        }

        setIsPlaying(true);

        // Sauvegarder les propriétés initiales
        const originalProps = {
            transform: blockElement.style.transform || 'none',
            opacity: blockElement.style.opacity || '1',
            transition: blockElement.style.transition || 'none',
            visibility: blockElement.style.visibility || 'visible'
        };

        // Désactiver les transitions CSS
        blockElement.style.transition = 'none';
        blockElement.style.visibility = 'visible';

        // Configuration de l'animation
        let fromState = { opacity: 0 };
        let toState = { 
            opacity: 1,
            duration: animation.duration || 1,
            ease: animation.ease || 'power2.out',
            onComplete: () => {
                setIsPlaying(false);
                // Restaurer les propriétés initiales
                Object.assign(blockElement.style, originalProps);
            }
        };

        // Configurer l'animation selon le type
        switch (animation.type) {
            case 'slide':
                fromState.x = -100;
                toState.x = 0;
                break;
            case 'scale':
                fromState.scale = 0;
                toState.scale = 1;
                break;
            case 'rotate':
                fromState.rotation = -180;
                toState.rotation = 0;
                break;
        }

        try {
            // Créer et exécuter l'animation
            gsap.set(blockElement, fromState);
            gsap.to(blockElement, toState);
        } catch (error) {
            console.error('Animation error:', error);
            setIsPlaying(false);
            Object.assign(blockElement.style, originalProps);
        }
    };

    if (!gsapLoaded) {
        return createElement(Button, {
            variant: 'secondary',
            disabled: true,
            className: 'upgsap-preview-button'
        }, __('Loading GSAP...', 'up-gsap-animate-2'));
    }

    return createElement(Button, {
        variant: 'secondary',
        icon: isPlaying ? 'controls-pause' : 'controls-play',
        onClick: playPreview,
        disabled: isPlaying || !animation?.enabled,
        className: 'upgsap-preview-button'
    }, isPlaying ? __('Playing...', 'up-gsap-animate-2') : __('Preview Animation', 'up-gsap-animate-2'));
}

export default PreviewButton;
