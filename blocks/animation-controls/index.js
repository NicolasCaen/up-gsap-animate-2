import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
    PanelBody,
    SelectControl,
    RangeControl,
    TextControl,
    ToggleControl
} from '@wordpress/components';

import './editor.scss';

registerBlockType('upgsap/animation-controls', {
    title: __('GSAP Animation', 'up-gsap-animate-2'),
    icon: 'move',
    category: 'design',
    attributes: {
        animation: {
            type: 'object',
            default: {
                type: 'fade',
                duration: 1,
                ease: 'power2.out',
                delay: 0,
                opacity: 0,
                x: 0,
                y: 0,
                scale: 1,
                rotation: 0
            }
        },
        trigger: {
            type: 'object',
            default: {
                type: 'scroll',
                start: 'top center',
                end: 'bottom center',
                scrub: false
            }
        },
        timelineId: {
            type: 'string',
            default: ''
        }
    },

    edit: ({ attributes, setAttributes }) => {
        const { animation, trigger, timelineId } = attributes;

        const updateAnimation = (key, value) => {
            setAttributes({
                animation: {
                    ...animation,
                    [key]: value
                }
            });
        };

        const updateTrigger = (key, value) => {
            setAttributes({
                trigger: {
                    ...trigger,
                    [key]: value
                }
            });
        };

        return (
            <>
                <InspectorControls>
                    <PanelBody title={__('Animation Settings', 'up-gsap-animate-2')}>
                        <SelectControl
                            label={__('Animation Type', 'up-gsap-animate-2')}
                            value={animation.type}
                            options={[
                                { label: 'Fade', value: 'fade' },
                                { label: 'Slide', value: 'slide' },
                                { label: 'Scale', value: 'scale' },
                                { label: 'Rotate', value: 'rotate' }
                            ]}
                            onChange={(value) => updateAnimation('type', value)}
                        />

                        <RangeControl
                            label={__('Duration', 'up-gsap-animate-2')}
                            value={animation.duration}
                            onChange={(value) => updateAnimation('duration', value)}
                            min={0}
                            max={5}
                            step={0.1}
                        />

                        <TextControl
                            label={__('Easing', 'up-gsap-animate-2')}
                            value={animation.ease}
                            onChange={(value) => updateAnimation('ease', value)}
                        />

                        <RangeControl
                            label={__('Delay', 'up-gsap-animate-2')}
                            value={animation.delay}
                            onChange={(value) => updateAnimation('delay', value)}
                            min={0}
                            max={5}
                            step={0.1}
                        />
                    </PanelBody>

                    <PanelBody title={__('Trigger Settings', 'up-gsap-animate-2')}>
                        <SelectControl
                            label={__('Trigger Type', 'up-gsap-animate-2')}
                            value={trigger.type}
                            options={[
                                { label: 'Scroll', value: 'scroll' },
                                { label: 'Load', value: 'load' },
                                { label: 'Click', value: 'click' }
                            ]}
                            onChange={(value) => updateTrigger('type', value)}
                        />

                        {trigger.type === 'scroll' && (
                            <>
                                <TextControl
                                    label={__('Start Position', 'up-gsap-animate-2')}
                                    value={trigger.start}
                                    onChange={(value) => updateTrigger('start', value)}
                                />
                                <ToggleControl
                                    label={__('Scrub Animation', 'up-gsap-animate-2')}
                                    checked={trigger.scrub}
                                    onChange={(value) => updateTrigger('scrub', value)}
                                />
                            </>
                        )}
                    </PanelBody>

                    <PanelBody title={__('Timeline Settings', 'up-gsap-animate-2')}>
                        <TextControl
                            label={__('Timeline ID', 'up-gsap-animate-2')}
                            value={timelineId}
                            onChange={(value) => setAttributes({ timelineId: value })}
                            help={__('Leave empty for standalone animation', 'up-gsap-animate-2')}
                        />
                    </PanelBody>
                </InspectorControls>

                <div className="upgsap-animation-block">
                    <div className="upgsap-animation-preview">
                        {/* Contenu du bloc */}
                        {attributes.children}
                    </div>
                </div>
            </>
        );
    },

    save: ({ attributes }) => {
        const { animation, trigger, timelineId } = attributes;
        
        return (
            <div 
                className="upgsap-animation"
                data-animation={JSON.stringify(animation)}
                data-trigger={JSON.stringify(trigger)}
                data-timeline={timelineId}
            >
                {attributes.children}
            </div>
        );
    }
}); 