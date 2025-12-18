# Android APK build (EAS)

## One-time setup
Add GitHub Secret:
- EXPO_TOKEN

## Build
GitHub -> Actions -> "release-android-apk" -> Run workflow
- profile: preview (APK)

Result:
- In the workflow run logs, EAS will print a download link
- Artifact "eas-build" includes eas-build.json with build info
