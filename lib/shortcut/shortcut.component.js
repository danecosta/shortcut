"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var animations_1 = require("@angular/animations");
var Subject_1 = require("rxjs/Subject");
var Observable_1 = require("rxjs/Observable");
var store = {
    smartSkin: localStorage.getItem('sm-skin') || 'senac-template',
    skin: this.skins.find(function (_skin) {
        return _skin.name == (localStorage.getItem('sm-skin') || 'senac-template');
    }),
    skins: this.skins,
    fixedHeader: localStorage.getItem('sm-fixed-header') == 'true',
    fixedNavigation: localStorage.getItem('sm-fixed-navigation') == 'true',
    fixedRibbon: localStorage.getItem('sm-fixed-ribbon') == 'true',
    fixedPageFooter: localStorage.getItem('sm-fixed-page-footer') == 'true',
    insideContainer: localStorage.getItem('sm-inside-container') == 'true',
    rtl: localStorage.getItem('sm-rtl') == 'true',
    menuOnTop: localStorage.getItem('sm-menu-on-top') == 'true',
    colorblindFriendly: localStorage.getItem('sm-colorblind-friendly') == 'true',
    shortcutOpen: false,
    isMobile: (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase())),
    device: '',
    mobileViewActivated: false,
    menuCollapsed: false,
    menuMinified: false,
};
var ShortcutComponent = /** @class */ (function () {
    function ShortcutComponent(router, renderer, el) {
        var _this = this;
        this.router = router;
        this.renderer = renderer;
        this.el = el;
        this.state = 'out';
        this.skins = [
            {
                name: 'senac-template',
                logo: 'assets/img/logo_senac_branco.png',
                skinBtnClass: 'btn btn-block btn-xs txt-color-white margin-right-5',
                style: {
                    backgroundColor: '#4E463F'
                },
                label: 'Senac Template'
            }
        ];
        this.botoes = [];
        this.subject = new Subject_1.Subject();
        this.store = store;
        this.trigger();
        Observable_1.Observable.fromEvent(window, 'resize').debounceTime(100).map(function () {
            _this.trigger();
        }).subscribe();
    }
    ShortcutComponent.prototype.trigger = function () {
        this.processBody(this.store);
        this.subject.next(this.store);
    };
    ShortcutComponent.prototype.subscribe = function (next, err, complete) {
        return this.subject.subscribe(next, err, complete);
    };
    ShortcutComponent.prototype.shortcutTo = function (route) {
        this.router.navigate(route);
        this.onShortcutToggle(false);
    };
    ShortcutComponent.prototype.ngOnInit = function () {
    };
    ShortcutComponent.prototype.listen = function () {
        var _this = this;
        this.layoutSub = this.subscribe(function (store) {
            _this.state = store.shortcutOpen ? 'in' : 'out';
            if (store.shortcutOpen) {
                _this.documentSub = _this.renderer.listenGlobal('document', 'mouseup', function (event) {
                    if (!_this.el.nativeElement.contains(event.target)) {
                        _this.onShortcutToggle(false);
                        _this.documentUnsub();
                    }
                });
            }
            else {
                _this.documentUnsub();
            }
        });
    };
    ShortcutComponent.prototype.ngAfterContentInit = function () {
        this.listen();
    };
    ShortcutComponent.prototype.ngAfterViewInit = function () {
    };
    ShortcutComponent.prototype.ngOnDestroy = function () {
        if (this.layoutSub)
            this.layoutSub.unsubscribe();
    };
    ShortcutComponent.prototype.documentUnsub = function () {
        this.documentSub && this.documentSub();
        this.documentSub = null;
    };
    // Layout Service
    ShortcutComponent.prototype.onShortcutToggle = function (condition) {
        if (condition == null) {
            this.store.shortcutOpen = !this.store.shortcutOpen;
        }
        else {
            this.store.shortcutOpen = !!condition;
        }
        this.trigger();
    };
    ShortcutComponent.prototype.dumpStorage = function () {
        localStorage.setItem('sm-skin', this.store.smartSkin);
        localStorage.setItem('sm-fixed-header', this.store.fixedHeader);
        localStorage.setItem('sm-fixed-navigation', this.store.fixedNavigation);
        localStorage.setItem('sm-fixed-ribbon', this.store.fixedRibbon);
        localStorage.setItem('sm-fixed-page-footer', this.store.fixedPageFooter);
        localStorage.setItem('sm-inside-container', this.store.insideContainer);
        localStorage.setItem('sm-rtl', this.store.rtl);
        localStorage.setItem('sm-menu-on-top', this.store.menuOnTop);
        localStorage.setItem('sm-colorblind-friendly', this.store.colorblindFriendly);
    };
    ShortcutComponent.prototype.processBody = function (state) {
        var $body = $('body');
        $body.removeClass(state.skins.map(function (it) { return (it.name); }).join(' '));
        $body.addClass(state.skin.name);
        $('#logo img').attr('src', state.skin.logo);
        $body.toggleClass('fixed-header', state.fixedHeader);
        $body.toggleClass('fixed-navigation', state.fixedNavigation);
        $body.toggleClass('fixed-ribbon', state.fixedRibbon);
        $body.toggleClass('fixed-page-footer', state.fixedPageFooter);
        $body.toggleClass('container', state.insideContainer);
        $body.toggleClass('smart-rtl', state.rtl);
        $body.toggleClass('menu-on-top', state.menuOnTop);
        $body.toggleClass('colorblind-friendly', state.colorblindFriendly);
        $body.toggleClass('shortcut-on', state.shortcutOpen);
        state.mobileViewActivated = $(window).width() < 979;
        $body.toggleClass('mobile-view-activated', state.mobileViewActivated);
        if (state.mobileViewActivated) {
            $body.removeClass('minified');
        }
        if (state.isMobile) {
            $body.addClass('mobile-detected');
        }
        else {
            $body.addClass('desktop-detected');
        }
        if (state.menuOnTop) {
            $body.removeClass('minified');
        }
        if (!state.menuOnTop) {
            $body.toggleClass('hidden-menu-mobile-lock', state.menuCollapsed);
            $body.toggleClass('hidden-menu', state.menuCollapsed);
            $body.removeClass('minified');
        }
        else if (state.menuOnTop && state.mobileViewActivated) {
            $body.toggleClass('hidden-menu-mobile-lock', state.menuCollapsed);
            $body.toggleClass('hidden-menu', state.menuCollapsed);
            $body.removeClass('minified');
        }
        if (state.menuMinified && !state.menuOnTop && !state.mobileViewActivated) {
            $body.addClass('minified');
            $body.removeClass('hidden-menu');
            $body.removeClass('hidden-menu-mobile-lock');
        }
    };
    __decorate([
        core_1.Input()
    ], ShortcutComponent.prototype, "botoes", void 0);
    ShortcutComponent = __decorate([
        core_1.Component({
            selector: 'shortcut',
            templateUrl: './shortcut.component.html',
            styleUrls: ['./shortcut.component.css'],
            animations: [
                animations_1.trigger('shortcutState', [
                    animations_1.state('out', animations_1.style({
                        height: 0,
                    })),
                    animations_1.state('in', animations_1.style({
                        height: '*',
                    })),
                    animations_1.transition('out => in', animations_1.animate('250ms ease-out')),
                    animations_1.transition('in => out', animations_1.animate('250ms 300ms ease-out'))
                ])
            ]
        })
    ], ShortcutComponent);
    return ShortcutComponent;
}());
exports.ShortcutComponent = ShortcutComponent;
