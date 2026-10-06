// 친구들과 같이 쓰는 저장소.
// 원래 Claude 아티팩트가 쓰던 공유 데이터베이스와 같은 모양(collection → doc → set/delete, onSnapshot)을
// Firebase Firestore 로 그대로 연결해요. 데이터는 rooms/<STUDY_ROOM>/<collection>/<doc> 에 저장돼요.
(function () {
  let cached;
  window.openSharedDb = async function () {
    if (cached !== undefined) return cached;
    const cfg = window.STUDY_FIREBASE_CONFIG;
    if (!cfg || !cfg.apiKey || !window.firebase) return (cached = null);
    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(cfg);
    const fs = app.firestore();
    // 답변 카드에 비어 있는 값(undefined)이 있어도 저장되게
    try { fs.settings({ ignoreUndefinedProperties: true, merge: true }); } catch (e) {}
    if (window.STUDY_EMULATOR) fs.useEmulator(window.STUDY_EMULATOR.host, window.STUDY_EMULATOR.port); // 개발용 테스트에서만
    const room = fs.collection('rooms').doc(window.STUDY_ROOM || 'main');
    return (cached = { collection: name => room.collection(name) });
  };
  window.SHARED_COLLECTIONS = ['records', 'members', 'feedback', 'topics', 'links', 'questions'];
})();
