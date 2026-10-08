const fs = require("node:fs");


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
