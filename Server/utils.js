import { createDefine } from "fresh";

/**
 * @typedef {object} State
 * @property {string} shared Data shared between middlewares, layouts, and routes.
 */

/** @type {import("fresh").Define<State>} */
export const define = createDefine();
