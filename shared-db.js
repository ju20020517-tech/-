// 친구들과 같이 쓰는 저장소.
// 원래 Claude 아티팩트가 쓰던 공유 데이터베이스와 같은 모양(collection → doc → set/delete, onSnapshot)을
// Firebase 로 그대로 이어 줘요. 데이터는 rooms/<STUDY_ROOM>/<collection>/<doc> 에 저장돼요.
//  - 기본: Realtime Database (firebaseConfig 에 databaseURL 이 있으면)
//  - STUDY_BACKEND = 'firestore' 로 두면 Firestore
(function () {
  const COLS = ['records', 'members', 'feedback', 'topics', 'links', 'questions'];
  window.SHARED_COLLECTIONS = COLS;
  const plain = v => JSON.parse(JSON.stringify(v ?? null)); // undefined 값 빼기

  function firestoreDb(app) {
    const fs = app.firestore();
    try { fs.settings({ ignoreUndefinedProperties: true, merge: true }); } catch (e) {}
    if (window.STUDY_EMULATOR) fs.useEmulator(window.STUDY_EMULATOR.host, window.STUDY_EMULATOR.port); // 개발용 테스트에서만
    const room = fs.collection('rooms').doc(window.STUDY_ROOM || 'main');
    return { collection: name => room.collection(name) };
  }

  // Realtime Database 를 Firestore 와 같은 모양으로 감싸기
  function realtimeDb(app) {
    const rdb = app.database();
    if (window.STUDY_EMULATOR) rdb.useEmulator(window.STUDY_EMULATOR.host, window.STUDY_EMULATOR.port); // 개발용 테스트에서만
    const roomRef = rdb.ref('rooms/' + (window.STUDY_ROOM || 'main'));
    const snapDoc = (id, data) => ({ id, data: () => data, exists: true });
    function collection(name) {
      const ref = roomRef.child(name);
      return {
        doc: id => ({
          set: data => ref.child(id).set(plain(data)),
          delete: () => ref.child(id).remove(),
        }),
        get: () => ref.once('value').then(s => {
          const docs = Object.entries(s.val() || {}).map(([id, d]) => snapDoc(id, d));
          return { docs, size: docs.length, forEach: fn => docs.forEach(fn) };
        }),
        onSnapshot(next, error) {
          let prev = new Map();
          const handler = s => {
            const cur = new Map(Object.entries(s.val() || {})), changes = [];
            for (const [id, d] of cur) {
              const was = prev.get(id);
              if (was === undefined) changes.push({ type: 'added', doc: snapDoc(id, d) });
              else if (JSON.stringify(was) !== JSON.stringify(d)) changes.push({ type: 'modified', doc: snapDoc(id, d) });
            }
            for (const [id, d] of prev) if (!cur.has(id)) changes.push({ type: 'removed', doc: snapDoc(id, d) });
            prev = cur;
            next({ docChanges: () => changes, metadata: { fromCache: false }, size: cur.size });
          };
          ref.on('value', handler, e => error && error(e));
          return () => ref.off('value', handler);
        },
      };
    }
    return { collection };
  }

  let cached;
  window.openSharedDb = async function () {
    if (cached !== undefined) return cached;
    const cfg = window.STUDY_FIREBASE_CONFIG;
    if (!cfg || !cfg.apiKey || !window.firebase) return (cached = null);
    const app = firebase.apps.length ? firebase.app() : firebase.initializeApp(cfg);
    const useFirestore = window.STUDY_BACKEND === 'firestore' || !cfg.databaseURL;
    return (cached = useFirestore ? firestoreDb(app) : realtimeDb(app));
  };
})();
