import {
  coerceNumberProperty,
  NumberInput,
} from "@angular/cdk/coercion";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnInit,
  Optional,
  ViewChild,
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
export class RondevuPaginatorComponent extends MatPaginator implements OnInit, AfterViewInit {
  private static readonly NAVIGATION_BUTTON_WIDTH = 58;
  private static readonly PAGE_INDEX_WIDTH = 40;

  @Input()
  set pageIndexSize(pageIndexSize: NumberInput) {
    this._pageIndexSize = coerceNumberProperty(pageIndexSize);
    this._fillPageIndexes();
    this.changeDetectorRef.markForCheck();
  }
  get pageIndexSize(): number {
    return this._pageIndexSize;
  }

  @ViewChild('actions')
  actionsContainer: ElementRef;

  pageIndexes: number[] = [];
  rangeStart: number = 0;
  rangeEnd: number;

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

  ngAfterViewInit(): void {
  }

  get middleIndex(): number {
    return Math.ceil(this._pageIndexSize/2) - 1;
  }

  get maxAvaiblePageindexSize(): number {
    return  Math.ceil(this.length / this.pageSize);
  }

  goToPage(pageIndex: number): void {
    if (pageIndex === this.pageIndex) {
      return;
    }
    const previousPageIndex = this.pageIndex;
    this.pageIndex = pageIndex;
    this._emitGoToPageEvent(previousPageIndex);
    this._rerenderIndexes(pageIndex);
  }

  trackByFn(_, index): number {
    return index;
  }

  private _rerenderIndexes(pageIndex: number) {
    console.clear();
    pageIndex = this.pageIndexes.findIndex(item => item === pageIndex);
    const diff = Math.abs(pageIndex - this.middleIndex);
    if (pageIndex > this.middleIndex && this.rangeEnd !== this.maxAvaiblePageindexSize) {
      this.rangeEnd += diff;
      this.rangeEnd = this.rangeEnd > this.maxAvaiblePageindexSize ? this.maxAvaiblePageindexSize : this.rangeEnd;

      this.rangeStart += diff;
      this.rangeStart = this.rangeEnd === this.maxAvaiblePageindexSize ? (this.rangeEnd - this._pageIndexSize) : this.rangeStart;

      console.log(this.rangeStart, this.middleIndex, this.rangeEnd, this.maxAvaiblePageindexSize);
      this._fillPageIndexes();
    } else if (pageIndex < this.middleIndex && this.rangeStart !== 0) {
      this.rangeStart -= diff;
      this.rangeStart = this.rangeStart <= 0 ? 0 : this.rangeStart;

      this.rangeEnd -= diff;
      this.rangeEnd = this.rangeStart === 0 ? (this.rangeStart + this._pageIndexSize) : this.rangeEnd;

      console.log(this.rangeStart, this.middleIndex, this.rangeEnd, this.maxAvaiblePageindexSize);
      this._fillPageIndexes();
    }
  }

  private _fillPageIndexes() {
    this.pageIndexes = [];
    this.rangeEnd = this.rangeEnd || this._pageIndexSize;
    for (let i = this.rangeStart; i < this.rangeEnd; i++) {
      this.pageIndexes.push(i);
    }

    console.log(this.pageIndexes, this._pageIndexSize);
  }

  private _recalculatePageIndexSize() {
    this.pageIndexSize = this._pageIndexSize > this.maxAvaiblePageindexSize ? this.maxAvaiblePageindexSize : this._pageIndexSize;
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
