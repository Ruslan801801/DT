# APK сборка через GitHub Actions (EAS)

## 1) Один раз: сгенерировать keystore
Actions → "Generate Android Keystore (one-time)" → Run workflow  
Скачать Artifact `android-keystore`.

Из него взять:
- `release.keystore.b64`
- `keystore-info.txt`

## 2) Добавить Secrets в GitHub
Repo → Settings → Secrets and variables → Actions → New repository secret:

- EXPO_TOKEN
- ANDROID_KEYSTORE_B64 (содержимое release.keystore.b64)
- ANDROID_KEYSTORE_PASSWORD (из keystore-info.txt)
- ANDROID_KEY_PASSWORD (из keystore-info.txt)
- ANDROID_KEY_ALIAS (обычно upload)

## 3) Собрать APK
Actions → "Build Android APK (EAS) + Upload Artifact" → Run workflow (profile=preview)

В конце скачать Artifact `DT-android-apk` → файл `DT-preview.apk`.
