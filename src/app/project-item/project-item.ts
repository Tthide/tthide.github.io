import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit, NgZone } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataService, Project } from "../services/data.service";
import { Observable, Subscription, defer } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { RotatingTextIconComponent } from "../shared/rotating-text-icon/rotating-text-icon";
import { AsyncPipe } from "@angular/common";
import { ProjectProcessComponent } from "./project-process/project-process";

@Component({
  selector: "app-project-item",
  imports: [RotatingTextIconComponent, AsyncPipe, ProjectProcessComponent],
  templateUrl: "./project-item.html",
  standalone: true,
  styleUrl: "./project-item.css"
})
export class ProjectItemComponent implements OnDestroy, AfterViewInit {
  project$!: Observable<Project | undefined>;
  @ViewChild('unityContainer', { read: ElementRef }) unityContainerRef?: ElementRef<HTMLDivElement>;

  // UI state
  isUnityLoading = false;
  unityProgress = 0;
  private sub?: Subscription;
  unityLoaded = false;
  userPressedLaunch = false;
  showLaunchWarning = false;

  // Loading flags
  private containerReady = false;
  private projectReady: Project | null = null;

  // Iframe reference
  private unityIframe?: HTMLIFrameElement;
  private messageHandler?: (event: MessageEvent) => void;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.project$ = this.route.paramMap.pipe(
      map(params => params.get('id') ?? ''),
      switchMap(id => defer(() => this.dataService.getProjectById(+id)))
    );

    this.sub = this.project$.subscribe(project => {
      if (project?.content?.info_card?.hasGame) {
        this.projectReady = project;

      }
    });
  }

  ngAfterViewInit() {
    this.containerReady = true;
  }

  launchUnityGame() {
    this.showLaunchWarning = true;
    if (!this.projectReady) return;
  }

  confirmLaunchGame() {
    this.showLaunchWarning = false;
    this.userPressedLaunch = true;
    if (!this.projectReady) return;

    if (this.containerReady && this.projectReady) {
      // Use NgZone to safely update the template
      this.ngZone.run(() => {
        this.userPressedLaunch = true;

        setTimeout(() => {
          if (this.containerReady) {
            this.loadUnityGame(this.projectReady!.id);
          }
        }, 500);
      });
    }
  }

  private loadUnityGame(gameId: number) {
    console.log('[Unity] Loading game in iframe, ID:', gameId);
    this.isUnityLoading = true;
    this.unityProgress = 0;

    const waitForContainer = () => {
      const container = this.unityContainerRef?.nativeElement;
      if (!container) {
        console.warn('[Unity] Container not ready yet, retrying...');
        setTimeout(waitForContainer, 50); // retry until canvas exists

        return;
      }

      // Create iframe
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '100%';
      iframe.style.border = 'none';
      iframe.style.display = 'block';
      iframe.setAttribute('allowfullscreen', 'true');
      iframe.setAttribute('tabindex', '-1');
      iframe.setAttribute('aria-hidden', 'true');


      // Point to a dedicated Unity loader HTML page
      iframe.src = `unity-loader.html?gameId=${gameId}&t=${Date.now()}`;


      // Listen for messages from iframe
      const messageHandler = (event: MessageEvent) => {

        const data = event.data;

        if (data.type === 'unity-progress') {
          this.unityProgress = data.progress;
          //console.log('[Unity] Progress:', (data.progress * 100).toFixed(2) + '%');
        } else if (data.type === 'unity-loaded') {
          console.log('[Unity] Game loaded successfully');
          this.isUnityLoading = false;
          this.unityLoaded = true;
          this.unityProgress = 1;
        } else if (data.type === 'unity-error') {
          console.error('[Unity] Error:', data.error);
          this.isUnityLoading = false;
        }
      };

      window.addEventListener('message', messageHandler);

      // Store handler reference for cleanup
      this.messageHandler = messageHandler;
      (iframe as any)._messageHandler = messageHandler;

      // Append iframe to container
      container.appendChild(iframe);
      this.unityIframe = iframe;

      console.log('[Unity] Iframe created and appended');
    }

    waitForContainer();
  }

  ngOnDestroy() {
    console.log('[Unity] === DESTROY START ===');

    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    // Unsubscribe
    this.sub?.unsubscribe();

    // Destroying iframe 
    if (this.unityIframe) {
      console.log('[Unity] Destroying iframe...');
      const iframeRef = this.unityIframe;
      this.unityIframe = undefined;

      try {
        // Replace with placeholder to break layout & GPU ties immediately
        const placeholder = document.createElement('div');
        iframeRef.replaceWith(placeholder);

        // Let Unity stop, then remove placeholder
        setTimeout(() => placeholder.remove(), 500);

        // blank the iframe just before removal (extra safety)
        iframeRef.srcdoc = '';
      } catch (err) {
        console.error('[Unity] Error removing iframe:', err);
      }
      console.log('[Unity] Iframe replaced, awaiting GC');
    }

    // Remove message handler
    if (this.messageHandler) {
      window.removeEventListener('message', this.messageHandler);
      this.messageHandler = undefined;
      console.log('[Unity] Message handler removed');
    }
    // Reset state
    this.unityLoaded = false;
    this.isUnityLoading = false;
    this.containerReady = false;
    this.projectReady = null;

  }
}