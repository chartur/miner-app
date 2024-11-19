import {Injectable} from "@angular/core";
import confetti from "canvas-confetti"

@Injectable({
  providedIn: "root"
})
export class UiService {
  constructor() {}

  public runFireworks(positionY: number = 0.8): void {
    const count = 150;
    const defaults = {
      origin: { y: positionY }
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio)
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }

}
