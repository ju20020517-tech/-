# 면접 스터디 노트 (Claude 없이 쓰는 버전)

Claude 아티팩트로 만든 **면접 스터디 노트**를 Claude 구독과 상관없이 친구들과 계속 쓸 수 있게 옮긴 버전이에요.
화면과 기능은 아티팩트와 **똑같아요**. 데이터를 저장하는 곳만 Claude 대신 **Firebase**(구글의 무료 데이터베이스)로 바뀌었어요.

- 조원별 면접 노트, 조원 관리, "나는" 선택
- 공통 질문 5개 자동 생성, 약점 질문, 친구에게 약점 질문 적어 주기
- 잘한 점 / 고칠 점 / 꼬리질문 피드백 표, NEW 표시, 새 피드백 개수
- 질문별로 모아 보기 (질문 추가, 내 답변 고르기, 자동 연결)
- 말하는 시간 계산, 글자색·형광펜·굵게·밑줄, 검색
- 드래그로 순서 바꾸기, 휴지통, 되돌리기(Ctrl+Z)
- 대학별 면접 D-day, A4 인쇄(PDF 저장)
- 친구가 쓴 내용이 새로고침 없이 바로 보이는 실시간 동기화

## 파일

| 파일 | 하는 일 |
| --- | --- |
| `index.html` | 스터디 노트 본체 (아티팩트와 같은 코드) |
| `firebase-config.js` | **여기에 내 Firebase 설정을 붙여 넣어요** |
| `shared-db.js` | 아티팩트의 공유 저장소를 Firebase로 이어 주는 부분 |
| `database.rules.json` | Realtime Database 규칙 (복사해서 붙여 넣기용) |
| `firestore.rules` | Firestore를 쓸 때의 규칙 |
| `면접스터디.html` | 위 파일들을 하나로 합친 버전 (크롬으로 바로 열기) |
| `backup.html` | 데이터를 파일로 받거나, 받은 파일을 다시 넣는 페이지 |
| `backup.json` | 아티팩트에 있던 데이터 (2026-10-06에 옮겨 둔 것) |

`firebase-config.js`가 비어 있으면 앱은 **이 브라우저에만** 저장하는 모드로 열려요(친구와 공유 안 됨).

---

## 1. 처음 한 번만: 설정하기 (약 10분, 한 사람만 하면 돼요)

### 1-1. Firebase 프로젝트 만들기
1. <https://console.firebase.google.com> 에 구글 계정으로 들어가요.
2. **프로젝트 만들기** → 이름 아무거나(예: `interview-study`) → Google 애널리틱스는 꺼도 돼요.
3. 무료 요금제(Spark)로 충분해요. 카드 등록 필요 없어요.

### 1-2. 데이터베이스(Realtime Database) 켜고 규칙 넣기
1. 왼쪽 메뉴 **데이터베이스 및 스토리지 → Realtime Database → 데이터베이스 만들기** (잠금 모드로 시작).
2. 위쪽 **규칙** 탭 → 내용을 전부 지우고 `database.rules.json` 내용을 붙여 넣기 → **게시**.

> Firestore를 쓰고 싶으면 `firebase-config.js`에 `window.STUDY_BACKEND = "firestore";`를 넣고, Firestore 규칙 칸에 `firestore.rules`를 붙여 넣으세요.

### 1-3. 웹 앱 등록하고 설정값 복사
1. 프로젝트 개요 옆 ⚙️ → **프로젝트 설정** → 아래 **내 앱**에서 웹 아이콘 `</>` 클릭.
2. 앱 닉네임 아무거나 → **앱 등록** (Firebase 호스팅 체크는 안 해도 돼요).
3. 화면에 나오는 `firebaseConfig = { apiKey: ..., ... }` 값들을 `firebase-config.js`의 같은 자리에 붙여 넣어요.

```js
window.STUDY_FIREBASE_CONFIG = {
  apiKey: "AIza....",
  authDomain: "interview-study.firebaseapp.com",
  projectId: "interview-study",
  storageBucket: "interview-study.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcd..."
};
```

> apiKey는 비밀번호가 아니라서 웹페이지에 들어가도 괜찮아요. 접근은 위의 보안 규칙이 막아요.

### 1-4. 인터넷 주소 만들기 (GitHub Pages, 무료)
1. 수정한 `firebase-config.js`를 이 저장소의 `main` 브랜치에 올려요.
   (GitHub 웹에서 파일을 열고 ✏️ 연필 버튼 → 붙여 넣기 → **Commit changes** 해도 돼요.)
2. 저장소 **Settings → Pages** → Source: **Deploy from a branch**, Branch: `main` / `(root)` → **Save**.
3. 1~2분 뒤 `https://ju20020517-tech.github.io/-/` 같은 주소가 생겨요. 이 주소를 조원들에게 보내면 끝!

### 1-5. (선택) 아티팩트에 있던 데이터 옮기기
`https://…/backup.html` 을 열고 **Claude 아티팩트에서 옮겨 온 데이터 넣기**를 누르면 `backup.json` 내용이 들어가요.
(옮길 당시에는 주연 노트의 공통 질문 5개와 "지원 동기" 모아 보기 질문 정도만 있었어요.)

---

## 2. 조원들이 쓰는 법

1. 받은 주소를 열고, 오른쪽 위 **나는**에서 내 이름을 골라요 (기기마다 한 번).
2. 나머지는 아티팩트와 똑같아요. 화면 안 **사용법**을 눌러 보세요.
3. 휴대폰에서는 브라우저 메뉴의 **홈 화면에 추가**를 하면 앱처럼 열 수 있어요.

## 3. 알아 두면 좋은 것

- **인쇄**: 아티팩트에서는 파일을 받아서 인쇄했지만, 여기서는 **인쇄용 파일 만들기**를 누르면 바로 인쇄 창이 떠요. "PDF로 저장"을 고르면 PDF가 돼요.
- **백업**: 가끔 `backup.html` → **백업 파일 받기**로 파일을 받아 두면 안전해요.
- **보안**: 아티팩트의 "링크가 있는 사람은 누구나"와 같아요. 주소를 아는 사람은 읽고 쓸 수 있으니 주소는 조원끼리만 공유하세요.
  `firebase-config.js`의 `STUDY_ROOM` 값을 바꾸면 완전히 새 방(빈 노트)에서 시작해요.
- **무료 한도**: Firebase 무료 요금제는 하루 읽기 5만 번·쓰기 2만 번이에요. 5~10명 스터디에는 충분해요.
- **다른 곳에 올리고 싶다면**: 폴더 전체를 <https://app.netlify.com/drop> 에 끌어다 놓아도 주소가 생겨요.
