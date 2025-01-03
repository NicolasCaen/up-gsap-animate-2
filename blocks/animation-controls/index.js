const { createHigherOrderComponent } = window.wp.compose;
const { createElement, Fragment } = window.wp.element;
const { InspectorControls } = window.wp.blockEditor;
const { PanelBody, SelectControl, TextControl, RangeControl, ToggleControl } = window.wp.components;
const { addFilter } = window.wp.hooks;
const { __ } = window.wp.i18n;

// Ajouter les attributs d'animation à tous les blocs
function addAnimationAttributes(settings) {
    settings.attributes = {
        ...settings.attributes,
        upgsapAnimation: {
            type: 'object',
            default: {
                enabled: false,
                type: 'fade',
                duration: 1,
                ease: 'power2.out',
                trigger: {
                    type: 'scroll',
                    start: 'top center',
                    scrubType: 'none',
                    markers: false
                }
            }
        }
    };

    return settings;
}

// Ajouter le panneau de contrôle d'animation à l'inspecteur
const withAnimationControls = createHigherOrderComponent((BlockEdit) => {
    return (props) => {
        const { attributes, setAttributes } = props;
        const { upgsapAnimation } = attributes;

        // Si le bloc n'a pas les attributs d'animation, ne rien faire
        if (!upgsapAnimation) {
            return createElement(BlockEdit, props);
        }

        const updateAnimation = (key, value) => {
            setAttributes({
                upgsapAnimation: {
                    ...upgsapAnimation,
                    [key]: value
                }
            });
        };

        const updateTrigger = (key, value) => {
            setAttributes({
                upgsapAnimation: {
                    ...upgsapAnimation,
                    trigger: {
                        ...upgsapAnimation.trigger,
                        [key]: value
                    }
                }
            });
        };

        // Ajouter la classe d'animation si activée
        if (upgsapAnimation.enabled) {
            props.attributes.className = `${props.attributes.className || ''} upgsap-animated`.trim();
        }

        const scrollControls = upgsapAnimation.trigger.type === 'scroll' ? [
            createElement(TextControl, {
                label: __('Start Position', 'up-gsap-animate-2'),
                help: __('Example: top center, 50% 75%', 'up-gsap-animate-2'),
                value: upgsapAnimation.trigger.start,
                onChange: (value) => updateTrigger('start', value)
            }),
            createElement(SelectControl, {
                label: __('Scrub Type', 'up-gsap-animate-2'),
                value: upgsapAnimation.trigger.scrubType,
                options: [
                    { label: 'None', value: 'none' },
                    { label: 'True', value: 'true' },
                    { label: 'Smooth', value: 'smooth' }
                ],
                onChange: (value) => updateTrigger('scrubType', value)
            }),
            createElement(ToggleControl, {
                label: __('Show Markers', 'up-gsap-animate-2'),
                checked: upgsapAnimation.trigger.markers,
                onChange: (value) => updateTrigger('markers', value)
            })
        ] : [];

        const animationControls = upgsapAnimation.enabled ? [
            createElement(SelectControl, {
                label: __('Animation Type', 'up-gsap-animate-2'),
                value: upgsapAnimation.type,
                options: [
                    { label: 'Fade', value: 'fade' },
                    { label: 'Slide', value: 'slide' },
                    { label: 'Scale', value: 'scale' },
                    { label: 'Rotate', value: 'rotate' }
                ],
                onChange: (value) => updateAnimation('type', value)
            }),
            createElement(RangeControl, {
                label: __('Duration', 'up-gsap-animate-2'),
                value: upgsapAnimation.duration,
                onChange: (value) => updateAnimation('duration', value),
                min: 0.1,
                max: 5,
                step: 0.1
            }),
            createElement(SelectControl, {
                label: __('Easing', 'up-gsap-animate-2'),
                value: upgsapAnimation.ease,
                options: [
                    { label: 'Power2.out', value: 'power2.out' },
                    { label: 'Power2.inOut', value: 'power2.inOut' },
                    { label: 'Back.out', value: 'back.out' },
                    { label: 'Elastic.out', value: 'elastic.out' }
                ],
                onChange: (value) => updateAnimation('ease', value)
            }),
            createElement(SelectControl, {
                label: __('Trigger Type', 'up-gsap-animate-2'),
                value: upgsapAnimation.trigger.type,
                options: [
                    { label: 'Scroll', value: 'scroll' },
                    { label: 'Load', value: 'load' },
                    { label: 'Click', value: 'click' },
                    { label: 'Hover', value: 'hover' }
                ],
                onChange: (value) => updateTrigger('type', value)
            }),
            ...scrollControls
        ] : [];

        return createElement(Fragment, null, [
            createElement(BlockEdit, props),
            createElement(InspectorControls, null,
                createElement(PanelBody, {
                    title: __('GSAP Animation', 'up-gsap-animate-2'),
                    initialOpen: false
                }, [
                    createElement(ToggleControl, {
                        label: __('Enable Animation', 'up-gsap-animate-2'),
                        checked: upgsapAnimation.enabled,
                        onChange: (value) => updateAnimation('enabled', value)
                    }),
                    ...animationControls
                ])
            )
        ]);
    };
}, 'withAnimationControls');

// Modifier le HTML de sortie des blocs pour ajouter les attributs d'animation
function addAnimationDataAttribute(extraProps, blockType, attributes) {
    const { upgsapAnimation } = attributes;

    if (upgsapAnimation && upgsapAnimation.enabled) {
        return {
            ...extraProps,
            className: `${extraProps.className || ''} upgsap-animated`.trim(),
            'data-animation': JSON.stringify(upgsapAnimation)
        };
    }

    return extraProps;
}

// Enregistrer les filtres
addFilter(
    'blocks.registerBlockType',
    'up-gsap-animate-2/add-animation-attributes',
    addAnimationAttributes
);

addFilter(
    'editor.BlockEdit',
    'up-gsap-animate-2/with-animation-controls',
    withAnimationControls
);

addFilter(
    'blocks.getSaveContent.extraProps',
    'up-gsap-animate-2/add-animation-data',
    addAnimationDataAttribute
);