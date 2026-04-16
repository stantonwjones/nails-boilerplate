import {type Options } from "sequelize";
import { type NextFunction, type Request, type Response } from "express";

export interface ControllerDoRouteParams {
  action: string,
  params: Record<string, any>,
  request: Request,
  response: Response,
  ws?: WebSocket,
  next: NextFunction,
}

interface ActionParams<T> {
  params: T;
  request: Request;
  response: Response;
}

export interface RouteOptions {
  controller?: string;
  action?: string | (<T>(actionParams: ActionParams<T>) => any);
  public?: boolean;
  json?: boolean;
  path?: string;
  async?: boolean;
  disable_autorender?: boolean;
  [key: number]: string; // For dynamic route parameters
}

type RouteMatcher = string;

type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'ws';

export type RouteDefinition = [HttpMethod, RouteMatcher, RouteOptions?];

export interface RoutesConfig extends Array<RouteDefinition> {}

interface MimesConfig {
  [key: string]: any;
}

export interface DbConfig {
  address: string;
  username?: string;
  password?: string;
  options?: Options;
}

interface AppConfig {
  APP_ROOT: string;
  PUBLIC_ROOT: string;
  CONTROLLERS_ROOT: string;
  VIEWS_ROOT: string;
  MODELS_ROOT: string;
  SERVER_ROOT: string;
  ENABLE_HTTP: boolean;
  HOST: string;
  PORT: number;
  ENABLE_HTTPS: boolean;
  SSL_PORT: number;
  PRIVATE_KEY: Buffer;
  CERTIFICATE: Buffer;
  // Optional properties from the original config, if they were uncommented
  // VIEW_ENGINE?: (path: string, options: object, callback: (err: any, html?: string) => void) => void;
  // VIEW_ENGINE_EXT?: string;
  // IP?: string;
}

export interface Config {
  service: AppConfig;
  routes: RoutesConfig;
  mimes: MimesConfig;
  db: DbConfig;
}
