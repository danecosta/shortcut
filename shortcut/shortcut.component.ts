import { Component, OnInit, OnDestroy, ElementRef, Renderer, Input } from '@angular/core';
import { Router } from "@angular/router";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

declare var $: any;

const store = {
  smartSkin: localStorage.getItem('sm-skin') || 'senac-template',
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

@Component({
  selector: 'shortcut',
  templateUrl: './shortcut.component.html',
  styleUrls: ['./shortcut.component.css'],
  animations: [
    trigger('shortcutState', [
      state('out', style({
        height: 0,
      })),
      state('in', style({
        height: '*',
      })),
      transition('out => in', animate('250ms ease-out')),
      transition('in => out', animate('250ms 300ms ease-out'))
    ])
  ]
})
export class ShortcutComponent implements OnInit, OnDestroy {

  public state: string = 'out';

  private layoutSub: Subscription | undefined;
  private documentSub: any;

  isActivated: boolean | undefined;
  smartSkin: string | undefined;
  store: any;
  private subject: Subject<any>;

  skins: [{
    name: 'senac-template';
    logo: 'assets/img/logo_senac_branco.png';
    skinBtnClass: 'btn btn-block btn-xs txt-color-white margin-right-5';
    style: {
      backgroundColor: '#4E463F';
    };
    label: 'Senac Template';
  }] | undefined;

  @Input() botoes: any[] = [];

  trigger() {
    this.processBody(this.store);
    this.subject.next(this.store)
  }

  subscribe(next: any, err?: any, complete?: any) {
    return this.subject.subscribe(next, err, complete)
  }

  constructor(private router: Router,
    private renderer: Renderer,
    private el: ElementRef) {
    this.subject = new Subject();
    this.store = store;
    this.trigger();

    Observable.fromEvent(window, 'resize').debounceTime(100).map(() => {
      this.trigger()
    }).subscribe()
  }

  shortcutTo(route: any) {
    this.router.navigate(route);
    this.onShortcutToggle(false);
  }

  ngOnInit() {

  }

  listen() {
    this.layoutSub = this.subscribe((store: { shortcutOpen: any; }) => {
      this.state = store.shortcutOpen ? 'in' : 'out'

      if (store.shortcutOpen) {
        this.documentSub = this.renderer.listenGlobal('document', 'mouseup', (event: { target: any; }) => {
          if (!this.el.nativeElement.contains(event.target)) {
            this.onShortcutToggle(false);
            this.documentUnsub()
          }
        });
      } else {
        this.documentUnsub()
      }
    })
  }

  ngAfterContentInit() {
    this.listen();
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    if (this.layoutSub)
      this.layoutSub.unsubscribe();
  }


  documentUnsub() {
    this.documentSub && this.documentSub();
    this.documentSub = null
  }

  // Layout Service

  onShortcutToggle(condition?: any) {
    if (condition == null) {
      this.store.shortcutOpen = !this.store.shortcutOpen;
    } else {
      this.store.shortcutOpen = !!condition;
    }

    this.trigger();
  }

  dumpStorage() {
    localStorage.setItem('sm-skin', this.store.smartSkin);
    localStorage.setItem('sm-fixed-header', this.store.fixedHeader);
    localStorage.setItem('sm-fixed-navigation', this.store.fixedNavigation);
    localStorage.setItem('sm-fixed-ribbon', this.store.fixedRibbon);
    localStorage.setItem('sm-fixed-page-footer', this.store.fixedPageFooter);
    localStorage.setItem('sm-inside-container', this.store.insideContainer);
    localStorage.setItem('sm-rtl', this.store.rtl);
    localStorage.setItem('sm-menu-on-top', this.store.menuOnTop);
    localStorage.setItem('sm-colorblind-friendly', this.store.colorblindFriendly);
  }

  processBody(state: any) {
    const $body = $('body');
    $body.removeClass(state.skins.map((it: { name: any; }) => (it.name)).join(' '));
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
    } else {
      $body.addClass('desktop-detected');
    }

    if (state.menuOnTop) { $body.removeClass('minified'); }


    if (!state.menuOnTop) {
      $body.toggleClass('hidden-menu-mobile-lock', state.menuCollapsed);
      $body.toggleClass('hidden-menu', state.menuCollapsed);
      $body.removeClass('minified');
    } else if (state.menuOnTop && state.mobileViewActivated) {
      $body.toggleClass('hidden-menu-mobile-lock', state.menuCollapsed);
      $body.toggleClass('hidden-menu', state.menuCollapsed);
      $body.removeClass('minified');
    }

    if (state.menuMinified && !state.menuOnTop && !state.mobileViewActivated) {
      $body.addClass('minified');
      $body.removeClass('hidden-menu');
      $body.removeClass('hidden-menu-mobile-lock');
    }
  }

}
