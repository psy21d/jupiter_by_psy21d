// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { createRoot } from 'react-dom/client';
import { atom } from 'jotai';
import './static/css/tailwind.css';
import './static/css/preflight.css';
import './static/css/jupiter.css';

import JupiterLogo from './icons/JupiterLogo';
import ChevronDownIcon from './icons/ChevronDownIcon';
import { setTerminalInView } from './stores/jotai-terminal-in-view';
import { cn } from './misc/cn';
import { ShadowDomContainer } from './components/ShadowDomContainer';

const containerId = 'jupiter-terminal-instance';
const packageJson = require('../package.json');
const bundleName = `main-${packageJson.version}`;
const scriptDomain = '/static';

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncProps = exports.appProps = exports.close = exports.resume = exports.init = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const client_1 = require("react-dom/client");
const jotai_1 = require("jotai");
const react_1 = require("react");
// Прикрыть пердак
//require("tailwindcss/tailwind.css");
const JupiterLogo_1 = __importDefault(require("./icons/JupiterLogo"));
const ChevronDownIcon_1 = __importDefault(require("./icons/ChevronDownIcon"));
const jotai_terminal_in_view_1 = require("./stores/jotai-terminal-in-view");
const cn_1 = require("./misc/cn");
const ShadowDomContainer_1 = require("./components/ShadowDomContainer");
const containerId = 'jupiter-terminal-instance';
const packageJson = require('../package.json');
const bundleName = `main-${packageJson.version}`;

const scriptDomain = '/static';

// Вали со своих серваков, ублюдок
// const scriptDomain = (() => {
//     var _a;
//     if (typeof window === 'undefined' || typeof document === 'undefined')
//         return '';
//     const url = (_a = document.currentScript) === null || _a === void 0 ? void 0 : _a.src;
//     if (url) {
//         return new URL(url).origin;
//     }
//     return '';
// })() || 'https://terminal.jup.ag';
function loadRemote(id, href, type) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
            const existing = document.getElementById(id);
            if (existing) {
                res({});
            }
            else {
                let el = type === 'text/javascript' ? document.createElement('script') : document.createElement('link');
                el.id = id;
                el.onload = res;
                el.onerror = rej;
                if (el instanceof HTMLScriptElement) {
                    el.type = 'text/javascript';
                    el.src = href;
                }
                else if (el instanceof HTMLLinkElement) {
                    el.rel = 'stylesheet';
                    el.href = href;
                }
                document.head.append(el);
            }
        });
    });
}
// Пошёл нахуй жук!
function loadJupiter() {
    return __awaiter(this, void 0, void 0, function* () {
        // В development режиме ничего не делаем
        if (process.env.NODE_ENV === 'development') {
            return;
        }
        try {
            // Загружаем только CSS файлы
            yield loadRemote('jupiter-css-tailwind', `/static/css/tailwind.css`, 'stylesheet');
            yield loadRemote('jupiter-css-preflight', `/static/css/preflight.css`, 'stylesheet');
            yield loadRemote('jupiter-css-main', `/static/css/jupiter.css`, 'stylesheet');
        }
        catch (error) {
            console.error(`Error loading Jupiter Terminal styles: ${error}`);
            throw new Error(`Error loading Jupiter Terminal styles: ${error}`);
        }
    });
}
const defaultStyles = {
    zIndex: 50,
};
const RenderLoadableJupiter = (props) => {
    const [loaded, setLoaded] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        loadJupiter();
        let intervalId;
        if (!loaded) {
            intervalId = setInterval(() => {
                var _a;
                const instance = (_a = window.JupiterRenderer) === null || _a === void 0 ? void 0 : _a.RenderJupiter;
                if (instance) {
                    setLoaded(true);
                }
            }, 50);
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [loaded]);
    const RenderJupiter = (0, react_1.useMemo)(() => {
        if (loaded) {
            return window.JupiterRenderer.RenderJupiter;
        }
        return EmptyJSX;
    }, [loaded]);
    return ((0, jsx_runtime_1.jsx)(RenderJupiter, Object.assign({}, props)));
};
const EmptyJSX = () => (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, {});
const RenderShell = (props) => {
    const displayMode = props.displayMode;
    const containerStyles = props.containerStyles;
    const containerClassName = props.containerClassName;
    (0, react_1.useEffect)(() => (0, jotai_terminal_in_view_1.setTerminalInView)(true), []);
    const displayClassName = (0, react_1.useMemo)(() => {
        // Default Modal
        if (!displayMode || displayMode === 'modal') {
            return 'fixed top-0 w-screen h-screen flex items-center justify-center bg-black/50  z-10';
        }
        else if (displayMode === 'integrated' || displayMode === 'widget') {
            return 'flex items-center justify-center w-full h-full  z-10';
        }
    }, [displayMode]);
    const contentClassName = (0, react_1.useMemo)(() => {
        // Default Modal
        if (!displayMode || displayMode === 'modal') {
            return `flex flex-col h-screen w-screen max-h-[90vh] md:max-h-[600px] max-w-[360px] overflow-auto text-black relative bg-black rounded-lg webkit-scrollbar ${containerClassName || ''}`;
        }
        else if (displayMode === 'integrated' || displayMode === 'widget') {
            return 'flex flex-col h-full w-full overflow-auto text-black relative webkit-scrollbar';
        }
    }, [containerClassName, displayMode]);
    const onClose = () => {
        if (window.Jupiter) {
            (0, jotai_terminal_in_view_1.setTerminalInView)(false);
            window.Jupiter.close();
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: displayClassName, children: [(0, jsx_runtime_1.jsx)("div", { style: Object.assign(Object.assign({}, defaultStyles), containerStyles), className: contentClassName, children: (0, jsx_runtime_1.jsx)(RenderLoadableJupiter, Object.assign({}, props)) }), !displayMode || displayMode === 'modal' ? ((0, jsx_runtime_1.jsx)("div", { onClick: onClose, className: "absolute w-screen h-screen top-0 left-0 backdrop-blur-sm" })) : null] }));
};
const RenderWidgetShell = (props) => {
    var _a, _b, _c, _d, _e;
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const classes = (0, react_1.useMemo)(() => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        const size = ((_a = props.widgetStyle) === null || _a === void 0 ? void 0 : _a.size) || 'default';
        const offsetX = (_d = (_c = (_b = props.widgetStyle) === null || _b === void 0 ? void 0 : _b.offset) === null || _c === void 0 ? void 0 : _c.x) !== null && _d !== void 0 ? _d : 0;
        const offsetY = (_g = (_f = (_e = props.widgetStyle) === null || _e === void 0 ? void 0 : _e.offset) === null || _f === void 0 ? void 0 : _f.y) !== null && _g !== void 0 ? _g : 0;
        let result = undefined;
        if (!((_h = props.widgetStyle) === null || _h === void 0 ? void 0 : _h.position) || ((_j = props.widgetStyle) === null || _j === void 0 ? void 0 : _j.position) === 'bottom-right') {
            result = {
                containerClassName: 'bottom-6 right-6',
                contentClassName: size === 'default' ? 'bottom-[60px] -right-3' : 'bottom-[44px] -right-4',
                style: { transform: `translate(-${offsetX}px, -${offsetY}px)` }
            };
        }
        if (((_k = props.widgetStyle) === null || _k === void 0 ? void 0 : _k.position) === 'bottom-left') {
            result = {
                containerClassName: 'bottom-6 left-6',
                contentClassName: size === 'default' ? 'bottom-[60px] -left-3' : 'bottom-[44px] -left-4',
                style: { transform: `translate(${offsetX}px, -${offsetY}px)` }
            };
        }
        if (((_l = props.widgetStyle) === null || _l === void 0 ? void 0 : _l.position) === 'top-left') {
            result = {
                containerClassName: 'top-6 left-6',
                contentClassName: size === 'default' ? 'top-[60px] -left-3' : 'top-[44px] -left-4',
                style: { transform: `translate(${offsetX}px, ${offsetY}px)` }
            };
        }
        if (((_m = props.widgetStyle) === null || _m === void 0 ? void 0 : _m.position) === 'top-right') {
            result = {
                containerClassName: 'top-6 right-6',
                contentClassName: size === 'default' ? 'top-[60px] -right-3' : 'top-[44px] -right-4',
                style: { transform: `translate(-${offsetX}px, ${offsetY}px)` }
            };
        }
        return Object.assign(Object.assign({}, result), { widgetContainerClassName: size === 'default' ? 'h-14 w-14' : 'h-10 w-10', widgetLogoSize: size === 'default' ? 42 : 32 });
    }, [(_a = props.widgetStyle) === null || _a === void 0 ? void 0 : _a.position, (_b = props.widgetStyle) === null || _b === void 0 ? void 0 : _b.size, (_c = props.widgetStyle) === null || _c === void 0 ? void 0 : _c.offset]);
    return ((0, jsx_runtime_1.jsxs)("div", { className: `fixed ${classes.containerClassName}`, style: classes.style, children: [(0, jsx_runtime_1.jsx)("div", { className: `${classes.widgetContainerClassName} rounded-full bg-black flex items-center justify-center cursor-pointer`, onClick: () => {
                    if (isOpen) {
                        setIsOpen(false);
                        (0, jotai_terminal_in_view_1.setTerminalInView)(false);
                    }
                    else {
                        setIsOpen(true);
                        (0, jotai_terminal_in_view_1.setTerminalInView)(true);
                    }
                }, children: isOpen ? ((0, jsx_runtime_1.jsx)("div", { className: (0, cn_1.cn)('text-white fill-current pt-1', {
                        'rotate-180': ((_d = props.widgetStyle) === null || _d === void 0 ? void 0 : _d.position) === 'top-left' || ((_e = props.widgetStyle) === null || _e === void 0 ? void 0 : _e.position) === 'top-right',
                    }), children: (0, jsx_runtime_1.jsx)(ChevronDownIcon_1.default, { width: classes.widgetLogoSize * 0.4, height: classes.widgetLogoSize * 0.4 }) })) : ((0, jsx_runtime_1.jsx)(JupiterLogo_1.default, { width: classes.widgetLogoSize, height: classes.widgetLogoSize })) }), (0, jsx_runtime_1.jsx)("div", { id: "integrated-terminal", className: `absolute overflow-hidden ${classes.contentClassName} flex flex-col w-[90vw] h-[600px] max-w-[384px] max-h-[75vh] rounded-2xl bg-black transition-opacity duration-300 shadow-2xl ${!isOpen ? '!h-0 !w-0 opacity-0' : 'opacity-100'}`, children: (0, jsx_runtime_1.jsx)(RenderLoadableJupiter, Object.assign({}, props)) })] }));
};
const store = (0, jotai_1.createStore)();
const appProps = (0, jotai_1.atom)(undefined);
exports.appProps = appProps;
function init(passedProps) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        if (typeof window === 'undefined' || typeof document === 'undefined')
            return null;
        const props = Object.assign({}, passedProps);
        const { enableWalletPassthrough, passthroughWalletContextState, onRequestConnectWallet, onSwapError, onSuccess, onFormUpdate, onScreenUpdate, integratedTargetId } = props, restProps = __rest(props, ["enableWalletPassthrough", "passthroughWalletContextState", "onRequestConnectWallet", "onSwapError", "onSuccess", "onFormUpdate", "onScreenUpdate", "integratedTargetId"]);
        const targetDiv = document.createElement('div');
        const instanceExist = document.getElementById(containerId);
        window.Jupiter.store = store;
        store.set(appProps, Object.assign(Object.assign({}, props), { scriptDomain }));
        (0, jotai_terminal_in_view_1.setTerminalInView)(false);
        // Remove previous instance
        if (instanceExist) {
            window.Jupiter._instance = null;
            instanceExist.remove();
            (_a = window.Jupiter.root) === null || _a === void 0 ? void 0 : _a.unmount();
        }
        targetDiv.id = containerId;
        targetDiv.classList.add('w-full');
        targetDiv.classList.add('h-full');
        if (restProps.displayMode === 'integrated') {
            const target = document.getElementById(integratedTargetId);
            if (!target) {
                throw new Error(`Jupiter Terminal: document.getElementById cannot find ${integratedTargetId}`);
            }
            target === null || target === void 0 ? void 0 : target.appendChild(targetDiv);
        }
        else {
            document.body.appendChild(targetDiv);
        }
        // Passthrough
        if (enableWalletPassthrough) {
            window.Jupiter.enableWalletPassthrough = true;
            window.Jupiter.onRequestConnectWallet = onRequestConnectWallet;
        }
        else {
            window.Jupiter.enableWalletPassthrough = false;
        }
        let element;
        if (restProps.displayMode === 'widget') {
            element = (0, jsx_runtime_1.jsx)(RenderWidgetShell, Object.assign({}, props));
        }
        else {
            element = (0, jsx_runtime_1.jsx)(RenderShell, Object.assign({}, props));
        }
        // Пошёл нахуй, отказная шызафрения
        // const stylesheetUrls = [
        //     `${scriptDomain}/${bundleName}-Tailwind.css`,
        //     `${scriptDomain}/scoped-preflight.css`,
        //     `${scriptDomain}/${bundleName}-Jupiter.css`,
        //     'https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Poppins&display=swap',
        // ];
        const stylesheetUrls = [
            '/static/css/tailwind.css',
            '/static/css/preflight.css',
            '/static/css/jupiter.css',
            '/static/fonts/fonts.css' // Локальный файл с @font-face
        ];
        const root = (0, client_1.createRoot)(targetDiv);
        root.render((0, jsx_runtime_1.jsx)(ShadowDomContainer_1.ShadowDomContainer, { stylesheetUrls: stylesheetUrls, children: element }));
        window.Jupiter.root = root;
        window.Jupiter._instance = element;
        // Callbacks
        window.Jupiter.onSwapError = onSwapError;
        window.Jupiter.onSuccess = onSuccess;
        window.Jupiter.onFormUpdate = onFormUpdate;
        window.Jupiter.onScreenUpdate = onScreenUpdate;
        // Special props
        window.Jupiter.localStoragePrefix = passedProps.localStoragePrefix || 'jupiter-terminal';
    });
}
exports.init = init;
const attributes = typeof document !== 'undefined' ? (_a = document.currentScript) === null || _a === void 0 ? void 0 : _a.attributes : undefined;
if (typeof window !== 'undefined' && typeof document !== 'undefined' && attributes) {
    document.onreadystatechange = function () {
        const loadComplete = document.readyState === 'complete';
        const shouldPreload = Boolean(attributes.getNamedItem('data-preload'));
        if (loadComplete && shouldPreload) {
            setTimeout(() => {
                loadJupiter().catch((error) => {
                    console.error(`Error pre-loading Jupiter Terminal: ${error}`);
                    throw new Error(`Error pre-loading Jupiter Terminal: ${error}`);
                });
            }, 2000);
        }
    };
}
const resume = () => {
    const instanceExist = document.getElementById(containerId);
    if (instanceExist) {
        instanceExist.style.display = 'block';
        return;
    }
};
exports.resume = resume;
const close = () => {
    const targetDiv = document.getElementById(containerId);
    if (targetDiv) {
        targetDiv.style.display = 'none';
    }
};
exports.close = close;
const syncProps = (props) => {
    const currentProps = store.get(appProps);
    const newProps = Object.assign(Object.assign({}, currentProps), { passthroughWalletContextState: props.passthroughWalletContextState || (currentProps === null || currentProps === void 0 ? void 0 : currentProps.passthroughWalletContextState) });
    store.set(appProps, newProps);
};
exports.syncProps = syncProps;

const Jupiter = {
  init,
  resume,
  close,
  syncProps,
  appProps
};

window.Jupiter = Jupiter;

export default Jupiter;
