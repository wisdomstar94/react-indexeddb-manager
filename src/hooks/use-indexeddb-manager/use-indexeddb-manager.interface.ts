export declare namespace IUseIndexeddbManager {
  export interface StoreIndexItem {
    indexName: string;
    keyPath: string;
    options?: IDBIndexParameters;
  }

  export type OpenDBOptions = {
    dbName: string;
    version: number;
    onComplete: (db: IDBDatabase | undefined) => void;
  }

  export type StoreDefineResult<STORENAME> = {
    storeName: STORENAME;
    isDefineSuccess: boolean | null;
    isExist: boolean | null;
  }

  export type StoreDefineResults<STORENAME> = Array<StoreDefineResult<STORENAME>>;

  export type DefineSchemaResult<DBNAME, STORENAME> = {
    dbName: DBNAME;
    isDefineSuccess: boolean | null;
    storeResult: StoreDefineResults<STORENAME>;
  }

  export type DefineSchemaResults<DBNAME, STORENAME> = Array<DefineSchemaResult<DBNAME, STORENAME>>;

  export type DefineStore<STORENAME> = {
    storeName: STORENAME;
    storekeyPath: string;
    storeIndexItems?: StoreIndexItem[];
    /** 
     * 만약 해당 store 가 이미 indexeddb 에 존재한다면 삭제 하고 다시 생성할 것인지 여부 
     * - true : store 존재하면 삭제 후 갱신된 정보로 다시 생성
     * - false : store 를 삭제하지 않음 (갱신된 정보로 새로 생성되지 않음, 데이터 보존이 필요한 경우 반드시 false 로 지정해주세요!)
     */
    isIfExistDeleteThenCreate: boolean;
  }

  export interface InsertResult<T extends { key: string }> {
    key: string;
    isInsertSuccess: boolean | undefined;
    data: T;
  }

  export type InsertOptions<T extends { key: string }, DBNAME, STORENAME> = {
    dbName: DBNAME;
    version: number;
    storeName: STORENAME;
    datas: T[];
    isOverwrite: boolean;
    onSuccess: (result: InsertResult<T & Partial<{ createdAt: number; updatedAt: number }>>[]) => void;
    onError: (event?: Event) => void;
  }

  export type ClearStoreOptions<DBNAME, STORENAME> = {
    dbName: DBNAME;
    version: number;
    storeName: STORENAME;
    onSuccess: (event?: Event) => void;
    onError: (event?: Event) => void;
  }

  export type DeleteResult = {
    key: string;
    isDeleteSuccess: boolean | undefined;
  }

  export type DeletesOptions<DBNAME, STORENAME> = {
    dbName: DBNAME;
    version: number;
    storeName: STORENAME;
    deleteKeys: string[];
    onSuccess: (result: DeleteResult[]) => void;
    onError: (event?: Event) => void;
  }

  export interface GetResult<T> {
    key: string;
    data: T | null | undefined;
    isGetSuccess: boolean | null;
  }

  export interface GetOptions<T extends { key: string } & Partial<{ createdAt: number; updatedAt: number }>, DBNAME, STORENAME> {
    dbName: DBNAME;
    version: number;
    storeName: STORENAME;
    keys: string[];
    onResult: (result: GetResult<T & ({ key: string } & Partial<{ createdAt: number; updatedAt: number }>)>[]) => void;
    onError: (event?: Event) => void;
  }

  export interface GetAllOptions<T extends { key: string } & Partial<{ createdAt: number; updatedAt: number }>, DBNAME, STORENAME> {
    dbName: DBNAME;
    version: number;
    storeName: STORENAME;
    onResult: (result: GetResult<T & ({ key: string } & Partial<{ createdAt: number; updatedAt: number }>)>[]) => void;
    onError: (event?: Event) => void;
  }

  export type DefineSchema<DBNAME, STORENAME> = {
    dbName: DBNAME;
    version: number;
    defineStores: DefineStore<STORENAME>[];
  }

  export type DefineSchemas<DBNAME, STORENAME> = Array<DefineSchema<DBNAME, STORENAME>>;

  export interface Props<DBNAME, STORENAME> {
    defineSchemas: DefineSchema<DBNAME, STORENAME>[];
    onDefineSchemasResult: (result: DefineSchemaResults<DBNAME, STORENAME>) => void;
  }
}