import {
  AddTonConnectPrefix,
  EventDispatcher,
  RemoveTonConnectPrefix,
  SdkActionEvent,
  UserActionEvent
} from "@tonconnect/ui";

export class TonConnectEventDispatcher implements EventDispatcher<UserActionEvent | SdkActionEvent> {
  addEventListener<P extends AddTonConnectPrefix<(UserActionEvent | SdkActionEvent)["type"]>>(eventName: P, listener: (event: CustomEvent<(UserActionEvent & {
    type: RemoveTonConnectPrefix<P>
  }) | (SdkActionEvent & {
    type: RemoveTonConnectPrefix<P>
  })>) => void, options?: AddEventListenerOptions): Promise<() => void> {
    return Promise.resolve(function () {
    });
  }
  public async dispatchEvent(
    eventName: string,
    eventDetails: UserActionEvent | SdkActionEvent
  ): Promise<void> {
    console.log(`Event: ${eventName}, details:`, eventDetails);
  }
}
