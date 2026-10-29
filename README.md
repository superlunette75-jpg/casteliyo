# Casteliyo

Camera workout coach web prototype. Requires Node.js 22+.

## Develop

Run `npm ci`, then `npm run dev`. Open the application in a browser. Deployed camera access requires HTTPS; localhost is allowed for development.

## Validate

Run `npm test`, `npm run typecheck`, and `npm run build`.

## Milestone 1

Squat counting uses MediaPipe landmarks processed on the device. The model and WASM are fetched from storage.googleapis.com and cdn.jsdelivr.net; fonts come from Google Fonts. Video is not uploaded or recorded. Turn sideways, position the camera at hip height, and keep hips, knees and ankles visible. Stand straight before starting. A complete rep requires standing, lowering below the configured knee threshold, then standing again. Tracking loss resets incomplete movements. Manual controls work without camera access. Voice uses browser speech synthesis. Finished workouts are stored locally in this browser, not synced to an account.

Automated tests cover counting logic, not real-world tracking accuracy. Real-device iOS Safari / Android Chrome validation and comparison against human rep counts remain required before claiming accuracy. This prototype is not a form assessment or medical tool.

## Push-ups and squat tracking

Select the exercise before enabling the camera. Push-ups measure shoulder–elbow–wrist flexion; squats measure hip–knee–ankle flexion. A rep requires an initial extension above 160°, flexion below 105°, and return above 160°, with transitions separated by more than 300ms. These are prototype thresholds requiring real-device validation, not form-quality measurements. Push-ups require a low, side-on camera with the near arm visible. The most visible side is locked until camera restart; loss of that side pauses counting and resets incomplete reps rather than switching arms. Restart to recalibrate on the other side.

The mirrored skeleton matches the contained video image. Missing or low-confidence joints are hidden. History records the chosen exercise; older records remain squats. Switching exercises resets the count, so save first.

## Next milestones

Set mechanics: choose sets, reps per set, and rest duration before starting (defaults: 3 × 10, 60 seconds). Camera or manual reps automatically finish a set at the target. Complete a shorter set with “Complete set early.” Counting pauses during rest; the next set starts automatically or via Skip rest. Save records the individual set totals, including a partial final set. Reset starts a fresh workout. Rest uses a wall-clock deadline, but browsers may throttle background tabs; keep this tab visible.

Voice: tap “Test voice” before starting to trigger speech directly from a user gesture. Camera startup also speaks immediately before asynchronous model loading. English device voices are selected when available, with browser default fallback; playback failures appear beside Test voice. Voice enable also plays a confirmation. Device volume, installed voices and browser autoplay policies still affect playback; audible output needs real-device validation.

1. Validate movement detection across people, devices, lighting and camera positions; tune thresholds from evidence.
2. Add structured sets, rest timers and workout plans.
3. Add Supabase authentication, access rules and synced history.
4. Add reviewed recipes, deterministic allergy filters and meal planning.

No service credentials are required for this milestone.
