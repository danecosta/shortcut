import { OnInit, OnDestroy, ElementRef, Renderer } from '@angular/core';
import { Router } from "@angular/router";
import { Subscription } from 'rxjs/Subscription';
export declare class ShortcutComponent implements OnInit, OnDestroy {
    private router;
    private renderer;
    private el;
    state: string;
    private layoutSub;
    private documentSub;
    isActivated: boolean | undefined;
    smartSkin: string | undefined;
    store: any;
    private subject;
    skins: [{
        name: 'senac-template';
        logo: 'assets/img/logo_senac_branco.png';
        skinBtnClass: 'btn btn-block btn-xs txt-color-white margin-right-5';
        style: {
            backgroundColor: '#4E463F';
        };
        label: 'Senac Template';
    }] | undefined;
    botoes: any[];
    trigger(): void;
    subscribe(next: any, err?: any, complete?: any): Subscription;
    constructor(router: Router, renderer: Renderer, el: ElementRef);
    shortcutTo(route: any): void;
    ngOnInit(): void;
    listen(): void;
    ngAfterContentInit(): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    documentUnsub(): void;
    onShortcutToggle(condition?: any): void;
    dumpStorage(): void;
    processBody(state: any): void;
}
