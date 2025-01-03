import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, TextControl, ToggleControl, RangeControl } from '@wordpress/components';

export const TriggerPanel = ({ attributes, setAttributes }) => {
    const { trigger } = attributes;

    const updateTrigger = (key, value) => {
        setAttributes({
            trigger: {
                ...trigger,
                [key]: value
            }
        });
    };

    return (
        <PanelBody title={__('Trigger Settings', 'up-gsap-animate-2')}>
            <SelectControl
                label={__('Trigger Type', 'up-gsap-animate-2')}
                value={trigger.type}
                options={[
                    { label: 'Scroll', value: 'scroll' },
                    { label: 'Load', value: 'load' },
                    { label: 'Click', value: 'click' },
                    { label: 'Hover', value: 'hover' },
                    { label: 'Custom', value: 'custom' }
                ]}
                onChange={(value) => updateTrigger('type', value)}
            />

            {trigger.type === 'scroll' && (
                <>
                    <TextControl
                        label={__('Start Position', 'up-gsap-animate-2')}
                        help={__('Example: top center, 50% 75%', 'up-gsap-animate-2')}
                        value={trigger.start}
                        onChange={(value) => updateTrigger('start', value)}
                    />
                    <TextControl
                        label={__('End Position', 'up-gsap-animate-2')}
                        help={__('Optional: Define where the animation ends', 'up-gsap-animate-2')}
                        value={trigger.end}
                        onChange={(value) => updateTrigger('end', value)}
                    />
                    <SelectControl
                        label={__('Scrub Type', 'up-gsap-animate-2')}
                        value={trigger.scrubType}
                        options={[
                            { label: 'None', value: 'none' },
                            { label: 'True', value: 'true' },
                            { label: 'Smooth', value: 'smooth' }
                        ]}
                        onChange={(value) => updateTrigger('scrubType', value)}
                    />
                    {trigger.scrubType === 'smooth' && (
                        <RangeControl
                            label={__('Smoothness', 'up-gsap-animate-2')}
                            value={trigger.smoothness}
                            onChange={(value) => updateTrigger('smoothness', value)}
                            min={0.1}
                            max={5}
                            step={0.1}
                        />
                    )}
                    <ToggleControl
                        label={__('Pin Element', 'up-gsap-animate-2')}
                        checked={trigger.pin}
                        onChange={(value) => updateTrigger('pin', value)}
                    />
                    <ToggleControl
                        label={__('Show Markers', 'up-gsap-animate-2')}
                        help={__('Debug mode: Show trigger positions', 'up-gsap-animate-2')}
                        checked={trigger.markers}
                        onChange={(value) => updateTrigger('markers', value)}
                    />
                </>
            )}

            {trigger.type === 'hover' && (
                <>
                    <ToggleControl
                        label={__('Reverse on Leave', 'up-gsap-animate-2')}
                        checked={trigger.reverse}
                        onChange={(value) => updateTrigger('reverse', value)}
                    />
                </>
            )}

            {trigger.type === 'custom' && (
                <TextControl
                    label={__('Custom Trigger', 'up-gsap-animate-2')}
                    help={__('CSS selector or element ID', 'up-gsap-animate-2')}
                    value={trigger.customTrigger}
                    onChange={(value) => updateTrigger('customTrigger', value)}
                />
            )}
        </PanelBody>
    );
};