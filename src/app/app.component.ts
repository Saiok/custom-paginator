import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { Subscription } from "rxjs";

@Component({
  selector: "my-app",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("paginator")
  paginator: MatPaginator;

  name = "Angular";
  subscription: Subscription;

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.subscription = this.paginator.page.subscribe(console.log);    
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
