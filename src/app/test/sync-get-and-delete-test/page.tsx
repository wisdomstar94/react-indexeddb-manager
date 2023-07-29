"use client"
import { useIndexeddbManager } from "@/hooks/use-indexeddb-manager/use-indexeddb-manager.hook"
import { defineSchemas, getDbVersion } from "@/indexeddb/schema";

interface Item {
  key: string;
  name: string;
  prop1: string;
}

export default function Page() {
  const indexeddbManager = useIndexeddbManager({
    defineSchemas: defineSchemas,
    onDefineSchemasResult(result) {
      console.log('@onDefineSchemasResult', result);
    },
  });

  function tryInsert() {
    indexeddbManager.insertToStore({
      dbName: 'test_db',
      version: getDbVersion('test_db'),
      storeName: 'test_store',
      isOverwrite: true,
      datas: [
        { key: `a${Date.now()}`, name: `hi ${Date.now()}`, prop1: '11', },
      ],
      onSuccess(result) {
        console.log('@insert.onSuccess.result', result);
      },
      onError(event) {
        console.log('@insert.onError.event', event);
      },
    })
  }

  function tryDeleteAll() {
    indexeddbManager.clearStore({
      dbName: 'test_db',
      version: getDbVersion('test_db'),
      storeName: 'test_store',
      onSuccess(result) {
        console.log('@tryDeleteAll.result', result);
      },
      onError(event) {
        console.log('@delete.onError.event', event);
      },
    })
  }

  function tryGetAll() {
    indexeddbManager.getAllFromStore<Item>({
      dbName: 'test_db',
      version: getDbVersion('test_db'),
      storeName: 'test_store',
      onResult(result) {
        console.log('@tryGetAll.result', result);
      },
      onError(event) {
        console.log('@getAll.onError.event', event);
      },
    })
  }

  function getAndDelete() {
    tryDeleteAll();
    tryGetAll();    
  }

  return (
    <>
      <button className="px-4 py-1 text-xs cursor-pointer hover:bg-slate-100" onClick={tryInsert}>
        insert!
      </button>
      <button className="px-4 py-1 text-xs cursor-pointer hover:bg-slate-100" onClick={getAndDelete}>
        getAll and deleteAll
      </button>
      {/* <button className="px-4 py-1 text-xs cursor-pointer hover:bg-slate-100" onClick={tryDelete}>
        delete!
      </button>
      <button className="px-4 py-1 text-xs cursor-pointer hover:bg-slate-100" onClick={tryGet}>
        get!
      </button>
      <button className="px-4 py-1 text-xs cursor-pointer hover:bg-slate-100" onClick={tryGetAll}>
        get all!
      </button> */}
    </>
  )
}
