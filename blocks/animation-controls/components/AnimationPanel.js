import { __ } from '@wordpress/i18n';
import { PanelBody, SelectControl, RangeControl, TextControl } from '@wordpress/components';

export const AnimationPanel = ({ attributes, setAttributes }) => {
    const { animation } = attributes;

    const updateAnimation = (key, value) => {
        setAttributes({
            animation: {
                ...animation,
                [key]: value
            }
        });
    };

    return (
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
        </PanelBody>
    );
}; 