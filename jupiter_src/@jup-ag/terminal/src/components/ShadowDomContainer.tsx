// @ts-nocheck
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadowDomContainer = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_dom_1 = require("react-dom");
const ShadowDomContainer = ({ children, stylesheetUrls }) => {
    const hostRef = (0, react_1.useRef)(null);
    const [shadowRoot, setShadowRoot] = (0, react_1.useState)(null);
    const [stylesLoaded, setStylesLoaded] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        if (hostRef.current && !shadowRoot) {
            // 1. Create the shadow root
            const newShadowRoot = hostRef.current.attachShadow({ mode: 'open' });
            const loadStyles = () => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    // Fetch all stylesheets as text
                    const stylePromises = stylesheetUrls.map((url) => fetch(url).then((res) => {
                        if (!res.ok) {
                            throw new Error(`Failed to fetch stylesheet: ${url}`);
                        }
                        return res.text();
                    }));
                    const allCssText = yield Promise.all(stylePromises);
                    // Inject all stylesheets
                    allCssText.forEach((cssText) => {
                        const styleEl = document.createElement('style');
                        styleEl.textContent = cssText;
                        newShadowRoot.appendChild(styleEl);
                    });
                    setStylesLoaded(true);
                }
                catch (error) {
                    console.error('Error fetching and applying styles:', error);
                }
            });
            loadStyles();
            // Create container for React portal
            const portalContainer = document.createElement('div');
            portalContainer.id = 'portal-container';
            portalContainer.style.width = '100%';
            portalContainer.style.height = '100%';
            newShadowRoot.appendChild(portalContainer);
            setShadowRoot(newShadowRoot);
        }
    }, [hostRef, shadowRoot, stylesheetUrls]);
    const portalTarget = shadowRoot === null || shadowRoot === void 0 ? void 0 : shadowRoot.getElementById('portal-container');
    return ((0, jsx_runtime_1.jsx)("div", { ref: hostRef, children: portalTarget && stylesLoaded ? (0, react_dom_1.createPortal)(children, portalTarget) : null }));
};
exports.ShadowDomContainer = ShadowDomContainer;
