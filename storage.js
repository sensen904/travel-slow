(function () {
  'use strict';

  const STATE_KEY = 'travel-slow-web-v1';
  const DATABASE_NAME = 'travel-slow-web-images-v1';
  const IMAGE_STORE = 'images';
  let databasePromise = null;
  let pendingStatus = null;

  function paintStatus() {
    if (!pendingStatus) return;
    document.querySelectorAll('#save-status, #save-status-mobile').forEach(function (element) {
      element.textContent = pendingStatus.message;
      element.dataset.state = pendingStatus.state;
      element.setAttribute('role', 'status');
      element.setAttribute('aria-live', 'polite');
    });
  }

  function status(message, state) {
    pendingStatus = { message: message, state: state };
    paintStatus();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', paintStatus, { once: true });
  }

  function quotaError(error) {
    return error && (error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED' || error.code === 22 || error.code === 1014);
  }

  function storageMessage(error, image) {
    if (quotaError(error)) {
      return image
        ? '浏览器存储空间不足，图片未能保存。请删除不需要的图片后重试。'
        : '浏览器存储空间不足，本次修改未能保存。请释放空间后重试。';
    }
    return image
      ? '当前浏览器无法保存图片，请检查浏览器存储设置后重试。'
      : '当前浏览器无法保存修改，关闭或刷新后可能丢失。请检查浏览器存储设置。';
  }

  function isState(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function load() {
    try {
      const value = window.localStorage.getItem(STATE_KEY);
      if (value === null) return null;
      const parsed = JSON.parse(value);
      if (!isState(parsed)) throw new Error('记录格式无效');
      return parsed;
    } catch (error) {
      status(error instanceof SyntaxError || error.message === '记录格式无效'
        ? '此浏览器中的记录无法读取，正在显示初始内容。'
        : '当前浏览器无法读取已保存的内容，请检查浏览器存储设置。', 'error');
      return null;
    }
  }

  function save(value) {
    if (!isState(value)) {
      status('内容格式无效，本次修改未能保存。', 'error');
      return false;
    }
    try {
      const serialized = JSON.stringify(value);
      if (typeof serialized !== 'string') throw new Error('内容无法序列化');
      window.localStorage.setItem(STATE_KEY, serialized);
      status('已保存在此浏览器', 'saved');
      return true;
    } catch (error) {
      status(error instanceof TypeError
        ? '内容暂时无法保存，请重试。'
        : storageMessage(error, false), 'error');
      return false;
    }
  }

  function openDatabase() {
    if (databasePromise) return databasePromise;
    databasePromise = new Promise(function (resolve, reject) {
      let request;
      let settled = false;
      const fail = function (error) {
        if (settled) return;
        settled = true;
        reject(error || new Error('图片存储不可用'));
      };
      try {
        if (!window.indexedDB) throw new Error('当前浏览器不支持图片存储');
        request = window.indexedDB.open(DATABASE_NAME, 1);
      } catch (error) {
        fail(error);
        return;
      }
      request.onupgradeneeded = function () {
        const database = request.result;
        if (!database.objectStoreNames.contains(IMAGE_STORE)) {
          const imageStore = database.createObjectStore(IMAGE_STORE, { keyPath: ['scope', 'id'] });
          imageStore.createIndex('scope', 'scope', { unique: false });
        }
      };
      request.onerror = function () { fail(request.error); };
      request.onblocked = function () { fail(new Error('图片存储被另一个页面占用，请关闭旧页面后重试')); };
      request.onsuccess = function () {
        const database = request.result;
        if (settled) {
          database.close();
          return;
        }
        settled = true;
        database.onversionchange = function () {
          database.close();
          databasePromise = null;
        };
        database.onclose = function () { databasePromise = null; };
        resolve(database);
      };
    }).catch(function (error) {
      databasePromise = null;
      throw error;
    });
    return databasePromise;
  }

  async function transact(mode, operation) {
    const database = await openDatabase();
    return new Promise(function (resolve, reject) {
      let transaction;
      let result;
      try {
        transaction = database.transaction(IMAGE_STORE, mode);
        const request = operation(transaction.objectStore(IMAGE_STORE));
        request.onsuccess = function () { result = request.result; };
        request.onerror = function () { reject(request.error || new Error('图片存储操作失败')); };
        transaction.oncomplete = function () { resolve(result); };
        transaction.onerror = function () { reject(transaction.error || new Error('图片存储操作失败')); };
        transaction.onabort = function () { reject(transaction.error || new Error('图片存储操作已中断')); };
      } catch (error) {
        if (transaction) {
          try { transaction.abort(); } catch (_) { /* The transaction may already be closed. */ }
        }
        reject(error);
      }
    });
  }

  function requiredKey(value, label) {
    if (typeof value !== 'string' || !value.trim()) throw new Error(label + '不能为空');
    return value;
  }

  async function putImage(scope, image) {
    try {
      requiredKey(scope, '图片所属位置');
      if (!image || typeof image !== 'object') throw new Error('图片内容无效');
      requiredKey(image.id, '图片编号');
      if (typeof image.url !== 'string' || !/^data:image\/[a-z0-9.+-]+;base64,/i.test(image.url)) {
        throw new Error('图片数据无效，请重新选择图片。');
      }
      await transact('readwrite', function (store) {
        return store.put({ scope: scope, id: image.id, name: String(image.name || '图片'), url: image.url });
      });
      status('已保存在此浏览器', 'saved');
    } catch (error) {
      const message = error && /不能为空|内容无效|数据无效/.test(error.message)
        ? error.message : storageMessage(error, true);
      status(message, 'error');
      throw new Error(message);
    }
  }

  async function imagesFor(scope) {
    try {
      requiredKey(scope, '图片所属位置');
      const records = await transact('readonly', function (store) { return store.index('scope').getAll(scope); });
      return records.map(function (record) { return { id: record.id, name: record.name, url: record.url }; });
    } catch (_) {
      const message = '已保存的图片暂时无法读取，请检查浏览器存储设置后重试。';
      status(message, 'error');
      throw new Error(message);
    }
  }

  async function removeImage(scope, id) {
    try {
      requiredKey(scope, '图片所属位置');
      requiredKey(id, '图片编号');
      await transact('readwrite', function (store) { return store.delete([scope, id]); });
      status('已保存在此浏览器', 'saved');
    } catch (_) {
      const message = '图片未能从此浏览器删除，请重试。';
      status(message, 'error');
      throw new Error(message);
    }
  }

  window.TravelStore = { load: load, save: save, putImage: putImage, imagesFor: imagesFor, removeImage: removeImage };
  window.openai = {
    widgetState: load(),
    setWidgetState: async function (snapshot) {
      window.openai.widgetState = snapshot;
      return save(snapshot);
    }
  };
})();
