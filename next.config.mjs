import fs from "node:fs";

// Fix for Windows exFAT/drive-D libuv quirk where readlink throws EISDIR instead of EINVAL on regular files
const origReadlink = fs.readlink;
const origReadlinkSync = fs.readlinkSync;
const origPromisesReadlink = fs.promises ? fs.promises.readlink : null;

fs.readlinkSync = function (p, options) {
  try {
    return origReadlinkSync.call(fs, p, options);
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

fs.readlink = function (p, options, callback) {
  let cb = callback;
  let opts = options;
  if (typeof options === "function") {
    cb = options;
    opts = undefined;
  }
  origReadlink.call(fs, p, opts, (err, linkString) => {
    if (err && (err.code === "EISDIR" || err.code === "UNKNOWN")) {
      const einval = new Error(`EINVAL: invalid argument, readlink '${p}'`);
      einval.code = "EINVAL";
      einval.errno = -4071;
      einval.syscall = "readlink";
      einval.path = p;
      return cb(einval);
    }
    if (cb) cb(err, linkString);
  });
};

if (origPromisesReadlink) {
  fs.promises.readlink = async function (p, options) {
    try {
      return await origPromisesReadlink.call(fs.promises, p, options);
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

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["three"],
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
  },
  webpack: (config) => {
    config.resolve.symlinks = false;
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      /Unable to snapshot resolve dependencies/,
      /PackFileCacheStrategy/,
    ];
    config.infrastructureLogging = {
      level: "error",
    };
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      exclude: /node_modules/,
      use: ["raw-loader"],
    });
    return config;
  },
};

export default nextConfig;
