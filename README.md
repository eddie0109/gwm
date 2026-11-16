# 건우 대전쟁 — GitHub Pages 분리 버전

기존 `index.html` 내부에 포함된 CSS와 JavaScript를 **기능별 파일로 분리**했습니다. 게임 기능, 밸런스, Firebase 설정, 저장 데이터 키는 수정하지 않았습니다.

## GitHub Pages 배포

`gwm_split` 폴더 **안의 전체 내용** (`index.html`, `css/`, `js/`)을 GitHub 저장소 `main` 브랜치의 루트에 올립니다. `index.html`만 올리면 작동하지 않습니다. GitHub → Settings → Pages에서 `Deploy from a branch` / `main` / `/(root)`를 선택합니다.

## 파일별 역할

| 파일 | 역할 |
|---|---|
| `index.html` | 화면 구조(HTML), CSS/JS 로딩 |
| `css/01-base.css` | 초기 레이아웃, 스타일 |
| `css/02-ui.css` | UI 개선 스타일 |
| `css/03-battlecats-theme.css` | 게임 테마 스타일 |
| `css/04-features.css` | 보물, 도감, 스피드업, 모달 등의 추가 스타일 |
| `js/01-core.js` | 공통 화면·오디오·화면 크기 |
| `js/02-sprites.js` | 스프라이트·픽셀 아트 |
| `js/03-traits.js` | 속성 상성 |
| `js/04-units.js` | 아군 캐릭터·진화 정의 |
| `js/05-treasures.js` | 세계편·미래편 보물 효과 |
| `js/06-enemies-stages.js` | 적 능력치·스테이지 구성 |
| `js/07-save-login.js` | 저장·Firebase 로그인 |
| `js/08-world-navigation.js` | 월드 선택·출석·적도감 |
| `js/09-stage-selection-formation.js` | 스테이지 선택·보물 이동·편성 |
| `js/10-gacha.js` | 뽑기 |
| `js/11-quests.js` | 퀘스트·시작화면 |
| `js/12-upgrades.js` | 캐릭터 및 기본 능력 강화 |
| `js/13-battle-controls.js` | 전투 컨트롤, 슬롯, 정보창, 스테이지 시작 |
| `js/14-battle-logic.js` | 전투 판정·적 출현·돈·승리·패배 |
| `js/15-battle-graphics.js` | 전투 캐릭터·배경·이펙트 그리기 |

## 개발 시 주의사항

- **JavaScript 로딩 순서를 변경하지 마세요.** 이 버전은 기존 스크립트의 전역 변수/함수를 공유하는 방식이므로 순서가 중요합니다.
- 분리는 코드 위치만 바꾼 것이지, 완전한 모듈화를 의미하지 않습니다. 한 파일의 함수가 다른 파일을 참조할 수 있습니다.
- `index.html`을 `file://`로 여는 것보다 GitHub Pages 또는 로컬 HTTP 서버(`python -m http.server 8000`)에서 실행하는 것을 권장합니다.
- 다른 AI에 수정 요청할 때는 **관련 파일과 그 의존 파일을 함께** 전달하고, 다른 영역의 변경은 최소화하도록 요청하세요.
- 기존 GitHub `index.html`을 백업한 다음 전체 파일을 함께 업로드하세요.

## 프라이빗 배틀 추가

`README_PVP.md`를 확인하세요. Firebase 규칙 등록이 필수입니다.
