import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { ActivatedRouteNode } from '../router-lab.model';
import { RouterLabService } from '../router-lab.service';

@Component({
  selector: 'router-debugger',
  imports: [NgTemplateOutlet],
  templateUrl: './router-debugger.component.html',
  styleUrls: ['./router-debugger.component.css'],
})
export class RouterDebuggerComponent {
  private readonly routerLabService = inject(RouterLabService);

  protected readonly snapshot = this.routerLabService.debugSnapshot;
  protected readonly formattedParams = computed(() =>
    this.formatJson(this.snapshot().params)
  );
  protected readonly formattedQueryParams = computed(() =>
    this.formatJson(this.snapshot().queryParams)
  );
  protected readonly formattedData = computed(() =>
    this.formatJson(this.snapshot().data)
  );

  protected formatNodeData(node: ActivatedRouteNode): string {
    return this.formatJson(node.data);
  }

  private formatJson(value: unknown): string {
    return JSON.stringify(value, null, 2);
  }
}
