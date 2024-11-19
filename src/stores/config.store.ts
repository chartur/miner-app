import {Injectable} from "@angular/core";
import {ComponentStore} from "@ngrx/component-store";
import {BoostDetailsMap} from "../interface/models/boost-details-map";
import {ConfigsDto} from "../interface/dto/configs.dto";
import {catchError, EMPTY, Observable, switchMap, tap} from "rxjs";
import {ConfigService} from "../services/config.service";

interface ConfigState extends ConfigsDto {
  isLoaded: boolean;
}

const initialState: ConfigState = {
  boostDetails: {} as BoostDetailsMap,
  tonByNonoton: 1000000000,
  periodWithSeconds: 18000,
  isLoaded: false
}

@Injectable({
  providedIn: "root"
})
export class ConfigStore extends ComponentStore<ConfigState> {
  public readonly boostDetails$: Observable<BoostDetailsMap> = this.select((state) => state.boostDetails);
  public readonly tonByNonoton$: Observable<number> = this.select((state) => state.tonByNonoton);
  public readonly periodWithSeconds$: Observable<number> = this.select((state) => state.periodWithSeconds);
  public readonly isLoaded$: Observable<boolean> = this.select((state) => state.isLoaded);

  private readonly setConfigSuccess = this.updater((state, payload: ConfigsDto) => ({
    ...state,
    ...payload,
    isLoaded: true
  }));

  public readonly loadConfigs = this.effect((body$: Observable<void>) => {
    return body$.pipe(
      switchMap(() => this.configService.loadConfig().pipe(
        tap({
          next: (config) => {
            this.setConfigSuccess(config);
          },
        }),
        catchError(() => EMPTY)
      ))
    )
  })

  constructor(
    private configService: ConfigService
  ) {
    super(initialState);
  }
}
