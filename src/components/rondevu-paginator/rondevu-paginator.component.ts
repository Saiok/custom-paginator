import {
  coerceNumberProperty,
  NumberInput,
} from "@angular/cdk/coercion";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnInit,
  Optional,
} from "@angular/core";
import {
  MatPaginator,
  MatPaginatorDefaultOptions,
  MatPaginatorIntl,
  MAT_PAGINATOR_DEFAULT_OPTIONS,
} from "@angular/material/paginator";

@Component({
  selector: "rondevu-paginator",
  templateUrl: "./rondevu-paginator.component.html",
  styleUrls: ["./rondevu-paginator.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RondevuPaginatorComponent extends MatPaginator implements OnInit {
  @Input()
  set pageIndexSize(pageIndexSize: NumberInput) {
    this._pageIndexSize = coerceNumberProperty(pageIndexSize);
    this.changeDetectorRef.markForCheck();
  }
  get pageIndexSize(): number {
    return this._pageIndexSize;
  }

  private _pageIndexSize: number = null;

  constructor(
    intl: MatPaginatorIntl,
    public changeDetectorRef: ChangeDetectorRef,
    @Optional() @Inject(MAT_PAGINATOR_DEFAULT_OPTIONS) defaults?: MatPaginatorDefaultOptions
  ) {
    super(intl, changeDetectorRef, defaults);
  }

  ngOnInit(): void {
    this._recalculatePageIndexSize();
  }

  get pageIndexes(): number[] {
    return Array.from(Array(this._pageIndexSize).keys());
  }
 
  goToPage(pageIndex: number): void {
    const previousPageIndex = this.pageIndex;
    this.pageIndex = pageIndex;
    this._emitGoToPageEvent(previousPageIndex);
  }

  trackByFn(_, index): number {
    return index;
  }

  private _recalculatePageIndexSize() {
    const maxAvaiblePageindexSize = Math.ceil(this.length / this.pageSize);
    this.pageIndexSize = this._pageIndexSize > maxAvaiblePageindexSize ? maxAvaiblePageindexSize : this._pageIndexSize;
  }

  private _emitGoToPageEvent(previousPageIndex: number) {
    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length,
    });
  }
}
