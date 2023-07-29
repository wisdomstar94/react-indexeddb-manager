"use client"
import { useIndexeddbManager } from "@/hooks/use-indexeddb-manager/use-indexeddb-manager.hook"
import { defineSchemas, getDbVersion } from "@/indexeddb/schema";
import { useCallback } from "react";

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

  const tryInsert = useCallback(() => {
    indexeddbManager.insertToStore({
      dbName: '__aaaa__',
      version: getDbVersion('__aaaa__'),
      storeName: '__aaaa__store_1',
      isOverwrite: true,
      datas: [
        { key: 'a1', name: `hi ${new Date().getTime()}`, prop1: '11', },
        { key: 'a2', name: `hello ${new Date().getTime()}`, prop1: '22', },
      ],
      onSuccess(result) {
        console.log('@insert.onSuccess.result', result);
      },
      onError(event) {
        console.log('@insert.onError.event', event);
      },
    })
  }, [indexeddbManager]);

  const tryDelete = useCallback(() => {
    indexeddbManager.deletesToStore({
      dbName: '__aaaa__',
      version: getDbVersion('__aaaa__'),
      storeName: '__aaaa__store_1',
      deleteKeys: ['a1', 'a2'],
      onSuccess(result) {
        console.log('@result', result);
      },
      onError(event) {
        console.log('@delete.onError.event', event);
      },
    })
  }, [indexeddbManager]);

  const tryGet = useCallback(() => {
    indexeddbManager.getFromStore<Item>({
      dbName: '__aaaa__',
      version: getDbVersion('__aaaa__'),
      storeName: '__aaaa__store_1',
      keys: ['a1', 'a2', 'a3'],
      onResult(result) {
        console.log('@tryGet.result', result);
        console.log('g', result[0].data?.updatedAt);
      },
      onError(event) {
        console.log('@get.onError.event', event);
      },
    })
  }, [indexeddbManager]);

  const tryGetAll = useCallback(() => {
    indexeddbManager.getAllFromStore<Item>({
      dbName: '__aaaa__',
      version: getDbVersion('__aaaa__'),
      storeName: '__aaaa__store_1',
      onResult(result) {
        console.log('@tryGetAll.result', result);
        console.log('g', result[0].data?.updatedAt);
      },
      onError(event) {
        console.log('@getAll.onError.event', event);
      },
    })
  }, [indexeddbManager]);

  return (
    <>
      <button className="px-4 py-1 text-xs cursor-pointer hover:bg-slate-100" onClick={tryInsert}>
        insert!
      </button>
      <button className="px-4 py-1 text-xs cursor-pointer hover:bg-slate-100" onClick={tryDelete}>
        delete!
      </button>
      <button className="px-4 py-1 text-xs cursor-pointer hover:bg-slate-100" onClick={tryGet}>
        get!
      </button>
      <button className="px-4 py-1 text-xs cursor-pointer hover:bg-slate-100" onClick={tryGetAll}>
        get all!
      </button>
    </>
  )
}
