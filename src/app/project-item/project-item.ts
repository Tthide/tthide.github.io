import { Component, OnDestroy, ViewChild, ElementRef, AfterViewInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { DataService, Project } from "../services/data.service";
import { Observable, Subscription, defer } from "rxjs";
import { map, switchMap } from "rxjs/operators";
import { RotatingTextIconComponent } from "../shared/rotating-text-icon/rotating-text-icon";
import { AsyncPipe } from "@angular/common";

@Component({
  selector: "app-project-item",
  imports: [RotatingTextIconComponent, AsyncPipe],
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

  // Loading flags
  private containerReady = false;
  private projectReady: Project | null = null;

  // Iframe reference
  private unityIframe?: HTMLIFrameElement;

  // Fullscreen state
  isFullscreen = false;

  constructor(
    private route: ActivatedRoute,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.project$ = this.route.paramMap.pipe(
      map(params => params.get('id') ?? ''),
      switchMap(id => defer(() => this.dataService.getProjectById(+id)))
    );

    this.sub = this.project$.subscribe(project => {
      if (project?.content?.info_card?.hasGame) {
        this.projectReady = project;
        this.unityLoaded = true;
        if (this.containerReady) {
          this.loadUnityGame(project.id);
        }
      }
    });
  }

  ngAfterViewInit() {
    this.containerReady = true;
    if (this.projectReady) {
      this.loadUnityGame(this.projectReady.id);
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


      // Point to a dedicated Unity loader HTML page
      iframe.src = `unity-loader.html?gameId=${gameId}&t=${Date.now()}`;
 
      this.unityIframe = iframe;

      // Listen for messages from iframe
      const messageHandler = (event: MessageEvent) => {
        // Verify origin if needed: if (event.origin !== window.location.origin) return;

        const data = event.data;

        if (data.type === 'unity-progress') {
          this.unityProgress = data.progress;
          console.log('[Unity] Progress:', (data.progress * 100).toFixed(2) + '%');
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
      (iframe as any)._messageHandler = messageHandler;

      // Append iframe to container
      container.appendChild(iframe);

      console.log('[Unity] Iframe created and appended');
    }

    waitForContainer();
  }

  toggleFullScreen() {
    const container = this.unityContainerRef?.nativeElement;
    if (!container) return;

    if (!document.fullscreenElement) {
      container.requestFullscreen()
        .then(() => {
          this.isFullscreen = true;
          console.log('[Unity] Entered fullscreen');
        })
        .catch(err => console.error('Fullscreen error:', err));
    } else {
      document.exitFullscreen();
      this.isFullscreen = false;
      console.log('[Unity] Exited fullscreen');
    }
  }

  ngOnDestroy() {
    console.log('[Unity] === DESTROY START ===');

    // Exit fullscreen
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }

    // Unsubscribe
    this.sub?.unsubscribe();

    // Remove message handler
    if (this.unityIframe && (this.unityIframe as any)._messageHandler) {
      window.removeEventListener('message', (this.unityIframe as any)._messageHandler);
    }

    // Destroying iframe 
    if (this.unityIframe) {
      console.log('[Unity] Destroying iframe...');

      // Clear iframe src to stop any ongoing requests
      this.unityIframe.src = 'about:blank';

      if (this.unityIframe.parentElement) {
        this.unityIframe.parentElement.removeChild(this.unityIframe);
      }

      this.unityIframe = undefined;
      console.log('[Unity] Iframe destroyed');
    }

    // Reset state
    this.unityLoaded = false;
    this.isUnityLoading = false;
    this.containerReady = false;
    this.projectReady = null;

  }
}