import { PersistRoot } from "./persist-root";

function makePersistRoot(value: any) : PersistRoot {
  
  const json = JSON.parse(value);
  const root : PersistRoot = {
    user: JSON.parse(json.user),
    persistentUi: JSON.parse(json.persistentUi),
    _persist: JSON.parse(json._persist),

  }

  return root;
}

export default makePersistRoot;