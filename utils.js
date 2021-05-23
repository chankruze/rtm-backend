/*
Author: chankruze (chankruze@geekofia.in)
Created: Sat May 15 2021 16:42:06 GMT+0530 (India Standard Time)

Copyright (c) Geekofia 2021 and beyond
*/

const isDevEnv = () => {
  return process.env.NODE_ENV !== "production";
};

module.exports = Object.freeze({
  isDevEnv,
});
