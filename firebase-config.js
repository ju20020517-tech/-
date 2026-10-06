// ① Firebase 콘솔 → 프로젝트 설정 → 내 앱(웹 </>) 에서 보이는 firebaseConfig 값.
//    databaseURL 이 있으면 Realtime Database 에 저장해요.
window.STUDY_FIREBASE_CONFIG = {
  apiKey: "AIzaSyD2W9dCQnJSocZtObzm_PE1kyjDLV2yCfE",
  authDomain: "study-eda27.firebaseapp.com",
  databaseURL: "https://study-eda27-default-rtdb.firebaseio.com",
  projectId: "study-eda27",
  storageBucket: "study-eda27.firebasestorage.app",
  messagingSenderId: "82694296889",
  appId: "1:82694296889:web:2213d0e753326154c004e8"
};

// ② 스터디방 이름. 조원 모두 같은 주소로 들어오면 같은 방을 써요.
//    다른 사람이 짐작하기 어려운 값으로 두면 좋아요. 바꾸면 빈 방에서 새로 시작해요.
window.STUDY_ROOM = "jpEvyJQMqNzAy4qa";
