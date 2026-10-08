const fs = require("node:fs");
const path = require("node:path");
const os = require("node:os");

const origOpenSync = fs.openSync;
fs.openSync = function (p, flags, mode) {
  try {
    return origOpenSync.call(fs, p, flags, mode);
  } catch (err) {
    if (err && err.code === "EPERM" && typeof p === "string" && p.includes("trace")) {
      const fallback = path.join(os.tmpdir(), `next-trace-${Date.now()}`);
      return origOpenSync.call(fs, fallback, flags, mode);
    }
    throw err;
  }
};

const origOpen = fs.open;
fs.open = function (p, flags, mode, cb) {
  let callback = cb;
  let m = mode;
  if (typeof mode === "function") {
    callback = mode;
    m = undefined;
  }
  return origOpen.call(fs, p, flags, m, (err, fd) => {
    if (err && err.code === "EPERM" && typeof p === "string" && p.includes("trace")) {
      const fallback = path.join(os.tmpdir(), `next-trace-${Date.now()}`);
      return origOpen.call(fs, fallback, flags, m, callback);
    }
    if (callback) callback(err, fd);
  });
};

if (fs.promises && fs.promises.open) {
  const origPromisesOpen = fs.promises.open;
  fs.promises.open = async function (p, flags, mode) {
    try {
      return await origPromisesOpen.call(fs.promises, p, flags, mode);
    } catch (err) {
      if (err && err.code === "EPERM" && typeof p === "string" && p.includes("trace")) {
        const fallback = path.join(os.tmpdir(), `next-trace-${Date.now()}`);
        return await origPromisesOpen.call(fs.promises, fallback, flags, mode);
      }
      throw err;
    }
  };
}


const origSync = fs.readlinkSync;
fs.readlinkSync = function (p, options) {
  try {
    return origSync.call(fs, p, options);
  } catch (err) {
    if (err && (err.code === "EISDIR" || err.code === "UNKNOWN")) {
      const einval = new Error(`EINVAL: invalid argument, readlink '${p}'`);
      einval.code = "EINVAL";
      einval.errno = -4071;
      einval.syscall = "readlink";
      einval.path = p;
      throw einval;
    }
    throw err;
  }
};

const origAsync = fs.readlink;
fs.readlink = function (p, options, cb) {
  let callback = cb;
  let opts = options;
  if (typeof options === "function") {
    callback = options;
    opts = undefined;
  }
  return origAsync.call(fs, p, opts, (err, linkString) => {
    if (err && (err.code === "EISDIR" || err.code === "UNKNOWN")) {
      const einval = new Error(`EINVAL: invalid argument, readlink '${p}'`);
      einval.code = "EINVAL";
      einval.errno = -4071;
      einval.syscall = "readlink";
      einval.path = p;
      return callback(einval);
    }
    if (callback) callback(err, linkString);
  });
};

if (fs.promises) {
  const origPromises = fs.promises.readlink;
  fs.promises.readlink = async function (p, options) {
    try {
      return await origPromises.call(fs.promises, p, options);
    } catch (err) {
      if (err && (err.code === "EISDIR" || err.code === "UNKNOWN")) {
        const einval = new Error(`EINVAL: invalid argument, readlink '${p}'`);
        einval.code = "EINVAL";
        einval.errno = -4071;
        einval.syscall = "readlink";
        einval.path = p;
        throw einval;
      }
      throw err;
    }
  };
}
