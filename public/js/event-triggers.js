class EventTriggerManager {
    constructor() {
        this.handlers = new Map();
        this.init();
    }

    init() {
        this.initLoadTriggers();
        this.initClickTriggers();
        this.initHoverTriggers();
        this.initCustomTriggers();
    }

    initLoadTriggers() {
        document.querySelectorAll('[data-trigger-type="load"]').forEach(element => {
            const delay = parseFloat(element.getAttribute('data-delay')) || 0;
            const animation = this.getAnimation(element);

            if (animation) {
                setTimeout(() => {
                    animation.play();
                }, delay * 1000);
            }
        });
    }

    initClickTriggers() {
        document.querySelectorAll('[data-trigger-type="click"]').forEach(element => {
            const config = this.getConfig(element);
            const animation = this.getAnimation(element);

            if (animation) {
                const handler = () => {
                    if (config.toggle) {
                        animation.reversed() ? animation.play() : animation.reverse();
                    } else {
                        animation.restart();
                    }
                };

                element.addEventListener('click', handler);
                this.handlers.set(element, { type: 'click', handler });
            }
        });
    }

    initHoverTriggers() {
        document.querySelectorAll('[data-trigger-type="hover"]').forEach(element => {
            const config = this.getConfig(element);
            const animation = this.getAnimation(element);

            if (animation) {
                const enterHandler = () => animation.play();
                const leaveHandler = () => {
                    if (config.reverseOnLeave) {
                        animation.reverse();
                    }
                };

                element.addEventListener('mouseenter', enterHandler);
                element.addEventListener('mouseleave', leaveHandler);

                this.handlers.set(element, {
                    type: 'hover',
                    handlers: [enterHandler, leaveHandler]
                });
            }
        });
    }

    initCustomTriggers() {
        document.querySelectorAll('[data-trigger-type="custom"]').forEach(element => {
            const eventName = element.getAttribute('data-event-name');
            if (!eventName) return;

            const animation = this.getAnimation(element);
            if (animation) {
                const handler = (event) => {
                    const eventData = event.detail || {};
                    if (eventData.play === false) {
                        animation.reverse();
                    } else {
                        animation.play();
                    }
                };

                document.addEventListener(eventName, handler);
                this.handlers.set(element, { type: 'custom', handler, eventName });
            }
        });
    }

    getAnimation(element) {
        return gsap.getById(element.getAttribute('data-animation-id'));
    }

    getConfig(element) {
        try {
            return JSON.parse(element.getAttribute('data-trigger-config') || '{}');
        } catch (e) {
            console.error('Invalid trigger configuration:', e);
            return {};
        }
    }

    // Nettoie les gestionnaires d'événements
    destroy(element) {
        const handlerData = this.handlers.get(element);
        if (handlerData) {
            switch (handlerData.type) {
                case 'click':
                    element.removeEventListener('click', handlerData.handler);
                    break;
                case 'hover':
                    element.removeEventListener('mouseenter', handlerData.handlers[0]);
                    element.removeEventListener('mouseleave', handlerData.handlers[1]);
                    break;
                case 'custom':
                    document.removeEventListener(handlerData.eventName, handlerData.handler);
                    break;
            }
            this.handlers.delete(element);
        }
    }

    // Nettoie tous les gestionnaires
    destroyAll() {
        this.handlers.forEach((data, element) => this.destroy(element));
    }
}

// Exporte l'instance
export const eventTriggerManager = new EventTriggerManager(); 