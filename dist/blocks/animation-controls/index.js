/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./blocks/animation-controls/components/PreviewButton.js":
/*!***************************************************************!*\
  !*** ./blocks/animation-controls/components/PreviewButton.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
var __ = window.wp.i18n.__;
var Button = window.wp.components.Button;
var _window$wp$element = window.wp.element,
  createElement = _window$wp$element.createElement,
  useState = _window$wp$element.useState,
  useEffect = _window$wp$element.useEffect;
var select = window.wp.data.select;
function PreviewButton(_ref) {
  var animation = _ref.animation,
    clientId = _ref.clientId;
  var _useState = useState(false),
    _useState2 = _slicedToArray(_useState, 2),
    isPlaying = _useState2[0],
    setIsPlaying = _useState2[1];
  var _useState3 = useState(false),
    _useState4 = _slicedToArray(_useState3, 2),
    gsapLoaded = _useState4[0],
    setGsapLoaded = _useState4[1];
  useEffect(function () {
    var _checkGsap = function checkGsap() {
      if (window.gsap) {
        setGsapLoaded(true);
      } else {
        setTimeout(_checkGsap, 100);
      }
    };
    _checkGsap();
  }, []);
  var getBlockElement = function getBlockElement(clientId) {
    // Essayer différents sélecteurs pour trouver le bloc
    var selectors = ["[data-block=\"".concat(clientId, "\"]"), // Ancien sélecteur
    "[data-type][data-block=\"".concat(clientId, "\"]"), // Sélecteur avec data-type
    ".block-editor-block-list__block[data-block=\"".concat(clientId, "\"]"), // Sélecteur complet
    "#block-".concat(clientId) // ID du bloc
    ];
    for (var _i = 0, _selectors = selectors; _i < _selectors.length; _i++) {
      var selector = _selectors[_i];
      var element = document.querySelector(selector);
      if (element) {
        console.log('Found block with selector:', selector);
        return element;
      }
    }

    // Si on ne trouve toujours pas le bloc, chercher dans l'iframe de l'éditeur
    var editor = document.querySelector('iframe[name="editor-canvas"]');
    if (editor !== null && editor !== void 0 && editor.contentDocument) {
      var _iterator = _createForOfIteratorHelper(selectors),
        _step;
      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var _selector = _step.value;
          var _element = editor.contentDocument.querySelector(_selector);
          if (_element) {
            console.log('Found block in iframe with selector:', _selector);
            return _element;
          }
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }
    }
    return null;
  };
  var playPreview = function playPreview() {
    if (!(animation !== null && animation !== void 0 && animation.enabled) || isPlaying || !gsapLoaded || !window.gsap) {
      console.warn('Animation not ready:', {
        enabled: animation === null || animation === void 0 ? void 0 : animation.enabled,
        isPlaying: isPlaying,
        gsapLoaded: gsapLoaded,
        gsapExists: !!window.gsap
      });
      return;
    }
    var gsap = window.gsap;

    // Trouver le bloc en utilisant la fonction helper
    var blockElement = getBlockElement(clientId);
    if (!blockElement) {
      console.warn('Block element not found. Details:', {
        clientId: clientId,
        availableBlocks: document.querySelectorAll('[data-block]').length,
        iframeExists: !!document.querySelector('iframe[name="editor-canvas"]')
      });
      return;
    }
    setIsPlaying(true);

    // Sauvegarder les propriétés initiales
    var originalProps = {
      transform: blockElement.style.transform || 'none',
      opacity: blockElement.style.opacity || '1',
      transition: blockElement.style.transition || 'none',
      visibility: blockElement.style.visibility || 'visible'
    };

    // Désactiver les transitions CSS
    blockElement.style.transition = 'none';
    blockElement.style.visibility = 'visible';

    // Configuration de l'animation
    var fromState = {
      opacity: 0
    };
    var toState = {
      opacity: 1,
      duration: animation.duration || 1,
      ease: animation.ease || 'power2.out',
      onComplete: function onComplete() {
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
    disabled: isPlaying || !(animation !== null && animation !== void 0 && animation.enabled),
    className: 'upgsap-preview-button'
  }, isPlaying ? __('Playing...', 'up-gsap-animate-2') : __('Preview Animation', 'up-gsap-animate-2'));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PreviewButton);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!********************************************!*\
  !*** ./blocks/animation-controls/index.js ***!
  \********************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _components_PreviewButton__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./components/PreviewButton */ "./blocks/animation-controls/components/PreviewButton.js");
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var createHigherOrderComponent = window.wp.compose.createHigherOrderComponent;
var _window$wp$element = window.wp.element,
  createElement = _window$wp$element.createElement,
  Fragment = _window$wp$element.Fragment;
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
      setAttributes = props.setAttributes,
      clientId = props.clientId;
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
    var scrollControls = upgsapAnimation.trigger.type === 'scroll' ? [createElement(TextControl, {
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
    })] : [];
    var animationControls = upgsapAnimation.enabled ? [createElement(SelectControl, {
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
    })].concat(scrollControls) : [];
    return createElement(Fragment, null, [createElement(BlockEdit, props), createElement(InspectorControls, null, createElement(PanelBody, {
      title: __('GSAP Animation', 'up-gsap-animate-2'),
      initialOpen: false
    }, [createElement(ToggleControl, {
      label: __('Enable Animation', 'up-gsap-animate-2'),
      checked: upgsapAnimation.enabled,
      onChange: function onChange(value) {
        return updateAnimation('enabled', value);
      }
    }), upgsapAnimation.enabled && [createElement(_components_PreviewButton__WEBPACK_IMPORTED_MODULE_0__["default"], {
      animation: upgsapAnimation,
      clientId: clientId
    })].concat(_toConsumableArray(animationControls))]))]);
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
})();

/******/ })()
;
//# sourceMappingURL=index.js.map