import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full",
  },
  {
    path: "",
    loadComponent: () => import("../pages/home/home.component").then(m => m.HomeComponent)
  },
  {
    path: "boost",
    loadComponent: () => import("../pages/boost/boost.component").then(m => m.BoostComponent)
  },
  {
    path: "cash-out",
    loadComponent: () => import("../pages/cash-out/cash-out.component").then(m => m.CashOutComponent)
  },
  {
    path: "ref",
    loadComponent: () => import("../pages/ref/ref.component").then(m => m.RefComponent)
  },
  {
    path: "stats",
    loadComponent: () => import("../pages/stats/stats.component").then(m => m.StatsComponent)
  },
  {
    path: "repair",
    loadComponent: () => import("../pages/repair/repair.component").then(m => m.RepairComponent)
  },
  {
    path: "tasks",
    loadComponent: () => import("../pages/tasks/tasks.component").then(m => m.TasksComponent)
  },
  {
    path: "**",
    pathMatch: "full",
    loadComponent: () => import("../pages/not-found/not-found.component").then(m => m.NotFoundComponent)
  }
];
