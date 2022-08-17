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
  private static readonly NAVIGATION_BUTTON_WIDTH = 66;
  private static readonly PAGE_INDEX_WIDTH = 40;

  @Input()
  set pageIndexSize(pageIndexSize: NumberInput) {
    console.log('CALL', pageIndexSize, this._fitCount, this.maxAvaiblePageindexSize);
    this.rangeEnd = null;
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
  private _fitCount: number;

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
    this._fitCount = (this.actionsContainer.nativeElement.clientWidth - 2*RondevuPaginatorComponent.NAVIGATION_BUTTON_WIDTH) / RondevuPaginatorComponent.PAGE_INDEX_WIDTH;
    this._fitCount = Math.floor(this._fitCount);
    this._recalculatePageIndexSize();
  }

  get middleIndex(): number {
    return Math.ceil(this._pageIndexSize/2) - 1;
  }

  get maxAvaiblePageindexSize(): number {
    return Math.ceil(this.length / this.pageSize);
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

  private _rerenderIndexes(pageIndex: number): void {
    console.clear();
    pageIndex = this.pageIndexes.findIndex(item => item === pageIndex);
    const diff = Math.abs(pageIndex - this.middleIndex);
    console.log({pageIndex, pageIndexSize: this.pageIndexSize, maxAvaiblePageindexSize: this.maxAvaiblePageindexSize, middleIndex: this.middleIndex, rangeStart: this.rangeStart, rangeEnd: this.rangeEnd, diff});
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

  private _fillPageIndexes(): void {
    this.pageIndexes = [];
    this.rangeEnd = this.rangeEnd || this._pageIndexSize;
    for (let i = this.rangeStart; i < this.rangeEnd; i++) {
      this.pageIndexes.push(i);
    }
  }

  private _recalculatePageIndexSize(): void {
    this.pageIndexSize = this._pageIndexSize > this._fitCount ? this._fitCount : this._pageIndexSize;
  }

  private _emitGoToPageEvent(previousPageIndex: number): void {
    this.page.emit({
      previousPageIndex,
      pageIndex: this.pageIndex,
      pageSize: this.pageSize,
      length: this.length,
    });
  }
}
