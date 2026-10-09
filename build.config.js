/**
 * build.config.js — konstanta yang dibagi antara build.js dan affiliate.js.
 * Dipisah supaya affiliate.js bisa dimuat tanpa circular require ke build.js.
 */
const SITE = 'https://cryptoairdropz.com';

module.exports = { SITE };
