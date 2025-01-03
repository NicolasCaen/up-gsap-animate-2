"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _window$wp$element = window.wp.element,
  createElement = _window$wp$element.createElement,
  Fragment = _window$wp$element.Fragment;
var createHigherOrderComponent = window.wp.compose.createHigherOrderComponent;
var InspectorControls = window.wp.blockEditor.InspectorControls;
var _window$wp$components = window.wp.components,
  PanelBody = _window$wp$components.PanelBody,
  SelectControl = _window$wp$components.SelectControl,
  TextControl = _window$wp$components.TextControl,
  RangeControl = _window$wp$components.RangeControl,
  ToggleControl = _window$wp$components.ToggleControl;
var addFilter = window.wp.hooks.addFilter;
var __ = window.wp.i18n.__;

// Ajouter les attributs d'animation à tous les blocs
function addAnimationAttributes(settings) {
  settings.attributes = _objectSpread(_objectSpread({}, settings.attributes), {}, {
    upgsapAnimation: {
      type: 'object',
      "default": {
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
  });
  return settings;
}

// Ajouter le panneau de contrôle d'animation à l'inspecteur
var withAnimationControls = createHigherOrderComponent(function (BlockEdit) {
  return function (props) {
    var attributes = props.attributes,
      setAttributes = props.setAttributes;
    var upgsapAnimation = attributes.upgsapAnimation;

    // Si le bloc n'a pas les attributs d'animation, ne rien faire
    if (!upgsapAnimation) {
      return createElement(BlockEdit, props);
    }
    var updateAnimation = function updateAnimation(key, value) {
      setAttributes({
        upgsapAnimation: _objectSpread(_objectSpread({}, upgsapAnimation), {}, _defineProperty({}, key, value))
      });
    };
    var updateTrigger = function updateTrigger(key, value) {
      setAttributes({
        upgsapAnimation: _objectSpread(_objectSpread({}, upgsapAnimation), {}, {
          trigger: _objectSpread(_objectSpread({}, upgsapAnimation.trigger), {}, _defineProperty({}, key, value))
        })
      });
    };

    // Ajouter la classe d'animation si activée
    if (upgsapAnimation.enabled) {
      props.attributes.className = "".concat(props.attributes.className || '', " upgsap-animated").trim();
    }
    return createElement(Fragment, null, [createElement(BlockEdit, props), createElement(InspectorControls, null, createElement(PanelBody, {
      title: __('GSAP Animation', 'up-gsap-animate-2'),
      initialOpen: false
    }, [createElement(ToggleControl, {
      label: __('Enable Animation', 'up-gsap-animate-2'),
      checked: upgsapAnimation.enabled,
      onChange: function onChange(value) {
        return updateAnimation('enabled', value);
      }
    }), upgsapAnimation.enabled && [createElement(SelectControl, {
      label: __('Animation Type', 'up-gsap-animate-2'),
      value: upgsapAnimation.type,
      options: [{
        label: 'Fade',
        value: 'fade'
      }, {
        label: 'Slide',
        value: 'slide'
      }, {
        label: 'Scale',
        value: 'scale'
      }, {
        label: 'Rotate',
        value: 'rotate'
      }],
      onChange: function onChange(value) {
        return updateAnimation('type', value);
      }
    }), createElement(RangeControl, {
      label: __('Duration', 'up-gsap-animate-2'),
      value: upgsapAnimation.duration,
      onChange: function onChange(value) {
        return updateAnimation('duration', value);
      },
      min: 0.1,
      max: 5,
      step: 0.1
    }), createElement(SelectControl, {
      label: __('Easing', 'up-gsap-animate-2'),
      value: upgsapAnimation.ease,
      options: [{
        label: 'Power2.out',
        value: 'power2.out'
      }, {
        label: 'Power2.inOut',
        value: 'power2.inOut'
      }, {
        label: 'Back.out',
        value: 'back.out'
      }, {
        label: 'Elastic.out',
        value: 'elastic.out'
      }],
      onChange: function onChange(value) {
        return updateAnimation('ease', value);
      }
    }), createElement(SelectControl, {
      label: __('Trigger Type', 'up-gsap-animate-2'),
      value: upgsapAnimation.trigger.type,
      options: [{
        label: 'Scroll',
        value: 'scroll'
      }, {
        label: 'Load',
        value: 'load'
      }, {
        label: 'Click',
        value: 'click'
      }, {
        label: 'Hover',
        value: 'hover'
      }],
      onChange: function onChange(value) {
        return updateTrigger('type', value);
      }
    }), upgsapAnimation.trigger.type === 'scroll' && [createElement(TextControl, {
      label: __('Start Position', 'up-gsap-animate-2'),
      help: __('Example: top center, 50% 75%', 'up-gsap-animate-2'),
      value: upgsapAnimation.trigger.start,
      onChange: function onChange(value) {
        return updateTrigger('start', value);
      }
    }), createElement(SelectControl, {
      label: __('Scrub Type', 'up-gsap-animate-2'),
      value: upgsapAnimation.trigger.scrubType,
      options: [{
        label: 'None',
        value: 'none'
      }, {
        label: 'True',
        value: 'true'
      }, {
        label: 'Smooth',
        value: 'smooth'
      }],
      onChange: function onChange(value) {
        return updateTrigger('scrubType', value);
      }
    }), createElement(ToggleControl, {
      label: __('Show Markers', 'up-gsap-animate-2'),
      checked: upgsapAnimation.trigger.markers,
      onChange: function onChange(value) {
        return updateTrigger('markers', value);
      }
    })]]]))]);
  };
}, 'withAnimationControls');

// Modifier le HTML de sortie des blocs pour ajouter les attributs d'animation
function addAnimationDataAttribute(extraProps, blockType, attributes) {
  var upgsapAnimation = attributes.upgsapAnimation;
  if (upgsapAnimation && upgsapAnimation.enabled) {
    return _objectSpread(_objectSpread({}, extraProps), {}, {
      className: "".concat(extraProps.className || '', " upgsap-animated").trim(),
      'data-animation': JSON.stringify(upgsapAnimation)
    });
  }
  return extraProps;
}

// Enregistrer les filtres
addFilter('blocks.registerBlockType', 'up-gsap-animate-2/add-animation-attributes', addAnimationAttributes);
addFilter('editor.BlockEdit', 'up-gsap-animate-2/with-animation-controls', withAnimationControls);
addFilter('blocks.getSaveContent.extraProps', 'up-gsap-animate-2/add-animation-data', addAnimationDataAttribute);