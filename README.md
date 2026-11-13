# 건우 대전쟁

냥코풍 GUI가 적용된 건우 대전쟁 웹 게임입니다.

## GitHub Pages 배포

1. GitHub 저장소의 최상위(루트)에 `index.html`, `README.md`, `.nojekyll`을 업로드합니다.
2. 기존 `index.html`이 있다면 새 파일로 교체합니다.
3. 저장소의 **Settings → Pages**에서 `Deploy from a branch`를 선택합니다.
4. Branch는 `main`, Folder는 `/ (root)`로 지정하고 저장합니다.
5. 배포가 끝나면 GitHub Pages 주소로 접속합니다.

## Firebase 연결

이 버전에는 Firebase 웹 앱 설정이 연결되어 있습니다.

- Firebase Authentication의 Google 로그인 사용
- Cloud Firestore의 `users/{uid}` 문서에 플레이 데이터 저장
- 각 사용자는 Firestore 보안 규칙에 따라 자신의 문서만 읽고 쓸 수 있음

Firebase 콘솔에서 다음 설정을 완료해야 클라우드 로그인이 동작합니다.

1. Authentication에서 Google 로그인 제공업체를 사용 설정합니다.
2. Authentication 설정의 승인된 도메인에 GitHub Pages 도메인(예: `계정명.github.io`)을 추가합니다.
3. Cloud Firestore를 생성하고 다음 보안 규칙을 게시합니다.

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;
    }
  }
}
```

> Firebase 웹 설정의 API 키는 웹 앱 식별용 공개 설정값입니다. 보안은 Authentication과 Firestore 보안 규칙으로 적용해야 합니다. GitHub OAuth Client Secret 등 비밀값을 HTML에 넣지 마세요.

## 참고

게스트/닉네임 모드는 해당 브라우저의 로컬 저장소를 사용합니다. Google 로그인은 Firebase 계정에 연결된 클라우드 저장을 사용합니다.
