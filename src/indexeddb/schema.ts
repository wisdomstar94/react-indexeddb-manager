import { IUseIndexeddbManager } from "@/hooks/use-indexeddb-manager/use-indexeddb-manager.interface";

const getDefineSchemas = <DBNAME, STORENAME>(defineSchemas: IUseIndexeddbManager.DefineSchemas<DBNAME, STORENAME>) => defineSchemas;

export const defineSchemas = getDefineSchemas([
  {
    dbName: 'test_db' as const,
    version: 1,
    defineStores: [
      {
        storeName: 'test_store' as const,
        storekeyPath: 'key',
        isIfExistDeleteThenCreate: false,
        storeIndexItems: [
          { indexName: `key_unique`, keyPath: `key`, options: { unique: true } },
        ],
      },
    ],
  },
  {
    dbName: '__aaaa__' as const,
    version: 1,
    defineStores: [
      {
        storeName: '__aaaa__store_1' as const,
        storekeyPath: 'key',
        isIfExistDeleteThenCreate: false,
        storeIndexItems: [
          { indexName: `key_unique`, keyPath: `key`, options: { unique: true } },
        ],
      },
      {
        storeName: '__aaaa__store_2' as const,
        storekeyPath: 'key',
        isIfExistDeleteThenCreate: false,
        storeIndexItems: [
          { indexName: `key_unique`, keyPath: `key`, options: { unique: true } },
        ],
      }
    ],
  },
  {
    dbName: '__bbbb__' as const,
    version: 1,
    defineStores: [
      {
        storeName: '__bbbb__store_1' as const,
        storekeyPath: 'key',
        isIfExistDeleteThenCreate: false,
        storeIndexItems: [
          { indexName: `key_unique`, keyPath: `key`, options: { unique: true } },
        ],
      },
      {
        storeName: '__bbbb__store_2' as const,
        storekeyPath: 'key',
        isIfExistDeleteThenCreate: false,
        storeIndexItems: [
          { indexName: `key_unique`, keyPath: `key`, options: { unique: true } },
        ],
      }
    ],
  },
]);

const _getDbVersion = <DBNAME, STORENAME>(defineSchemas: IUseIndexeddbManager.DefineSchemas<DBNAME, STORENAME>) => {
  return (dbName: DBNAME) => defineSchemas.find(x => x.dbName === dbName)?.version ?? 1;
};

export const getDbVersion = _getDbVersion(defineSchemas);