import { coerceNumberProperty, NumberInput } from "@angular/cdk/coercion";
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnInit,
  Optional,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation,
} from "@angular/core";
import {
  MAT_PAGINATOR_DEFAULT_OPTIONS,
  MatPaginator,
  MatPaginatorDefaultOptions,
  MatPaginatorIntl,
} from "@angular/material/paginator";
import { BehaviorSubject, combineLatest } from "rxjs";

@Component({
  selector: "rondevu-paginator",
  templateUrl: "./rondevu-paginator.component.html",
  styleUrls: ["./rondevu-paginator.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RondevuPaginatorComponent
  extends MatPaginator
  implements OnInit, AfterViewInit, OnChanges
{
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static readonly NAVIGATION_BUTTON_WIDTH = 66;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  private static readonly PAGE_INDEX_WIDTH = 40;

  @Input()
  set pageIndexSize(pageIndexSize: NumberInput) {
    this._pageIndexSize = coerceNumberProperty(pageIndexSize);
    this.changeDetectorRef.markForCheck();
  }

  get pageIndexSize(): number {
    return this._pageIndexSize;
  }

  @ViewChild("actions")
  actionsContainer: ElementRef;

  pageIndexes: number[] = [];
  rangeStart: number = 0;
  rangeEnd: number = null;

  private _pageIndexSize: number = null;
  private _fitCount: number = 0;

  private _pageIndexSizeChanged: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private _pageIndexChanged: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  constructor(
    intl: MatPaginatorIntl,
    public changeDetectorRef: ChangeDetectorRef,
    @Optional()
    @Inject(MAT_PAGINATOR_DEFAULT_OPTIONS)
    defaults?: MatPaginatorDefaultOptions
  ) {
    super(intl, changeDetectorRef, defaults);
  }

  ngOnInit(): void {
    combineLatest([
      this._pageIndexSizeChanged,
      this._pageIndexChanged,
    ]).subscribe(([pageIndexSize, pageIndex]) => {
      if (!this.pageIndexes.length) {
        this.rangeStart = 0;
        this._fillPageIndexes();
        return;
      }

      if (pageIndex > pageIndexSize) {
        const diff = Math.abs(this._pageIndexSize - this.middleIndex);
        this.rangeEnd = pageIndex + diff - 1;
        this.rangeStart = pageIndex - diff;
        this._fillPageIndexes();
      } else if (this.rangeStart === 0) {
        this.rangeEnd = this._pageIndexSize;
        this._fillPageIndexes();
      }

      this._rerenderIndexes(pageIndex);
    });
  }

  ngAfterViewInit(): void {
    this._fitCount =
      (this.actionsContainer.nativeElement.clientWidth -
        2 * RondevuPaginatorComponent.NAVIGATION_BUTTON_WIDTH) /
      RondevuPaginatorComponent.PAGE_INDEX_WIDTH;
    this._fitCount = coerceNumberProperty(Math.floor(this._fitCount));
    this._recalculatePageIndexSize();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.pageIndex?.currentValue) {
      this._pageIndexChanged.next(changes.pageIndex.currentValue);
    }
    if (changes?.pageIndexSize?.currentValue) {
      this._pageIndexSizeChanged.next(changes.pageIndexSize.currentValue);
    }
  }

  get middleIndex(): number {
    return Math.ceil(this._pageIndexSize / 2) - 1;
  }

  get totalPage(): number {
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
    pageIndex = this.pageIndexes.findIndex((item) => item === pageIndex);
    const diff = Math.abs(pageIndex - this.middleIndex);
    if (
      pageIndex > this.middleIndex &&
      this.rangeEnd !== this.totalPage
    ) {
      this.rangeEnd += diff;
      this.rangeEnd =
        this.rangeEnd > this.totalPage
          ? this.totalPage
          : this.rangeEnd;

      this.rangeStart += diff;
      this.rangeStart =
        this.rangeEnd === this.totalPage
          ? this.rangeEnd - this._pageIndexSize
          : this.rangeStart;

      this._fillPageIndexes();
    } else if (pageIndex < this.middleIndex && this.rangeStart !== 0) {
      this.rangeStart -= diff;
      this.rangeStart = this.rangeStart <= 0 ? 0 : this.rangeStart;

      this.rangeEnd -= diff;
      this.rangeEnd =
        this.rangeStart === 0
          ? this.rangeStart + this._pageIndexSize
          : this.rangeEnd;

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
    const availablePageIndexSize =
      this._fitCount > this.totalPage
        ? this.totalPage
        : this._fitCount;

    this.pageIndexSize =
      coerceNumberProperty(this._pageIndexSize) === 0 || this._pageIndexSize > availablePageIndexSize
        ? availablePageIndexSize
        : this._pageIndexSize;
    this._pageIndexSizeChanged.next(this._pageIndexSize);
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
