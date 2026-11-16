# 건우 도장 — Firebase 프라이빗 1:1 대전

## 설치(필수)

1. ZIP 안의 `index.html`, `css/`, `js/` 전체를 GitHub 저장소 루트에 업로드합니다. 기존 HTML 한 파일을 쓰면 구동되지 않습니다.
2. [Firebase Console](https://console.firebase.google.com/)에서 기존 `gunwoo-war` 프로젝트를 엽니다.
3. **Build → Firestore Database**가 없다면 생성합니다(프로덕션 모드 추천).
4. **Authentication → Sign-in method**에서 Google 또는 GitHub 로그인 사용을 확인합니다. GitHub Pages 주소(`eddie0109.github.io`)를 승인된 도메인에 등록해야 할 수 있습니다.
5. **Firestore Database → Rules**에서 기존 보안 규칙을 보존하면서 `FIRESTORE_RULES_ADD.txt`의 `match /dojoRooms/{code}` 부분을 **기존 `match /databases/{database}/documents` 내부에 추가**하고 게시합니다. *전체 규칙을 덮어쓰지 마세요. 기존 사용자 저장 데이터 접근이 막힐 수 있습니다.*
6. GitHub Pages에서 게임을 열고 각각 다른 Google/GitHub 계정으로 로그인합니다.
7. 첫 번째 사용자가 `건우 도장 → 방 만들기`를 누르고 방 코드를 전달합니다. 두 번째 사용자가 `건우 도장 → 코드로 참가`에 입력하면 자동으로 시작됩니다.

## 대전 방식

- 현재 버전은 **방장 브라우저가 판정하는 1:1 실시간 대전**입니다. Firestore를 중계 서버로 사용하고, 전투 스냅샷은 약 0.45초마다 갱신됩니다. 엄밀한 전용 권위 서버가 아니므로 지연이 있거나 호스트가 나가면 종료됩니다.
- 참여자는 자신의 현재 편성(최대 10개), 경험치/중복 레벨, 진화 폼을 가져갑니다. 실시간 전투는 별도의 아레나로 진행하며, 기존 세계편/미래편 진행 저장을 변경하지 않습니다.
- 각자 돈 생산·일꾼 강화·대포·소환 쿨타임을 별도로 관리합니다. 180초 안에 성 체력이 더 많이 남으면 승리합니다.
- 친구 두 명은 **서로 다른 Firebase 계정**이어야 합니다. 로컬/게스트 로그인은 온라인 프라이빗 배틀에서 사용할 수 없습니다.
- 방은 생성 후 2시간이 지나면 새 참가를 막습니다. 오래된 방 문서는 자동 삭제하지 않으므로 운영자가 주기적으로 정리하거나 Firestore TTL을 별도로 설정하는 것을 권장합니다.
- 동일한 서버에 접속하려면 두 이용자가 동일한 Firebase 프로젝트 설정을 사용해야 합니다.

## 코드 위치

- `js/16-private-battle.js`: 방 생성, 참가, 서버 통신, 호스트 판정, 아레나 표시
- `css/05-private-battle.css`: 도장·대전 화면 디자인
- `js/08-world-navigation.js`: 도장 버튼 연결
- `js/01-core.js`: 도장 화면을 화면 전환 목록에 추가
- `index.html`: 화면 마크업, 추가 CSS/JS 로딩
- `FIRESTORE_RULES_ADD.txt`: Firebase Firestore 보안 규칙 조각

## 알려진 제약

- Firebase 계정 두 개로의 실제 원격 양측 접속 및 Firestore Rules 통합 테스트는 이 ZIP만으로 검증할 수 없습니다. 콘솔 보안 규칙 적용과 두 기기 테스트가 필요합니다.
- 전용 서버가 아닌 방장 클라이언트 판정 방식이라 순위전, 현금성 보상, 강력한 치트 방지에는 적합하지 않습니다.
- 통신량이 늘면 Firestore 요금이 발생할 수 있으므로 트래픽과 사용량을 확인하세요.
