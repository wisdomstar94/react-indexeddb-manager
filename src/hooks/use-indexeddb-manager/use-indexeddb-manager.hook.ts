import { useEffect, useRef, useState } from "react";
import { IUseIndexeddbManager } from "./use-indexeddb-manager.interface";

export function useIndexeddbManager<DBNAME extends string, STORENAME extends string>(props: IUseIndexeddbManager.Props<DBNAME, STORENAME>) {
  const {
    defineSchemas,
    onDefineSchemasResult,
  } = props;

  const isSchemasChecking = useRef<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isAbleIndexeddb, setIsAbleIndexeddb] = useState<boolean>();

  function insertToStore<T extends { key: string }>(options: IUseIndexeddbManager.InsertOptions<T, DBNAME, STORENAME>) {
    if (!isAbleIndexeddb) {
      console.error(`indexed db 가 지원되지 않습니다.`);
      return;
    }

    const {
      dbName,
      version,
      storeName,
      isOverwrite,
      datas,
      onSuccess,
      onError,
    } = options;

    let db: IDBDatabase;
    const result: IUseIndexeddbManager.InsertResult<T>[] = datas.map((item) => ({ key: item.key, isInsertSuccess: undefined, data: item }));
    const request = window.indexedDB.open(dbName, version);
    request.onsuccess = (event) => {
      db = (event.target as any).result;
      for (const data of datas) {
        const store = db.transaction([storeName], 'readonly').objectStore(storeName);
        const nowTimestamp = new Date().getTime();
        const storeTransaction = store.get(data.key);
        storeTransaction.onsuccess = (_event) => {
          const store = db.transaction([storeName], 'readwrite').objectStore(storeName);
          const originalData = storeTransaction.result;
          if (originalData !== undefined) {
            // 존재함!
            if (isOverwrite) {
              (data as any).createdAt = originalData.createdAt;
              (data as any).updatedAt = nowTimestamp;
              const storeRequest = store.put(data);
              storeRequest.onsuccess = () => {
                result.forEach(item => {
                  if (item.key === data.key) {
                    item.isInsertSuccess = true;
                  }
                });
                checkComplete();
              };
              storeRequest.onerror = () => {
                result.forEach(item => {
                  if (item.key === data.key) {
                    item.isInsertSuccess = false;
                  }
                });
                checkComplete();
              };
            }
          } else {
            // 존재하지 않음!
            (data as any).createdAt = nowTimestamp;
            (data as any).updatedAt = nowTimestamp;
            const storeRequest = store.add(data);
            storeRequest.onsuccess = () => {
              result.forEach(item => {
                if (item.key === data.key) {
                  item.isInsertSuccess = true;
                }
              });
              checkComplete();
            };
            storeRequest.onerror = () => {
              result.forEach(item => {
                if (item.key === data.key) {
                  item.isInsertSuccess = false;
                }
              });
              checkComplete();
            };
          }
        };
      }
    };
    request.onerror = (event) => {
      onError(event);
      db?.close();
    };

    function checkComplete() {
      const target = result.find(x => x.isInsertSuccess === undefined);
      if (target !== undefined) return;
      // complete!
      onSuccess(result);
      db.close();
    }
  }

  function deletesToStore(options: IUseIndexeddbManager.DeletesOptions<DBNAME, STORENAME>) {
    if (!isAbleIndexeddb) {
      console.error(`indexed db 가 지원되지 않습니다.`);
      return;
    }

    const {
      dbName,
      version,
      storeName,
      deleteKeys,
      onSuccess,
      onError,
    } = options;

    let db: IDBDatabase;
    const request = window.indexedDB.open(dbName, version);
    const result: IUseIndexeddbManager.DeleteResult[] = deleteKeys.map(x => ({ key: x, isDeleteSuccess: undefined }));
    request.onsuccess = (event) => {
      db = (event.target as any).result;
      for (const deleteKey of deleteKeys) {
        const store = db.transaction([storeName], 'readwrite').objectStore(storeName);
        const storeTransaction = store.delete(deleteKey);
        storeTransaction.onsuccess = () => {
          result.forEach(item => {
            if (item.key === deleteKey) {
              item.isDeleteSuccess = true;
            }
          });
          checkComplete();
        };
        storeTransaction.onerror = () => {
          result.forEach(item => {
            if (item.key === deleteKey) {
              item.isDeleteSuccess = false;
            }
          });
          checkComplete();
        };
      }
    };
    request.onerror = (event) => {
      onError(event);
      db?.close();
    };
    
    function checkComplete() {
      if (result.find(x => x.isDeleteSuccess === undefined) !== undefined) return;
      // complete!
      onSuccess(result);
      db.close();
    }
  }

  function clearStore(options: IUseIndexeddbManager.ClearStoreOptions<DBNAME, STORENAME>) {
    if (!isAbleIndexeddb) {
      console.error(`indexed db 가 지원되지 않습니다.`);
      return;
    }

    const {
      dbName,
      version,
      storeName,
      onSuccess,
      onError,
    } = options;

    let db: IDBDatabase;
    const request = window.indexedDB.open(dbName, version);
    request.onsuccess = (event) => {
      db = (event.target as any).result;
      const store = db.transaction([storeName], 'readwrite').objectStore(storeName);
      const storeRequest = store.clear();
      storeRequest.onsuccess = (event) => {
        onSuccess(event);
        db?.close();
      };
      storeRequest.onerror = (event) => {
        onError();
        db?.close();
      };
    };
    request.onerror = (event) => {
      onError(event);
      db?.close();
    };
  }

  function getFromStore<T extends { key: string } & Partial<{ createdAt: number; updatedAt: number }>>(options: IUseIndexeddbManager.GetOptions<T, DBNAME, STORENAME>) {
    const {
      dbName,
      version,
      storeName,
      keys,
      onResult,
      onError,
    } = options;

    let db: IDBDatabase;
    const result: IUseIndexeddbManager.GetResult<T & { key: string } & Partial<{ createdAt: number; updatedAt: number }>>[] = keys.map(x => ({ key: x, data: null, isGetSuccess: null }));
    const request = window.indexedDB.open(dbName, version);
    request.onsuccess = (event) => {
      db = (event.target as any).result;
      const store = db.transaction([storeName], 'readonly').objectStore(storeName);
      for (const key of keys) {
        const storeRequest = store.get(key);
        storeRequest.onsuccess = () => {
          result.forEach((thisItem) => {
            if (thisItem.key === key) {
              thisItem.isGetSuccess = true;
              thisItem.data = storeRequest.result;
            }
          });
          checkComplete();
        };
        storeRequest.onerror = () => {
          result.forEach((thisItem) => {
            if (thisItem.key === key) {
              thisItem.isGetSuccess = false;
            }
          });
          checkComplete();
        };
      }
    };
    request.onerror = (event) => {
      onError(event);
      db?.close();
    };

    function checkComplete() {
      if (result.find(x => x.isGetSuccess === null) !== undefined) {
        return;
      }
      onResult(result);
      db?.close();
    }
  }

  function getAllFromStore<T extends { key: string } & Partial<{ createdAt: number; updatedAt: number }>>(options: IUseIndexeddbManager.GetAllOptions<T, DBNAME, STORENAME>) {
    const {
      dbName,
      version,
      storeName,
      onResult,
      onError,
    } = options;

    let db: IDBDatabase;
    // const result: IUseIndexeddbManager.GetResult<T & { key: string } & Partial<{ createdAt: number; updatedAt: number }>>[] = keys.map(x => ({ key: x, data: null, isGetSuccess: null }));
    const result: IUseIndexeddbManager.GetResult<T & { key: string } & Partial<{ createdAt: number; updatedAt: number }>>[] = [];
    const request = window.indexedDB.open(dbName, version);
    request.onsuccess = (event) => {
      db = (event.target as any).result;
      const store = db.transaction([storeName], 'readonly').objectStore(storeName);
      
      const storeRequest = store.getAll();
      storeRequest.onsuccess = () => {
        storeRequest.result.forEach((thisItem) => {
          result.push({
            key: thisItem.key,
            isGetSuccess: true,
            data: thisItem,
          });
        });
        checkComplete();
      };
      storeRequest.onerror = () => {
        onError(event);
      };
    };
    request.onerror = (event) => {
      onError(event);
      db?.close();
    };

    function checkComplete() {
      if (result.find(x => x.isGetSuccess === null) !== undefined) {
        return;
      }
      onResult(result);
      db?.close();
    }
  }

  useEffect(() => {
    if (isAbleIndexeddb !== true) {
      return;
    }

    if (isSchemasChecking.current) {
      return;
    }

    let callCheckCompleteCount = 0;
    isSchemasChecking.current = true;
    const result: IUseIndexeddbManager.DefineSchemaResults<DBNAME, STORENAME> = defineSchemas.map(x => ({ 
      dbName: x.dbName, 
      isDefineSuccess: null, 
      storeResult: x.defineStores.map(k => ({ 
        storeName: k.storeName,
        isDefineSuccess: null,
        isExist: null,
      })), 
    }));

    for (const schema of defineSchemas) {
      let db: IDBDatabase;
      const request = window.indexedDB.open(schema.dbName, schema.version);
      request.onerror = (event) => {
        result.forEach((thisItem) => {
          if (thisItem.dbName === schema.dbName) {
            thisItem.isDefineSuccess = false;
          }
        });
        checkComplete(db);
      };
      request.onsuccess = (event) => {
        checkComplete(db);
      };
      request.onupgradeneeded = (event) => {
        db = (event.target as any).result;
        for (const defineStore of schema.defineStores) {
          if (!db.objectStoreNames.contains(defineStore.storeName)) {
            const store = db.createObjectStore(defineStore.storeName, { keyPath: defineStore.storekeyPath });
            defineStore.storeIndexItems?.forEach((storeIndexItem) => {
              store?.createIndex(storeIndexItem.indexName, storeIndexItem.keyPath, storeIndexItem.options);
            });
            result.forEach((thisItem) => {
              if (thisItem.dbName === schema.dbName) {
                thisItem.storeResult.forEach((thisStoreItem) => {
                  if (thisStoreItem.storeName === defineStore.storeName) {
                    thisStoreItem.isDefineSuccess = true;
                    thisStoreItem.isExist = false;
                  }
                }); 
              }
            });
          } else {
            result.forEach((thisItem) => {
              if (thisItem.dbName === schema.dbName) {
                thisItem.storeResult.forEach((thisStoreItem) => {
                  if (thisStoreItem.storeName === defineStore.storeName) {
                    thisStoreItem.isDefineSuccess = false;
                    thisStoreItem.isExist = true;
                  }
                }); 
              }
            });
          }
        }
        result.forEach((thisItem) => {
          if (thisItem.dbName === schema.dbName) {
            thisItem.isDefineSuccess = true;
          }
        });
      };
    }

    function checkComplete(db: IDBDatabase | undefined) {
      db?.close();
      callCheckCompleteCount++;
      if (callCheckCompleteCount !== defineSchemas.length) return;
      
      isSchemasChecking.current = false;
      onDefineSchemasResult(result);
      setIsReady(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defineSchemas, isAbleIndexeddb]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsAbleIndexeddb(!!window.indexedDB);
    }
  }, []);

  return {
    isAbleIndexeddb,
    isReady,
    insertToStore,
    deletesToStore,
    clearStore,
    getFromStore,
    getAllFromStore,
  };
}